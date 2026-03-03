export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import Transaction from '@/models/Transaction';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        await connectToDatabase();

        // debug log for versioning
        console.log("Transaction Type Enum:", (Transaction.schema.path('type') as any).enumValues);

        // session.user.id is populated in the session callback in src/auth.ts
        const user = await User.findById(session.user.id).select('-password');

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // --- Daily Increment Logic ---
        if (user.isIncrementing && user.dailyIncrement > 0) {
            const now = new Date();
            const lastIncrement = new Date(user.lastIncrementDate || (user as any).createdAt);
            const hoursSinceLast = (now.getTime() - lastIncrement.getTime()) / (1000 * 60 * 60);
            
            if (hoursSinceLast >= 24) {
                const daysToIncrement = Math.floor(hoursSinceLast / 24);
                
                // We'll create individual transactions for each day
                const transactionPromises = [];
                for (let i = 1; i <= daysToIncrement; i++) {
                    const incrementDate = new Date(lastIncrement.getTime() + (i * 24 * 60 * 60 * 1000));
                    transactionPromises.push(Transaction.create({
                        userId: user._id,
                        amount: user.dailyIncrement,
                        coin: 'USD',
                        type: 'increment',
                        status: 'success',
                        createdAt: incrementDate,
                        description: 'Daily automated ROI increment'
                    }));
                }
                
                await Promise.all(transactionPromises);

                user.balance += (user.dailyIncrement * daysToIncrement);
                user.lastIncrementDate = new Date(lastIncrement.getTime() + (daysToIncrement * 24 * 60 * 60 * 1000));
                await user.save();
            }
        }
        // ------------------------------

        return NextResponse.json(user);
    } catch (error: any) {
        console.error('Profile fetch error:', error);
        return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { username, profileImage } = await request.json();
        await connectToDatabase();

        const updatedUser = await User.findByIdAndUpdate(
            session.user.id,
            { $set: { username, profileImage } },
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(updatedUser);
    } catch (error: any) {
        console.error('Profile update error:', error);
        return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
