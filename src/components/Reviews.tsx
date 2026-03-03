'use client';
import { Star, CheckCircle } from 'lucide-react';
import Image from 'next/image';

interface ReviewsProps {
    comments: {
        name: string;
        date: string;
        comment: string;
        picture: string;
    }[];
}

export default function Reviews({ comments }: ReviewsProps) {
    if (!comments) return null;

    return (
        <section className="py-24 bg-gray-50/50">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-black mb-4 font-heading tracking-tight text-gray-900 leading-tight">
                        Real Results from Real People
                    </h2>
                    <p className="text-gray-500 font-medium max-w-2xl mx-auto text-lg leading-relaxed text-center">
                        Join over 50,000 satisfied customers who transformed their lives with EcoEstras.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {comments.map((review, idx) => (
                        <div
                            key={idx}
                            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
                        >
                            <div className="flex gap-4 h-full">
                                {/* Left Content: Info & Comment */}
                                <div className="flex-1 flex flex-col">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-bold text-gray-900 text-sm">{review.name}</h4>
                                        <div className="flex items-center gap-1 text-[10px] text-gray-400 font-semibold italic">
                                            <CheckCircle size={10} className="text-gray-900" />
                                            <span>Verified</span>
                                        </div>
                                    </div>

                                    <div className="text-[10px] text-gray-400 font-medium mb-2">
                                        {review.date}
                                    </div>

                                    <div className="flex gap-0.5 text-black mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={12} fill="currentColor" stroke="none" />
                                        ))}
                                    </div>

                                    <div className="flex-1">
                                        <p className="text-[13px] text-gray-800 font-bold leading-snug">
                                            {review.comment}
                                        </p>
                                    </div>
                                </div>

                                {/* Right Content: Testimony Image (Not profile) */}
                                <div className="w-24 sm:w-28 h-36 sm:h-40 flex-shrink-0 relative rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                                    <Image
                                        src={review.picture}
                                        alt={`Testimony from ${review.name}`}
                                        fill
                                        sizes="(max-width: 768px) 100px, 120px"
                                        unoptimized
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
