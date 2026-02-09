'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        axios.get('/api/settings').then(res => setSettings(res.data));
    }, []);

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        
        const payload = {
            notificationEmail: formData.get('notificationEmail'),
            paymentMethods: {
                btc: formData.get('btc'),
                eth: formData.get('eth'),
                usdt: formData.get('usdt'),
                sol: formData.get('sol'),
                cashapp: formData.get('cashapp'),
                paypal: formData.get('paypal'),
                zelle: formData.get('zelle'),
            }
        };

        try {
            await axios.post('/api/settings', payload);
            alert('Settings saved successfully');
            router.refresh();
        } catch (error) {
            alert('Failed to save settings');
        } finally {
            setLoading(false);
        }
    };

    if (!settings) return <div>Loading...</div>;

    return (
        <div className="max-w-4xl">
            <h1 className="mb-6 text-2xl font-bold">Site Settings</h1>
            
            <form onSubmit={handleSave} className="space-y-8">
                {/* Notifications */}
                <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-6">
                    <h3 className="mb-4 text-lg font-semibold text-blue-400">Notifications</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="mb-2 block text-sm text-slate-400">Admin Email (for alerts)</label>
                            <input 
                                name="notificationEmail" 
                                type="email"
                                defaultValue={settings.notificationEmail}
                                required
                                className="w-full rounded bg-slate-800 p-2 text-white border border-slate-700 focus:border-blue-500 outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Crypto Addresses */}
                <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-6">
                    <h3 className="mb-4 text-lg font-semibold text-purple-400">Crypto Wallets</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="mb-2 block text-sm text-slate-400">Bitcoin (BTC) Address</label>
                            <input 
                                name="btc" 
                                type="text"
                                defaultValue={settings.paymentMethods?.btc}
                                className="w-full rounded bg-slate-800 p-2 text-white border border-slate-700 outline-none"
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm text-slate-400">Ethereum (ETH) Address</label>
                            <input 
                                name="eth" 
                                type="text"
                                defaultValue={settings.paymentMethods?.eth}
                                className="w-full rounded bg-slate-800 p-2 text-white border border-slate-700 outline-none"
                            />
                        </div>
                         <div>
                            <label className="mb-2 block text-sm text-slate-400">USDT (TRC20/ERC20) Address</label>
                            <input 
                                name="usdt" 
                                type="text"
                                defaultValue={settings.paymentMethods?.usdt}
                                className="w-full rounded bg-slate-800 p-2 text-white border border-slate-700 outline-none"
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm text-slate-400">Solana (SOL) Address</label>
                            <input 
                                name="sol" 
                                type="text"
                                defaultValue={settings.paymentMethods?.sol}
                                className="w-full rounded bg-slate-800 p-2 text-white border border-slate-700 outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Fiat/Other */}
                <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-6">
                    <h3 className="mb-4 text-lg font-semibold text-green-400">Fiat / App Payments</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="mb-2 block text-sm text-slate-400">CashApp Tag</label>
                            <input 
                                name="cashapp" 
                                type="text"
                                defaultValue={settings.paymentMethods?.cashapp}
                                className="w-full rounded bg-slate-800 p-2 text-white border border-slate-700 outline-none"
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm text-slate-400">PayPal Email/Link</label>
                            <input 
                                name="paypal" 
                                type="text"
                                defaultValue={settings.paymentMethods?.paypal}
                                className="w-full rounded bg-slate-800 p-2 text-white border border-slate-700 outline-none"
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm text-slate-400">Zelle (Email/Phone)</label>
                            <input 
                                name="zelle" 
                                type="text"
                                defaultValue={settings.paymentMethods?.zelle}
                                className="w-full rounded bg-slate-800 p-2 text-white border border-slate-700 outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="rounded bg-blue-600 px-6 py-3 font-bold hover:bg-blue-500"
                    >
                        {loading ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>
            </form>
        </div>
    );
}
