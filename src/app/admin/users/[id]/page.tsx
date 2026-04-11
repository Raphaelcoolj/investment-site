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
            const res = await axios.patch(`/api/admin/users/${params.id}`, updates);
            setUser(res.data);
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
                
                <div className="flex flex-col gap-3 pt-6">
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full rounded bg-blue-600 py-3 font-semibold hover:bg-blue-500"
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    
                    <button 
                        type="button" 
                        onClick={() => router.push(`/admin/users/${params.id}/investments`)}
                        className="w-full rounded border border-slate-700 bg-slate-800 py-3 font-semibold text-white hover:bg-slate-700"
                    >
                        View Investments
                    </button>

                    <button 
                        type="button" 
                        onClick={async () => {
                            if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
                                setLoading(true);
                                try {
                                    await axios.delete(`/api/admin/users/${params.id}`);
                                    alert('User deleted successfully');
                                    router.push('/admin/users');
                                } catch (error) {
                                    alert('Failed to delete user');
                                    setLoading(false);
                                }
                            }
                        }}
                        disabled={loading}
                        className="w-full rounded bg-red-600/20 border border-red-600/50 py-3 font-semibold text-red-500 hover:bg-red-600 hover:text-white transition-colors"
                    >
                        Delete Account
                    </button>
                </div>
            </form>
        </div>
    );
}
