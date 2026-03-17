'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import CryptoChart from '@/components/CryptoChart';
import TransactionReceipt from '@/components/TransactionReceipt';

const REAL_ESTATE_PROPERTIES = [
    {
        id: 're-1',
        name: 'Burj Khalifa Residence',
        location: 'Dubai, UAE',
        pricePerUnit: 5000,
        yield: '20%',
        occupancy: '98%',
        image: 'https://images.unsplash.com/photo-1597659840241-37e2b9c2f55f?q=80&w=1000'
    },
    {
        id: 're-2',
        name: 'Central Park Tower Suite',
        location: 'New York, USA',
        pricePerUnit: 7000,
        yield: '20%',
        occupancy: '94%',
        image: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?q=80&w=1000'
    },
    {
        id: 're-3',
        name: 'One Hyde Park',
        location: 'London, UK',
        pricePerUnit: 10000,
        yield: '20%',
        occupancy: '96%',
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1000'
    },
    {
        id: 're-4',
        name: 'The Peak Villa',
        location: 'Hong Kong',
        pricePerUnit: 13000,
        yield: '20%',
        occupancy: '100%',
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000'
    },
    {
        id: 're-5',
        name: 'Marina Bay Sands Penthouse',
        location: 'Singapore',
        pricePerUnit: 17000,
        yield: '20%',
        occupancy: '99%',
        image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=1000'
    },
    {
        id: 're-6',
        name: 'Santorini Heights Villa',
        location: 'Greece',
        pricePerUnit: 19000,
        yield: '20%',
        occupancy: '95%',
        image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=1000'
    },
    {
        id: 're-7',
        name: 'Champs-Élysées Luxury Suite',
        location: 'Paris, France',
        pricePerUnit: 22000,
        yield: '20%',
        occupancy: '100%',
        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1000'
    },
    {
        id: 're-8',
        name: 'The Shard Sky Residence',
        location: 'London, UK',
        pricePerUnit: 10000,
        yield: '20%',
        occupancy: '97%',
        image: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?q=80&w=1000'
    },
    {
        id: 're-9',
        name: 'The Royal Atlantis Suite',
        location: 'Dubai, UAE',
        pricePerUnit: 28000,
        yield: '20%',
        occupancy: '94%',
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1000'
    },
    {
        id: 're-10',
        name: 'Beverly Hills Estate',
        location: 'California, USA',
        pricePerUnit: 30000,
        yield: '20%',
        occupancy: '98%',
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000'
    },
    {
        id: 're-11',
        name: 'Kyoto Zen Retreat',
        location: 'Japan',
        pricePerUnit: 14000,
        yield: '20%',
        occupancy: '94%',
        image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1000'
    },
    {
        id: 're-12',
        name: 'Monaco Harbor View',
        location: 'Monaco',
        pricePerUnit: 35000,
        yield: '20%',
        occupancy: '100%',
        image: 'https://images.unsplash.com/photo-1541414779316-956a5084c0d4?q=80&w=1000'
    },
    {
        id: 're-13',
        name: 'Swiss Alps Chalet',
        location: 'Zermatt, Switzerland',
        pricePerUnit: 23000,
        yield: '20%',
        occupancy: '92%',
        image: 'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?q=80&w=1000'
    },
    {
        id: 're-14',
        name: 'Sydney Harbor Penthouse',
        location: 'Australia',
        pricePerUnit: 20000,
        yield: '20%',
        occupancy: '97%',
        image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=1000'
    },
    {
        id: 're-15',
        name: 'Maldives Overwater Bungalow',
        location: 'Maldives',
        pricePerUnit: 28000,
        yield: '20%',
        occupancy: '99%',
        image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1000'
    },
    {
        id: 're-16',
        name: 'Bora Bora Lagoon Estate',
        location: 'French Polynesia',
        pricePerUnit: 24000,
        yield: '20%',
        occupancy: '95%',
        image: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?q=80&w=1000'
    },
    {
        id: 're-17',
        name: 'Vatican View Apartment',
        location: 'Rome, Italy',
        pricePerUnit: 17000,
        yield: '20%',
        occupancy: '98%',
        image: 'https://images.unsplash.com/photo-1525874684015-58379d421a52?q=80&w=1000'
    },
    {
        id: 're-18',
        name: 'Lago di Como Villa',
        location: 'Italy',
        pricePerUnit: 26000,
        yield: '20%',
        occupancy: '96%',
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1000'
    },
    {
        id: 're-19',
        name: 'Aspen Mountain Lodge',
        location: 'Colorado, USA',
        pricePerUnit: 22000,
        yield: '20%',
        occupancy: '93%',
        image: 'https://images.unsplash.com/photo-1518732714860-b62714ce0c59?q=80&w=1000'
    },
    {
        id: 're-20',
        name: 'Phuket Beachfront Palace',
        location: 'Thailand',
        pricePerUnit: 15000,
        yield: '20%',
        occupancy: '97%',
        image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=1000'
    }
];

