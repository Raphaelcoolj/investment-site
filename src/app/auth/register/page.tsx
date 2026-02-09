'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    
    const formData = new FormData(event.currentTarget);
    const username = formData.get('username') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            setError(data.message || 'Registration failed');
            return;
        }
        
        router.push('/auth/login?registered=true');
    } catch (e: any) {
        setError(e.message || 'Registration failed');
    } finally {
        setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="glass-panel w-full max-w-md p-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-indigo-400">Join NovaVault</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            required
            className="glass-input rounded-lg p-3"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="glass-input rounded-lg p-3"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="glass-input rounded-lg p-3"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-indigo-600 p-3 font-semibold hover:bg-indigo-500 transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating Wallet...' : 'Register'}
          </button>
        </form>
         <p className="mt-4 text-center text-sm text-gray-400">
            Already have an account? <a href="/auth/login" className="text-indigo-400 hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
}
