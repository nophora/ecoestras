'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, Lock, Truck, ShieldCheck, CreditCard } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
    const router = useRouter();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        suburb: '',
        postal_code: '',
    });

    useEffect(() => {
        const pending = localStorage.getItem('pending_order');
        if (pending) {
            setOrder(JSON.parse(pending));
        } else {
            router.push('/');
        }
        setLoading(false);
    }, [router]);

    const cartItem = order?.cart_bucket?.[0];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic Validation
        if (!formData.name || !formData.email || !formData.phone || !formData.address || !formData.suburb) {
            setValidationError('Please fill in all required shipping fields (including Suburb)');

            // Auto-scroll to error
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setValidationError(null);
        setIsSubmitting(true);

        const totalAmount = order?.cart_bucket?.reduce((sum: number, item: any) => {
            return sum + (item.pricing?.customer_totalprice || 0);
        }, 0);

        const finalOrder = {
            ...order,
            customer: formData,
            total_amount: totalAmount
        };

        try {
            const res = await fetch('http://localhost:5000/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalOrder)
            });

            if (res.ok) {
                const data = await res.json();

                // If backend returned PayFast data, redirect via form submission
                if (data.payfast) {
                    const form = document.createElement('form');
                    form.method = 'POST';
                    form.action = data.payfast.url;

                    Object.keys(data.payfast.data).forEach(key => {
                        const input = document.createElement('input');
                        input.type = 'hidden';
                        input.name = key;
                        input.value = data.payfast.data[key];
                        form.appendChild(input);
                    });

                    document.body.appendChild(form);
                    localStorage.removeItem('pending_order');
                    form.submit();
                } else {
                    // Fallback to manual success if no PayFast data (shouldn't happen)
                    localStorage.removeItem('pending_order');
                    setIsSuccess(true);
                }
            } else {
                setValidationError('Checkout failed. Please try again.');
            }
        } catch (err) {
            console.error('Checkout error:', err);
            setValidationError('Server connection error. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return null;
    if (!order && !isSuccess) return null;

    if (isSuccess) {
        return (
            <main className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
                <div className="text-center space-y-6 max-w-md animate-in fade-in zoom-in duration-500">
                    <div className="w-24 h-24 bg-green-50 text-green-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8">
                        <ShieldCheck size={48} />
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 font-heading tracking-tight">Order Placed!</h1>
                    <p className="text-xl text-gray-500 font-medium">Thank you for your purchase. We've received your order and are preparing it for shipment from South Africa.</p>
                    <div className="pt-8">
                        <Link href="/" className="bg-primary-600 hover:bg-primary-700 text-white font-black py-4 px-12 rounded-full shadow-lg transition-all inline-block uppercase tracking-widest text-sm">
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 font-sans selection:bg-primary-100 selection:text-primary-900">
            {/* Simple Header */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-50">
                <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-primary-900 font-black text-xl tracking-tighter group font-heading">
                        <ChevronLeft className="group-hover:-translate-x-1 transition-transform" />
                        PAP PLUS
                    </Link>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
                        <Lock size={14} className="text-green-500" />
                        Secure Checkout
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-7xl mx-auto">

                    {/* Left Column: Shipping Info */}
                    <div className="lg:col-span-7 space-y-8">
                        <section className="bg-white rounded-[2.5rem] shadow-soft border border-gray-100 p-8 md:p-12">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600">
                                    <Truck size={24} />
                                </div>
                                <h2 className="text-2xl font-black text-gray-900 font-heading tracking-tight">Shipping Details</h2>
                            </div>

                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-4">Full Name</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. John Doe"
                                            className="w-full px-8 py-4 rounded-full border-2 border-gray-50 bg-slate-50 focus:bg-white focus:border-primary-600 focus:outline-none transition-all font-bold text-gray-900"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-4">Email Address</label>
                                        <input
                                            type="email"
                                            placeholder="john@example.com"
                                            className="w-full px-8 py-4 rounded-full border-2 border-gray-50 bg-slate-50 focus:bg-white focus:border-primary-600 focus:outline-none transition-all font-bold text-gray-900"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-4">Phone Number (For Delivery Updates)</label>
                                    <input
                                        type="tel"
                                        placeholder="012 345 6789"
                                        className="w-full px-8 py-4 rounded-full border-2 border-gray-50 bg-slate-50 focus:bg-white focus:border-primary-600 focus:outline-none transition-all font-bold text-gray-900"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-4">Street Address</label>
                                    <input
                                        type="text"
                                        placeholder="123 Luxury Lane, Sandton"
                                        className="w-full px-8 py-4 rounded-full border-2 border-gray-50 bg-slate-50 focus:bg-white focus:border-primary-600 focus:outline-none transition-all font-bold text-gray-900"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-4">City</label>
                                        <input
                                            type="text"
                                            placeholder="Johannesburg"
                                            className="w-full px-8 py-4 rounded-full border-2 border-gray-50 bg-slate-50 focus:bg-white focus:border-primary-600 focus:outline-none transition-all font-bold text-gray-900"
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-4">Suburb</label>
                                        <input
                                            type="text"
                                            placeholder="Sandton"
                                            className="w-full px-8 py-4 rounded-full border-2 border-gray-50 bg-slate-50 focus:bg-white focus:border-primary-600 focus:outline-none transition-all font-bold text-gray-900"
                                            value={formData.suburb}
                                            onChange={(e) => setFormData({ ...formData, suburb: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-4">Postal Code</label>
                                        <input
                                            type="text"
                                            placeholder="2000"
                                            className="w-full px-8 py-4 rounded-full border-2 border-gray-50 bg-slate-50 focus:bg-white focus:border-primary-600 focus:outline-none transition-all font-bold text-gray-900"
                                            value={formData.postal_code}
                                            onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </form>
                        </section>

                        <section className="bg-white rounded-[2.5rem] shadow-soft border border-gray-100 p-8 md:p-12">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                                    <CreditCard size={24} />
                                </div>
                                <h2 className="text-2xl font-black text-gray-900 font-heading tracking-tight">Payment Method</h2>
                            </div>

                            <div className="p-6 rounded-3xl border-2 border-primary-600 bg-primary-50/50 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="bg-white p-1 rounded-xl shadow-sm flex items-center justify-center min-w-[120px] min-h-[48px]">
                                        <svg width="110" height="32" viewBox="0 0 110 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="PayFast">
                                            {/* payfast wordmark */}
                                            <text x="0" y="22" fill="#005CB9" style={{ font: 'bold 18px sans-serif', letterSpacing: '-0.5px' }}>payfast</text>
                                            {/* red chevron */}
                                            <path d="M98 10L106 16L98 22" stroke="#E41F35" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                            {/* by network tagline (optional but professional) */}
                                            <text x="35" y="30" fill="#005CB9" style={{ font: '6px sans-serif', opacity: 0.8 }}>by network</text>
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-black text-gray-900">Secure Online Payment</p>
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Instant EFT, Card, Masterpass</p>
                                    </div>
                                </div>
                                <div className="w-6 h-6 rounded-full border-4 border-primary-600 bg-white shadow-inner"></div>
                            </div>

                            <p className="mt-8 text-sm text-gray-500 font-medium leading-relaxed">
                                After clicking “Complete Order”, you will be redirected to PayFast to complete your purchase securely.
                                <span className="text-primary-600 font-black"> Free shipping applied to all South African orders.</span>
                            </p>
                        </section>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-32 space-y-8">
                            <section className="bg-white rounded-[2.5rem] shadow-card border border-gray-100 overflow-hidden">
                                <div className="p-8 border-b border-gray-50 bg-slate-50/50">
                                    <h2 className="text-xl font-black text-gray-900 font-heading tracking-tight">Order Summary</h2>
                                </div>

                                <div className="p-8 space-y-8">
                                    <div className="flex items-center gap-6">
                                        <div className="relative w-24 h-24 bg-slate-50 rounded-3xl overflow-hidden border border-gray-100 flex-shrink-0">
                                            <Image
                                                src={cartItem.product_icon}
                                                alt={cartItem.name}
                                                fill
                                                className="object-cover"
                                            />
                                            <div className="absolute top-1 right-1 bg-primary-600 text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-white">
                                                {cartItem.quantity}
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-black text-gray-900 text-lg leading-tight mb-2">{cartItem.name}</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {Array.isArray(cartItem.variant) ? (
                                                    cartItem.variant.map((attr: any, idx: number) => {
                                                        const key = Object.keys(attr)[0];
                                                        const value = attr[key];
                                                        const displayValue = Array.isArray(value) ? value.join(', ') : String(value);
                                                        return (
                                                            <span key={idx} className="bg-white px-3 py-1 rounded-full border border-gray-100 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                                                {key}: {displayValue}
                                                            </span>
                                                        );
                                                    })
                                                ) : (
                                                    // Fallback for old data or single object structure
                                                    Object.entries(cartItem.variant || {}).map(([key, value], idx) => (
                                                        <span key={idx} className="bg-white px-3 py-1 rounded-full border border-gray-100 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                                            {key}: {String(value)}
                                                        </span>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-8 border-t border-gray-50">
                                        <div className="flex justify-between text-gray-500 font-medium">
                                            <span>Subtotal</span>
                                            <span className="text-gray-900 font-bold">R{cartItem.pricing.customer_totalprice}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-500 font-medium">
                                            <span>Shipping (South Africa)</span>
                                            <span className="text-green-600 font-bold uppercase tracking-widest text-xs">Free</span>
                                        </div>
                                        <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
                                            <div>
                                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Total to pay</p>
                                                <p className="text-4xl font-black text-gray-900">R{cartItem.pricing.customer_totalprice}</p>
                                            </div>
                                            <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-1">
                                                Zero Extas
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8">
                                    {validationError && (
                                        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 animate-in fade-in slide-in-from-top-2 duration-300">
                                            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                                                <Lock size={14} />
                                            </div>
                                            <p className="text-xs font-bold uppercase tracking-widest">{validationError}</p>
                                        </div>
                                    )}

                                    <button
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                        className="w-full bg-primary-600 hover:bg-primary-700 text-white font-black py-6 rounded-full shadow-2xl hover:shadow-primary-600/30 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm disabled:opacity-50"
                                    >
                                        {isSubmitting ? 'Processing...' : 'Complete Order'}
                                        <ChevronLeft className="rotate-180" size={18} />
                                    </button>

                                    <div className="mt-8 grid grid-cols-2 gap-4">
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                            <ShieldCheck size={14} className="text-primary-600" />
                                            Enamel Safe
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                            <ShieldCheck size={14} className="text-primary-600" />
                                            Peroxide Free
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>

            {/* Simple Footer */}
            <footer className="py-12 border-t border-gray-100 text-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">
                    &copy; 2026 PAP PLUS South Africa. All Rights Reserved.
                </p>
            </footer>
        </main>
    );
}
