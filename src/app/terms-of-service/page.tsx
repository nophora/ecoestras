'use client';

import { Gavel, Scale, ShieldCheck, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function TermsOfService() {
    return (
        <main className="min-h-screen bg-slate-50 font-sans selection:bg-primary-100 selection:text-primary-900">
            {/* Header / Nav */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-50">
                <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-primary-900 font-black text-xl tracking-tighter group font-heading">
                        <ChevronLeft className="group-hover:-translate-x-1 transition-transform" />
                        PAP PLUS
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
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary-50 to-transparent pointer-events-none"></div>
                <div className="container mx-auto px-4 max-w-4xl relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-full text-xs font-bold uppercase tracking-widest mb-8">
                        <Gavel size={14} /> Effective as of February 2026
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-8 font-heading tracking-tight leading-tight">
                        Terms of <br />
                        <span className="text-primary-600">Service.</span>
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
                            <h2 className="text-3xl font-black text-gray-900 mb-6">Overview</h2>
                            <p className="text-gray-600 leading-relaxed mb-12">
                                This website is operated by PAP PLUS. Throughout the site, the terms “we”, “us” and “our” refer to PAP PLUS. PAP PLUS offers this website, including all information, tools and services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies and notices stated here.
                            </p>

                            <hr className="border-gray-100 mb-12" />

                            <div className="space-y-12">
                                {/* Section 1 */}
                                <div>
                                    <h3 className="text-xl font-black text-gray-900 mb-4 uppercase tracking-wider text-sm flex items-center gap-2">
                                        <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                                        Section 1 - Online Store Terms
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        By agreeing to these Terms of Service, you represent that you are at least the age of majority in your province of residence. You may not use our products for any illegal or unauthorized purpose nor may you, in the use of the Service, violate any laws in your jurisdiction (including but not limited to copyright laws).
                                    </p>
                                </div>

                                {/* Section 2 */}
                                <div>
                                    <h3 className="text-xl font-black text-gray-900 mb-4 uppercase tracking-wider text-sm flex items-center gap-2">
                                        <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                                        Section 2 - General Conditions
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        We reserve the right to refuse service to anyone for any reason at any time. You understand that your content (not including credit card information), may be transferred unencrypted. Credit card information is always encrypted during transfer over networks.
                                    </p>
                                </div>

                                {/* Section 4 */}
                                <div>
                                    <h3 className="text-xl font-black text-gray-900 mb-4 uppercase tracking-wider text-sm flex items-center gap-2">
                                        <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                                        Section 4 - Modifications to the Service and Prices
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue the Service without notice at any time.
                                    </p>
                                </div>

                                {/* Section 5 */}
                                <div>
                                    <h3 className="text-xl font-black text-gray-900 mb-4 uppercase tracking-wider text-sm flex items-center gap-2">
                                        <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                                        Section 5 - Products or Services
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        Certain products or services may be available exclusively online through the website. These products or services may have limited quantities and are subject to return or exchange only according to our Return Policy.
                                    </p>
                                </div>

                                {/* Section 13 */}
                                <div className="bg-primary-50 p-8 rounded-3xl border border-primary-100">
                                    <h3 className="text-xl font-black text-primary-900 mb-4 uppercase tracking-wider text-sm flex items-center gap-2">
                                        <ShieldCheck size={20} className="text-primary-600" />
                                        Section 13 - Disclaimer of Warranties; Limitation of Liability
                                    </h3>
                                    <p className="text-sm text-primary-900/70 leading-relaxed">
                                        We do not guarantee that your use of our service will be uninterrupted, timely, secure or error-free. In no case shall PAP PLUS, our directors, officers, or employees be liable for any injury, loss, claim, or any direct, indirect, incidental, or consequential damages of any kind.
                                    </p>
                                </div>

                                {/* Section 18 */}
                                <div>
                                    <h3 className="text-xl font-black text-gray-900 mb-4 uppercase tracking-wider text-sm flex items-center gap-2">
                                        <Scale size={20} className="text-primary-600" />
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
                                        href="mailto:support@papplus.co.za"
                                        className="text-2xl font-black text-primary-600 hover:text-primary-700 transition-colors"
                                    >
                                        support@papplus.co.za
                                    </a>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-primary-900 text-white/50 py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-2xl font-black mb-8 text-white">PAP PLUS</h2>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40">
                        &copy; 2026 PAP PLUS South Africa. All Rights Reserved.
                    </p>
                </div>
            </footer>
        </main>
    );
}
