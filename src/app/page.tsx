'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Hero from '../components/Hero';
import ProductSlider from '../components/ProductSlider';
import Ingredients from '../components/Ingredients';
import FAQ from '../components/FAQ';
import Reviews from '../components/Reviews';
import StickyCart from '../components/StickyCart';
import Features from '../components/Features';
import TrustLogos from '../components/TrustLogos';
import ReviewSummary from '../components/ReviewSummary';
import { getProduct, trackVisitor, trackCart, trackCheckout } from '../lib/api';
import { v4 as uuidv4 } from 'uuid';
import { Truck, ShieldCheck, RefreshCcw, Headset } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    let sid = localStorage.getItem('session_id');
    if (!sid) {
      sid = uuidv4();
      localStorage.setItem('session_id', sid);
    }
    setSessionId(sid);

    getProduct('agzo-fukqib5peeq')
      .then(data => {
        setProduct(data);
        trackVisitor(data.product_id, sid!);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleAddToCart = async () => {
    if (product) {
      // Create pending order for checkout page
      const pendingOrder = {
        product_id: product.product_id,
        store_id: product.store_id || 'pap-plus',
        cart_bucket: [{
          product_id: product.product_id,
          name: product.product_name,
          product_icon: product.hero_banner,
          quantity: 1,
          variant: [], // Default to no variants for simplicity
          pricing: {
            customer_totalprice: product.pricing.selling_price_zar,
            supplier_totalprice: product.pricing.supplier_cost_zar
          }
        }]
      };

      console.log(`[Home] Initiating checkout for product: ${product.product_id}`);
      localStorage.setItem('pending_order', JSON.stringify(pendingOrder));

      // Track analytics - explicitly wait to ensure they reach the server before navigation
      try {
        console.log('[Home] Sending trackCart...');
        await trackCart(product.product_id, sessionId);
        console.log('[Home] Sending trackCheckout...');
        await trackCheckout(product.product_id, sessionId);
      } catch (err) {
        console.error('[Home] Tracking failed:', err);
      }

      // Redirect to checkout
      router.push('/checkout');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-primary-600 bg-white"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div></div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center">Product not found. Ensure backend is running and seeded.</div>;

  return (
    <main className="min-h-screen pb-24 bg-white font-sans selection:bg-primary-100 selection:text-primary-900">
      {/* Announcement Bar */}
      <div className="bg-primary-900 text-white py-2.5 text-center text-[10px] font-black uppercase tracking-[0.2em]">
        Free South Africa Shipping • 30-Day Money Back Guarantee • Store Closing Sale: Up to 50% Off
      </div>

      <nav className="fixed top-8 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-5xl bg-white/70 backdrop-blur-xl z-50 rounded-full border border-white/40 shadow-card px-8 h-16 flex items-center justify-between">
        <span className="text-2xl font-black tracking-tighter text-primary-900 font-heading">PAP PLUS</span>
        <button
          onClick={handleAddToCart}
          className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all"
        >
          Buy Now
        </button>
      </nav>

      <Hero product={product} onAddToCart={handleAddToCart} />

      <TrustLogos />

      <div className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black mb-4 font-heading tracking-tight">Scientifically Better</h2>
            <p className="text-gray-500 font-medium">Why PAP PLUS is the #1 choice for whitening.</p>
          </div>
          <ProductSlider images={product.product_images} />
        </div>
      </div>

      <Features specs={product.description_specifications} />

      {/* Benefits Icons */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-3xl shadow-soft">
              <Truck className="text-primary-600 mb-4" size={32} />
              <span className="font-bold text-gray-900 text-xs uppercase tracking-widest">Fast Shipping</span>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-3xl shadow-soft">
              <ShieldCheck className="text-primary-600 mb-4" size={32} />
              <span className="font-bold text-gray-900 text-xs uppercase tracking-widest">Secure Checkout</span>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-3xl shadow-soft">
              <RefreshCcw className="text-primary-600 mb-4" size={32} />
              <span className="font-bold text-gray-900 text-xs uppercase tracking-widest">Easy Returns</span>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-3xl shadow-soft">
              <Headset className="text-primary-600 mb-4" size={32} />
              <span className="font-bold text-gray-900 text-xs uppercase tracking-widest">24/7 Support</span>
            </div>
          </div>
        </div>
      </div>

      <Ingredients ingredients={product.ingredients} />

      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <ReviewSummary />
          <Reviews comments={product.comments} />
        </div>
      </section>

      <FAQ faqs={product.faq} />

      <footer className="bg-primary-900 text-white/50 py-16 border-t border-primary-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-black mb-8 text-white">PAP PLUS</h2>
          <div className="flex justify-center gap-8 mb-8 text-xs font-bold uppercase tracking-widest">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/assistance" className="hover:text-white transition-colors">Refund Policy</Link>
          </div>
          <p className="text-[10px] font-medium leading-loose max-w-2xl mx-auto opacity-40">
            Disclaimer: These statements have not been evaluated by the SAHPRA. This product is not intended to diagnose, treat, cure, or prevent any disease. Individual results may vary.
          </p>
        </div>
      </footer>

      <StickyCart price={product.pricing.selling_price_zar} onAddToCart={handleAddToCart} />
    </main>
  );
}
