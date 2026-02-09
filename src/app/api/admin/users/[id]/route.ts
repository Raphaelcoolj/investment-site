import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import Transaction from '@/models/Transaction';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        await connectToDatabase();
        const user = await User.findById(params.id);
        if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });
        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching user' }, { status: 500 });
    }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    try {
        const body = await request.json();
        await connectToDatabase();
        
        const currentUser = await User.findById(params.id);
        if (!currentUser) return NextResponse.json({ message: 'User not found' }, { status: 404 });

        const oldBalance = currentUser.balance;
        const newBalance = body.balance !== undefined ? parseFloat(body.balance) : oldBalance;

        // Handle Transaction side effects
        if (newBalance > oldBalance) {
            const diff = newBalance - oldBalance;
            // Try to find the oldest pending deposit to approve
            const pendingDeposit = await Transaction.findOne({
                userId: params.id,
                type: 'deposit',
                status: 'pending'
            }).sort({ createdAt: 1 });

            if (pendingDeposit) {
                pendingDeposit.status = 'success';
                // Optionally update the amount if it differs? User didn't specify, but for now we follow the "approval" flow.
                // If the admin increases by more than the pending amount, it still counts as approving that pending one.
                await pendingDeposit.save();
            } else {
                // Manual deposit by admin if no pending exists
                await Transaction.create({
                    userId: params.id,
                    amount: diff,
                    coin: 'USD', // Or 'ADMIN'
                    type: 'deposit',
                    status: 'success'
                });
            }
        } else if (newBalance < oldBalance) {
            const diff = oldBalance - newBalance;
            // Create withdrawal record
            await Transaction.create({
                userId: params.id,
                amount: diff,
                coin: 'USD',
                type: 'withdrawal',
                status: 'success'
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            params.id,
            { $set: body },
            { new: true }
        );

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json({ message: 'Error updating user' }, { status: 500 });
    }
}
