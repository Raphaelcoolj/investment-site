'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (!token) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center p-4">
                <div className="glass-panel w-full max-w-md p-8 text-center">
                    <h2 className="text-2xl font-bold mb-4 text-red-500">Invalid Link</h2>
                    <p className="text-gray-400 mb-6">The password reset link is invalid or has expired.</p>
                    <Link href="/auth/forgot-password" title="Request new link" className="text-blue-400 hover:underline">
                        Request a new link
                    </Link>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        setMessage('');
        setError('');

        try {
            const res = await axios.post('/api/auth/reset-password', { token, password });
            setMessage(res.data.message);
            setTimeout(() => router.push('/auth/login'), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
            <div className="glass-panel w-full max-w-md p-8">
                <h2 className="text-3xl font-bold mb-6 text-center text-blue-400">Reset Password</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="New Password"
                        required
                        className="glass-input rounded-lg p-3"
                    />
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm New Password"
                        required
                        className="glass-input rounded-lg p-3"
                    />
                    {message && <p className="text-green-500 text-sm">{message}. Redirecting to login...</p>}
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded-lg bg-blue-600 p-3 font-semibold hover:bg-blue-500 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-blue-400 animate-pulse text-xl">Loading...</div>
            </div>
        }>
            <ResetPasswordForm />
        </Suspense>
    );
}
