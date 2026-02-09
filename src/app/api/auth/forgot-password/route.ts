import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import SiteSettings from '@/models/SiteSettings';

export async function POST(request: Request) {
    try {
        const { email } = await request.json();
        await connectToDatabase();

        const user = await User.findOne({ email });
        if (!user) {
            // For security reasons, don't reveal if user exists
            return NextResponse.json({ message: 'If an account exists with this email, a reset link will be sent.' });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpiry = new Date(Date.now() + 3600000); // 1 hour

        await user.save();

        const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`;

        // Configure Nodemailer (Reusing settings from deposit route)
        const settings = await SiteSettings.findOne();
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, 
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Password Reset Request - NovaVault',
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
                `Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n` +
                `${resetUrl}\n\n` +
                `If you did not request this, please ignore this email and your password will remain unchanged.\n`
        };

        if (!process.env.EMAIL_USER) {
            console.log("MOCK RESET EMAIL SENT:", mailOptions);
        } else {
            await transporter.sendMail(mailOptions);
        }

        return NextResponse.json({ message: 'If an account exists with this email, a reset link will be sent.' });
    } catch (error: any) {
        console.error('Forgot password error:', error);
        return NextResponse.json({ message: 'Error processing request' }, { status: 500 });
    }
}
