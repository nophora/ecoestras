'use client';

import { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import ProductSlider from '../components/ProductSlider';
import Ingredients from '../components/Ingredients';
import FAQ from '../components/FAQ';
import Reviews from '../components/Reviews';
import StickyCart from '../components/StickyCart';
import Features from '../components/Features';
import { getProduct, trackVisitor, trackCart, trackCheckout } from '../lib/api';
import { v4 as uuidv4 } from 'uuid';

export default function Home() {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    // Generate or retrieve session ID
    let sid = localStorage.getItem('session_id');
    if (!sid) {
      sid = uuidv4();
      localStorage.setItem('session_id', sid);
    }
    setSessionId(sid);

    // Fetch Product
    getProduct('agzo-fukqib5peeq')
      .then(data => {
        setProduct(data);
        trackVisitor(data.product_id, sid!);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleAddToCart = () => {
    if (product) {
      trackCart(product.product_id, sessionId);
      alert('Added to cart! Redirecting to checkout...'); // Stub definition
      trackCheckout(product.product_id, sessionId);
      // Here we would redirect to PayFast or Checkout page
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-violet-600">Loading...</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center">Product not found. Ensure backend is running and seeded.</div>;

  return (
    <main className="min-h-screen pb-24">
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-40 border-b border-gray-100 h-16 flex items-center justify-center">
        <span className="text-xl font-bold tracking-tighter text-violet-900">PAP PLUS</span>
      </nav>

      <Hero product={product} onAddToCart={handleAddToCart} />

      <ProductSlider images={product.product_images} />

      <Features specs={product.description_specifications} />

      <Ingredients ingredients={product.ingredients} />

      <Reviews comments={product.comments} />

      <FAQ faqs={product.faq} />

      <StickyCart price={product.pricing.selling_price_zar} onAddToCart={handleAddToCart} />
    </main>
  );
}
