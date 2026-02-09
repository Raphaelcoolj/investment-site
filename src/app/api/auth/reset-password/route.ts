import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const { token, password } = await request.json();
        await connectToDatabase();

        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return NextResponse.json({ message: 'Invalid or expired password reset token' }, { status: 400 });
        }

        // Set new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiry = undefined;

        await user.save();

        return NextResponse.json({ message: 'Password has been reset successfully' });
    } catch (error: any) {
        console.error('Reset password error:', error);
        return NextResponse.json({ message: 'Error resetting password' }, { status: 500 });
    }
}
