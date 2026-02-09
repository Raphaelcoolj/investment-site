import axios from 'axios';

// Static fallbacks in case of total network failure
const FALLBACK_PRICES: Record<string, number> = {
    'bitcoin': 45000,
    'ethereum': 2500,
    'tether': 1.00,
    'solana': 100,
};

const SYMBOL_TO_ID: Record<string, string> = {
    'BTC': 'bitcoin',
    'ETH': 'ethereum',
    'USDT': 'tether',
    'SOL': 'solana',
};

/**
 * Fetches the current price of a cryptocurrency in USD with multiple fallbacks.
 * @param coinId The CoinGecko ID (e.g., 'bitcoin')
 * @returns The price in USD or a fallback value
 */
export async function getCryptoPrice(coinId: string): Promise<number | null> {
    const id = coinId.toLowerCase();

    // 1. Try CoinGecko
    try {
        const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price`, {
            params: {
                ids: id,
                vs_currencies: 'usd'
            },
            timeout: 3000
        });
        if (response.data && response.data[id]) {
            return response.data[id].usd;
        }
    } catch (error: any) {
        console.warn(`CoinGecko failed for ${id}: ${error.message}`);
    }

    // 2. Try CryptoCompare as Fallback
    try {
        // Map CoinGecko ID back to Symbol for CryptoCompare
        const symbol = Object.keys(SYMBOL_TO_ID).find(key => SYMBOL_TO_ID[key] === id);
        if (symbol) {
            const response = await axios.get(`https://min-api.cryptocompare.com/data/price`, {
                params: {
                    fsym: symbol,
                    tsyms: 'USD'
                },
                timeout: 3000
            });
            if (response.data && response.data.USD) {
                return response.data.USD;
            }
        }
    } catch (error: any) {
        console.warn(`CryptoCompare failed for ${id}: ${error.message}`);
    }

    // 3. Last Resort: Hardcoded Fallback
    const fallbackPrice = FALLBACK_PRICES[id];
    if (fallbackPrice) {
        console.log(`Using hardcoded fallback for ${id}`);
        return fallbackPrice;
    }

    return null;
}
