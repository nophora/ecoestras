'use client';
import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductSliderProps {
    images: string[];
}

export default function ProductSlider({ images }: ProductSliderProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    // Duplicate images for "infinite" feel if there are few
    const displayImages = [...images, ...images, ...images];

    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 10);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

            // Loop logic: if we are near the end or beginning, jump to the middle copy
            if (scrollLeft <= 0) {
                scrollRef.current.scrollLeft = scrollWidth / 3;
            } else if (scrollLeft >= scrollWidth - clientWidth) {
                scrollRef.current.scrollLeft = scrollWidth / 3;
            }
        }
    };

    useEffect(() => {
        const el = scrollRef.current;
        if (el) {
            el.addEventListener('scroll', checkScroll);
            // Start in the middle of our triple-list for infinite feel
            el.scrollLeft = el.scrollWidth / 3;
            checkScroll();
            return () => el.removeEventListener('scroll', checkScroll);
        }
    }, [images]);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { clientWidth } = scrollRef.current;
            const scrollAmount = direction === 'left' ? -clientWidth / 1.5 : clientWidth / 1.5;
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    if (!images || images.length === 0) return null;

    return (
        <div className="relative w-full overflow-hidden group py-8">
            {/* Gradient Fades for depth */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none hidden md:block"></div>
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none hidden md:block"></div>

            {/* Scroll Container */}
            <div
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-4 md:px-20 py-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {displayImages.map((img, idx) => (
                    <div
                        key={idx}
                        className="flex-shrink-0 w-[80vw] md:w-[400px] aspect-square relative rounded-[2.5rem] overflow-hidden bg-white shadow-card border border-gray-100 snap-center transition-transform duration-500 hover:scale-[1.02]"
                    >
                        <Image
                            src={img}
                            alt={`Product Show ${idx}`}
                            fill
                            sizes="(max-width: 768px) 80vw, 400px"
                            unoptimized
                            className="object-contain p-8"
                        />
                    </div>
                ))}
            </div>

            {/* Navigation Controls */}
            <div className="absolute inset-x-4 md:inset-x-10 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none z-20">
                <button
                    onClick={() => scroll('left')}
                    className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-xl shadow-2xl flex items-center justify-center text-primary-900 border border-gray-100 pointer-events-auto hover:bg-primary-600 hover:text-white transition-all transform active:scale-95 disabled:opacity-30"
                >
                    <ChevronLeft size={28} />
                </button>
                <button
                    onClick={() => scroll('right')}
                    className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-xl shadow-2xl flex items-center justify-center text-primary-900 border border-gray-100 pointer-events-auto hover:bg-primary-600 hover:text-white transition-all transform active:scale-95 disabled:opacity-30"
                >
                    <ChevronRight size={28} />
                </button>
            </div>

            {/* Hint for mobile */}
            <div className="text-center mt-6 block md:hidden">
                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Swipe to explore</span>
            </div>
        </div>
    );
}
