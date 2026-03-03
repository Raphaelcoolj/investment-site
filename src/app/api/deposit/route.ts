import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import Transaction from '@/models/Transaction';
import SiteSettings from '@/models/SiteSettings';
import nodemailer from 'nodemailer';
import axios from 'axios';
import { getCryptoPrice } from '@/lib/prices';

const COIN_MAPPING: Record<string, string> = {
    'BTC': 'bitcoin',
    'ETH': 'ethereum',
    'USDT': 'tether',
    'SOL': 'solana',
};

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { amount, method, transactionId } = await request.json(); 

        await connectToDatabase();
        const user = await User.findById(session.user.id);
        const settings = await SiteSettings.findOne();
        
        if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });

        // Calculate Crypto Worth if applicable
        let cryptoWorthText = '';
        const coinId = COIN_MAPPING[method.toUpperCase()];
        
        if (coinId) {
            const price = await getCryptoPrice(coinId);
            if (price) {
                const cryptoAmount = (amount / price).toFixed(8);
                cryptoWorthText = `Approx. Crypto Amount: ${cryptoAmount} ${method.toUpperCase()}`;
            } else {
                cryptoWorthText = `Approx. Crypto Amount: (Price currently unavailable)`;
            }
        }

        // Configure Nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, 
                pass: process.env.EMAIL_PASS
            }
        });

        const adminEmail = settings?.notificationEmail || process.env.EMAIL_USER;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: adminEmail,
            subject: `New Deposit Alert: ${user.username}`,
            text: `
                User: ${user.username} (${user.email})
                Action: Confirmed Deposit
                Amount: $${amount}
                Method: ${method.toUpperCase()}
                ${cryptoWorthText}
                
                Please verify their payment and update their balance in the Admin Dashboard.
            `
        };

        // If credentials are not set, log it (for simulation)
        if (!process.env.EMAIL_USER) {
            console.log("MOCK EMAIL SENT:", mailOptions);
        } else {
             await transporter.sendMail(mailOptions);
        }

        // Create a pending transaction record
        await Transaction.create({
            userId: user._id,
            amount: amount,
            coin: method.toUpperCase(),
            type: 'deposit',
            status: 'pending',
            description: `Deposit via ${method.toUpperCase()}`
        });

        return NextResponse.json({ message: 'Deposit notification sent' });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error processing deposit' }, { status: 500 });
    }
}
