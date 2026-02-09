'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {
        axios.get('/api/admin/users').then(res => setUsers(res.data));
    }, []);

    return (
        <div>
            <h1 className="mb-6 text-2xl font-bold">User Management</h1>
            <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-900/50">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-800 text-slate-400">
                        <tr>
                            <th className="p-4">Username</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Balance</th>
                            <th className="p-4">Increment</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id} className="border-b border-slate-800 hover:bg-slate-800/50">
                                <td className="p-4 font-medium">{user.username}</td>
                                <td className="p-4 text-slate-400">{user.email}</td>
                                <td className="p-4 text-green-400">${user.balance.toFixed(2)}</td>
                                <td className="p-4">
                                    {user.isIncrementing ? (
                                        <span className="rounded bg-green-900/50 px-2 py-1 text-xs text-green-400">
                                            +{user.dailyIncrement}/day
                                        </span>
                                    ) : (
                                        <span className="text-slate-500">Off</span>
                                    )}
                                </td>
                                <td className="p-4">
                                    <Link 
                                        href={`/admin/users/${user._id}`}
                                        className="rounded bg-blue-600 px-3 py-1 text-xs hover:bg-blue-500"
                                    >
                                        Manage
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
