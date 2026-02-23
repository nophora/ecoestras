export default function TrustLogos() {
    const logos = [
        { name: 'Amazon', src: 'https://cdn.worldvectorlogo.com/logos/amazon-2.svg' },
        { name: 'Walmart', src: 'https://cdn.worldvectorlogo.com/logos/walmart.svg' },
        { name: 'Target', src: 'https://cdn.worldvectorlogo.com/logos/target-6.svg' },
        { name: 'Cosmopolitan', src: 'https://cdn.worldvectorlogo.com/logos/cosmopolitan.svg' },
        { name: 'Vogue', src: 'https://cdn.worldvectorlogo.com/logos/vogue-2.svg' },
    ];

    return (
        <div className="w-full bg-white py-12 border-b border-gray-100">
            <div className="container mx-auto px-4">
                <p className="text-center text-gray-400 font-bold text-sm tracking-widest uppercase mb-8">Featured & Trusted In</p>
                <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                    {logos.map((logo) => (
                        <img
                            key={logo.name}
                            src={logo.src}
                            alt={logo.name}
                            className="h-6 md:h-8 w-auto object-contain"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
