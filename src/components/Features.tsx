interface FeaturesProps {
    specs: { title: string; info: string; image: string }[];
}

export default function Features({ specs }: FeaturesProps) {
    if (!specs) return null;

    return (
        <section className="py-24 space-y-32 container mx-auto px-4 max-w-6xl">
            {specs.map((spec, idx) => (
                <div
                    key={idx}
                    className={`flex flex-col ${idx % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-16 lg:gap-24`}
                >
                    <div className="flex-1 w-full text-center lg:text-left">
                        <span className="text-gray-400 font-black text-xs uppercase tracking-[0.3em] mb-4 block">Process {idx + 1}</span>
                        <h3 className="text-4xl lg:text-5xl font-black mb-6 font-heading tracking-tight text-gray-900 leading-[1.1]">
                            {spec.title}
                        </h3>
                        <p className="text-xl text-gray-600 leading-relaxed font-medium mb-8">
                            {spec.info}
                        </p>
                        <div className="w-16 h-1.5 bg-black mx-auto lg:mx-0"></div>
                    </div>
                    <div className="flex-1 w-full relative">
                        <div className="relative aspect-[4/5] overflow-hidden transition-transform hover:scale-[1.02] duration-500">
                            <img
                                src={spec.image}
                                alt={spec.title}
                                className="object-contain w-full h-full"
                            />
                        </div>
                    </div>
                </div>
            ))}
        </section>
    );
}
