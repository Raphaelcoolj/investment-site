'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
    { name: 'Overview', href: '/dashboard', icon: 'Home' },
    { name: 'Deposit', href: '/dashboard/deposit', icon: 'Wallet' },
    { name: 'Transactions', href: '/dashboard/transactions', icon: 'History' },
    { name: 'Profile', href: '/dashboard/profile', icon: 'User' },
];

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar Aside */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 flex-col border-r border-gray-800 bg-[#0f172a] transition-transform duration-300 md:relative md:flex md:translate-x-0 ${
                isOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
                <div className="flex items-center justify-between p-6">
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-600">
                        NovaVault
                    </h1>
                    <button onClick={onClose} className="text-gray-400 hover:text-white md:hidden">
                        <span className="text-2xl">✕</span>
                    </button>
                </div>
                <nav className="flex-1 space-y-2 px-4 py-4">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => onClose()}
                                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                                    isActive
                                        ? 'bg-blue-600/10 text-blue-400'
                                        : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                                }`}
                            >
                                <span className="h-5 w-5 rounded bg-current/20" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-4">
                    <button className="w-full rounded-lg border border-gray-800 bg-gray-900/50 px-4 py-2 text-sm text-gray-400 hover:bg-gray-800 transition-colors">
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
}
