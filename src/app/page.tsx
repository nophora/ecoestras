'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getProduct, getHomepage, trackVisitor, trackCart, trackCheckout } from '../lib/api';
import { Menu, Search, ShoppingBag, ArrowRight, Heart } from 'lucide-react';

export default function Home() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState<any>(null);
    const [homeData, setHomeData] = useState<any>(null);
    const [mockProducts] = useState([
        { id: '1', name: 'Smart Trash Can', desc: 'For Bedroom, Living And Room Kitchen', price: 37.56, discount: 10, img: 'https://res.cloudinary.com/platformtour/image/upload/v1718740858/1623832270576_ncacgm.webp' },
        { id: '2', name: 'Electric Hairball', desc: 'Smart Trimmer Digital Display Fabric Portable', price: 17.79, discount: 20, img: 'https://res.cloudinary.com/platformtour/image/upload/v1718740858/1623832270576_ncacgm.webp' },
        { id: '3', name: 'Cookit Knife Set', desc: 'Chef Knives with Non-Slip German Stainless Steel', price: 93.90, discount: 40, img: 'https://res.cloudinary.com/platformtour/image/upload/v1718740858/1623832270576_ncacgm.webp' },
        { id: '4', name: 'Pet Bed Warming Soft', desc: 'Soft Sleeping Bag Cushion Puppy Kennel', price: 61.28, discount: 15, img: 'https://res.cloudinary.com/platformtour/image/upload/v1718740858/1623832270576_ncacgm.webp' },
        { id: '5', name: 'Smart Kettle Pro', desc: 'Temperature Control with App Integration', price: 549.00, discount: 5, img: 'https://res.cloudinary.com/platformtour/image/upload/v1718740858/1623832270576_ncacgm.webp' },
        { id: '6', name: 'Wireless Charger Pad', desc: '15W Fast Charging for iPhone and Galaxy', price: 299.00, discount: 12, img: 'https://res.cloudinary.com/platformtour/image/upload/v1718740858/1623832270576_ncacgm.webp' },
        { id: '7', name: 'Mini Humidifier', desc: 'USB Powered with Night Light Mode', price: 189.50, discount: 25, img: 'https://res.cloudinary.com/platformtour/image/upload/v1718740858/1623832270576_ncacgm.webp' },
        { id: '8', name: 'Ergonomic Mouse', desc: 'Vertical Wireless Mouse with DPI Control', price: 420.00, discount: 18, img: 'https://res.cloudinary.com/platformtour/image/upload/v1718740858/1623832270576_ncacgm.webp' },
    ]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Use the product ID that was used previously
                const [productInfo, homepageInfo] = await Promise.all([
                    getProduct('agzo-fukqib5peeq'),
                    getHomepage()
                ]);
                setProduct(productInfo);
                setHomeData(homepageInfo);
            } catch (err) {
                console.error('Error fetching homepage data:', err);
                // Fallback to defaults or seed data if empty
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

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
                    <button className="relative hover:scale-110 transition-transform active:scale-95 mr-2">
                        <ShoppingBag size={20} strokeWidth={2} />
                        <span className="absolute -top-1 -right-1 bg-white text-black text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">1</span>
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
                            href={`/product?id=${displayHome.hero.product_id}`}
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

            <section className="bg-white px-2 md:px-10 pb-20 rounded-t-[3rem] relative z-30 -mt-8">
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
                        {mockProducts.map((p) => (
                            <div key={p.id} className="min-w-[180px] md:min-w-[220px] group cursor-pointer">
                                <Link href={`/product?id=${displayHome.hero.product_id}`}>
                                    <div className="aspect-square rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden relative mb-4">
                                        <img
                                            src={p.img}
                                            alt={p.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors shadow-sm">
                                            <Heart size={14} />
                                        </button>
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-[11px] font-black uppercase text-gray-900 truncate">
                                            {p.name}
                                        </h3>
                                        <p className="text-[9px] font-bold text-gray-400 line-clamp-2 leading-tight h-6">
                                            {p.desc}
                                        </p>
                                        <div className="flex items-center gap-2 pt-2">
                                            <p className="text-sm font-black text-gray-900 italic">R{p.price.toFixed(2)}</p>
                                            <div className="px-2 py-0.5 rounded-full border border-gray-200 text-[8px] font-black text-gray-500">
                                                -{p.discount}%
                                            </div>
                                        </div>
                                        <p className="text-[8px] font-bold text-gray-300 uppercase italic">Estimated</p>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Middle Section & Grid */}
            <section className="bg-white py-24 px-10">
                <div className="max-w-7xl mx-auto space-y-24">

                    {/* Section Heading */}
                    <div className="text-center mb-10">
                        <h2 className="text-3xl md:text-4xl font-bold font-script text-black leading-none uppercase">
                            NEW <span className="text-gray-400">&</span> Trending
                        </h2>
                    </div>

                    {/* Middle Highlight Section */}
                    {displayHome.middlesection && (
                        <div className="group cursor-pointer">
                            <Link href={`/product?id=${displayHome.middlesection.product_id}`} className="flex flex-col md:flex-row items-center gap-12">
                                <div className="w-full md:w-1/2 overflow-hidden rounded-[3rem] aspect-[4/3] bg-gray-50 flex items-center justify-center">
                                    <img
                                        src={displayHome.middlesection.icon}
                                        alt={displayHome.middlesection.title1}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                </div>
                                <div className="w-full md:w-1/2 space-y-6">
                                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-tight text-black">
                                        {displayHome.middlesection.title1}
                                    </h2>
                                    <p className="text-2xl font-black text-gray-900 italic">
                                        R1588,37
                                    </p>
                                    <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border-b-2 border-black pb-1 group-hover:gap-4 transition-all">
                                        Explore Collection <ArrowRight size={12} strokeWidth={3} />
                                    </div>
                                </div>
                            </Link>
                        </div>
                    )}





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
                                    <Link href={`/product?id=${section.product_id}`}>
                                        <div className="aspect-square overflow-hidden rounded-[2.5rem] bg-gray-50 relative">
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
                </div>
            </section>
        </main>
    );
}
