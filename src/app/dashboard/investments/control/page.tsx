'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import TransactionReceipt from '@/components/TransactionReceipt';

export default function ControlInvestmentsPage() {
    const { data: session } = useSession();
    const [investments, setInvestments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [selectedInv, setSelectedInv] = useState<any>(null);
    const [actionAmount, setActionAmount] = useState<string>('');
    const [actionType, setActionType] = useState<'increase' | 'decrease' | 'terminate' | null>(null);
    const [showReceipt, setShowReceipt] = useState(false);
    const [lastTransaction, setLastTransaction] = useState<any>(null);

    const fetchInvestments = useCallback(async () => {
        try {
            const res = await axios.get('/api/invest');
            setInvestments(res.data);
        } catch (error) {
            console.error('Error fetching investments:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchInvestments();
    }, [fetchInvestments]);

    const handleAction = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedInv || !actionType) return;

        setActionLoading(selectedInv._id);
        try {
            if (actionType === 'terminate') {
                const res = await axios.delete(`/api/invest?id=${selectedInv._id}`);
                setLastTransaction({
                    id: Math.random().toString(36).substr(2, 9),
                    amount: selectedInv.amountInvested + selectedInv.totalProfit,
                    type: 'payout',
                    productName: selectedInv.productName,
                    date: new Date().toISOString(),
                    description: `Termination payout for ${selectedInv.productName}`
                });
            } else {
                const res = await axios.patch('/api/invest', {
                    id: selectedInv._id,
                    amount: parseFloat(actionAmount),
                    action: actionType
                });
                setLastTransaction({
                    id: Math.random().toString(36).substr(2, 9),
                    amount: parseFloat(actionAmount),
                    type: actionType === 'increase' ? 'investment' : 'withdrawal',
                    productName: selectedInv.productName,
                    date: new Date().toISOString(),
                    description: `${actionType === 'increase' ? 'Capital increase' : 'Partial withdrawal'} for ${selectedInv.productName}`
                });
            }

            setShowReceipt(true);
            fetchInvestments();
            setSelectedInv(null);
            setActionType(null);
            setActionAmount('');
        } catch (error: any) {
            alert(error.response?.data?.message || 'Error processing action');
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="space-y-12">
            <header className="mb-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tighter">Manage Portfolio</h1>
                        <p className="text-gray-400 mt-2 font-medium">Control, expand or liquidate your active holdings</p>
                    </div>
                    
                    <div className="flex p-1.5 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-white/5 shadow-xl">
                        <a 
                            href="/dashboard/investments"
                            className="px-8 py-3 rounded-xl text-gray-500 hover:text-white text-xs font-black uppercase tracking-widest transition-all"
                        >
                            Market
                        </a>
                        <button 
                            className="px-8 py-3 rounded-xl bg-indigo-600 text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20 transition-all"
                        >
                            Manage
                        </button>
                    </div>
                </div>
            </header>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <div className="h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Accessing your vaults...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {investments.length > 0 ? investments.map((inv) => (
                        <div key={inv._id} className="group bg-slate-900/40 border border-white/5 rounded-[2rem] p-8 backdrop-blur-sm hover:border-indigo-500/30 transition-all duration-500">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-2xl font-black text-white">{inv.productName}</h3>
                                        <span className="px-3 py-1 bg-white/5 rounded-full text-[9px] font-black text-indigo-400 uppercase tracking-widest border border-white/5">
                                            {inv.category}
                                        </span>
                                    </div>
                                    <p className="text-gray-500 text-sm font-medium">Started on {new Date(inv.createdAt).toLocaleDateString()}</p>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 flex-1 lg:max-w-2xl px-4">
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Principal</p>
                                        <p className="text-xl font-black text-white">${inv.amountInvested.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Total ROI</p>
                                        <p className="text-xl font-black text-emerald-400">+${inv.totalProfit.toLocaleString()}</p>
                                    </div>
                                    <div className="hidden sm:block">
                                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Value Projection</p>
                                        <p className="text-xl font-black text-blue-400">${(inv.amountInvested + inv.totalProfit).toLocaleString()}</p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    <button 
                                        onClick={() => { setSelectedInv(inv); setActionType('increase'); }}
                                        className="px-6 py-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-[10px] font-black text-emerald-400 uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all"
                                    >
                                        Increase
                                    </button>
                                    <button 
                                        onClick={() => { setSelectedInv(inv); setActionType('decrease'); }}
                                        className="px-6 py-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl text-[10px] font-black text-orange-400 uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all"
                                    >
                                        Decrease
                                    </button>
                                    <button 
                                        onClick={() => { setSelectedInv(inv); setActionType('terminate'); }}
                                        className="px-6 py-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-[10px] font-black text-red-500 uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                                    >
                                        Terminate
                                    </button>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="py-20 text-center bg-slate-900/20 rounded-[3rem] border border-dashed border-white/5">
                            <p className="text-gray-500 font-bold italic">You don't have any active assets to manage.</p>
                            <a href="/dashboard/investments" className="mt-4 inline-block text-indigo-400 font-black text-xs uppercase tracking-widest hover:text-indigo-300">Browse Market &rarr;</a>
                        </div>
                    )}
                </div>
            )}

            {/* Management Modal */}
            {selectedInv && actionType && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 animate-in fade-in duration-300">
                    <div className="w-full max-w-md overflow-hidden rounded-[3rem] border border-white/10 bg-[#0f172a] shadow-2xl">
                        <div className="p-10">
                            <h2 className="text-3xl font-black text-white capitalize">{actionType} Capital</h2>
                            <p className="text-indigo-400 font-bold mt-2 uppercase text-[10px] tracking-[0.2em]">{selectedInv.productName}</p>
                            
                            <form onSubmit={handleAction} className="mt-10 space-y-8">
                                {actionType !== 'terminate' ? (
                                    <div className="space-y-3">
                                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest">Capital adjustment (USD)</label>
                                        <div className="relative group">
                                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-600 transition-colors group-focus-within:text-indigo-400">$</span>
                                            <input 
                                                type="number" 
                                                value={actionAmount}
                                                onChange={(e) => setActionAmount(e.target.value)}
                                                placeholder="1,000"
                                                className="w-full rounded-2xl bg-white/[0.02] border-white/10 py-6 pl-12 pr-6 text-2xl font-bold text-white focus:border-indigo-500 focus:bg-white/[0.04] outline-none transition-all"
                                                required
                                            />
                                        </div>
                                        <p className="text-[10px] text-gray-600 font-medium px-2 italic">
                                            {actionType === 'increase' ? 'Your available balance will be deducted' : 'Amount will be returned to your main balance'}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="bg-red-500/5 rounded-[2rem] p-8 border border-red-500/10 text-center">
                                        <p className="text-red-400 font-black text-sm uppercase tracking-widest mb-4">Final Liquidation Alert</p>
                                        <p className="text-gray-400 text-sm leading-relaxed">
                                            Terminating this investment will close your position and refund your principal + accrued profits to your balance.
                                        </p>
                                        <div className="mt-6 p-4 bg-slate-900/50 rounded-2xl">
                                            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Total Disbursement</p>
                                            <p className="text-2xl font-black text-white">${(selectedInv.amountInvested + selectedInv.totalProfit).toLocaleString()}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-4">
                                    <button 
                                        type="button" 
                                        onClick={() => { setSelectedInv(null); setActionType(null); }}
                                        className="flex-1 rounded-2xl bg-white/5 py-5 font-black text-xs uppercase tracking-widest text-white hover:bg-white/10 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={!!actionLoading}
                                        className={`flex-[1.5] rounded-2xl py-5 font-black text-xs uppercase tracking-widest text-white transition-all active:scale-95 disabled:opacity-50 ${
                                            actionType === 'increase' ? 'bg-emerald-600 hover:bg-emerald-500' : 
                                            actionType === 'decrease' ? 'bg-orange-600 hover:bg-orange-500' : 
                                            'bg-red-600 hover:bg-red-500'
                                        }`}
                                    >
                                        {actionLoading ? 'Processing...' : `Confirm ${actionType}`}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {showReceipt && lastTransaction && (
                <TransactionReceipt 
                    isOpen={showReceipt} 
                    onClose={() => setShowReceipt(false)} 
                    transaction={lastTransaction} 
                />
            )}
        </div>
    );
}
