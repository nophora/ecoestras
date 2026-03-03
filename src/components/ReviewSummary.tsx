import { Star } from 'lucide-react';

export default function ReviewSummary() {
    const stats = [
        { stars: 5, count: 62, percentage: 94 },
        { stars: 4, count: 4, percentage: 6 },
        { stars: 3, count: 0, percentage: 0 },
        { stars: 2, count: 0, percentage: 0 },
        { stars: 1, count: 0, percentage: 0 },
    ];

    return (
        <div className="bg-white p-8 rounded-3xl shadow-card border border-gray-100 max-w-lg mx-auto mb-16">
            <div className="flex flex-col items-center mb-8">
                <div className="bg-gray-50 text-black p-2 rounded-xl mb-2">
                    <Star size={32} fill="currentColor" />
                </div>
                <div className="text-5xl font-black text-gray-900 mb-1">4.9</div>
                <div className="text-gray-500 font-bold uppercase tracking-widest text-xs">66 Verified Reviews</div>
            </div>

            <div className="space-y-3">
                {stats.map((stat) => (
                    <div key={stat.stars} className="flex items-center gap-4">
                        <div className="flex items-center gap-1 w-20 flex-shrink-0">
                            <span className="font-bold text-gray-900">{stat.stars}</span>
                            <Star size={14} className="text-black" fill="currentColor" />
                        </div>
                        <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-black rounded-full transition-all duration-1000"
                                style={{ width: `${stat.percentage}%` }}
                            ></div>
                        </div>
                        <div className="w-8 text-right text-sm text-gray-400 font-medium">({stat.count})</div>
                    </div>
                ))}
            </div>

            <button className="w-full mt-10 py-4 px-6 border-2 border-gray-100 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-colors uppercase tracking-widest text-xs">
                Write a Review
            </button>
        </div>
    );
}
