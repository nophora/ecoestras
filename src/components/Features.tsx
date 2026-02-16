interface FeaturesProps {
    specs: { title: string; info: string; image: string }[];
}

export default function Features({ specs }: FeaturesProps) {
    if (!specs) return null;

    return (
        <section className="py-12 space-y-24 container mx-auto px-4">
            {specs.map((spec, idx) => (
                <div
                    key={idx}
                    className={`flex flex-col ${idx % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 group`}
                >
                    <div className="flex-1 w-full">
                        <h3 className="text-2xl lg:text-3xl font-bold mb-4">{spec.title}</h3>
                        <p className="text-lg text-gray-600 leading-relaxed">{spec.info}</p>
                    </div>
                    <div className="flex-1 w-full relative aspect-video rounded-3xl overflow-hidden shadow-2xl transform transition-transform group-hover:scale-[1.02]">
                        <img src={spec.image} alt={spec.title} className="object-cover w-full h-full" />
                    </div>
                </div>
            ))}
        </section>
    );
}
