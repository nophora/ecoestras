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
        <section className="py-16 bg-white overflow-hidden">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">Customer Reviews</h2>

                {/* Simple horizontal scroll for carousel effect */}
                <div className="flex gap-6 overflow-x-auto pb-8 px-4 snap-x scrollbar-hide -mx-4 lg:mx-0">
                    {comments.map((review, idx) => (
                        <div
                            key={idx}
                            className="flex-shrink-0 w-80 md:w-96 bg-gray-50 p-6 rounded-2xl border border-gray-100 snap-center shadow-sm"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                                    <img src={review.picture} alt={review.name} className="object-cover w-full h-full" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">{review.name}</h4>
                                    <span className="text-xs text-gray-500">{review.date}</span>
                                </div>
                                <div className="ml-auto text-yellow-400">★★★★★</div>
                            </div>
                            <p className="text-gray-700 italic">"{review.comment}"</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
