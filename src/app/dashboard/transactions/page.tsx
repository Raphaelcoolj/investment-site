'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import TransactionDetailModal from '@/components/TransactionDetailModal';

interface Transaction {
    _id: string;
    amount: number;
    coin: string;
    type: 'deposit' | 'withdrawal' | 'increment';
    status: 'pending' | 'success' | 'failed';
    createdAt: string;
}

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

    useEffect(() => {
        axios.get('/api/user/transactions')
            .then(res => setTransactions(res.data))
            .catch(err => console.error('Failed to fetch transactions:', err))
            .finally(() => setLoading(false));
    }, []);

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
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Transaction History</h1>
            
            <div className="glass-panel overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50">
                {loading ? (
                    <div className="p-12 text-center animate-pulse text-gray-400">Loading transactions...</div>
                ) : transactions.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-800 mb-4">
                            <span className="text-2xl text-slate-500">📋</span>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">No transactions yet</h3>
                        <p className="text-gray-400">Your recent activities will appear here.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-800/50 text-slate-400 border-b border-slate-800">
                                <tr>
                                    <th className="p-4">Date</th>
                                    <th className="p-4">Type</th>
                                    <th className="p-4">Amount (USD)</th>
                                    <th className="p-4">Asset</th>
                                    <th className="p-4">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((tx) => (
                                    <tr 
                                        key={tx._id} 
                                        onClick={() => setSelectedTx(tx)}
                                        className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group"
                                    >
                                        <td className="p-4 text-slate-400">
                                            {new Date(tx.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-medium uppercase ${
                                                tx.type === 'withdrawal' ? 'text-red-400' : 
                                                tx.type === 'increment' ? 'text-green-400' : 'text-blue-400'
                                            }`}>
                                                {getTypeName(tx.type)}
                                            </span>
                                        </td>
                                        <td className="p-4 font-mono font-bold group-hover:text-blue-400 transition-colors">
                                            {tx.type === 'withdrawal' ? '-' : '+'}${tx.amount.toFixed(2)}
                                        </td>
                                        <td className="p-4 uppercase text-slate-300">
                                            {tx.coin}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full border text-[10px] font-bold uppercase ${getStatusStyle(tx.status, tx.type)}`}>
                                                {tx.type === 'withdrawal' ? 'Completed' : tx.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <TransactionDetailModal 
                isOpen={!!selectedTx}
                onClose={() => setSelectedTx(null)}
                transaction={selectedTx}
            />
        </div>
    );
}
