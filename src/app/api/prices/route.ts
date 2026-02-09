import { NextResponse } from 'next/server';
import { getCryptoPrice } from '@/lib/prices';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const ids = searchParams.get('ids');

    if (!ids) {
        return NextResponse.json({ message: 'Missing ids parameter' }, { status: 400 });
    }

    const price = await getCryptoPrice(ids);

    if (price !== null) {
        return NextResponse.json({
            [ids]: { usd: price }
        });
    }

    return NextResponse.json({ message: 'All price providers failed' }, { status: 500 });
}
