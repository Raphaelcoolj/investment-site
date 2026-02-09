'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function AdminUserDetailPage({ params }: { params: { id: string } }) {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        axios.get(`/api/admin/users/${params.id}`).then(res => setUser(res.data));
    }, [params.id]);

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const updates = Object.fromEntries(formData.entries());
        
        // Convert checkbox to boolean
        updates.isIncrementing = (updates.isIncrementing === 'on') as any;

        try {
            await axios.patch(`/api/admin/users/${params.id}`, updates);
            alert('User updated successfully');
            router.refresh();
        } catch (error) {
            alert('Failed to update user');
        } finally {
            setLoading(false);
        }
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div className="max-w-2xl">
            <h1 className="mb-6 text-2xl font-bold">Edit User: {user.username}</h1>
            <form onSubmit={handleUpdate} className="space-y-6 rounded-lg border border-slate-800 bg-slate-900/50 p-6">
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="mb-2 block text-sm text-slate-400">Balance ($)</label>
                        <input 
                            name="balance" 
                            type="number" 
                            step="0.01" 
                            defaultValue={user.balance}
                            className="w-full rounded bg-slate-800 p-2 text-white"
                        />
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-6">
                    <h3 className="mb-4 text-lg font-semibold text-green-400">Auto-Increment Simulation</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-2 block text-sm text-slate-400">Daily Amount ($)</label>
                            <input 
                                name="dailyIncrement" 
                                type="number" 
                                step="0.01" 
                                defaultValue={user.dailyIncrement}
                                className="w-full rounded bg-slate-800 p-2 text-white"
                            />
                        </div>
                        <div className="flex items-end">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    name="isIncrementing" 
                                    type="checkbox" 
                                    defaultChecked={user.isIncrementing}
                                    className="h-5 w-5 rounded border-slate-600 bg-slate-800"
                                />
                                <span className="text-white">Active</span>
                            </label>
                        </div>
                    </div>
                </div>
                
                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full rounded bg-red-600 py-3 font-semibold hover:bg-red-500"
                >
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
        </div>
    );
}
