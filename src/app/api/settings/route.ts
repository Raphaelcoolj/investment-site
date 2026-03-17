import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectToDatabase from '@/lib/db';
import SiteSettings from '@/models/SiteSettings';

export async function GET(request: Request) {
    try {
        await connectToDatabase();
        
        let settings = await SiteSettings.findOne();
        
        if (!settings) {
            return NextResponse.json({
                paymentMethods: {
                    btc: 'Admin has not set this yet',
                    eth: '',
                    usdt: '',
                    sol: '',
                    cashapp: '',
                    paypal: '',
                    applePay: '',
                },
                notificationEmail: 'admin@example.com'
            });
        }

        return NextResponse.json(settings);
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching settings' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        await connectToDatabase();
        
        // Upsert settings
        let settings = await SiteSettings.findOne();
        if (settings) {
            settings.set(body);
            await settings.save();
        } else {
            settings = await SiteSettings.create(body);
        }

        return NextResponse.json(settings);
    } catch (error) {
        return NextResponse.json({ message: 'Error updating settings' }, { status: 500 });
    }
}
