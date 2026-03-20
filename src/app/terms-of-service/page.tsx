'use client';

import { Gavel, Scale, ShieldCheck, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function TermsOfService() {
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
                        <span>Terms & Conditions</span>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <section className="bg-white pt-20 pb-32 border-b border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-gray-50 to-transparent pointer-events-none"></div>
                <div className="container mx-auto px-10 max-w-4xl relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full text-[10px] font-black uppercase tracking-widest mb-8">
                        <Gavel size={14} /> Effective as of March 2026
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-black mb-8 font-heading tracking-tighter leading-none uppercase">
                        Terms of <br />
                        <span className="text-gray-400">Service.</span>
                    </h1>
                    <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-2xl">
                        Please read these terms carefully before using our website. By accessing any part of the site, you agree to be bound by these Terms of Service.
                    </p>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-20">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="bg-white rounded-[3rem] shadow-soft border border-gray-100 p-8 md:p-16">

                        <div className="prose prose-slate max-w-none">
                            <h2 className="text-3xl font-black text-black mb-6 uppercase tracking-tighter">Overview</h2>
                            <p className="text-gray-600 leading-relaxed mb-12">
                                This website is operated by EcoEstras. Throughout the site, the terms “we”, “us” and “our” refer to EcoEstras. EcoEstras offers this website, including all information, tools and services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies and notices stated here.
                            </p>

                            <hr className="border-gray-100 mb-12" />

                            <div className="space-y-12">
                                {/* Section 1 */}
                                <div>
                                    <h3 className="text-xl font-black text-black mb-4 uppercase tracking-widest text-[11px] flex items-center gap-2">
                                        <div className="w-2 h-2 bg-black rounded-full"></div>
                                        Section 1 - Online Store Terms
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        By agreeing to these Terms of Service, you represent that you are at least the age of majority in your province of residence. You may not use our products for any illegal or unauthorized purpose nor may you, in the use of the Service, violate any laws in your jurisdiction (including but not limited to copyright laws).
                                    </p>
                                </div>

                                {/* Section 2 */}
                                <div>
                                    <h3 className="text-xl font-black text-black mb-4 uppercase tracking-widest text-[11px] flex items-center gap-2">
                                        <div className="w-2 h-2 bg-black rounded-full"></div>
                                        Section 2 - General Conditions
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        We reserve the right to refuse service to anyone for any reason at any time. You understand that your content (not including credit card information), may be transferred unencrypted. Credit card information is always encrypted during transfer over networks.
                                    </p>
                                </div>

                                {/* Section 4 */}
                                <div>
                                    <h3 className="text-xl font-black text-black mb-4 uppercase tracking-widest text-[11px] flex items-center gap-2">
                                        <div className="w-2 h-2 bg-black rounded-full"></div>
                                        Section 4 - Modifications to the Service and Prices
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue the Service without notice at any time.
                                    </p>
                                </div>

                                {/* Section 5 */}
                                <div>
                                    <h3 className="text-xl font-black text-black mb-4 uppercase tracking-widest text-[11px] flex items-center gap-2">
                                        <div className="w-2 h-2 bg-black rounded-full"></div>
                                        Section 5 - Products or Services
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        Certain products or services may be available exclusively online through the website. These products or services may have limited quantities and are subject to return or exchange only according to our Return Policy.
                                    </p>
                                </div>

                                {/* Section 13 */}
                                <div className="bg-black p-8 md:p-12 rounded-[2.5rem] border border-black/5 shadow-2xl">
                                    <h3 className="text-xl font-black text-white mb-4 uppercase tracking-widest text-[11px] flex items-center gap-2">
                                        <ShieldCheck size={20} className="text-white" />
                                        Section 13 - Disclaimer of Warranties; Limitation of Liability
                                    </h3>
                                    <p className="text-sm text-white/70 leading-relaxed italic">
                                        We do not guarantee that your use of our service will be uninterrupted, timely, secure or error-free. In no case shall EcoEstras, our directors, officers, or employees be liable for any injury, loss, claim, or any direct, indirect, incidental, or consequential damages of any kind.
                                    </p>
                                </div>

                                {/* Section 18 */}
                                <div>
                                    <h3 className="text-xl font-black text-black mb-4 uppercase tracking-widest text-[11px] flex items-center gap-2">
                                        <Scale size={20} className="text-black" />
                                        Section 18 - Governing Law
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of <strong>South Africa</strong>.
                                    </p>
                                </div>

                                <hr className="border-gray-100" />

                                {/* Contact Section */}
                                <div className="text-center pt-8">
                                    <h3 className="text-2xl font-black text-gray-900 mb-4">Questions?</h3>
                                    <p className="text-gray-500 mb-8">
                                        If you have any questions about the Terms of Service, please reach out to our legal team:
                                    </p>
                                    <a
                                        href="mailto:support@ecoestras.co.za"
                                        className=" text-1xl md:text-2xl font-black text-black hover:text-gray-600 transition-colors uppercase tracking-tight"
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
