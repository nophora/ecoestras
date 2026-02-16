'use client';
import { useState } from 'react';
import Image from 'next/image';

interface ProductSliderProps {
    images: string[];
}

export default function ProductSlider({ images }: ProductSliderProps) {
    const [activeImage, setActiveImage] = useState(0);

    if (!images || images.length === 0) return null;

    return (
        <div className="w-full max-w-4xl mx-auto py-12 px-4">
            <h2 className="text-2xl font-bold text-center mb-8 lg:hidden">Product Gallery</h2>

            {/* Main Image Display */}
            <div className="relative w-full aspect-[4/3] md:aspect-[16/9] rounded-2xl overflow-hidden shadow-lg mb-4 bg-white">
                <Image
                    src={images[activeImage]}
                    alt={`Product view ${activeImage + 1}`}
                    fill
                    className="object-contain"
                />
            </div>

            {/* Thumbnails (Scrollable on mobile) */}
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                {images.map((img, idx) => (
                    <button
                        key={idx}
                        onClick={() => setActiveImage(idx)}
                        className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all snap-start ${activeImage === idx ? 'border-violet-600 shadow-md scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                            }`}
                    >
                        <Image
                            src={img}
                            alt={`Thumbnail ${idx + 1}`}
                            fill
                            className="object-cover"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}
