'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

const COIN_MAPPING: Record<string, string> = {
    'BTC': 'bitcoin',
    'ETH': 'ethereum',
    'USDT': 'tether',
    'SOL': 'solana',
};

interface Transaction {
    _id: string;
    amount: number;
    coin: string;
    type: 'deposit' | 'withdrawal' | 'increment';
    status: 'pending' | 'success' | 'failed';
    createdAt: string;
}

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    transaction: Transaction | null;
}

export default function TransactionDetailModal({ isOpen, onClose, transaction }: ModalProps) {
    const [cryptoAmount, setCryptoAmount] = useState<string | null>(null);
    const [loadingPrice, setLoadingPrice] = useState(false);

    useEffect(() => {
        if (!transaction || !isOpen) {
            setCryptoAmount(null);
            return;
        }

        const coinId = COIN_MAPPING[transaction.coin.toUpperCase()];
        if (coinId) {
            setLoadingPrice(true);
            axios.get(`/api/prices`, {
                params: {
                    ids: coinId
                }
            }).then(res => {
                const data = res.data;
                const price = data[coinId]?.usd;
                if (price) {
                    const calculated = (transaction.amount / price).toFixed(8);
                    setCryptoAmount(calculated);
                } else {
                    setCryptoAmount('N/A');
                }
            }).catch(err => {
                console.error("Failed to fetch price for invoice:", err);
                setCryptoAmount('Price Error');
            }).finally(() => {
                setLoadingPrice(false);
            });
        }
    }, [transaction, isOpen]);

    if (!isOpen || !transaction) return null;

    const getStatusStyle = (status: string, type: string) => {
        if (type === 'withdrawal') return 'bg-red-900/50 text-red-400 border-red-500/50';
        if (status === 'pending') return 'bg-slate-700/50 text-slate-400 border-slate-600/50';
        if (status === 'success' || type === 'increment') return 'bg-green-900/50 text-green-400 border-green-500/50';
        return 'bg-slate-800 text-slate-500';
    };

    const getTypeName = (type: string) => {
        if (type === 'increment') return 'Daily Profit';
        if (type === 'withdrawal') return 'Withdrawal';
        return 'Deposit';
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="glass-panel w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    <span className="text-2xl">✕</span>
                </button>

                <div className="text-center mb-6">
                    <div className={`mx-auto h-16 w-16 flex items-center justify-center rounded-full mb-4 ${
                        transaction.type === 'increment' ? 'bg-green-500/20 text-green-400' : 
                        transaction.type === 'withdrawal' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                    }`}>
                        <span className="text-2xl">
                            {transaction.type === 'increment' ? '📈' : transaction.type === 'withdrawal' ? '💸' : '💰'}
                        </span>
                    </div>
                    <h2 className="text-2xl font-bold">{getTypeName(transaction.type)}</h2>
                    <p className="text-gray-400 text-sm">Ref ID: {transaction._id.substring(0, 8)}...</p>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between border-b border-white/5 pb-3">
                        <span className="text-gray-400">Status</span>
                        <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase ${getStatusStyle(transaction.status, transaction.type)}`}>
                            {transaction.type === 'withdrawal' ? 'Completed' : transaction.status}
                        </span>
                    </div>

                    <div className="flex justify-between border-b border-white/5 pb-3">
                        <span className="text-gray-400">Amount (USD)</span>
                        <span className="font-mono font-bold text-lg">
                            {transaction.type === 'withdrawal' ? '-' : '+'}${transaction.amount.toFixed(2)}
                        </span>
                    </div>

                    {cryptoAmount && (
                        <div className="flex justify-between border-b border-white/5 pb-3">
                            <span className="text-gray-400">Amount ({transaction.coin.toUpperCase()})</span>
                            <span className="font-mono font-bold text-blue-400">
                                {loadingPrice ? '...' : cryptoAmount}
                            </span>
                        </div>
                    )}

                    <div className="flex justify-between border-b border-white/5 pb-3">
                        <span className="text-gray-400">Asset</span>
                        <span className="uppercase text-slate-100 font-medium">{transaction.coin}</span>
                    </div>

                    <div className="flex justify-between border-b border-white/5 pb-3">
                        <span className="text-gray-400">Date & Time</span>
                        <span className="text-slate-100 text-sm text-right">
                            {new Date(transaction.createdAt).toLocaleString(undefined, {
                                dateStyle: 'medium',
                                timeStyle: 'short'
                            })}
                        </span>
                    </div>

                    {transaction.type === 'deposit' && (
                        <div className="p-3 bg-blue-500/5 rounded-lg border border-blue-500/10 mt-4">
                            <p className="text-xs text-blue-400 text-center uppercase tracking-widest font-bold">Transaction Confirmed</p>
                        </div>
                    )}
                </div>

                <button 
                    onClick={onClose}
                    className="w-full mt-8 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors font-semibold"
                >
                    Close Invoice
                </button>
            </div>
        </div>
    );
}
