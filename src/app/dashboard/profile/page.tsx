'use client';

import { useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';
import axios from 'axios';

export default function ProfilePage() {
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [avatarUrl, setAvatarUrl] = useState('https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg');

    useEffect(() => {
        setLoading(true);
        axios.get('/api/user/profile')
            .then(res => setUser(res.data))
            .catch(err => console.error('Failed to fetch profile:', err))
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const username = formData.get('username');
        
        try {
            const res = await axios.patch('/api/user/profile', {
                username,
                profileImage: avatarUrl // avatarUrl is updated via "Change Photo" (though photo upload is still simulated, the URL is saved)
            });
            setUser(res.data);
            alert('Profile updated successfully!');
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl">
            <h1 className="mb-6 text-2xl font-bold">My Profile</h1>
            
            <div className="mb-8 flex items-center gap-6">
                <img 
                    src={avatarUrl} 
                    alt="Profile" 
                    className="h-24 w-24 rounded-full border-2 border-slate-700 object-cover"
                />
                <div>
                    <button className="rounded bg-slate-800 px-4 py-2 text-sm text-white hover:bg-slate-700">
                        Change Photo
                    </button>
                    <p className="mt-2 text-xs text-gray-500">Supported formats: JPG, PNG. Max 5MB.</p>
                </div>
            </div>

            <form onSubmit={handleSave} className="space-y-6 rounded-lg border border-slate-800 bg-slate-900/50 p-6">
                <div>
                    <label className="mb-2 block text-sm text-slate-400">Username</label>
                    <input 
                        type="text" 
                        name="username"
                        key={user?.username}
                        defaultValue={user?.username || 'Loading...'}
                        className="w-full rounded bg-slate-800 p-2 text-white border border-slate-700 outline-none"
                    />
                </div>
                <div>
                    <label className="mb-2 block text-sm text-slate-400">Email Address</label>
                    <input 
                        type="email" 
                        key={user?.email}
                        defaultValue={user?.email || 'Loading...'}
                        disabled
                        className="w-full rounded bg-slate-800/50 p-2 text-gray-500 border border-slate-700 cursor-not-allowed"
                    />
                </div>
                
                <div className="flex justify-end gap-4">
                    <button 
                        onClick={() => signOut({ callbackUrl: '/auth/login' })}
                        className="rounded bg-red-600 px-6 py-3 font-bold hover:bg-red-500"
                    >
                        Sign Out
                    </button>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="rounded bg-blue-600 px-6 py-3 font-bold hover:bg-blue-500"
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}
