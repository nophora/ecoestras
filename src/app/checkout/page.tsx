'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, Lock, Truck, ShieldCheck, CreditCard, ChevronDown, ChevronUp } from 'lucide-react';
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

    // State to control our custom premium dropdown
    const [isProvinceOpen, setIsProvinceOpen] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        apartment: '',
        city: '',
        suburb: '',
        province: '',
        postal_code: '',
    });
    const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);

    // List of SA Provinces
    const provincesList = [
        "Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal",
        "Limpopo", "Mpumalanga", "Northern Cape", "North West", "Western Cape"
    ];

    useEffect(() => {
        const pending = localStorage.getItem('pending_order');
        if (pending) {
            setOrder(JSON.parse(pending));
        } else {
            router.push('/');
        }
        setLoading(false);
    }, [router]);

    // Auto-fill form data if the user returns from a failed PayFast payment
    useEffect(() => {
        const savedFormData = localStorage.getItem('ecoestras_checkout');
        if (savedFormData) {
            try {
                setFormData(JSON.parse(savedFormData));
            } catch (e) {
                console.error("Could not load saved checkout data", e);
            }
        }
    }, []);

    const cartItems = order?.cart_bucket || [];
    const totalItems = cartItems.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);
    const subtotal = cartItems.reduce((sum: number, item: any) => sum + (item.pricing?.customer_totalprice || 0), 0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic Validation
        if (!formData.name || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.suburb || !formData.province || !formData.postal_code) {
            setValidationError('Please fill in all required shipping fields');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        // Robust Email Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setValidationError('Please enter a valid email address (e.g. name@example.com)');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        // Phone Validation (Ensures it's at least 10 digits)
        if (formData.phone.replace(/\s/g, '').length < 10) {
            setValidationError('Please enter a valid 10-digit phone number');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setValidationError(null);
        setIsSubmitting(true);

        // Save the completed form data before sending to backend/PayFast
        localStorage.setItem('ecoestras_checkout', JSON.stringify(formData));

        const totalAmount = order?.cart_bucket?.reduce((sum: number, item: any) => {
            return sum + (item.pricing?.customer_totalprice || 0);
        }, 0);

        const finalOrder = {
            ...order,
            customer: formData,
            total_amount: totalAmount
        };

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL;

            const res = await fetch(`${API_URL}/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalOrder)
            });

            if (res.ok) {
                const data = await res.json();

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
                    form.submit();
                } else {
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
                        <Link href="/" className="bg-black hover:bg-gray-800 text-white font-black py-4 px-12 rounded-full shadow-lg transition-all inline-block uppercase tracking-widest text-sm">
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-white font-sans selection:bg-black selection:text-white uppercase tracking-tight">
            {/* Simple Header */}
            <div className="bg-black text-white border-b border-white/5 sticky top-0 z-50">
                <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-white font-black text-xl tracking-tighter group font-heading">
                        <ChevronLeft className="group-hover:-translate-x-1 transition-transform" />
                        EcoEstras
                    </Link>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
                        <Lock size={14} className="text-green-500" />
                        Secure Checkout
                    </div>
                </div>
            </div>

            {/* Changed px-4 py-12 to be responsive, reducing side gaps on mobile */}
            <div className="container mx-auto px-3 sm:px-4 py-8 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 max-w-7xl mx-auto">

                    {/* Left Column: Shipping Info */}
                    <div className="lg:col-span-7 space-y-6 md:space-y-8">
                        {/* Changed padding from p-8 to p-5 for mobile, and rounded-[2.5rem] to rounded-3xl for mobile */}
                        <section className="bg-white rounded-3xl md:rounded-[2.5rem] shadow-soft border border-gray-100 p-5 md:p-12">
                            <div className="flex items-center gap-4 mb-6 md:mb-8">
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-black flex items-center justify-center text-white">
                                    <Truck size={20} className="md:w-6 md:h-6" />
                                </div>
                                <h2 className="text-xl md:text-2xl font-black text-gray-900 font-heading tracking-tight">Shipping Details</h2>
                            </div>

                            <form className="space-y-5 md:space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-4">Full Name</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. John Doe"
                                            /* Changed px-8 py-4 to responsive px-5 py-3.5 md:px-8 md:py-4 */
                                            className="w-full px-5 py-3.5 md:px-8 md:py-4 rounded-full border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-black focus:outline-none transition-all font-bold text-gray-900"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-4">Email Address</label>
                                        <input
                                            type="email"
                                            placeholder="john@example.com"
                                            className="w-full px-5 py-3.5 md:px-8 md:py-4 rounded-full border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-black focus:outline-none transition-all font-bold text-gray-900"
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
                                        className="w-full px-5 py-3.5 md:px-8 md:py-4 rounded-full border-2 border-gray-50 bg-slate-50 focus:bg-white focus:border-black focus:outline-none transition-all font-bold text-gray-900"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-4">Street Address</label>
                                    <input
                                        type="text"
                                        placeholder="123 Luxury Lane, Sandton"
                                        className="w-full px-5 py-3.5 md:px-8 md:py-4 rounded-full border-2 border-gray-50 bg-slate-50 focus:bg-white focus:border-black focus:outline-none transition-all font-bold text-gray-900"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-4">Apartment, suite, etc. (optional)</label>
                                    <input
                                        type="text"
                                        placeholder="Apartment 4B, Complex Name"
                                        className="w-full px-5 py-3.5 md:px-8 md:py-4 rounded-full border-2 border-gray-50 bg-slate-50 focus:bg-white focus:border-black focus:outline-none transition-all font-bold text-gray-900"
                                        value={formData.apartment}
                                        onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-4">City</label>
                                        <input
                                            type="text"
                                            placeholder="Johannesburg"
                                            className="w-full px-5 py-3.5 md:px-8 md:py-4 rounded-full border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-black focus:outline-none transition-all font-bold text-gray-900"
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-4">Suburb</label>
                                        <input
                                            type="text"
                                            placeholder="Sandton"
                                            className="w-full px-5 py-3.5 md:px-8 md:py-4 rounded-full border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-black focus:outline-none transition-all font-bold text-gray-900"
                                            value={formData.suburb}
                                            onChange={(e) => setFormData({ ...formData, suburb: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">

                                    {/* --- PREMIUM CUSTOM DROPDOWN --- */}
                                    <div className="space-y-2 relative">
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-4">Province</label>
                                        <div className="relative">
                                            <button
                                                type="button"
                                                onClick={() => setIsProvinceOpen(!isProvinceOpen)}
                                                className={`w-full px-5 py-3.5 md:px-8 md:py-4 rounded-full border-2 flex justify-between items-center transition-all font-bold focus:outline-none ${isProvinceOpen
                                                    ? 'bg-white border-black text-gray-900'
                                                    : 'bg-gray-50 border-gray-50 text-gray-900 hover:bg-white hover:border-gray-200'
                                                    }`}
                                            >
                                                <span className={formData.province ? 'text-gray-900' : 'text-gray-400 font-normal truncate pr-2'}>
                                                    {formData.province || 'Select Province'}
                                                </span>
                                                <ChevronDown
                                                    size={20}
                                                    className={`flex-shrink-0 transition-transform duration-300 ${isProvinceOpen ? 'rotate-180 text-black' : 'text-gray-400'}`}
                                                />
                                            </button>

                                            {/* Dropdown Menu */}
                                            {isProvinceOpen && (
                                                <div className="absolute top-[110%] left-0 w-full bg-white border border-gray-100 rounded-3xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                                    <div className="max-h-60 overflow-y-auto py-2">
                                                        {provincesList.map((prov) => (
                                                            <div
                                                                key={prov}
                                                                onClick={() => {
                                                                    setFormData({ ...formData, province: prov });
                                                                    setIsProvinceOpen(false);
                                                                }}
                                                                className={`w-full text-left px-5 py-3 md:px-8 md:py-3 text-sm font-bold cursor-pointer transition-colors ${formData.province === prov
                                                                    ? 'bg-black text-white'
                                                                    : 'text-gray-500 hover:bg-gray-50 hover:text-black'
                                                                    }`}
                                                            >
                                                                {prov}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {/* ---------------------------------- */}

                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-4">Postal Code</label>
                                        <input
                                            type="text"
                                            placeholder="2000"
                                            className="w-full px-5 py-3.5 md:px-8 md:py-4 rounded-full border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-black focus:outline-none transition-all font-bold text-gray-900"
                                            value={formData.postal_code}
                                            onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </form>
                        </section>

                        <section className="bg-white rounded-3xl md:rounded-[2.5rem] shadow-soft border border-gray-100 p-5 md:p-12">
                            <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
                                <div className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                                    <CreditCard className="w-5 h-5 md:w-6 md:h-6" />
                                </div>
                                <h2 className="text-xl md:text-2xl font-black text-gray-900 font-heading tracking-tight">Payment Method</h2>
                            </div>

                            <div className="p-4 md:p-6 rounded-2xl md:rounded-3xl border-2 border-black bg-gray-50 flex items-start md:items-center justify-between gap-4">
                                <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4 flex-1">
                                    <div className="bg-white p-1 rounded-xl shadow-sm flex items-center justify-center w-[90px] md:w-[120px] h-[40px] md:h-[48px] flex-shrink-0">
                                        <svg className="w-full h-auto" viewBox="0 0 110 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="PayFast">
                                            <text x="0" y="22" fill="#005CB9" style={{ font: 'bold 18px sans-serif', letterSpacing: '-0.5px' }}>payfast</text>
                                            <path d="M98 10L106 16L98 22" stroke="#E41F35" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                            <text x="35" y="30" fill="#005CB9" style={{ font: '6px sans-serif', opacity: 0.8 }}>by network</text>
                                        </svg>
                                    </div>

                                    <div className="flex-1">
                                        <p className="font-black text-gray-900 text-[14px] md:text-base leading-tight md:leading-normal">Secure Online Payment</p>
                                        <p className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-wider md:tracking-widest mt-1">Instant EFT, Card, Masterpass</p>
                                    </div>
                                </div>

                                <div className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0 rounded-full border-[3px] md:border-4 border-black bg-white shadow-inner mt-2 md:mt-0 flex items-center justify-center">
                                    <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-black rounded-full"></div>
                                </div>
                            </div>

                            <p className="mt-6 md:mt-8 text-[12px] md:text-sm text-gray-500 font-medium leading-relaxed">
                                After clicking “Complete Order”, you will be redirected to PayFast to complete your purchase securely.
                                <span className="text-black font-black block mt-2 md:inline md:mt-0"> Free shipping applied to all South African orders.</span>
                            </p>
                        </section>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-24 md:top-32 space-y-8">
                            <section className="bg-white rounded-3xl md:rounded-[2.5rem] shadow-card border border-gray-100 overflow-hidden">
                                <div
                                    onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
                                    className="p-5 md:p-8 border-b border-gray-50 bg-slate-50/50 flex items-center justify-between cursor-pointer group"
                                >
                                    <div>
                                        <h2 className="text-xl font-black text-gray-900 font-heading tracking-tight">Order Summary</h2>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                            {totalItems} {totalItems === 1 ? 'Item' : 'Items'} • Click to {isSummaryExpanded ? 'hide' : 'show'}
                                        </p>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-black transition-colors">
                                        {isSummaryExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                    </div>
                                </div>

                                <div className="p-5 md:p-8 space-y-6 md:space-y-8">
                                    <div className={`space-y-6 overflow-hidden transition-all duration-500 ${isSummaryExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                        {cartItems.map((item: any, idx: number) => (
                                            <div key={idx} className="flex items-center gap-4 md:gap-6 pb-6 border-b border-gray-50 last:border-0 last:pb-0">
                                                <div className="relative w-16 h-16 md:w-20 md:h-20 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 flex-shrink-0">
                                                    <Image
                                                        src={item.product_icon}
                                                        alt={item.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                    <div className="absolute top-1 right-1 bg-black text-white text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full border border-white">
                                                        {item.quantity}
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-black text-gray-900 text-sm leading-tight mb-1 truncate">{item.name}</h3>
                                                    <div className="flex flex-wrap gap-1 mb-2">
                                                        {item.variant?.map((attr: any, vIdx: number) => {
                                                            const key = Object.keys(attr)[0];
                                                            return (
                                                                <span key={vIdx} className="text-[8px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded">
                                                                    {key}: {attr[key]}
                                                                </span>
                                                            );
                                                        })}
                                                    </div>
                                                    <p className="text-xs font-black text-black">R{item.pricing?.customer_totalprice.toFixed(2)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {!isSummaryExpanded && cartItems.length > 0 && (
                                        <div className="flex items-center gap-4 py-2">
                                            <div className="flex -space-x-4 overflow-hidden">
                                                {cartItems.slice(0, 3).map((item: any, idx: number) => (
                                                    <div key={idx} className="inline-block h-10 w-10 md:h-12 md:w-12 rounded-xl ring-4 ring-white bg-gray-50 border border-gray-100 relative overflow-hidden flex-shrink-0">
                                                        <Image src={item.product_icon} alt={item.name} fill className="object-cover" />
                                                    </div>
                                                ))}
                                                {cartItems.length > 3 && (
                                                    <div className="inline-block h-10 w-10 md:h-12 md:w-12 rounded-xl ring-4 ring-white bg-black flex items-center justify-center text-[10px] font-black text-white flex-shrink-0">
                                                        +{cartItems.length - 3}
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'} in cart
                                            </p>
                                        </div>
                                    )}

                                    <div className="space-y-4 pt-6 md:pt-8 border-t border-gray-50">
                                        <div className="flex justify-between text-gray-500 font-medium text-xs uppercase tracking-widest">
                                            <span>Subtotal</span>
                                            <span className="text-gray-900 font-bold">R{subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-500 font-medium text-[10px] md:text-xs uppercase tracking-widest">
                                            <span>Shipping (South Africa)</span>
                                            <span className="text-green-600 font-bold tracking-widest">Free</span>
                                        </div>
                                        <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total to pay</p>
                                                <p className="text-3xl md:text-4xl font-black text-gray-900">R{subtotal.toFixed(2)}</p>
                                            </div>
                                            <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-1">
                                                Zero Extas
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-5 md:p-8 pt-0 md:pt-0">
                                    {validationError && (
                                        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 animate-in fade-in slide-in-from-top-2 duration-300">
                                            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                                                <Lock size={14} />
                                            </div>
                                            <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest">{validationError}</p>
                                        </div>
                                    )}

                                    <button
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                        className="w-full bg-black hover:bg-gray-800 text-white font-black py-5 md:py-6 rounded-full shadow-2xl hover:shadow-black/30 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm disabled:opacity-50"
                                    >
                                        {isSubmitting ? 'Processing...' : 'Complete Order'}
                                        <ChevronLeft className="rotate-180" size={18} />
                                    </button>

                                    <div className="mt-6 md:mt-8 grid grid-cols-2 gap-4">
                                        <div className="flex items-center gap-2 text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                            <ShieldCheck size={14} className="text-black" />
                                            Secured Results
                                        </div>
                                        <div className="flex items-center gap-2 text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                            <ShieldCheck size={14} className="text-black" />
                                            Secured Formula
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>

            {/* Simple Footer */}
            <footer className="py-8 md:py-12 border-t border-gray-100 text-center">
                <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] md:tracking-[0.3em]">
                    &copy; 2026 EcoEstras South Africa. All Rights Reserved.
                </p>
            </footer>
        </main>
    );
}