'use client';

import { useParams } from 'next/navigation';
import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Carousel from "framer-motion-carousel";

import FAQ from '../../../components/FAQ';
import Reviews from '../../../components/Reviews';
import Features from '../../../components/Features';

import ReviewSummary from '../../../components/ReviewSummary';
import { getProduct, getPublicProducts, trackVisitor, trackCart, trackCheckout } from '../../../lib/api';
import { v4 as uuidv4 } from 'uuid';
import { PackageX, Truck, ShieldCheck, RefreshCcw, Headset, Menu, Search, ShoppingBag, Star, Minus, Plus, ChevronDown, ChevronUp, Heart, CheckCircle2, ArrowRight, X, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Variant {
  [key: string]: string[];
}

export default function Product() {
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [cartCount, setCartCount] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<any[]>([]);

  const [activeImage, setActiveImage] = useState(0);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [mockProducts, setMockProducts] = useState<any>(null);

  const [isMobile, setIsMobile] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const trackedIdRef = useRef<string | null>(null);

  const params = useParams();
  const id = params?.id as string; // This grabs "agzo-fukqib5peeq" from the URL

  useEffect(() => {
    let sid = localStorage.getItem('session_id');
    if (!sid) {
      sid = uuidv4();
      localStorage.setItem('session_id', sid);
    }
    setSessionId(sid);

    // If there is no ID in the URL, wait.
    if (!id) return;

    // USE THE DYNAMIC ID HERE 👇
    // USE PROMISE.ALL TO FETCH BOTH AT THE SAME TIME 👇
    Promise.all([
      getProduct(id), getPublicProducts(8)
    ]).then(([data, allProducts]) => {
      setProduct(data);

      // 👇 THE FIX: Check the sticky note before tracking! 👇
      if (trackedIdRef.current !== id) {
        trackVisitor(data.product_id, sid!);
        trackedIdRef.current = id; // Update the sticky note so it doesn't fire again
      }
      // 👆 END FIX 👆

      //KEEPING PRODUCT_ID TO LOCAL STORAGE TO USE IT ON HOMEPAGE
      localStorage.removeItem('local_product_id');
      localStorage.setItem('local_product_id', data.product_id);


      // Dynamically initialize selectedVariant if productVariants or API data exists
      // Here we use the local productVariants as requested
      const initialVariants = data.variants.map((v: Variant) => {
        const key = Object.keys(v)[0];
        return { [key]: (v as any)[key][0] };
      });
      setSelectedVariant(initialVariants);


      // 2. Handle the public products list
      // Assuming you have a state called setMockProducts or setRelatedProducts
      setMockProducts(allProducts);

      // Initialize cart count from localStorage
      const existingCart = localStorage.getItem('Cart_order');
      if (existingCart) {
        try {
          const items = JSON.parse(existingCart);
          setCartCount(items.length);
          setCartItems(items);
        } catch (e) {
          console.error('Error parsing cart:', e);
        }
      }
    })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));

    // Function to check the screen width
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 750);
    };

    // Run it once immediately on mount to get the initial size
    handleResize();

    // Listen for window resizes
    window.addEventListener('resize', handleResize);

    // Cleanup the listener when the component unmounts
    return () => window.removeEventListener('resize', handleResize);

  }, [id]); // Tell useEffect to re-run if the 'id' in the URL changes


  const handleVariant = (Variantname: string, Variantselected: string) => {
    // Filter out any existing selection with the same attribute name to prevent duplicates
    const filteredVariants = selectedVariant.filter(v => !Object.keys(v).includes(Variantname));
    const newSelection = { [Variantname]: Variantselected };
    setSelectedVariant([...filteredVariants, newSelection]);
  }


  //buying the product without adding it to the cart

  const buyButton = async () => {
    if (product) {
      // Selected product data structure for checkout
      const selected_product = [{
        name: product.product_name,
        product_icon: product.product_images[0],
        quantity: quantity,
        variant: selectedVariant, // Now an array of attributes
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


      // This is the order object prepared for the checkout page
      const sendToCheckout = {
        store_id: product.store_id || 'ecoestras',
        customer: {
          name: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          postal_code: '',
        },
        cart_bucket: selected_product,
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

      // Track analytics - explicitly wait to ensure they reach the server before navigation
      try {
        console.log('[product] Sending trackCart...');
        await trackCart(product.product_id, sessionId);
        console.log('[product] Sending trackCheckout...');
        await trackCheckout(product.product_id, sessionId);
      } catch (err) {
        console.error('[product] Tracking failed:', err);
      }

      // Redirect to checkout
      router.push('/checkout');
    }
  };


  // The real add to cart button
  const AddToCartButton = async () => {
    if (product) {
      // Create pending order data structure
      const selected_product = {
        name: product.product_name,
        product_icon: product.product_images[0],
        quantity: quantity,
        variant: selectedVariant,
        pricing: {
          selling_price_zar: product.pricing.selling_price_zar,
          supplier_cost_zar: product.pricing.supplier_cost_zar,
          estimated_profit: product.pricing.selling_price_zar - product.pricing.supplier_cost_zar,
          supplier_totalprice: product.pricing.supplier_cost_zar * quantity,
          customer_totalprice: product.pricing.selling_price_zar * quantity,
          profit_totalprice: (product.pricing.selling_price_zar - product.pricing.supplier_cost_zar) * quantity,
        },
        source_link: product.source_link,
      };

      try {
        const getCartStr = localStorage.getItem('Cart_order');
        let cartArray = [];

        if (getCartStr) {
          cartArray = JSON.parse(getCartStr);
        }

        cartArray.push(selected_product);
        localStorage.setItem('Cart_order', JSON.stringify(cartArray));

        // Update UI
        setCartCount(cartArray.length);
        setCartItems(cartArray);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);

        // Track analytics
        console.log('[product] Sending trackCart...');
        await trackCart(product.product_id, sessionId);
      } catch (err) {
        console.error('[product] AddToCart failed:', err);
      }
    }
  };

  const removeFromCart = (index: number) => {
    try {
      const getCartStr = localStorage.getItem('Cart_order');
      if (getCartStr) {
        let cartArray = JSON.parse(getCartStr);
        cartArray = cartArray.filter((_: any, i: number) => i !== index);
        localStorage.setItem('Cart_order', JSON.stringify(cartArray));
        setCartCount(cartArray.length);
        setCartItems(cartArray);
      }
    } catch (err) {
      console.error('Error removing item:', err);
    }
  };
  const subtotal = cartItems.reduce((acc, item) => acc + item.pricing.customer_totalprice, 0);


  const carterToCheckoutButton = async () => {
    if (!product) return;

    let getCartStr = localStorage.getItem('Cart_order');

    if (!getCartStr) {
      console.log('Carter is empty:'); // if the carter is empty the check out button should be gray and not clickerble
    } else {
      try {
        const cartBucket = JSON.parse(getCartStr);

        // This is the order object prepared for the checkout page
        const sendToCheckout = {
          store_id: product.store_id || 'ecoestras',
          customer: {
            name: '',
            email: '',
            phone: '',
            address: '',
            city: '',
            postal_code: '',
          },
          cart_bucket: cartBucket,
          status: {
            payment: 'PENDING',
            fulfillment: 'UNFULFILLED'
          },
          payfast_pf_payment_id: '',
          createdAt: Date.now()
        };

        // Clear any existing pending orders to avoid duplication/stale data
        localStorage.removeItem('pending_order');

        // Save to localStorage so checkout page can pick it up
        localStorage.setItem('pending_order', JSON.stringify(sendToCheckout));

        // Track analytics
        console.log('[product] Sending trackCheckout...');
        await trackCheckout(product.product_id, sessionId);

        // Redirect to checkout
        router.push('/checkout');
      } catch (err) {
        console.error('[product] Checkout failed:', err);
      }
    }
  };









  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="relative flex flex-col items-center">
        <h1 className="text-3xl md:text-5xl font-black tracking-[0.5em] text-black animate-pulse uppercase">
          ECOESTRAS
        </h1>
        <div className="mt-4 w-24 h-[1px] bg-black/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-black animate-shimmer" />
        </div>
      </div>
    </div>
  );


  if (!product) { // or whatever your condition is for not finding it
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
        <div className="max-w-md w-full text-center space-y-8">
          {/* Minimalist Icon */}
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100">
              <PackageX strokeWidth={1.5} className="w-10 h-10 text-gray-400" />
            </div>
          </div>

          {/* Premium Typography Heading */}
          <div className="space-y-3">
            <h1 className="text-2xl font-black text-black uppercase tracking-[0.2em]">
              Connection Interrupted
            </h1>

            {/* Customer-friendly explanation */}
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed px-6">
              We temporarily lost your connection. This usually resolves quickly upon refreshing the secure connection. </p>
          </div>

          {/* Sleek Call-to-Action Button */}
          <div className="pt-6">
            <Link
              href={`/product/${id}`} // Or href="/" to send them to the home page
              className="inline-flex items-center justify-center px-10 py-4 bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-gray-800 transition-all shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)]"
            >
              Retry Connection
            </Link>
          </div>
        </div>
      </div>
    );
  }







  return (
    <main className="min-h-screen bg-white font-sans selection:bg-black selection:text-white uppercase tracking-tight overflow-x-hidden">
      {/* Announcement Bar */}
      <div className="scrollwrap border-b border-white/10">
        <div className="announcement-slide">
          <h1 className="announcement">FREE GROUND SHIPPING - SA ONLY</h1>
          <h1 className="announcement">LIMITED-TIME OFFER: 20% OFF</h1>
          <h1 className="announcement">FREE SHIPPING</h1>
        </div>
        <div className="announcement-slide">
          <h1 className="announcement">FREE GROUND SHIPPING - SA ONLY</h1>
          <h1 className="announcement">LIMITED-TIME OFFER: 20% OFF</h1>
          <h1 className="announcement">FREE SHIPPING</h1>
        </div>
        <div className="announcement-slide">
          <h1 className="announcement">FREE GROUND SHIPPING - SA ONLY</h1>
          <h1 className="announcement">LIMITED-TIME OFFER: 20% OFF</h1>
          <h1 className="announcement">FREE SHIPPING</h1>
        </div>
      </div>

      {/* Header - Fixed below Announcement Bar */}
      <header className="bg-black/90 backdrop-blur-md text-white py-4 px-10 flex items-center justify-between fixed top-[30px] left-0 w-full z-[99] border-b border-white/5">
        <div className="flex items-center gap-6">
          <button className="hover:scale-110 transition-transform active:scale-95">
            <Menu size={20} strokeWidth={2} />
          </button>
          <button className="hover:scale-110 transition-transform active:scale-95">
            <Search size={20} strokeWidth={2} />
          </button>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 text-center">
          <Link href="/">
            <img
              src="https://res.cloudinary.com/platformtour/image/upload/v1718636228/Picsart_24-06-01_19-54-15-468-removebg-preview_1_e6lydr.png"
              alt="ECOESTRAS"
              className="h-7 md:h-10 w-auto invert brightness-0"
            />
          </Link>
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative hover:scale-110 transition-transform active:scale-95 mr-2"
          >
            <ShoppingBag size={20} strokeWidth={2} />
            <span className="absolute -top-1 -right-1 bg-white text-black text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-black/10 shadow-sm">
              {cartCount}
            </span>
          </button>
        </div>
      </header>

      {/* Main Product Section */}
      <section className="pt-[150px] pb-24 px-4 md:px-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Left Column: Gallery */}
          {/* Responsive Layout Check */}

          {isMobile ? (
            <div className="w-full relative pb-8">
              {/* Mobile Carousel */}
              <Carousel
                autoPlay={false}
                interval={3000} // <-- Add this
                loop={true}     // <-- Add this
                renderArrowLeft={() => null}
                renderArrowRight={() => null}
                renderDots={({ activeIndex: currentIdx }) => {
                  // The Safe Hack: Use setTimeout to update the state AFTER the render cycle finishes
                  if (currentIdx !== activeIndex) {
                    setTimeout(() => setActiveIndex(currentIdx), 0);
                  }
                  return null; // Hide the default inside dots
                }}
              >
                {product.product_images.map((img: string, i: number) => (
                  <img
                    key={i}
                    src={img}
                    alt={`${product.product_name} image ${i + 1}`}
                    className="w-full h-auto object-cover rounded-[15px]"
                  />
                ))}
              </Carousel>

              {/* Custom Dots OUTSIDE the Carousel (Tailwind Version) */}
              <div className="flex justify-center items-center gap-3 w-full h-[30px] mt-4">
                {product.product_images.map((_: any, i: number) => (
                  <div
                    key={i}
                    className={`h-[10px] rounded-full bg-black/80 transition-all duration-700 ease-in-out ${activeIndex === i ? 'w-[25px]' : 'w-[10px]'
                      }`}
                  />
                ))}
              </div>
            </div>
          ) : (<div className="space-y-6">
            <div className="aspect-square rounded-[2rem] overflow-hidden bg-gray-50 border border-gray-100 relative group shadow-card">
              <img
                src={product.product_images[activeImage]}
                alt={product.product_name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <button className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-gray-400 hover:text-red-500 transition-all shadow-sm">
                <Heart size={20} />
              </button>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
              {product.product_images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`min-w-[80px] md:min-w-[100px] aspect-square rounded-2xl overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-black' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                >
                  <img src={img} alt={`${product.product_name} thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>)}

          {/* Right Column: Info */}
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="text-xs font-black text-gray-400 tracking-[0.3em] uppercase">{product.store_id || 'ecoestras'}</span>
              <h1 className="text-4xl md:text-6xl font-black text-black tracking-tighter uppercase leading-none">
                {product.product_name}
              </h1>

              <div className="flex items-center gap-4">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="black" className="text-black" />
                  ))}
                </div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  {product.comments?.length || 54} Reviews
                </span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <span className="text-3xl font-black text-black italic">
                R{product.pricing.selling_price_zar.toFixed(2)}
              </span>
              {product.pricing.original_price_zar > product.pricing.selling_price_zar && (
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold text-gray-300 line-through">
                    R{product.pricing.original_price_zar.toFixed(2)}
                  </span>
                  <span className="bg-black text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter flex items-center gap-1">
                    <CheckCircle2 size={10} />
                    Save {Math.round(((product.pricing.original_price_zar - product.pricing.selling_price_zar) / product.pricing.original_price_zar) * 100)}%
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-100">
              {product.benefit.map((benefit: any, i: any) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-black/5 flex items-center justify-center">
                    <CheckCircle2 size={12} className="text-black" />
                  </div>
                  <span className="text-[11px] font-bold text-gray-600 uppercase tracking-tight">{benefit}</span>
                </div>
              ))}
            </div>

            {/* Selection (Placeholders like image) */}
            <div className="space-y-6 pt-6">
              {product.variants.map((variantObj: any, idx: any) => {
                const variantName = Object.keys(variantObj)[0];
                const options = (variantObj as any)[variantName];
                return (
                  <div key={idx} className="space-y-3">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{variantName}</span>
                    <div className="flex gap-3">
                      {options.map((option: string) => {
                        const isActive = selectedVariant.some(v => v[variantName] === option);
                        return (
                          <button
                            key={option}
                            onClick={() => handleVariant(variantName, option)}
                            className={`px-8 py-2.5 rounded-full text-[10px] font-black tracking-widest uppercase transition-all border-2 ${isActive ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-100'
                              }`}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              <div className="space-y-3">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Quantity</span>
                <div className="inline-flex items-center border-2 border-black rounded-full px-4 py-2 gap-6">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="hover:scale-125 transition-transform"><Minus size={14} strokeWidth={3} /></button>
                  <span className="text-sm font-black w-4 text-center">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="hover:scale-125 transition-transform"><Plus size={14} strokeWidth={3} /></button>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <button
                  onClick={AddToCartButton}
                  className="w-full py-5 rounded-full border-2 border-black bg-white text-black font-black uppercase tracking-[0.2em] text-xs hover:bg-gray-50 transition-all active:scale-[0.98]"
                >
                  Add to cart
                </button>
                <button
                  onClick={buyButton}
                  className="w-full py-5 rounded-full bg-black text-white font-black uppercase tracking-[0.2em] text-xs shadow-2xl hover:bg-gray-900 transition-all active:scale-[0.98]"
                >
                  Buy it now
                </button>
              </div>

              {/* Trust Icons Row */}
              <div className="grid grid-cols-4 gap-4 pt-8">
                {[
                  { icon: Truck, label: "Fast Shipping" },
                  { icon: ShieldCheck, label: "Secure Checkout" },
                  { icon: RefreshCcw, label: "Hassle Free" },
                  { icon: Headset, label: "Support" }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center text-center gap-2">
                    <item.icon size={24} strokeWidth={1.5} className="text-black" />
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-tighter leading-tight">{item.label}</span>
                  </div>
                ))}
              </div>

              {/* Accordions */}
              <div className="pt-8 space-y-2">
                {[
                  { id: 'shipping', label: 'Shipping Details' },
                  { id: 'returns', label: 'Money Back & Returns' }
                ].map((acc) => (
                  <div key={acc.id} className="border-b border-gray-100">
                    <button
                      onClick={() => setOpenAccordion(openAccordion === acc.id ? null : acc.id)}
                      className="w-full py-4 flex items-center justify-between text-left"
                    >
                      <span className="text-[11px] font-black uppercase tracking-widest text-black flex items-center gap-3">
                        {acc.id === 'shipping' ? <Truck size={14} /> : <RefreshCcw size={14} />}
                        {acc.label}
                      </span>
                      {openAccordion === acc.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    {openAccordion === acc.id && (
                      <div className="pb-6 animate-in slide-in-from-top-2 duration-300">
                        <p className="text-[10px] font-bold text-gray-500 leading-relaxed uppercase tracking-tight">
                          {acc.id === 'shipping'
                            ? "All orders are processed within 24-48 hours. Shipping typically takes 3-7 business days across South Africa."
                            : "We offer a 30-day money back guarantee. If you're not completely satisfied, return your item for a full refund."}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>


      <Features specs={product.description_specifications} />

      {/* Budget Friendly Shopping Section (Duplicated from Home) */}
      <div className="bg-black text-white px-10 pt-8 pb-12 font-black uppercase tracking-[0.2em] text-[10px] relative z-20">
        Budget Friendly Shopping
      </div>

      <section className={`bg-white px-2 md:px-10 pb-4 ${isMobile ? 'rounded-t-[11px]' : 'rounded-t-[3rem]'} relative z-30 -mt-8`}>
        <div className="max-w-7xl mx-auto pt-10">
          <div className="flex items-center justify-between mb-8 px-4">
            <div>
              <h2 className="text-sm font-black italic uppercase tracking-widest text-gray-900 flex items-center gap-2">
                SUPER <span className="text-gray-400 not-italic">OFFER</span>
              </h2>
            </div>
            <button className="p-2 rounded-full hover:bg-gray-100 transition-all text-gray-300">
              <ArrowRight size={20} />
            </button>
          </div>

          <div className="flex overflow-x-auto gap-4 px-4 no-scrollbar pb-8 scroll-smooth">
            {mockProducts.map((p: any) => (
              <div key={p._id} className="min-w-[180px] md:min-w-[220px] group cursor-pointer">
                <Link href={`/product/${p.product_id}`}>
                  <div className="aspect-square rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden relative mb-4">
                    <img
                      src={p.product_images[0]}
                      alt={p.product_name}
                      className="w-full h-[180px] md:h-[220px] object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors shadow-sm">
                      <Heart size={14} />
                    </button>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-[11px] font-black uppercase text-gray-900 truncate">
                      {p.product_name}
                    </h3>
                    <p className="text-[9px] font-bold text-gray-400 line-clamp-2 leading-tight h-6">
                      {p.description_specifications[0].title}
                    </p>
                    <div className="flex items-center gap-2 pt-2">
                      <p className="text-sm font-black text-gray-900 italic">R{p.pricing.selling_price_zar}</p>

                      <div className={`px-2 py-0.5 rounded-full border border-gray-200 text-[8px] font-black text-gray-500 ${p.pricing.original_price_zar > p.pricing.selling_price_zar ? '' : 'invisible'}`}>
                        {p.pricing.original_price_zar > p.pricing.selling_price_zar ? `-${Math.round(((p.pricing.original_price_zar - p.pricing.selling_price_zar) / p.pricing.original_price_zar) * 100)}%`
                          : '0%'}</div>

                    </div>
                    <p className="text-[8px] font-bold text-gray-300 uppercase italic">Estimated</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Icons */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-3xl shadow-soft">
              <Truck className="text-black mb-4" size={32} />
              <span className="font-bold text-gray-900 text-xs uppercase tracking-widest">Fast Shipping</span>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-3xl shadow-soft">
              <ShieldCheck className="text-black mb-4" size={32} />
              <span className="font-bold text-gray-900 text-xs uppercase tracking-widest">Secure Checkout</span>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-3xl shadow-soft">
              <RefreshCcw className="text-black mb-4" size={32} />
              <span className="font-bold text-gray-900 text-xs uppercase tracking-widest">Easy Returns</span>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-3xl shadow-soft">
              <Headset className="text-black mb-4" size={32} />
              <span className="font-bold text-gray-900 text-xs uppercase tracking-widest">24/7 Support</span>
            </div>
          </div>
        </div>
      </div>


      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <ReviewSummary />
          <Reviews comments={product.comments} />
        </div>
      </section>

      <FAQ faqs={product.faq} />

      {/* Footer */}
      <footer className="bg-black text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-black mb-8 text-white uppercase tracking-tighter">EcoEstras</h2>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-8">
            {[
              { label: 'Terms Of Service', href: '/terms-of-service' },
              { label: 'Privacy Policy', href: '/privacy-policy' },
              { label: 'Refund Policy', href: '/refund-policy' },
              { label: 'Assistance', href: '/assistance' }
            ].map((link, i) => (
              <Link
                key={i}
                href={link.href}
                className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">
            &copy; 2026 EcoEstras South Africa. All Rights Reserved.
          </p>
          <p className="mt-8 text-[8px] font-medium leading-loose max-w-2xl mx-auto opacity-30 text-gray-400">
            Disclaimer: These statements have not been evaluated by the SAHPRA. This product is not intended to diagnose, treat, cure, or prevent any disease. Individual results may vary.
          </p>
        </div>
      </footer>

      {/* Pop-up Notification */}
      {showNotification && (
        <div className="fixed bottom-10 right-10 z-[999] bg-black text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom-10 fade-in duration-500 border border-white/10 backdrop-blur-md">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <CheckCircle2 size={16} className="text-white" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest">Added to Cart</p>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">{product.product_name} successfully added</p>
          </div>
        </div>
      )}
      {/* Cart Drawer */}
      <div className={`fixed inset-0 z-[1000] transition-opacity duration-500 ${isCartOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
        <div className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-500 transform ${isCartOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
          <div className="p-8 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-xl font-black italic uppercase tracking-widest text-black">Cart</h2>
            <button onClick={() => setIsCartOpen(false)} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-black hover:bg-gray-100 transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <ShoppingBag size={48} className="text-gray-200" />
                <p className="text-xs font-black uppercase tracking-widest text-gray-400">Your cart is empty</p>
                <button onClick={() => setIsCartOpen(false)} className="px-8 py-3 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-full">Continue Shopping</button>
              </div>
            ) : (
              cartItems.map((item, idx) => (
                <div key={idx} className="flex gap-6 group">
                  <div className="w-24 h-24 rounded-2xl bg-gray-50 overflow-hidden border border-gray-100 shrink-0">
                    <img src={item.product_icon} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-tight text-black mb-1">{item.name}</h3>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {item.variant.map((v: any, i: number) => {
                          const key = Object.keys(v)[0];
                          return (
                            <span key={i} className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">
                              {key}: {v[key]}
                            </span>
                          );
                        })}
                      </div>
                      <p className="text-xs font-black text-black italic">R{item.pricing.customer_totalprice.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Qty: {item.quantity}</span>
                      <button
                        onClick={() => removeFromCart(idx)}
                        className="text-[9px] font-black uppercase tracking-tighter text-red-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={12} />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-8 bg-gray-50/50 border-t border-gray-100 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Subtotal</span>
              <span className="text-xl font-black italic text-black font-sans">R{subtotal.toFixed(2)}</span>
            </div>
            <p className="text-[9px] font-bold text-gray-400 leading-relaxed uppercase tracking-tight text-center">
              Free Shipping. Taxes Included.
            </p>
            <button
              onClick={() => {
                setIsCartOpen(false);
                carterToCheckoutButton();
              }}
              className="w-full py-5 bg-black text-white font-black uppercase tracking-[0.2em] text-xs shadow-2xl hover:bg-gray-900 transition-all active:scale-[0.98] rounded-2xl disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
              disabled={cartItems.length === 0}
            >
              Check Out
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
