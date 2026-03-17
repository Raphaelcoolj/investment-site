import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import Investment from '@/models/Investment';
import Transaction from '@/models/Transaction';

const PROPERTY_DATA: Record<string, { price: number; yield: number }> = {
    're-1': { price: 5000, yield: 0.65 },
    're-2': { price: 7000, yield: 0.82 },
    're-3': { price: 10000, yield: 0.74 },
    're-4': { price: 13000, yield: 0.89 },
    're-5': { price: 17000, yield: 0.68 },
    're-6': { price: 19000, yield: 0.72 },
    're-7': { price: 22000, yield: 0.85 },
    're-8': { price: 10000, yield: 0.64 },
    're-9': { price: 28000, yield: 0.86 },
    're-10': { price: 30000, yield: 0.81 },
    're-11': { price: 14000, yield: 0.62 },
    're-12': { price: 35000, yield: 0.90 },
    're-13': { price: 23000, yield: 0.70 },
    're-14': { price: 20000, yield: 0.66 },
    're-15': { price: 28000, yield: 0.88 },
    're-16': { price: 24000, yield: 0.75 },
    're-17': { price: 17000, yield: 0.60 },
    're-18': { price: 26000, yield: 0.84 },
    're-19': { price: 22000, yield: 0.69 },
    're-20': { price: 15000, yield: 0.71 }
};

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { productId, productName, category, amountInvested, units } = await request.json();

        if (!productId || !productName || !category || !amountInvested) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        await connectToDatabase();

        const user = await User.findById(session.user.id);
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        if (user.balance < amountInvested) {
            return NextResponse.json({ message: 'Insufficient balance' }, { status: 400 });
        }

        // Deduct balance
        user.balance -= amountInvested;
        await user.save();

        // Create Investment
        const investment = await Investment.create({
            userId: user._id,
            productId,
            productName,
            category,
            amountInvested,
            units: units || 0,
            status: 'active',
        });

        // Create Transaction Receipt for the investment
        const transaction = await Transaction.create({
            userId: user._id,
            amount: amountInvested,
            coin: 'USD',
            type: 'investment',
            status: 'success',
            description: `Investment in ${productName}`
        });

        return NextResponse.json({ 
            message: 'Investment successful', 
            investment,
            transactionId: transaction._id 
        });

    } catch (error: any) {
        console.error('Investment error:', error);
        return NextResponse.json({ message: 'Error processing investment' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        await connectToDatabase();
        const investments = await Investment.find({ userId: session.user.id, status: 'active' });

        const now = new Date();
        const updatePromises = [];

        for (const inv of investments) {
            const startDate = inv.lastPayoutDate ? new Date(inv.lastPayoutDate) : new Date(inv.createdAt);
            const msPassed = now.getTime() - startDate.getTime();
            const daysPassed = Math.floor(msPassed / (1000 * 60 * 60 * 24));

            if (daysPassed >= 1) {
                let dailyYield = 0.2 / 30; // 20% monthly return as requested for all investments

                const profitEarned = inv.amountInvested * dailyYield * daysPassed;
                
                inv.totalProfit += profitEarned;
                inv.lastPayoutDate = new Date(startDate.getTime() + daysPassed * 24 * 60 * 60 * 1000);
                
                // Create a payout transaction for record
                updatePromises.push(Transaction.create({
                    userId: session.user.id,
                    amount: profitEarned,
                    coin: 'USD',
                    type: 'payout',
                    status: 'success',
                    description: `Daily ROI payout from ${inv.productName}`
                }));
                
                updatePromises.push(inv.save());
            }
        }

        if (updatePromises.length > 0) {
            await Promise.all(updatePromises);
        }

        // Fetch again to get updated values
        const finalInvestments = await Investment.find({ userId: session.user.id }).sort({ createdAt: -1 });
        return NextResponse.json(finalInvestments);
    } catch (error) {
        console.error('Error fetching/updating investments profit:', error);
        return NextResponse.json({ message: 'Error fetching investments' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { id, amount, action } = await request.json(); // action: 'increase' | 'decrease'

        await connectToDatabase();
        const investment = await Investment.findOne({ _id: id, userId: session.user.id });
        const user = await User.findById(session.user.id);

        if (!investment || !user) {
            return NextResponse.json({ message: 'Investment or User not found' }, { status: 404 });
        }

        if (action === 'increase') {
            if (user.balance < amount) {
                return NextResponse.json({ message: 'Insufficient balance' }, { status: 400 });
            }
            user.balance -= amount;
            investment.amountInvested += amount;
            // Update units for real estate
            if (investment.category === 'real-estate') {
                const pricePerUnit = PROPERTY_DATA[investment.productId]?.price || 1000;
                investment.units += amount / pricePerUnit;
            }

            await Transaction.create({
                userId: user._id,
                amount,
                coin: 'USD',
                type: 'investment',
                status: 'success',
                description: `Capital increase for ${investment.productName}`
            });
        } else if (action === 'decrease') {
            if (investment.amountInvested < amount) {
                return NextResponse.json({ message: 'Insufficient investment capital' }, { status: 400 });
            }
            user.balance += amount;
            investment.amountInvested -= amount;
            if (investment.category === 'real-estate') {
                const pricePerUnit = PROPERTY_DATA[investment.productId]?.price || 1000;
                investment.units -= amount / pricePerUnit;
            }

            await Transaction.create({
                userId: user._id,
                amount,
                coin: 'USD',
                type: 'withdrawal',
                status: 'success',
                description: `Capital partial withdrawal from ${investment.productName}`
            });
        }

        await user.save();
        await investment.save();

        return NextResponse.json(investment);
    } catch (error) {
        return NextResponse.json({ message: 'Error updating investment' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        await connectToDatabase();
        const investment = await Investment.findOne({ _id: id, userId: session.user.id });
        const user = await User.findById(session.user.id);

        if (!investment || !user) {
            return NextResponse.json({ message: 'Investment not found' }, { status: 404 });
        }

        const totalRefund = investment.amountInvested + investment.totalProfit;
        user.balance += totalRefund;
        
        await Transaction.create({
            userId: user._id,
            amount: totalRefund,
            coin: 'USD',
            type: 'payout',
            status: 'success',
            description: `Termination of ${investment.productName} (Principal + Profit returned)`
        });

        await user.save();
        await Investment.findByIdAndDelete(id);

        return NextResponse.json({ message: 'Investment terminated and funds returned' });
    } catch (error) {
        return NextResponse.json({ message: 'Error terminating investment' }, { status: 500 });
    }
}
