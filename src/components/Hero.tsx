import Image from 'next/image';

interface HeroProps {
    product: any;
    onAddToCart: () => void;
}

export default function Hero({ product, onAddToCart }: HeroProps) {
    if (!product) return null;

    return (
        <section className="relative w-full overflow-hidden bg-gradient-to-br from-violet-100 to-white pt-20 pb-12 lg:pt-32">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-12">

                    {/* Text Content */}
                    <div className="flex-1 text-center lg:text-left z-10">
                        <span className="inline-block py-1 px-3 rounded-full bg-violet-100 text-violet-700 text-sm font-semibold mb-6 tracking-wide">
                            NEW • PEROXIDE FREE
                        </span>
                        <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-gray-900 leading-tight">
                            Professional Whitening. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">
                                Zero Sensitivity.
                            </span>
                        </h1>
                        <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
                            {product.description_specifications[0]?.info || "Experience visibly whiter teeth in just 30 minutes."}
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                            <div className="flex items-end gap-2">
                                <span className="text-3xl font-bold text-gray-900">R{product.pricing.selling_price_zar}</span>
                                <span className="text-lg text-gray-500 line-through mb-1">R{(product.pricing.selling_price_zar * 1.5).toFixed(0)}</span>
                            </div>
                            <button
                                onClick={onAddToCart}
                                className="bg-violet-600 hover:bg-violet-700 text-white text-lg font-semibold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 w-full sm:w-auto"
                            >
                                Buy Now
                            </button>
                        </div>

                        <div className="mt-8 flex items-center justify-center lg:justify-start gap-6 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                <span>Enamel Safe</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                <span>Free Shipping</span>
                            </div>
                        </div>
                    </div>

                    {/* Hero Image */}
                    <div className="flex-1 relative w-full aspect-square max-w-lg lg:max-w-xl">
                        <div className="absolute inset-0 bg-violet-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                        <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                            <Image
                                src={product.hero_banner || product.product_images[0]}
                                alt={product.product_name}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
