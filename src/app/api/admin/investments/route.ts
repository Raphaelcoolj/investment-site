import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import connectToDatabase from '@/lib/db';
import Investment from '@/models/Investment';
import User from '@/models/User';
import Transaction from '@/models/Transaction';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        await connectToDatabase();
        const investments = await Investment.find({}).populate('userId', 'username email').sort({ createdAt: -1 });

        return NextResponse.json(investments);
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching investments' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { id, amountInvested, totalProfit, status } = await request.json();

        await connectToDatabase();
        const investment = await Investment.findById(id);
        if (!investment) {
            return NextResponse.json({ message: 'Investment not found' }, { status: 404 });
        }

        // If profit is increased, we can log a payout transaction
        if (totalProfit !== undefined && totalProfit > investment.totalProfit) {
            const profitDiff = totalProfit - investment.totalProfit;
            
            // Log payout transaction
            await Transaction.create({
                userId: investment.userId,
                amount: profitDiff,
                coin: 'USD',
                type: 'payout',
                status: 'success',
                description: `Profit payout from ${investment.productName}`
            });

            // Increment user balance
            await User.findByIdAndUpdate(investment.userId, {
                $inc: { balance: profitDiff }
            });
        }

        // Update investment
        if (amountInvested !== undefined) investment.amountInvested = amountInvested;
        if (totalProfit !== undefined) investment.totalProfit = totalProfit;
        if (status !== undefined) investment.status = status;

        await investment.save();

        return NextResponse.json(investment);
    } catch (error) {
        console.error('Error updating investment:', error);
        return NextResponse.json({ message: 'Error updating investment' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        await connectToDatabase();
        await Investment.findByIdAndDelete(id);

        return NextResponse.json({ message: 'Investment deleted' });
    } catch (error) {
        return NextResponse.json({ message: 'Error deleting investment' }, { status: 500 });
    }
}
