'use client';

import { useState } from 'react';
import CryptoChart from '@/components/CryptoChart';
import DepositModal from '@/components/DepositModal';

const METHODS = [
    { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', color: 'rgba(255, 99, 132, 1)' },
    { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', color: 'rgba(54, 162, 235, 1)' },
    { id: 'solana', symbol: 'SOL', name: 'Solana', color: 'rgba(153, 102, 255, 1)' },
    { id: 'tether', symbol: 'USDT', name: 'Tether', color: 'rgba(75, 192, 192, 1)' },
    { id: 'cashapp', symbol: 'CASHAPP', name: 'CashApp', color: 'rgba(34, 197, 94, 1)' },
    { id: 'paypal', symbol: 'PAYPAL', name: 'PayPal', color: 'rgba(37, 99, 235, 1)' },
    { id: 'applepay', symbol: 'APPLE PAY', name: 'Apple Pay', color: 'rgba(0, 0, 0, 1)' },
];

export default function DepositPage() {
    const [selectedCoin, setSelectedCoin] = useState<{id: string, symbol: string} | null>(null);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Deposit Funds</h1>
            <p className="text-gray-400">Select a cryptocurrency to get your deposit address.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {METHODS.map(coin => (
                    <button 
                        key={coin.id}
                        onClick={() => setSelectedCoin(coin)}
                        className="glass-panel p-6 border border-slate-800 bg-slate-900/50 rounded-xl hover:border-blue-500/50 transition-all text-left group"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-2xl font-bold text-blue-400">{coin.symbol}</span>
                            <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20">
                                <span className="text-blue-400">↓</span>
                            </div>
                        </div>
                        <h3 className="text-lg font-semibold">{coin.name}</h3>
                        <p className="text-sm text-gray-500">Click to deposit</p>
                    </button>
                ))}
            </div>

            <DepositModal 
                isOpen={!!selectedCoin}
                onClose={() => setSelectedCoin(null)}
                coin={selectedCoin?.id || ''}
                coinSymbol={selectedCoin?.symbol || ''}
            />
        </div>
    );
}
