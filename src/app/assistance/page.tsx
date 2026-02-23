'use client';

import { useState } from 'react';
import { ChevronLeft, Send, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function AssistancePage() {
    const [mode, setMode] = useState<'assistant' | 'refund'>('assistant');
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
    const [formData, setFormData] = useState({
        email: '',
        number: '',
        trackId: '',
        message: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');

        try {
            const res = await fetch('http://localhost:5000/api/assistance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    Number: formData.number,
                    TrackId: formData.trackId,
                    Message: formData.message,
                    refund: mode === 'refund'
                })
            });

            if (res.ok) {
                setStatus('success');
                setFormData({ email: '', number: '', trackId: '', message: '' });
                setTimeout(() => setStatus('idle'), 5000);
            } else {
                alert('Something went wrong. Please try again.');
                setStatus('idle');
            }
        } catch (err) {
            console.error(err);
            alert('Failed to connect to server.');
            setStatus('idle');
        }
    };

    return (
        <main className="min-h-screen bg-white font-sans selection:bg-primary-100 selection:text-primary-900">
            {/* Nav */}
            <nav className="container mx-auto px-4 h-20 flex items-center justify-between border-b border-gray-50">
                <Link href="/" className="flex items-center gap-2 text-primary-900 font-black text-xl tracking-tighter group font-heading">
                    <ChevronLeft className="group-hover:-translate-x-1 transition-transform" />
                    PAP PLUS
                </Link>
            </nav>

            <div className="container mx-auto px-4 py-12 max-w-xl">
                <h1 className="text-2xl font-black text-gray-900 text-center mb-8 uppercase tracking-widest font-heading">
                    Contact Us
                </h1>

                {/* Mode Toggles */}
                <div className="flex justify-center gap-3 mb-10">
                    <button
                        onClick={() => setMode('assistant')}
                        className={`px-8 py-2.5 rounded-full text-xs font-black transition-all border ${mode === 'assistant'
                            ? 'bg-black text-white border-black shadow-lg'
                            : 'bg-white text-black border-black hover:bg-gray-50'
                            }`}
                    >
                        Assistant
                    </button>
                    <button
                        onClick={() => setMode('refund')}
                        className={`px-8 py-2.5 rounded-full text-xs font-black transition-all border ${mode === 'refund'
                            ? 'bg-black text-white border-black shadow-lg'
                            : 'bg-white text-black border-black hover:bg-gray-50'
                            }`}
                    >
                        Refund
                    </button>
                </div>

                {/* Success State */}
                {status === 'success' ? (
                    <div className="bg-green-50 text-green-700 p-12 rounded-[2.5rem] text-center border border-green-100 animate-in fade-in zoom-in duration-500">
                        <CheckCircle2 className="mx-auto mb-4" size={48} />
                        <h2 className="text-xl font-black mb-2">Message Sent!</h2>
                        <p className="font-medium">A member of our team will be in touch shortly.</p>
                        <button
                            onClick={() => setStatus('idle')}
                            className="mt-8 text-xs font-bold uppercase tracking-widest underline"
                        >
                            Send another message
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative group">
                            <input
                                type="email"
                                required
                                placeholder="Email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-8 py-5 rounded-full border-2 border-gray-900 bg-white placeholder:text-gray-400 font-bold focus:outline-none focus:ring-4 focus:ring-primary-100 transition-all"
                            />
                        </div>

                        <div className="relative group">
                            <input
                                type="tel"
                                required
                                placeholder="Number"
                                value={formData.number}
                                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                                className="w-full px-8 py-5 rounded-full border-2 border-gray-900 bg-white placeholder:text-gray-400 font-bold focus:outline-none focus:ring-4 focus:ring-primary-100 transition-all"
                            />
                        </div>

                        {mode === 'refund' && (
                            <div className="relative group animate-in slide-in-from-top-4 duration-300">
                                <input
                                    type="text"
                                    required
                                    placeholder="Track Id"
                                    value={formData.trackId}
                                    onChange={(e) => setFormData({ ...formData, trackId: e.target.value })}
                                    className="w-full px-8 py-5 rounded-full border-2 border-gray-900 bg-white placeholder:text-gray-400 font-bold focus:outline-none focus:ring-4 focus:ring-primary-100 transition-all"
                                />
                            </div>
                        )}

                        <div className="relative group">
                            <textarea
                                required
                                rows={6}
                                placeholder="Your Message"
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                className="w-full px-8 py-6 rounded-[2.5rem] border-2 border-gray-900 bg-white placeholder:text-gray-400 font-bold focus:outline-none focus:ring-4 focus:ring-primary-100 transition-all resize-none"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={status === 'submitting'}
                            className="w-full sm:w-auto px-16 py-5 rounded-full border-2 border-gray-900 bg-white hover:bg-black hover:text-white text-black font-black uppercase tracking-widest transition-all disabled:opacity-50"
                        >
                            {status === 'submitting' ? 'Sending...' : 'Submit'}
                        </button>
                    </form>
                )}

                {/* Overview Text */}
                <div className="mt-16 border-t border-gray-50 pt-10">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Overview</h3>
                    <p className="text-gray-500 leading-relaxed font-medium">
                        We're always here to listen! If there's something on your mind, feel free to send us a quick message.
                        If you have a problem with your PAP PLUS product, please don't hesitate to reach out and a member of our support staff will be in touch.
                    </p>
                </div>
            </div>
        </main>
    );
}
