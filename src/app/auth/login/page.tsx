'use client';

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    
    const formData = new FormData(event.currentTarget);
    const usernameOrEmail = formData.get('usernameOrEmail') as string;
    const password = formData.get('password') as string;

    const credentials: Record<string, string> = { password };

    // Determine if the input is an email or username
    if (usernameOrEmail.includes('@')) {
      credentials.email = usernameOrEmail;
    } else {
      credentials.username = usernameOrEmail;
    }
    
    try {
      const res = await signIn('credentials', {
        ...credentials,
        redirect: false,
      });
      
      if (res?.error) {
        setError(res.error);
      } else if (res?.ok) {
        // Fetch session to check role
        const session = await getSession();
        
        if (session?.user?.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
        
        router.refresh();
      }
    } catch (e: any) {
      setError(e.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="glass-panel w-full max-w-md p-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-400">Login to Merrick Investments PLC.</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="usernameOrEmail"
            placeholder="Email or Username"
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
            className="rounded-lg bg-blue-600 p-3 font-semibold hover:bg-blue-500 transition-colors disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="mt-4 text-center space-y-2">
          <p className="text-sm">
            <a href="/auth/forgot-password" title="Forgot password link" className="text-gray-400 hover:text-blue-400">Forgot password?</a>
          </p>
          <p className="text-sm text-gray-400">
              Don't have an account? <a href="/auth/register" className="text-blue-400 hover:underline">Register</a>
          </p>
        </div>
      </div>
    </div>
  );
}
