'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import CryptoChart from '@/components/CryptoChart';
import DepositModal from '@/components/DepositModal';

const PAYMENT_METHODS = [
    { id: 'bitcoin', symbol: 'BTC', color: 'rgba(255, 99, 132, 1)' },
    { id: 'ethereum', symbol: 'ETH', color: 'rgba(54, 162, 235, 1)' },
    { id: 'solana', symbol: 'SOL', color: 'rgba(153, 102, 255, 1)' },
    { id: 'tether', symbol: 'USDT', color: 'rgba(75, 192, 192, 1)' },
    { id: 'cashapp', symbol: 'CASHAPP', color: 'rgba(34, 197, 94, 1)' },
    { id: 'paypal', symbol: 'PAYPAL', color: 'rgba(37, 99, 235, 1)' },
    { id: 'zelle', symbol: 'ZELLE', color: 'rgba(107, 33, 168, 1)' },
];

export default function DashboardPage() {
    const [selectedCoin, setSelectedCoin] = useState<{id: string, symbol: string} | null>(null);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/user/profile')
            .then(res => setUser(res.data))
            .catch(err => console.error('Failed to fetch profile:', err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <p className="text-gray-400">Welcome back, {user?.username || 'Investor'}</p>
                </div>
                <div className="glass-panel px-6 py-3 min-w-[200px]">
                    <p className="text-sm text-gray-400">Total Balance</p>
                    {loading ? (
                        <div className="h-8 w-24 animate-pulse bg-slate-800 rounded mt-1"></div>
                    ) : (
                        <p className="text-2xl font-mono font-bold text-green-400">
                            ${user?.balance?.toFixed(2) || '0.00'}
                        </p>
                    )}
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {PAYMENT_METHODS.map(coin => (
                    <CryptoChart 
                        key={coin.id}
                        coinId={coin.id}
                        label={`${coin.symbol}/USD`}
                        color={coin.color}
                        onChartClick={() => setSelectedCoin(coin)}
                    />
                ))}
            </div>

            {/* Deposit Modal */}
            <DepositModal 
                isOpen={!!selectedCoin}
                onClose={() => setSelectedCoin(null)}
                coin={selectedCoin?.id || ''}
                coinSymbol={selectedCoin?.symbol || ''}
            />
        </div>
    );
}
