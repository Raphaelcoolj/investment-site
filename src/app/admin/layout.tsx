'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="flex min-h-screen flex-col bg-slate-900 text-white">
            <header className="flex h-16 items-center justify-between border-b border-slate-800 px-6">
                <div className="flex items-center">
                    <Link href="/admin" className="mr-6 text-xl font-bold text-red-500">
                        NovaVault Admin
                    </Link>
                    <nav className="hidden gap-4 md:flex">
                        <Link href="/admin/users" className="hover:text-red-400">Users</Link>
                        <Link href="/admin/settings" className="hover:text-red-400">Settings</Link>
                    </nav>
                </div>
                
                <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="text-slate-400 hover:text-white md:hidden"
                >
                    <span className="text-2xl">{isMenuOpen ? '✕' : '☰'}</span>
                </button>
            </header>

            {/* Mobile Nav Dropdown */}
            {isMenuOpen && (
                <div className="border-b border-slate-800 bg-slate-900 md:hidden">
                    <nav className="flex flex-col p-4 space-y-2">
                        <Link 
                            href="/admin/users" 
                            onClick={() => setIsMenuOpen(false)}
                            className="rounded-lg px-4 py-2 hover:bg-slate-800"
                        >
                            Users
                        </Link>
                        <Link 
                            href="/admin/settings" 
                            onClick={() => setIsMenuOpen(false)}
                            className="rounded-lg px-4 py-2 hover:bg-slate-800"
                        >
                            Settings
                        </Link>
                    </nav>
                </div>
            )}

            <main className="flex-1 p-6">
                {children}
            </main>
        </div>
    );
}
