'use client';

import { RefreshCcw, ShieldCheck, Clock, ChevronLeft, Package, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function RefundPolicy() {
    return (
        <main className="min-h-screen bg-white font-sans selection:bg-black selection:text-white uppercase tracking-tight">
            {/* Header / Nav */}
            <div className="bg-black text-white border-b border-white/5 sticky top-0 z-50">
                <div className="container mx-auto px-10 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-white font-black text-xl tracking-tighter group font-heading">
                        <ChevronLeft className="group-hover:-translate-x-1 transition-transform" />
                        EcoEstras
                    </Link>
                    <div className="hidden md:flex items-center gap-6 text-xs font-black uppercase tracking-widest text-gray-400">
                        <span>Legal Center</span>
                        <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                        <span>Refund Policy</span>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <section className="bg-white pt-20 pb-32 border-b border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-gray-50 to-transparent pointer-events-none"></div>
                <div className="container mx-auto px-10 max-w-4xl relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full text-[10px] font-black uppercase tracking-widest mb-8">
                        <Clock size={14} /> Last Updated: March 2026
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-black mb-8 font-heading tracking-tighter leading-none uppercase">
                        Refund <br />
                        <span className="text-gray-400">Policy.</span>
                    </h1>
                    <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-2xl">
                        Our 10-day return policy is designed to ensure your complete satisfaction. Please read the details below to understand your rights and our process.
                    </p>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-20">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="bg-white rounded-[3rem] shadow-soft border border-gray-100 p-8 md:p-16">

                        <div className="prose prose-slate max-w-none">
                            <h2 className="text-3xl font-black text-black mb-6 uppercase tracking-tighter">Returns Overview</h2>
                            <p className="text-gray-600 leading-relaxed mb-12">
                                We have a 10-day return policy, which means you have 10 days after receiving your item to request a return.
                            </p>

                            <hr className="border-gray-100 mb-12" />

                            <div className="space-y-12">
                                {/* Eligibility */}
                                <div>
                                    <h3 className="text-xl font-black text-black mb-4 uppercase tracking-widest text-[11px] flex items-center gap-2">
                                        <ShieldCheck size={20} className="text-black" />
                                        Eligibility Criteria
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        To be eligible for a return, you must have your tracking ID and go to the assistance page to request your refund. Your item must be in the same condition that you received it, unworn or unused, with tags, and in its original packaging. You’ll also need the receipt or proof of purchase.
                                    </p>
                                </div>

                                {/* Starting a Return */}
                                <div>
                                    <h3 className="text-xl font-black text-black mb-4 uppercase tracking-widest text-[11px] flex items-center gap-2">
                                        <Package size={20} className="text-black" />
                                        Starting a Return
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        To start a return, you can contact us. If your return is accepted, we’ll send you a return address, as well as instructions on how and where to send your package. Items sent back to us without first requesting a return will not be accepted.
                                    </p>
                                </div>

                                {/* Damages and Issues */}
                                <div className="bg-gray-50 p-8 md:p-12 rounded-[2.5rem] border border-gray-100 shadow-sm">
                                    <h3 className="text-xl font-black text-black mb-4 uppercase tracking-widest text-[11px] flex items-center gap-2">
                                        <Trash2 size={20} className="text-black" />
                                        Damages and Issues
                                    </h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        Please inspect your order upon reception and contact us immediately if the item is defective, damaged or if you receive the wrong item, so that we can evaluate the issue and make it right.
                                    </p>
                                </div>

                                {/* Exceptions */}
                                <div>
                                    <h3 className="text-xl font-black text-black mb-4 uppercase tracking-widest text-[11px] flex items-center gap-2">
                                        <div className="w-2 h-2 bg-black rounded-full"></div>
                                        Exceptions / Non-Returnable Items
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        Certain types of items cannot be returned, like perishable goods (such as food, flowers, or plants), custom products (such as special orders or personalized items), and personal care goods (such as beauty products). We also do not accept returns for hazardous materials, flammable liquids, or gases. Please get in touch if you have questions or concerns about your specific item.
                                    </p>
                                </div>

                                {/* Exchanges & Refunds */}
                                <div>
                                    <h3 className="text-xl font-black text-black mb-4 uppercase tracking-widest text-[11px] flex items-center gap-2">
                                        <RefreshCcw size={20} className="text-black" />
                                        Exchanges & Refunds
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        We will notify you once we’ve received and inspected your return, and let you know if the refund was approved or not. If approved, you’ll be automatically refunded on your original payment method. Please remember it can take some time for your bank or credit card company to process and post the refund too.
                                    </p>
                                </div>

                                <hr className="border-gray-100" />

                                {/* Contact Section */}
                                <div className="text-center pt-8">
                                    <h3 className="text-2xl font-black text-gray-900 mb-4">Request a Refund</h3>
                                    <p className="text-gray-500 mb-8">
                                        Ready to start the process? Contact our support team directly:
                                    </p>
                                    <a
                                        href="mailto:support@ecoestras.co.za"
                                        className="text-2xl font-black text-black hover:text-gray-600 transition-colors uppercase tracking-tight"
                                    >
                                        support@ecoestras.co.za
                                    </a>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-black text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-2xl font-black mb-8 text-white uppercase tracking-tighter">EcoEstras</h2>
                    <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-8">
                        {[
                            { label: 'Terms Of Service', href: '/terms-of-service' },
                            { label: 'Privacy Policy', href: '/privacy-policy' },
                            { label: 'Refund Policy', href: '/refund-policy' },
                            { label: 'Assistance', href: '/assistance' }
                        ].map((link, i) => (
                            <Link
                                key={i}
                                href={link.href}
                                className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40">
                        &copy; 2026 EcoEstras South Africa. All Rights Reserved.
                    </p>
                </div>
            </footer>
        </main>
    );
}