export default function InvestmentsPage() {
    const { data: session } = useSession();
    const [prices, setPrices] = useState<any>(null);
    const [investments, setInvestments] = useState<any[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [investAmount, setInvestAmount] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [showReceipt, setShowReceipt] = useState(false);
    const [lastTransaction, setLastTransaction] = useState<any>(null);

    const fetchInvestments = async () => {
        try {
            const res = await axios.get('/api/invest');
            setInvestments(res.data);
        } catch (error) {
            console.error('Error fetching investments:', error);
        }
    };

    const fetchPrices = async () => {
        try {
            const res = await axios.get('/api/prices');
            setPrices(res.data);
        } catch (error) {
            console.error('Error fetching prices:', error);
        }
    };

    useEffect(() => {
        fetchInvestments();
        fetchPrices();
        const interval = setInterval(fetchPrices, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleInvest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProduct || !investAmount || parseFloat(investAmount) <= 0) return;

        setLoading(true);
        setMessage(null);

        try {
            const res = await axios.post('/api/invest', {
                productId: selectedProduct.id || selectedProduct.name.toLowerCase().replace(/\s+/g, '-'),
                productName: selectedProduct.name,
                category: selectedProduct.category,
                amountInvested: parseFloat(investAmount),
                units: selectedProduct.category === 'real-estate' ? parseFloat(investAmount) / selectedProduct.pricePerUnit : undefined
            });

            setLastTransaction({
                id: res.data.transactionId,
                amount: parseFloat(investAmount),
                type: 'investment',
                productName: selectedProduct.name,
                date: new Date().toISOString()
            });

            setMessage({ type: 'success', text: 'Investment successful!' });
            fetchInvestments();
            setShowReceipt(true);
            setSelectedProduct(null);
            setInvestAmount('');
        } catch (error: any) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Error processing investment' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-12">
            <header className="mb-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tighter">Investment Core</h1>
                        <p className="text-gray-400 mt-2 font-medium">Diversify your portfolio with premium global assets</p>
                    </div>
                    
                    {/* Sub Navigation */}
                    <div className="flex p-1.5 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-white/5 shadow-xl">
                        <button 
                            className="px-8 py-3 rounded-xl bg-blue-600 text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 transition-all"
                        >
                            Market
                        </button>
                        <a 
                            href="/dashboard/investments/control"
                            className="px-8 py-3 rounded-xl text-gray-500 hover:text-white text-xs font-black uppercase tracking-widest transition-all"
                        >
                            Manage
                        </a>
                    </div>
                </div>
            </header>

            {/* Status Messages */}
            {message && (
                <div className={`mb-6 rounded-xl p-4 animate-in fade-in slide-in-from-top-4 duration-300 ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                    {message.text}
                </div>
            )}

            {/* Commodities Section */}
            <section>
                <div className="flex items-center gap-3 mb-8">
                    <span className="h-8 w-1.5 bg-blue-500 rounded-full"></span>
                    <h2 className="text-2xl font-bold text-white">Commodities</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <CryptoChart 
                        coinId="oil" 
                        label="Crude Oil (WTI)" 
                        color="#3b82f6" 
                        onChartClick={() => setSelectedProduct({ name: 'Crude Oil', category: 'commodity', price: prices?.commodities?.oil })} 
                    />
                    <CryptoChart 
                        coinId="gold" 
                        label="Gold (XAU/USD)" 
                        color="#eab308" 
                        onChartClick={() => setSelectedProduct({ name: 'Gold', category: 'commodity', price: prices?.commodities?.gold })} 
                    />
                </div>
            </section>

            {/* Global Stocks Section */}
            <section>
                <div className="flex items-center gap-3 mb-8 text-white">
                    <span className="h-8 w-1.5 bg-emerald-500 rounded-full"></span>
                    <h2 className="text-2xl font-bold">Global Tech Stocks</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <CryptoChart 
                        coinId="aapl" 
                        label="Apple Inc (AAPL)" 
                        color="#94a3b8" 
                        onChartClick={() => setSelectedProduct({ name: 'Apple Inc', category: 'stock' })} 
                    />
                    <CryptoChart 
                        coinId="msft" 
                        label="Microsoft (MSFT)" 
                        color="#00a4ef" 
                        onChartClick={() => setSelectedProduct({ name: 'Microsoft', category: 'stock' })} 
                    />
                    <CryptoChart 
                        coinId="googl" 
                        label="Alphabet Inc (GOOGL)" 
                        color="#ea4335" 
                        onChartClick={() => setSelectedProduct({ name: 'Alphabet Inc', category: 'stock' })} 
                    />
                    <CryptoChart 
                        coinId="meta" 
                        label="Meta Platforms (META)" 
                        color="#0668E1" 
                        onChartClick={() => setSelectedProduct({ name: 'Meta Platforms', category: 'stock' })} 
                    />
                    <CryptoChart 
                        coinId="tsla" 
                        label="Tesla Inc (TSLA)" 
                        color="#e81123" 
                        onChartClick={() => setSelectedProduct({ name: 'Tesla Inc', category: 'stock' })} 
                    />
                    <CryptoChart 
                        coinId="amzn" 
                        label="Amazon.com (AMZN)" 
                        color="#ff9900" 
                        onChartClick={() => setSelectedProduct({ name: 'Amazon.com', category: 'stock' })} 
                    />
                    <CryptoChart 
                        coinId="brk-b" 
                        label="Berkshire Hathaway (BRK.B)" 
                        color="#ffffff" 
                        onChartClick={() => setSelectedProduct({ name: 'Berkshire Hathaway', category: 'stock' })} 
                    />
                    <CryptoChart 
                        coinId="xai" 
                        label="xAI (Private Equity)" 
                        color="#6366f1" 
                        onChartClick={() => setSelectedProduct({ name: 'xAI', category: 'stock' })} 
                    />
                </div>
            </section>

            {/* Real Estate Section */}
            <section>
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <span className="h-8 w-1.5 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></span>
                        <h2 className="text-2xl font-bold text-white">Premium Real Estate</h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {REAL_ESTATE_PROPERTIES.map((prop) => (
                        <div 
                            key={prop.id}
                            onClick={() => setSelectedProduct({ ...prop, category: 'real-estate' })}
                            className="group relative aspect-[4/5] overflow-hidden rounded-[2.5rem] border border-white/5 bg-slate-900 shadow-2xl transition-all duration-700 hover:-translate-y-3 hover:border-indigo-500/40 hover:shadow-[0_20px_50px_-15px_rgba(99,102,241,0.3)] cursor-pointer"
                        >
                            <img 
                                src={prop.image} 
                                alt={prop.name}
                                className="absolute inset-0 h-full w-full object-cover grayscale-[20%] transition-transform duration-1000 group-hover:scale-110 group-hover:grayscale-0"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent"></div>
                            
                            {/* Property Details Overlay */}
                            <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400/80">{prop.location}</span>
                                            <h3 className="text-xl font-bold text-white group-hover:text-indigo-200 transition-colors leading-tight">{prop.name}</h3>
                                        </div>
                                    </div>
                                    
                                    <div className="h-px w-full bg-white/10 group-hover:bg-indigo-500/30 transition-colors"></div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Starting Price</p>
                                            <p className="text-sm font-bold text-white">${prop.pricePerUnit.toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Monthly Return</p>
                                            <p className="text-sm font-bold text-emerald-400">{prop.yield}</p>
                                        </div>
                                    </div>

                                    <button className="w-full py-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl text-sm font-bold text-white hover:bg-indigo-600 hover:border-indigo-500 transition-all duration-300 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                                        Invest Units
                                    </button>
                                </div>
                            </div>

                            {/* Status Tags */}
                            <div className="absolute top-6 left-6 right-6 flex justify-between">
                                <span className="bg-[#020617]/60 backdrop-blur-md px-3 py-1.5 rounded-full text-[9px] font-black text-white border border-white/10">
                                    {prop.occupancy} OCCUPANCY
                                </span>
                                <span className="bg-indigo-600/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[9px] font-black text-white shadow-lg">
                                    VERIFIED
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* My Portfolio Section */}
            <section className="bg-slate-900/50 border border-white/5 rounded-[2rem] p-8 overflow-hidden backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-8">
                    <span className="h-8 w-1.5 bg-white rounded-full"></span>
                    <h2 className="text-2xl font-bold text-white">My Holdings</h2>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 text-[10px] uppercase tracking-widest text-gray-500 font-black">
                                <th className="px-6 py-6 pb-4">Asset</th>
                                <th className="px-6 py-6 pb-4">Principal</th>
                                <th className="px-6 py-6 pb-4">Current Profit</th>
                                <th className="px-6 py-6 pb-4">Status</th>
                                <th className="px-6 py-6 pb-4">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {investments.length > 0 ? investments.map((inv) => (
                                <tr key={inv._id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-6">
                                        <div className="font-bold text-white group-hover:text-blue-400 transition-colors">{inv.productName}</div>
                                        <div className="text-[10px] text-gray-500 uppercase tracking-tighter mt-0.5">{inv.category}</div>
                                    </td>
                                    <td className="px-6 py-6 font-mono text-gray-300 font-bold">${inv.amountInvested.toLocaleString()}</td>
                                    <td className="px-6 py-6">
                                        <div className="text-emerald-400 font-bold">+${inv.totalProfit.toLocaleString()}</div>
                                        <div className="h-1 w-16 bg-white/5 rounded-full mt-2 overflow-hidden">
                                            <div className="h-full bg-emerald-500/50" style={{ width: '45%' }}></div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${inv.status === 'active' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                                            {inv.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-6 text-xs text-gray-500">{new Date(inv.createdAt).toLocaleDateString()}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center text-gray-600 italic">
                                        No active assets in your portfolio.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Investment Modal */}
            {selectedProduct && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
                    <div className="w-full max-w-md overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#0f172a] shadow-2xl shadow-indigo-500/10">
                        <div className="p-10">
                            <h2 className="text-3xl font-black text-white">Invest Allocation</h2>
                            <p className="text-indigo-400 font-bold mt-2 uppercase text-xs tracking-widest">{selectedProduct.name} • {selectedProduct.category}</p>
                            
                            <form onSubmit={handleInvest} className="mt-10 space-y-8">
                                <div className="space-y-3">
                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest">Amount to invest (USD)</label>
                                    <div className="relative group">
                                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-600 transition-colors group-focus-within:text-indigo-400">$</span>
                                        <input 
                                            type="number" 
                                            value={investAmount}
                                            onChange={(e) => setInvestAmount(e.target.value)}
                                            placeholder="5,000"
                                            className="w-full rounded-2xl bg-white/[0.02] border-white/10 py-6 pl-12 pr-6 text-2xl font-bold text-white focus:border-indigo-500 focus:bg-white/[0.04] outline-none transition-all placeholder:text-gray-800"
                                            required
                                        />
                                    </div>
                                    {selectedProduct.category === 'real-estate' && investAmount && (
                                        <div className="space-y-4 pt-4 border-t border-white/5">
                                            <div className="flex justify-between items-center px-1">
                                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Share Ownership</p>
                                                <p className="text-sm font-black text-indigo-400">
                                                    {(parseFloat(investAmount) / selectedProduct.pricePerUnit).toFixed(4)} UNITS
                                                </p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-emerald-500/5 rounded-2xl p-4 border border-emerald-500/10">
                                                    <p className="text-[9px] font-black text-emerald-500/60 uppercase mb-1">Monthly ROI</p>
                                                    <p className="text-lg font-black text-emerald-400">
                                                        ${(parseFloat(investAmount) * (parseFloat(selectedProduct.yield) / 100)).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                                    </p>
                                                </div>
                                                <div className="bg-blue-500/5 rounded-2xl p-4 border border-blue-500/10">
                                                    <p className="text-[9px] font-black text-blue-500/60 uppercase mb-1">Annual ROI</p>
                                                    <p className="text-lg font-black text-blue-400">
                                                        ${(parseFloat(investAmount) * (parseFloat(selectedProduct.yield) / 100) * 12).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                                    </p>
                                                </div>
                                            </div>
                                            <p className="text-[9px] text-gray-600 text-center italic">Calculated based on current {selectedProduct.yield} fixed monthly return</p>
                                        </div>
                                    )}
                                    {selectedProduct.category !== 'real-estate' && investAmount && (
                                        <div className="bg-slate-900/40 rounded-2xl p-4 border border-white/5">
                                            <p className="text-[9px] font-black text-gray-500 uppercase mb-1">Potential Monthly ROI (20%)</p>
                                            <p className="text-lg font-black text-white">
                                                ${(parseFloat(investAmount) * 0.2).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-4">
                                    <button 
                                        type="button" 
                                        onClick={() => setSelectedProduct(null)}
                                        className="flex-1 rounded-2xl bg-white/5 py-5 font-black text-xs uppercase tracking-widest text-white hover:bg-white/10 transition-all active:scale-95"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={loading}
                                        className="flex-[1.5] rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 py-5 font-black text-xs uppercase tracking-widest text-white shadow-lg shadow-indigo-500/20 hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-50"
                                    >
                                        {loading ? 'Transacting...' : 'Confirm Asset Purchase'}
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
