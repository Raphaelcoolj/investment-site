'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function UserInvestmentsPage({ params }: { params: { id: string } }) {
    const [investments, setInvestments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchInvestments = async () => {
        try {
            const res = await axios.get('/api/admin/investments');
            const userInvestments = res.data.filter((inv: any) => 
                inv.userId?._id === params.id || inv.userId === params.id
            );
            setInvestments(userInvestments);
        } catch (error) {
            console.error('Error fetching investments:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvestments();
    }, [params.id]);

    if (loading) return <div className="p-8 text-white">Loading investments...</div>;

    return (
        <div className="max-w-4xl space-y-6">
            <button 
                onClick={() => router.back()}
                className="mb-4 text-sm text-gray-400 hover:text-white"
            >
                &larr; Back to User
            </button>
            <h1 className="text-2xl font-bold">User Investments</h1>
            <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-800 text-gray-400 uppercase text-[10px] tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Product</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4">Profit</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {investments.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                    No investments found for this user.
                                </td>
                            </tr>
                        ) : null}
                        {investments.map((inv) => (
                            <tr key={inv._id} className="hover:bg-gray-800/50">
                                <td className="px-6 py-4 font-medium">{inv.productName}</td>
                                <td className="px-6 py-4">${inv.amountInvested.toLocaleString()}</td>
                                <td className="px-6 py-4 text-green-400">${inv.totalProfit.toLocaleString()}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${inv.status === 'active' ? 'bg-blue-500/10 text-blue-400' : 'bg-green-500/10 text-green-400'}`}>
                                        {inv.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-500">{new Date(inv.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
