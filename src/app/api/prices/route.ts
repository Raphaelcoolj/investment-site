import { NextResponse } from 'next/server';

// Cache for prices
let priceCache: any = null;
let lastFetch = 0;
const CACHE_DURATION = 5000; // 5 seconds for simulation feel

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const ids = searchParams.get('ids');
    const now = Date.now();
    
    // Base prices including new requested stocks
    const basePrices: any = {
        oil: 78.42,
        gold: 2038.15,
        aapl: 184.22,
        msft: 402.15,
        googl: 143.98,
        meta: 485.32,
        tsla: 188.45,
        amzn: 172.10,
        'brk-b': 408.20,
        xai: 250.00, // Simulated price for xAI
        bitcoin: 62450.00,
        ethereum: 3450.00,
        solana: 130.00,
        tether: 1.00
    };

    const getFluctuatedPrice = (id: string) => {
        const base = basePrices[id] || 100;
        const seed = Math.sin(now / 10000 + (id.length * 10)); 
        const variance = (seed * 0.005); 
        const noise = (Math.random() - 0.5) * 0.001; 
        return parseFloat((base * (1 + variance + noise)).toFixed(2));
    };

    // If specific IDs are requested (for CryptoChart compatibility)
    if (ids) {
        const idList = ids.split(',');
        const result: any = {};
        idList.forEach(id => {
            result[id] = { usd: getFluctuatedPrice(id) };
        });
        return NextResponse.json(result);
    }

    // Default response for Investments Dashboard
    const prices = {
        commodities: {
            oil: getFluctuatedPrice('oil'),
            gold: getFluctuatedPrice('gold'),
        },
        stocks: {
            aapl: getFluctuatedPrice('aapl'),
            msft: getFluctuatedPrice('msft'),
            googl: getFluctuatedPrice('googl'),
            meta: getFluctuatedPrice('meta'),
            tsla: getFluctuatedPrice('tsla'),
            amzn: getFluctuatedPrice('amzn'),
            'brk-b': getFluctuatedPrice('brk-b'),
            xai: getFluctuatedPrice('xai'),
        },
        timestamp: now
    };

    return NextResponse.json(prices);
}
