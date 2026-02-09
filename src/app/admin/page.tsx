'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function AdminDashboardPage() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalBalance: 0,
    });

    useEffect(() => {
        axios.get('/api/admin/users').then(res => {
            const users = res.data;
            const totalBalance = users.reduce((acc: number, user: any) => acc + user.balance, 0);
            setStats({
                totalUsers: users.length,
                totalBalance,
            });
        });
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Admin Overview</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-panel p-6 border border-slate-800 bg-slate-900/50 rounded-lg">
                    <p className="text-slate-400 text-sm">Total Users</p>
                    <p className="text-3xl font-bold text-blue-400">{stats.totalUsers}</p>
                </div>
                <div className="glass-panel p-6 border border-slate-800 bg-slate-900/50 rounded-lg">
                    <p className="text-slate-400 text-sm">Total User Balance</p>
                    <p className="text-3xl font-bold text-green-400">${stats.totalBalance.toFixed(2)}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link href="/admin/users" className="glass-panel p-6 border border-slate-800 bg-slate-900/50 rounded-lg hover:bg-slate-800/50 transition-colors">
                    <h3 className="text-xl font-bold mb-2">User Management</h3>
                    <p className="text-slate-400 text-sm">View, edit, and manage all users and their balances.</p>
                </Link>
                <Link href="/admin/settings" className="glass-panel p-6 border border-slate-800 bg-slate-900/50 rounded-lg hover:bg-slate-800/50 transition-colors">
                    <h3 className="text-xl font-bold mb-2">Platform Settings</h3>
                    <p className="text-slate-400 text-sm">Update platform wallet addresses and notification emails.</p>
                </Link>
            </div>
        </div>
    );
}
