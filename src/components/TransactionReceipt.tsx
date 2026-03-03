'use client';

import React from 'react';

interface TransactionReceiptProps {
    isOpen: boolean;
    onClose: () => void;
    transaction: {
        amount: number;
        type: string;
        productName?: string;
        description?: string;
        date: string;
        id: string;
    };
}

export default function TransactionReceipt({ isOpen, onClose, transaction }: TransactionReceiptProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-md overflow-hidden rounded-2xl bg-[#1e293b] border border-gray-800 shadow-2xl animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
                        <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white">Transaction Success</h2>
                    <p className="text-blue-100 opacity-80">Receipt #{transaction.id.slice(-8).toUpperCase()}</p>
                </div>

                {/* Content */}
                <div className="p-8 space-y-6">
                    <div className="text-center">
                        <p className="text-sm uppercase tracking-widest text-gray-400">Amount Paid</p>
                        <p className="text-4xl font-black text-white mt-1">
                            ${transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-gray-800 pt-6">
                        <div>
                            <p className="text-xs uppercase text-gray-500">Service/Product</p>
                            <p className="text-sm font-semibold text-gray-200">{transaction.productName || transaction.type}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs uppercase text-gray-500">Transaction Type</p>
                            <p className="text-sm font-semibold text-gray-200 capitalize">{transaction.type}</p>
                        </div>
                        <div>
                            <p className="text-xs uppercase text-gray-500">Date & Time</p>
                            <p className="text-sm font-semibold text-gray-200">{new Date(transaction.date).toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs uppercase text-gray-500">Status</p>
                            <p className="text-sm font-semibold text-green-400">Completed</p>
                        </div>
                    </div>

                    {transaction.description && (
                        <div className="rounded-xl bg-blue-500/5 p-4 border border-blue-500/10">
                            <p className="text-xs font-medium text-blue-400 uppercase tracking-wider mb-1">Description</p>
                            <p className="text-sm text-gray-300 italic">"{transaction.description}"</p>
                        </div>
                    )}

                    <div className="rounded-xl bg-gray-900/50 p-4 border border-gray-800">
                        <p className="text-[10px] text-gray-500 text-center leading-relaxed">
                            Thank you for investing with NovaVault. This receipt serves as official proof of transaction.
                            For any inquiries, please contact our support with the receipt ID.
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full rounded-xl bg-blue-600 py-4 font-bold text-white transition-all hover:bg-blue-500 active:scale-[0.98]"
                    >
                        Done
                    </button>

                    <button
                        onClick={() => window.print()}
                        className="w-full text-xs text-gray-500 hover:text-gray-300 transition-colors"
                    >
                        Download PDF Receipt
                    </button>
                </div>
            </div>
        </div>
    );
}
