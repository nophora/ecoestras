'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/api';
import { Lock, Mail, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login({ email, password });
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Invalid credentials. Access denied.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden font-heading">
            {/* Animated Background Gradients */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-500/10 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-500/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />

            <div className="w-full max-w-md relative z-10">
                {/* Logo & Header */}
                <div className="text-center mb-10 group cursor-default">
                    <div className="inline-block relative mb-6">
                        <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <img
                            src="https://res.cloudinary.com/platformtour/image/upload/v1772006469/Screenshot_2026-02-25_100005_b5zf6w.jpg"
                            alt="Admin"
                            className="w-24 h-24 rounded-3xl object-cover border-2 border-white/10 shadow-2xl relative transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute -bottom-2 -right-2 bg-blue-500 p-2 rounded-xl shadow-lg border border-white/20">
                            <ShieldCheck className="text-white" size={16} />
                        </div>
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tighter mb-2">
                        DASHBOARD <span className="text-blue-500">ACCESS</span>
                    </h1>
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em]">Authorized Personnel Only</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative group/card overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

                        <div className="space-y-6 relative">
                            {/* Email Field */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Email Address</label>
                                <div className="relative group">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-blue-500">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-black/50 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white text-sm font-bold placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all"
                                        placeholder="Admin only"
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Security Key</label>
                                <div className="relative group">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-blue-500">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-black/50 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white text-sm font-bold placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all font-mono"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-white text-black font-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-white/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 shadow-xl overflow-hidden relative group/btn"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    {isLoading ? (
                                        <Loader2 className="animate-spin" size={20} />
                                    ) : (
                                        <>
                                            AUTHENTICATE <ArrowRight size={18} className="transition-transform group-hover/btn:translate-x-1" />
                                        </>
                                    )}
                                </span>
                                <div className="absolute inset-0 bg-blue-500 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
                            </button>
                        </div>
                    </div>
                </form>

                {/* Footer Info */}
                <div className="mt-8 flex justify-center items-center gap-6">
                    <div className="flex items-center gap-2 text-gray-600 group hover:text-gray-400 transition-colors">
                        <div className="w-1 h-1 rounded-full bg-gray-600" />
                        <span className="text-[8px] font-bold uppercase tracking-[0.2em]">Secure Protocol v4.0</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 group hover:text-gray-400 transition-colors">
                        <div className="w-1 h-1 rounded-full bg-gray-600" />
                        <span className="text-[8px] font-bold uppercase tracking-[0.2em]">End-to-End Encryption</span>
                    </div>
                </div>
            </div>

            {/* Aesthetic Grain Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
        </div>
    );
}
