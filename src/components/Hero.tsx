import { useState } from 'react';
import Image from 'next/image';
import { Star, Minus, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface HeroProps {
    product: any;
    onAddToCart: (quantity: number) => void;
}

export default function Hero({ product, onAddToCart }: HeroProps) {
    const [quantity, setQuantity] = useState(1);
    const router = useRouter();

    // Selected product data structure for checkout
    const selected_product = [{
        name: product.product_name,
        product_icon: product.product_images[0],
        quantity: quantity,
        variant: {
            color: "purple violet",
            pairs: 7,
            total_strips: 14,
        },
        pricing: {
            selling_price_zar: product.pricing.selling_price_zar,
            supplier_cost_zar: product.pricing.supplier_cost_zar,
            estimated_profit: product.pricing.selling_price_zar - product.pricing.supplier_cost_zar,
            supplier_totalprice: product.pricing.supplier_cost_zar * quantity,
            customer_totalprice: product.pricing.selling_price_zar * quantity,
            profit_totalprice: (product.pricing.selling_price_zar - product.pricing.supplier_cost_zar) * quantity,
        },
        source_link: product.source_link,
    }]

    const buyButton = () => {
        const cart = [...selected_product]

        // This is the order object prepared for the checkout page
        const sendToCheckout = {
            store_id: product.product_name,
            customer: {
                name: '',
                email: '',
                phone: '',
                address: '',
                city: '',
                postal_code: '',
            },
            cart_bucket: cart,
            status: {
                payment: 'PENDING',
                fulfillment: 'UNFULFILLED'
            },
            payfast_pf_payment_id: '',
            createdAt: Date.now()
        }

        // Clear any existing pending orders to avoid duplication/stale data
        localStorage.removeItem('pending_order');

        // Save to localStorage so checkout page can pick it up
        localStorage.setItem('pending_order', JSON.stringify(sendToCheckout));

        // Navigate to checkout
        router.push('/checkout');
    }


    if (!product) return null;

    return (
        <section className="relative h-[90vh] min-h-[700px] w-full flex items-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={product.hero_banner || product.product_images[0]}
                    alt="Premium PAP PLUS Whitening"
                    fill
                    sizes="100vw"
                    unoptimized
                    className="object-cover object-center brightness-[0.85] lg:brightness-100"
                    priority
                />
                {/* Mobile Gradient Overlay for Readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-white via-white/40 to-transparent lg:from-white/10 lg:via-transparent lg:to-transparent z-10 hidden sm:block"></div>
                <div className="absolute inset-0 bg-white/60 sm:hidden z-10"></div>
            </div>

            <div className="container mx-auto px-4 lg:px-12 z-20 relative">
                <div className="max-w-2xl">
                    <div className="flex items-center gap-1 mb-4 text-primary-600">
                        {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
                        <span className="ml-2 text-primary-900 font-semibold text-sm">TRUSTED BY 50,000+ USERS</span>
                    </div>

                    <h1 className="text-5xl lg:text-7xl font-bold mb-6 text-gray-900 leading-[1.1] font-heading tracking-tight">
                        Premium PAP+ <br />
                        <span className="text-primary-600">Whitening.</span> <br />
                        <span className="text-gray-900">Zero Sensitivity.</span>
                    </h1>

                    <p className="text-xl text-gray-700 mb-8 max-w-lg leading-relaxed font-medium">
                        Peroxide-Free, Enamel-Safe technology for a professional-level bright smile in just 30 minutes.
                    </p>

                    <div className="flex flex-col gap-6">
                        {/* Price Display */}
                        <div className="flex items-center gap-6">
                            <span className="text-4xl lg:text-5xl font-black text-primary-600 drop-shadow-[0_2px_10px_rgba(255,255,255,0.8)]">R{product.pricing.selling_price_zar}</span>
                            {product.pricing.original_price_zar && (
                                <span className="text-4xl lg:text-5xl text-gray-700/60 line-through font-black drop-shadow-[0_2px_10px_rgba(255,255,255,0.8)]">Was R{product.pricing.original_price_zar}</span>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            {/* Quantity Selector */}
                            <div className="flex items-center bg-white rounded-full border border-gray-200 p-1 shadow-sm w-full sm:w-auto">
                                <button
                                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                    className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    <Minus size={20} />
                                </button>
                                <span className="w-12 text-center font-bold text-xl">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(prev => prev + 1)}
                                    className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>

                            <button
                                onClick={buyButton}
                                className="bg-primary-600 hover:bg-primary-700 text-white text-xl font-bold py-5 px-12 rounded-full shadow-2xl hover:shadow-primary-500/30 transition-all transform hover:-translate-y-1 w-full sm:w-auto uppercase tracking-wider"
                            >
                                Shop Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Features Bar (Optional style) */}
            <div className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-200 z-10 hidden lg:block">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between text-sm font-bold text-primary-900">
                    <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div> CLINICALLY PROVEN</span>
                    <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div> 100% PEROXIDE FREE</span>
                    <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div> ENAMEL SAFE FORMULA</span>
                    <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div> DESIGNED IN SOUTH AFRICA</span>
                </div>
            </div>
        </section>
    );
}
