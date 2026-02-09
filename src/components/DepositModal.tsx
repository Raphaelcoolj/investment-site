'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';

interface DepositModalProps {
    isOpen: boolean;
    onClose: () => void;
    coin: string; // e.g., 'bitcoin', 'ethereum'
    coinSymbol: string;
}

export default function DepositModal({ isOpen, onClose, coin, coinSymbol }: DepositModalProps) {
    const { data: session } = useSession();
    const [adminAddress, setAdminAddress] = useState('Loading...');
    const [amount, setAmount] = useState('');
    const [isCopied, setIsCopied] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);

    useEffect(() => {
        if (isOpen) {
            // Fetch settings to get address
            axios.get('/api/settings').then(res => {
                const methods = res.data.paymentMethods;
                // Map coin to setting key (simplified)
                const key = coinSymbol.toLowerCase();
                setAdminAddress(methods?.[key] || 'Contact Support for Address');
            });
        }
    }, [isOpen, coinSymbol]);

    if (!isOpen) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(adminAddress);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleConfirm = async () => {
        if (!session) {
            alert('Please log in again to continue.');
            return;
        }

        if (!amount || parseFloat(amount) <= 0) {
            alert('Please enter a valid deposit amount.');
            return;
        }

        setIsConfirming(true);
        try {
            await axios.post('/api/deposit', {
                method: coinSymbol,
                amount: parseFloat(amount)
            });
            alert('Deposit notification sent to Admin!');
            onClose();
        } catch (e) {
            alert('Failed to send notification');
        } finally {
            setIsConfirming(false);
        }
    };

    const isCrypto = !['cashapp', 'paypal', 'zelle'].includes(coinSymbol.toLowerCase());

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="glass-panel w-full max-w-md p-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
                
                <h2 className="text-2xl font-bold mb-4">Deposit via {coinSymbol.toUpperCase()}</h2>
                <p className="text-sm text-gray-400 mb-6">
                    {isCrypto ? (
                        <>To fund your account, please send {coinSymbol.toUpperCase()} to the address below. Your balance will be updated automatically after network confirmation.</>
                    ) : (
                        <>To fund your account, please send payment to the {coinSymbol.toUpperCase()} account below. Your balance will be updated after verification.</>
                    )}
                </p>

                <div className="mb-6">
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                        Enter Amount to Deposit ($)
                    </label>
                    <input 
                        type="number"
                        placeholder="e.g. 500"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full rounded-lg border border-gray-700 bg-black/40 p-3 text-white outline-none focus:border-blue-500"
                        required
                    />
                </div>

                <div className="mb-2 flex justify-between text-xs text-gray-400">
                    <span>{isCrypto ? `${coinSymbol.toUpperCase()} Address` : `${coinSymbol.toUpperCase()} Details`}</span>
                </div>
                <div className="bg-black/40 p-4 rounded-lg mb-4 break-all font-mono text-sm border border-gray-700">
                    {adminAddress}
                </div>

                <button 
                    onClick={handleCopy}
                    className="w-full mb-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm font-medium transition-colors"
                >
                    {isCopied ? 'Copied!' : `Copy ${isCrypto ? 'Address' : 'Tag/Details'}`}
                </button>

                <div className="border-t border-gray-700 my-4" />

                {isCrypto && (
                    <p className="text-xs text-yellow-500 mb-4">
                        ⚠️ Ensure you are sending {coinSymbol.toUpperCase()} on the correct network. Lost funds cannot be recovered.
                    </p>
                )}

                <button 
                    onClick={handleConfirm}
                    disabled={isConfirming}
                    className="w-full py-3 rounded-lg bg-green-600 hover:bg-green-500 font-bold transition-colors"
                >
                    {isConfirming ? 'Confirming...' : 'I Have Made Payment'}
                </button>
            </div>
        </div>
    );
}
