'use client';

import { Shield, Lock, FileText, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPolicy() {
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
                        <span>Privacy & Data</span>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <section className="bg-white pt-20 pb-32 border-b border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary-50 to-transparent pointer-events-none"></div>
                <div className="container mx-auto px-4 max-w-4xl relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-full text-xs font-bold uppercase tracking-widest mb-8">
                        <Shield size={14} /> Correct as of February 2026
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-8 font-heading tracking-tight leading-tight">
                        Our Commitment <br />
                        <span className="text-primary-600">To Your Privacy.</span>
                    </h1>
                    <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-2xl">
                        At PAP PLUS, your trust is our most valuable ingredient. We are committed to transparency in how we handle your information as you shop with us.
                    </p>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-20">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="bg-white rounded-[3rem] shadow-soft border border-gray-100 p-8 md:p-16">

                        <div className="prose prose-slate max-w-none">
                            <h2 className="text-3xl font-black text-gray-900 mb-6">Privacy Policy</h2>
                            <p className="text-gray-600 leading-relaxed mb-12">
                                This Privacy Policy describes how PAP PLUS (the “Site” or “we”) collects, uses, and discloses your Personal Information when you visit or make a purchase from the Site.
                            </p>

                            <hr className="border-gray-100 mb-12" />

                            <div className="space-y-16">
                                {/* Section: Collecting Personal Information */}
                                <div>
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600">
                                            <FileText size={24} />
                                        </div>
                                        <h3 className="text-2xl font-black text-gray-900">Collecting Personal Information</h3>
                                    </div>
                                    <p className="text-gray-600 leading-relaxed mb-6">
                                        When you visit the Site, we collect certain information about your device, your interaction with the Site, and information necessary to process your purchases. We refer to any information that can uniquely identify an individual as “Personal Information”. See the list below for more information about what Personal Information we collect and why.
                                    </p>

                                    <div className="space-y-8 bg-slate-50 p-8 rounded-3xl border border-gray-100">
                                        <div>
                                            <h4 className="font-black text-primary-900 uppercase tracking-widest text-xs mb-3">Device Information</h4>
                                            <p className="text-sm text-gray-600 leading-relaxed">
                                                <strong>Examples:</strong> Version of web browser, IP address, time zone, cookie information, search terms, and how you interact with the Site.<br />
                                                <strong>Purpose:</strong> To load the Site accurately for you, and to perform analytics on Site usage to optimize our Site.<br />
                                                <strong>Source:</strong> Collected automatically using cookies, log files, web beacons, tags, or pixels.
                                            </p>
                                        </div>
                                        <div>
                                            <h4 className="font-black text-primary-900 uppercase tracking-widest text-xs mb-3">Order Information</h4>
                                            <p className="text-sm text-gray-600 leading-relaxed">
                                                <strong>Examples:</strong> Name, billing address, shipping address, payment information, email address, and phone number.<br />
                                                <strong>Purpose:</strong> To provide products or services to you to fulfill our contract, to process your payment information, arrange for shipping, and provide you with invoices and confirmations.<br />
                                                <strong>Source:</strong> Collected directly from you.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Section: Minors */}
                                <div>
                                    <div className="flex items-center gap-4 mb-6 text-amber-600">
                                        <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center">
                                            <Lock size={24} />
                                        </div>
                                        <h3 className="text-2xl font-black">Minors</h3>
                                    </div>
                                    <p className="text-gray-600 leading-relaxed">
                                        The Site is not intended for individuals under the age of 18. We do not intentionally collect Personal Information from children. If you are the parent or guardian and believe your child has provided us with Personal Information, please contact us at the address below to request deletion.
                                    </p>
                                </div>

                                {/* Section: Sharing */}
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900 mb-6">Sharing Personal Information</h3>
                                    <p className="text-gray-600 leading-relaxed mb-6">
                                        We share your Personal Information with service providers to help us provide our services and fulfill our contracts with you, as described above. For example:
                                    </p>
                                    <ul className="list-disc pl-6 space-y-4 text-gray-600">
                                        <li>We use secure cloud infrastructure to power our online store.</li>
                                        <li>We may share your Personal Information to comply with applicable laws and regulations in South Africa, to respond to a subpoena, or other lawful requests for information.</li>
                                    </ul>
                                </div>

                                {/* Section: Lawful Basis */}
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900 mb-6">Your Rights</h3>
                                    <p className="text-gray-600 leading-relaxed mb-6">
                                        If you are a resident of South Africa, you have certain rights regarding your personal information, including the right to access, correct, or request deletion of your data.
                                    </p>
                                    <p className="text-gray-600 leading-relaxed">
                                        Your Personal Information will be initially processed in our secure servers and may be transferred outside of South Africa for storage and further processing.
                                    </p>
                                </div>

                                <hr className="border-gray-100" />

                                {/* Contact Section */}
                                <div className="text-center pt-8">
                                    <h3 className="text-2xl font-black text-gray-900 mb-4">Contact Us</h3>
                                    <p className="text-gray-500 mb-8">
                                        For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us by e-mail at:
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
