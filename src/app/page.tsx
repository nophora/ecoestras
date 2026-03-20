'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; //,
import { getHomepage, getPublicProducts, trackCheckout } from '../lib/api';
import { Menu, Search, ShoppingBag, ArrowRight, Heart, Star, X, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export default function Home() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [homeData, setHomeData] = useState<any>(null);
    const [mockProducts, setMockProducts] = useState<any>(null);

    const [sessionId, setSessionId] = useState('');
    const [cartCount, setCartCount] = useState(0);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [cartItems, setCartItems] = useState<any[]>([]);

    const [isMobile, setIsMobile] = useState(false);


    const [testimonials] = useState([
        {
            name: 'Charlie M.',
            location: 'Johannesburg',
            content: 'What a high-quality item. Purchased my U1 Gloves and waited about a week or two to receive. Definitely worth the wait. What a high-quality Gloves.',
            stars: 5
        },
        {
            name: 'Jason K.',
            location: 'Cape Town',
            content: 'Excellent trousers, the fit is perfect and they actually feel like trainers and look formal. The best combination!',
            stars: 5
        },
        {
            name: 'Lisa Y.',
            location: 'Pretoria',
            content: 'I am so impressed with this product. I will definitely be getting some more. I was quite apprehensive in the beginning cos in the past I’ve spent...',
            stars: 5
        }
    ]);

    useEffect(() => {
        let sid = localStorage.getItem('session_id');
        if (!sid) {
            sid = uuidv4();
            localStorage.setItem('session_id', sid);
        }
        setSessionId(sid);

        const fetchData = async () => {
            try {
                // Use the product ID that was used previously
                const [homepageInfo, activeProducts] = await Promise.all([
                    getHomepage(), getPublicProducts(16)
                ]);
                setHomeData(homepageInfo);
                setMockProducts(activeProducts);
                // Initialize cart count from localStorage
                const existingCart = localStorage.getItem('Cart_order');
                if (existingCart) {
                    try {
                        const items = JSON.parse(existingCart);
                        setCartCount(items.length);
                        setCartItems(items);
                    } catch (e) {
                        console.error('Error parsing cart:', e);
                    }
                }
            } catch (err) {
                console.error('Error fetching homepage data:', err);
                // Fallback to defaults or seed data if empty
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // Function to check the screen width
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 750);
        };

        // Run it once immediately on mount to get the initial size
        handleResize();

        // Listen for window resizes
        window.addEventListener('resize', handleResize);

        // Cleanup the listener when the component unmounts
        return () => window.removeEventListener('resize', handleResize);


    }, []);

    const removeFromCart = (index: number) => {
        try {
            const getCartStr = localStorage.getItem('Cart_order');
            if (getCartStr) {
                let cartArray = JSON.parse(getCartStr);
                cartArray = cartArray.filter((_: any, i: number) => i !== index);
                localStorage.setItem('Cart_order', JSON.stringify(cartArray));
                setCartCount(cartArray.length);
                setCartItems(cartArray);
            }
        } catch (err) {
            console.error('Error removing item:', err);
        }
    };

    const subtotal = cartItems.reduce((acc, item) => acc + item.pricing.customer_totalprice, 0);

    const carterToCheckoutButton = async () => {
        let local_product_id = localStorage.getItem('local_product_id');
        if (!local_product_id) return;

        let getCartStr = localStorage.getItem('Cart_order');

        if (!getCartStr) {
            console.log('Carter is empty:');
        } else {
            try {
                const cartBucket = JSON.parse(getCartStr);

                const sendToCheckout = {
                    store_id: 'ecoestras',
                    customer: {
                        name: '',
                        email: '',
                        phone: '',
                        address: '',
                        city: '',
                        postal_code: '',
                    },
                    cart_bucket: cartBucket,
                    status: {
                        payment: 'PENDING',
                        fulfillment: 'UNFULFILLED'
                    },
                    payfast_pf_payment_id: '',
                    createdAt: Date.now()
                };

                localStorage.removeItem('pending_order');
                localStorage.setItem('pending_order', JSON.stringify(sendToCheckout));

                console.log('[home] Sending trackCheckout...');
                await trackCheckout(local_product_id, sessionId);

                router.push('/checkout');
            } catch (err) {
                console.error('[home] Checkout failed:', err);
            }
        }
    };

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white">
            <div className="relative flex flex-col items-center">
                <h1 className="text-3xl md:text-5xl font-black tracking-[0.5em] text-black animate-pulse uppercase">
                    ECOESTRAS
                </h1>
                <div className="mt-4 w-24 h-[1px] bg-black/10 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black animate-shimmer" />
                </div>
            </div>
        </div>
    );

    // Fallback data if backend is empty or doesn't have homeData yet
    const displayHome = homeData?.hero ? homeData : {
        hero: {
            banner: 'https://res.cloudinary.com/platformtour/image/upload/v1717494719/Screenshot_2024-06-04_103020_z7uqji.jpg',
            title1: 'FLASH DEALS',
            title2: 'Build Shoping Memories',
            title3: 'Soak up the sun for less Get low prices on what you love this summer, To good to miss!',
            product_id: 'agzo-fukqib5peeq'
        }
    };

    return (
        <main className="min-h-screen bg-white font-sans selection:bg-black selection:text-white overflow-x-hidden">
            {/* Announcement Bar */}
            <div className="scrollwrap border-b border-white/10">
                <div className="announcement-slide">
                    <h1 className="announcement">FREE GROUND SHIPPING - SA ONLY</h1>
                    <h1 className="announcement">LIMITED-TIME OFFER: 20% OFF</h1>
                    <h1 className="announcement">FREE SHIPPING</h1>
                </div>
                <div className="announcement-slide">
                    <h1 className="announcement">FREE GROUND SHIPPING - SA ONLY</h1>
                    <h1 className="announcement">LIMITED-TIME OFFER: 20% OFF</h1>
                    <h1 className="announcement">FREE SHIPPING</h1>
                </div>
                <div className="announcement-slide">
                    <h1 className="announcement">FREE GROUND SHIPPING - SA ONLY</h1>
                    <h1 className="announcement">LIMITED-TIME OFFER: 20% OFF</h1>
                    <h1 className="announcement">FREE SHIPPING</h1>
                </div>
            </div>

            {/* Header - Fixed below Announcement Bar */}
            <header className="bg-black/90 backdrop-blur-md text-white py-4 px-10 flex items-center justify-between fixed top-[30px] left-0 w-full z-[99] border-b border-white/5">
                <div className="flex items-center gap-6">
                    <button className="hover:scale-110 transition-transform active:scale-95">
                        <Menu size={20} strokeWidth={2} />
                    </button>
                    <button className="hover:scale-110 transition-transform active:scale-95">
                        <Search size={20} strokeWidth={2} />
                    </button>
                </div>

                <div className="absolute left-1/2 -translate-x-1/2 text-center">
                    <Link href="/">
                        <img
                            src="https://res.cloudinary.com/platformtour/image/upload/v1718636228/Picsart_24-06-01_19-54-15-468-removebg-preview_1_e6lydr.png"
                            alt="ECOESTRAS"
                            className="h-7 md:h-10 w-auto invert brightness-0"
                        />
                    </Link>
                </div>

                <div className="flex items-center gap-6">
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="relative hover:scale-110 transition-transform active:scale-95 mr-2"
                    >
                        <ShoppingBag size={20} strokeWidth={2} />
                        <span className="absolute -top-1 -right-1 bg-white text-black text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-black/10 shadow-sm">
                            {cartCount}
                        </span>
                    </button>
                </div>
            </header>

            {/* Hero Section - Padding top accounts for fixed bars (30px + approx 100px = 150px) */}
            <section className="relative h-[110vh] w-full overflow-hidden flex items-end pt-[110px]">
                <img
                    src={displayHome.hero.banner}
                    alt="Hero Banner"
                    className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Visual Overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                <div className="relative z-10 w-full max-w-7xl mx-auto px-10 pb-24 space-y-4">
                    <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000">
                        <h4 className="text-white text-sm font-black uppercase tracking-[0.3em] drop-shadow-lg">
                            {displayHome.hero.title1}
                        </h4>
                        <h1 className="text-white text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-6 drop-shadow-2xl">
                            {displayHome.hero.title2.split(' ').map((word: string, i: number) => (
                                <span key={i} className="block">{word}</span>
                            ))}
                        </h1>
                        <p className="text-white/90 text-sm md:text-base font-bold max-w-md leading-relaxed drop-shadow-lg mb-10">
                            {displayHome.hero.title3}
                        </p>

                        <Link
                            href={`/product/${displayHome.hero.product_id}`}
                            className="inline-flex items-center gap-3 px-10 py-4 bg-white text-black text-[11px] font-black uppercase tracking-[0.2em] rounded-full shadow-2xl hover:scale-110 hover:bg-gray-100 transition-all active:scale-95 group"
                        >
                            Shop Now
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" strokeWidth={3} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Budget Friendly Shopping Section */}
            <div className="bg-black text-white px-10 pt-8 pb-12 font-black uppercase tracking-[0.2em] text-[10px] relative z-20">
                Budget Friendly Shopping
            </div>

            <section className={`bg-white px-2 md:px-10 pb-4 ${isMobile ? 'rounded-t-[11px]' : 'rounded-t-[3rem]'} relative z-30 -mt-8`}>
                <div className="max-w-7xl mx-auto pt-10">
                    <div className="flex items-center justify-between mb-8 px-4">
                        <div>
                            <h2 className="text-sm font-black italic uppercase tracking-widest text-gray-900 flex items-center gap-2">
                                SUPER <span className="text-gray-400 not-italic">OFFER</span>
                            </h2>
                        </div>
                        <button className="p-2 rounded-full hover:bg-gray-100 transition-all text-gray-300">
                            <ArrowRight size={20} />
                        </button>
                    </div>

                    <div className="flex overflow-x-auto gap-4 px-4 no-scrollbar pb-8 scroll-smooth">
                        {mockProducts.slice(0, 8).map((p: any) => (
                            <div key={p._id} className="min-w-[180px] md:min-w-[220px] group cursor-pointer">
                                <Link href={`/product/${p.product_id}`}>
                                    <div className="aspect-square rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden relative mb-4">
                                        <img
                                            src={p.product_images[0]}
                                            alt={p.product_name}
                                            className="w-full h-[180px] md:h-[220px] object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors shadow-sm">
                                            <Heart size={14} />
                                        </button>
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-[11px] font-black uppercase text-gray-900 truncate">
                                            {p.product_name}
                                        </h3>
                                        <p className="text-[9px] font-bold text-gray-400 line-clamp-2 leading-tight h-6">
                                            {p.description_specifications[0].title}
                                        </p>
                                        <div className="flex items-center gap-2 pt-2">
                                            <p className="text-sm font-black text-gray-900 italic">R{p.pricing.selling_price_zar}</p>

                                            <div className={`px-2 py-0.5 rounded-full border border-gray-200 text-[8px] font-black text-gray-500 ${p.pricing.original_price_zar > p.pricing.selling_price_zar ? '' : 'invisible'}`}>
                                                {p.pricing.original_price_zar > p.pricing.selling_price_zar ? `-${Math.round(((p.pricing.original_price_zar - p.pricing.selling_price_zar) / p.pricing.original_price_zar) * 100)}%`
                                                    : '0%'}</div>

                                        </div>
                                        <p className="text-[8px] font-bold text-gray-300 uppercase italic">Estimated</p>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Middle Section & Highlight */}
            <section className="bg-white pt-8 pb-12 px-10">
                <div className="max-w-7xl mx-auto space-y-16">
                    {/* Section Heading */}
                    <div className="text-center mb-6">
                        <h2 className="text-3xl md:text-4xl font-bold font-script text-black leading-none uppercase">
                            NEW <span className="text-gray-400">&</span> Trending
                        </h2>
                    </div>

                    {/* Middle Highlight Section */}
                    {displayHome.middlesection && (
                        <div className="group cursor-pointer">
                            <Link href={`/product/${displayHome.middlesection.product_id}`} className="flex flex-col md:flex-row items-center gap-12">
                                <div className={`w-full ${isMobile ? 'md:w-[100%]' : 'md:w-1/2'} overflow-hidden ${isMobile ? 'rounded-[20px]' : 'rounded-[3rem]'} aspect-[4/3] bg-gray-50 flex items-center justify-center`}>
                                    <img
                                        src={displayHome.middlesection.icon}
                                        alt={displayHome.middlesection.title1}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                </div>
                                <div className="w-full md:w-1/2 space-y-6">
                                    <h2 className="text-3xl md:text-6xl font-black uppercase tracking-tighter leading-tight text-black">
                                        {displayHome.middlesection.title1}
                                    </h2>
                                    <p className="text-2xl font-black text-gray-900 italic">
                                        {displayHome.middlesection.title2}
                                    </p>
                                    <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border-b-2 border-black pb-1 group-hover:gap-4 transition-all">
                                        Explore Collection <ArrowRight size={12} strokeWidth={3} />
                                    </div>
                                </div>
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* Weekly Deals Section - Matching Budget Friendly Shopping Style */}
            <div className="bg-black text-white px-10 pt-8 pb-12 font-black uppercase tracking-[0.2em] text-[10px] relative z-20">
                Weekly Deals
            </div>

            <section className={`bg-white px-2 md:px-10 pb-4 ${isMobile ? 'rounded-t-[11px]' : 'rounded-t-[3rem]'} relative z-30 -mt-8`}>
                <div className="max-w-7xl mx-auto pt-10 space-y-24">
                    {/* Duplicated Carousel */}
                    <div>
                        <div className="flex items-center justify-between mb-8 px-4">
                            <div>
                                <h2 className="text-sm font-black italic uppercase tracking-widest text-gray-900 flex items-center gap-2">
                                    SUPER <span className="text-gray-400 not-italic">OFFER</span>
                                </h2>
                            </div>
                            <button className="p-2 rounded-full hover:bg-gray-100 transition-all text-gray-300">
                                <ArrowRight size={20} />
                            </button>
                        </div>

                        <div className="flex overflow-x-auto gap-4 px-4 no-scrollbar pb-8 scroll-smooth">
                            {mockProducts.reverse().slice(0, 8).map((p: any) => (
                                <div key={p._id} className="min-w-[180px] md:min-w-[220px] group cursor-pointer">
                                    <Link href={`/product/${p.product_id}`}>
                                        <div className="aspect-square rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden relative mb-4">
                                            <img
                                                src={p.product_images[0]}
                                                alt={p.product_name}
                                                className="w-full h-[180px] md:h-[220px] object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                            <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors shadow-sm">
                                                <Heart size={14} />
                                            </button>
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-[11px] font-black uppercase text-gray-900 truncate">
                                                {p.product_name}
                                            </h3>
                                            <p className="text-[9px] font-bold text-gray-400 line-clamp-2 leading-tight h-6">
                                                {p.description_specifications[0].title}
                                            </p>
                                            <div className="flex items-center gap-2 pt-2">
                                                <p className="text-sm font-black text-gray-900 italic">R{p.pricing.selling_price_zar}</p>

                                                <div className={`px-2 py-0.5 rounded-full border border-gray-200 text-[8px] font-black text-gray-500 ${p.pricing.original_price_zar > p.pricing.selling_price_zar ? '' : 'invisible'}`}>
                                                    {p.pricing.original_price_zar > p.pricing.selling_price_zar ? `-${Math.round(((p.pricing.original_price_zar - p.pricing.selling_price_zar) / p.pricing.original_price_zar) * 100)}%`
                                                        : '0%'}</div>

                                            </div>
                                            <p className="text-[8px] font-bold text-gray-300 uppercase italic">Estimated</p>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Middle Section & Highlight */}
                    {/* Section Heading */}
                    <div className="text-center mb-6">
                        <h2 className="text-3xl md:text-4xl font-bold font-script text-black leading-none uppercase">
                            Trending <span className="text-gray-400">THIS</span> Week
                        </h2>
                    </div>

                    {/* Bottom Grid Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            { key: 'downleft', label: 'Featured Choice' },
                            { key: 'downmiddle', label: 'Trending Now' },
                            { key: 'downright', label: 'New Arrival' }
                        ].map((item: any, i: number) => {
                            const section = displayHome[item.key];
                            if (!section) return null;

                            return (
                                <div key={i} className="group cursor-pointer space-y-6">
                                    <Link href={`/product/${section.product_id}`}>
                                        <div className={`aspect-square overflow-hidden ${isMobile ? 'rounded-[20px]' : 'rounded-[2.5rem]'} bg-gray-50 relative`}>
                                            <img
                                                src={section.icon}
                                                alt={section.title1}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
                                            />
                                            <div className="absolute top-6 left-6">
                                                <span className="bg-black text-white text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-widest">
                                                    {item.label}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="space-y-2 mt-4">
                                            <h3 className="text-2xl font-black uppercase tracking-tighter text-black leading-tight">
                                                {section.title1}
                                            </h3>
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-black text-gray-900">{section.title2}</p>
                                                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <ArrowRight size={14} strokeWidth={3} />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>

                    {/* From Our Customers Section */}
                    <div className="pt-20 pb-10">
                        <div className="text-center mb-12">
                            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-gray-900">
                                FROM OUR CUSTOMERS
                            </h2>
                        </div>

                        <div className="flex overflow-x-auto gap-6 no-scrollbar pb-8 scroll-smooth px-4">
                            {testimonials.map((t, i) => (
                                <div key={i} className="min-w-[300px] md:min-w-[400px] flex-1 bg-white border border-gray-100 rounded-[2.5rem] p-10 flex flex-col items-center text-center space-y-6 shadow-2xl hover:shadow-[0_30px_60px_rgba(0,0,0,0.12)] transition-shadow">
                                    <div className="flex gap-1">
                                        {[...Array(t.stars)].map((_, i) => (
                                            <Star key={i} size={16} fill="black" strokeWidth={0} />
                                        ))}
                                    </div>
                                    <p className="text-gray-500 text-sm leading-relaxed font-medium">
                                        "{t.content}"
                                    </p>
                                    <div className="space-y-1">
                                        <h4 className="font-black text-gray-900 uppercase tracking-widest text-[11px]">{t.name}</h4>
                                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">{t.location}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer Section */}
            <footer className="bg-black text-white">
                {/* Subscription Area */}
                <div className="max-w-7xl mx-auto px-10 py-24 text-center border-b border-white/5">
                    <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">
                        Subscribe to our emails
                    </h2>
                    <p className="text-gray-400 text-sm md:text-base mb-12 max-w-lg mx-auto leading-relaxed">
                        Be the first to know about new collections and exclusive offers.
                    </p>
                    <div className="max-w-md mx-auto relative group">
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full bg-transparent border border-white/30 rounded-full py-4 px-8 pr-16 text-sm focus:outline-none focus:border-white transition-colors"
                        />
                        <button className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:translate-x-1 transition-transform">
                            <ArrowRight size={20} strokeWidth={2} />
                        </button>
                    </div>
                </div>

                {/* Payment & Support Area */}
                <div className="max-w-7xl mx-auto px-10 py-16">
                    <div className="flex flex-col items-center space-y-8">
                        {/* Payment Icons */}
                        <div className="space-y-4 text-center">
                            <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                                We accept <ArrowRight size={10} className="-rotate-90" />
                            </div>
                            <div className="flex flex-wrap justify-center gap-4 transition-all duration-500">
                                {[
                                    { name: 'AMEX', color: 'bg-[#016FD0]' },
                                    { name: 'Apple Pay', color: 'bg-white text-black' },
                                    { name: 'Mastercard', color: 'bg-[#EB001B]' },
                                    { name: 'PayPal', color: 'bg-[#003087]' },
                                    { name: 'Visa', color: 'bg-[#1A1F71]' },
                                    { name: 'Klarna', color: 'bg-[#FFB3C7] text-black' }
                                ].map((p, i) => (
                                    <div key={i} className={`${p.color} px-3 py-1.5 rounded-md text-[9px] font-black uppercase tracking-tighter flex items-center justify-center min-w-[50px] h-8`}>
                                        {p.name}
                                    </div>
                                ))}
                            </div>
                        </div>



                        {/* Legal & Footer Links */}
                        <div className="w-full pt-16 flex flex-col md:flex-row items-center justify-between gap-8 border-t border-white/5">
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                &copy; 2026 ECOESTRAS
                            </p>
                            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
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
                        </div>
                    </div>
                </div>
            </footer>

            {/* Cart Drawer */}
            <div className={`fixed inset-0 z-[1000] transition-opacity duration-500 ${isCartOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}>
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
                <div className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-500 transform ${isCartOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
                    <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-xl font-black italic uppercase tracking-widest text-black">Cart</h2>
                        <button onClick={() => setIsCartOpen(false)} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-black hover:bg-gray-100 transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
                        {cartItems.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                <ShoppingBag size={48} className="text-gray-200" />
                                <p className="text-xs font-black uppercase tracking-widest text-gray-400">Your cart is empty</p>
                                <button onClick={() => setIsCartOpen(false)} className="px-8 py-3 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-full">Continue Shopping</button>
                            </div>
                        ) : (
                            cartItems.map((item, idx) => (
                                <div key={idx} className="flex gap-6 group">
                                    <div className="w-24 h-24 rounded-2xl bg-gray-50 overflow-hidden border border-gray-100 shrink-0">
                                        <img src={item.product_icon} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between py-1">
                                        <div>
                                            <h3 className="text-xs font-black uppercase tracking-tight text-black mb-1">{item.name}</h3>
                                            <div className="flex flex-wrap gap-2 mb-2">
                                                {item.variant.map((v: any, i: number) => {
                                                    const key = Object.keys(v)[0];
                                                    return (
                                                        <span key={i} className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">
                                                            {key}: {v[key]}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                            <p className="text-xs font-black text-black italic">R{item.pricing.customer_totalprice.toFixed(2)}</p>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase">Qty: {item.quantity}</span>
                                            <button
                                                onClick={() => removeFromCart(idx)}
                                                className="text-[9px] font-black uppercase tracking-tighter text-red-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Trash2 size={12} />
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="p-8 bg-gray-50/50 border-t border-gray-100 space-y-6">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Subtotal</span>
                            <span className="text-xl font-black italic text-black font-sans">R{subtotal.toFixed(2)}</span>
                        </div>
                        <p className="text-[9px] font-bold text-gray-400 leading-relaxed uppercase tracking-tight text-center">
                            Free Shipping. Taxes Included.
                        </p>
                        <button
                            onClick={() => {
                                setIsCartOpen(false);
                                carterToCheckoutButton();
                            }}
                            className="w-full py-5 bg-black text-white font-black uppercase tracking-[0.2em] text-xs shadow-2xl hover:bg-gray-900 transition-all active:scale-[0.98] rounded-2xl disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
                            disabled={cartItems.length === 0}
                        >
                            Check Out
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
