'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ShieldCheck, Truck, ArrowRight, Package, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

function SuccessContent() {
    const searchParams = useSearchParams();
    const [trackId, setTrackId] = useState<string | null>(null);

    useEffect(() => {
        const id = searchParams.get('track_id');
        if (id) {
            setTrackId(id);
        }
    }, [searchParams]);

    return (
        <main className="min-h-screen bg-white font-sans selection:bg-black selection:text-white uppercase tracking-tight">
            {/* Nav */}
            <nav className="container mx-auto px-4 h-20 flex items-center justify-between border-b border-gray-50">
                <Link href="/" className="flex items-center gap-2 text-black font-black text-xl tracking-tighter group font-heading">
                    EcoEstras
                </Link>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-green-600 bg-green-50 px-4 py-2 rounded-full">
                    <ShieldCheck size={14} />
                    Payment Verified
                </div>
            </nav>

            <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl text-center">
                <div className="mb-12 relative inline-block">
                    <div className="w-32 h-32 bg-gray-50 rounded-[3rem] flex items-center justify-center text-black animate-in zoom-in duration-700">
                        <CheckCircle2 size={64} strokeWidth={1.5} />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-2xl shadow-xl border border-gray-50 animate-bounce duration-[2000ms]">
                        <Package className="text-black" size={24} />
                    </div>
                </div>

                <h1 className="text-4xl md:text-6xl font-black text-gray-900 font-heading tracking-tight mb-6 mt-4">
                    Thank You for Your Order!
                </h1>

                <p className="text-xl text-gray-500 font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
                    We've received your payment and our team in South Africa is already preparing your premium whitening kit for shipment.
                </p>

                {/* Order Meta Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                    <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-gray-100 text-left">
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Tracking Status</p>
                        <h3 className="text-xl font-black text-gray-900 mb-4">Awaiting Fulfillment</h3>
                        <div className="flex items-center gap-2 text-black font-bold text-sm">
                            <Truck size={18} />
                            <span>Ships within 24-48 hours</span>
                        </div>
                    </div>

                    <div className="bg-black p-8 rounded-[2.5rem] shadow-xl shadow-black/20 text-left text-white">
                        <p className="text-xs font-black text-white/60 uppercase tracking-widest mb-2">Your Tracking ID</p>
                        <h3 className="text-3xl font-black mb-4 text-white">{trackId || 'Processing...'}</h3>
                        <p className="text-sm font-medium text-white/80">Keep this ID for your records. We'll email you once your package is on the way.</p>
                    </div>
                </div>

                {/* Next Steps */}
                <div className="space-y-4">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-3 bg-gray-900 hover:bg-black text-white px-12 py-5 rounded-full font-black uppercase tracking-widest text-sm transition-all group"
                    >
                        Back to Home
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <div className="block pt-4">
                        <Link href="/assistance" className="text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-black transition-colors">
                            Need Help? Contact Support
                        </Link>
                    </div>
                </div>
            </div>

            {/* Trust Footer */}
            <div className="bg-slate-50 border-t border-gray-100 py-16">
                <div className="container mx-auto px-4 text-center">
                    <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        <div className="flex items-center gap-2 font-black text-sm tracking-tighter uppercase grayscale">
                            <ShieldCheck size={20} />
                            Secured Results
                        </div>
                        <div className="flex items-center gap-2 font-black text-sm tracking-tighter uppercase grayscale">
                            <ShieldCheck size={20} />
                            Secured Formula
                        </div>
                        <div className="flex items-center gap-2 font-black text-sm tracking-tighter uppercase grayscale">
                            <ShieldCheck size={20} />
                            Secured Quality
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-black uppercase tracking-widest text-gray-400">Loading Order Details...</div>}>
            <SuccessContent />
        </Suspense>
    );
}
