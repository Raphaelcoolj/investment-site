'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminInvestmentsPage() {
    const [investments, setInvestments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState({ amountInvested: 0, totalProfit: 0, status: '' });

    const fetchInvestments = async () => {
        try {
            const res = await axios.get('/api/admin/investments');
            setInvestments(res.data);
        } catch (error) {
            console.error('Error fetching investments:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvestments();
    }, []);

    const handleEdit = (inv: any) => {
        setEditingId(inv._id);
        setEditForm({
            amountInvested: inv.amountInvested,
            totalProfit: inv.totalProfit,
            status: inv.status
        });
    };

    const handleUpdate = async () => {
        try {
            await axios.patch('/api/admin/investments', {
                id: editingId,
                ...editForm
            });
            setEditingId(null);
            fetchInvestments();
        } catch (error) {
            alert('Error updating investment');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this investment?')) return;
        try {
            await axios.delete(`/api/admin/investments?id=${id}`);
            fetchInvestments();
        } catch (error) {
            alert('Error deleting investment');
        }
    };

    if (loading) return <div className="p-8 text-white">Loading investments...</div>;

    return (
        <div className="p-8 text-white">
            <header className="mb-8">
                <h1 className="text-3xl font-bold">Manage Investments</h1>
                <p className="text-gray-400">View and edit user investments and profits</p>
            </header>

            <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-800 text-gray-400 uppercase text-[10px] tracking-wider">
                        <tr>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Product</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4">Current Profit</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {investments.map((inv) => (
                            <tr key={inv._id} className="hover:bg-gray-800/50">
                                <td className="px-6 py-4">
                                    <div className="font-semibold">{inv.userId?.username}</div>
                                    <div className="text-xs text-gray-500">{inv.userId?.email}</div>
                                </td>
                                <td className="px-6 py-4 font-medium">{inv.productName}</td>
                                <td className="px-6 py-4">
                                    {editingId === inv._id ? (
                                        <input 
                                            type="number" 
                                            value={editForm.amountInvested}
                                            onChange={(e) => setEditForm({ ...editForm, amountInvested: parseFloat(e.target.value) })}
                                            className="w-24 bg-gray-800 border border-gray-700 rounded px-2 py-1"
                                        />
                                    ) : (
                                        `$${inv.amountInvested.toLocaleString()}`
                                    )}
                                </td>
                                <td className="px-6 py-4 text-green-400">
                                    {editingId === inv._id ? (
                                        <input 
                                            type="number" 
                                            value={editForm.totalProfit}
                                            onChange={(e) => setEditForm({ ...editForm, totalProfit: parseFloat(e.target.value) })}
                                            className="w-24 bg-gray-800 border border-gray-700 rounded px-2 py-1"
                                        />
                                    ) : (
                                        `$${inv.totalProfit.toLocaleString()}`
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    {editingId === inv._id ? (
                                        <select 
                                            value={editForm.status}
                                            onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                                            className="bg-gray-800 border border-gray-700 rounded px-2 py-1"
                                        >
                                            <option value="active">Active</option>
                                            <option value="completed">Completed</option>
                                        </select>
                                    ) : (
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${inv.status === 'active' ? 'bg-blue-500/10 text-blue-400' : 'bg-green-500/10 text-green-400'}`}>
                                            {inv.status}
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-gray-500">{new Date(inv.createdAt).toLocaleDateString()}</td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    {editingId === inv._id ? (
                                        <>
                                            <button onClick={handleUpdate} className="text-blue-400 hover:underline">Save</button>
                                            <button onClick={() => setEditingId(null)} className="text-gray-400 hover:underline">Cancel</button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => handleEdit(inv)} className="text-indigo-400 hover:underline">Edit</button>
                                            <button onClick={() => handleDelete(inv._id)} className="text-red-400 hover:underline">Delete</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
