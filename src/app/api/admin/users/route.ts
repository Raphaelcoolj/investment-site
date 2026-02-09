import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';

export async function GET(request: Request) {
    try {
        await connectToDatabase();
        // In real app: Check for Admin Role here!
        const users = await User.find({}).sort({ createdAt: -1 });
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching users' }, { status: 500 });
    }
}
