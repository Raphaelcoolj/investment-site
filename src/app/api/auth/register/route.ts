import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();
    
    await connectToDatabase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    if (username.toLowerCase() === 'admin') {
         return NextResponse.json({ message: 'Cannot register as Admin' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Generate a simulated wallet address
    const walletAddress = '0x' + Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join('');

    await User.create({
        username,
        email,
        password: hashedPassword,
        walletAddress,
        balance: 0.00,
        role: 'user' // Default to user, manual change to admin in DB/Seed
    });

    return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'An error occurred while registering the user.' }, { status: 500 });
  }
}
