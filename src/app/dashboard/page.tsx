'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    ShoppingBag,
    Box,
    Zap,
    Users,
    CheckCircle2,
    AlertCircle,
    User,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    ChevronDown,
    ChevronUp,
    Search,
    Trash2,
    Eye,
    EyeOff,
    ExternalLink,
    Tag,
    History,
    Plus,
    CreditCard,
    RefreshCw,
    X,
    BarChart3,
    Settings,
    LogOut,
    Bell,
    ChevronRight,
    MessageSquare,
    Globe,
    Calendar,
    Store,
    Activity,
    Target,
    Zap as Flash,
    ShieldCheck,
    Loader2
} from 'lucide-react';
import { getAssistanceRequests, markAssistanceDone, getOrders, markOrderFulfilled, markOrderPaid, deleteOrder, getAllProducts, toggleProductPause, deleteProduct, createProduct, getMe, logout, getHomepage, updateHomepage } from '@/lib/api';

type Order = {
    _id: string;
    order_track_id: string;
    store_id: string;
    customer: {
        name: string;
        email: string;
        phone: string;
        address: string;
        city: string;
        suburb: string;
        postal_code: string;
    };
    cart_bucket: {
        name: string;
        product_icon: string;
        quantity: number;
        variant: any;
        pricing: {
            selling_price_zar: number;
            supplier_cost_zar: number;
            customer_totalprice: number;
            supplier_totalprice: number;
        };
        source_link: string;
    }[];
    total_amount: number;
    status: {
        payment: string;
        fulfillment: string;
    };
    createdAt: string | number;
};

type Product = {
    _id: string;
    product_id: string;
    store_id: string;
    product_name: string;
    paused: boolean;
    hero_banner: string;
    source_link: string;
    pricing: {
        original_price_zar: number;
        selling_price_zar: number;
        supplier_cost_zar: number;
        estimated_profit: number;
    };
    category: string[];
    product_images: string[];
    benefit?: string[];
    visitors?: { timestamp: string; session: string }[];
    cart_events?: { timestamp: string; session: string }[];
    checkout_events?: { timestamp: string; session: string }[];
};

type AssistanceRequest = {
    _id: string;
    email: string;
    Number: string;
    TrackId?: string;
    Message: string;
    refund: boolean;
    status: 'PENDING' | 'DONE';
    store_id: string;
    Day: string;
    Month: string;
    Year: string;
    createdAt: string;
};




export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'products' | 'sessions' | 'assistant'>('dashboard');
    const [activeFilter, setFilter] = useState<'all' | 'undone' | 'done' | 'refunds' | 'assist' | 'paid' | 'unpaid' | 'unfulfilled'>('all');
    const [requests, setRequests] = useState<AssistanceRequest[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
    const [expandedProductOrders, setExpandedProductOrders] = useState<Set<string>>(new Set());
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; orderId: string | null; productId: string | null }>({
        isOpen: false,
        orderId: null,
        productId: null
    });
    const [notification, setNotification] = useState<{
        message: string;
        type: 'success' | 'error' | 'info';
    } | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isProductPauseModalOpen, setIsProductPauseModalOpen] = useState(false);
    const [productToToggle, setProductToToggle] = useState<string | null>(null);

    const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
    const [newProductForm, setNewProductForm] = useState({
        product_id: '',
        product_name: '',
        category: '',
        hero_banner: '',
        source_link: '',
        store_id: 'EcoEstras',
        selling_price_zar: 0,
        supplier_cost_zar: 0,
        original_price_zar: 0,
        product_images: '',
        benefit: ['', '', ''],
        // variants: [[]] as { [key: string]: any }[][], // Array of variants, each is an array of attribute objects
        variants: [] as { [key: string]: string[] }[], // Now an array of objects
        faq: [{ question: '', answer: '' }],
        description_specifications: [{ title: '', info: '', image: '' }],
        comments: [] as any[], // Start empty, we'll add the first one in a useEffect or logic
    });

    const [isEditHomeModalOpen, setIsEditHomeModalOpen] = useState(false);
    const [homeForm, setHomeForm] = useState({
        hero: { product_id: '', banner: '', title1: '', title2: '', title3: '' },
        middlesection: { product_id: '', icon: '', title1: '', title2: '' },
        downleft: { product_id: '', icon: '', title1: '', title2: '' },
        downmiddle: { product_id: '', icon: '', title1: '', title2: '' },
        downright: { product_id: '', icon: '', title1: '', title2: '' }
    });

    // Auto-dismiss notification
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const [selectedSessionProduct, setSelectedSessionProduct] = useState<Product | null>(null);
    const [activeGraphMetric, setActiveGraphMetric] = useState<'visitor' | 'carter' | 'checkout'>('visitor');
    const [activeTimeRange, setActiveTimeRange] = useState<'7d' | '30d' | '3m' | '1y'>('7d');
    const [cardRanges, setCardRanges] = useState<{ [key: string]: 'today' | '7d' | '30d' | '1y' }>({
        Revenue: 'today',
        Sales: 'today',
        Orders: 'today',
        Sessions: 'today',
        'Total Checkout': 'today'
    });
    const [revenueGraphRange, setRevenueGraphRange] = useState<'7d' | '30d' | '3m' | '1y'>('7d');
    const [salesGraphRange, setSalesGraphRange] = useState<'7d' | '30d' | '3m' | '1y'>('7d');
    const [hoveredPoint, setHoveredPoint] = useState<{ x: number, y: number, value: number, label: string } | null>(null);
    const [hoveredFinancialPoint, setHoveredFinancialPoint] = useState<{ x: number, y: number, value: number, label: string, type: 'revenue' | 'sales' } | null>(null);
    const [lastSyncTime, setLastSyncTime] = useState<string>('');

    const [user, setUser] = useState<any>(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);
    const router = useRouter();

    // --- Authentication Guard ---
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('dashboard_token');
            if (!token) {
                router.push('/dashboard/login');
                return;
            }

            try {
                const userData = await getMe();
                setUser(userData);
                setIsAuthLoading(false);
            } catch (err) {
                console.error('Auth check failed:', err);
                logout();
                router.push('/dashboard/login');
            }
        };

        checkAuth();
    }, [router]);

    // Form persistence for draft
    useEffect(() => {
        if (isAddProductModalOpen) {
            const savedDraft = localStorage.getItem('test_product');
            if (savedDraft) {
                try {
                    const draft = JSON.parse(savedDraft);
                    setNewProductForm({
                        ...draft,
                        category: Array.isArray(draft.category) ? draft.category.join(', ') : draft.category,
                        product_images: Array.isArray(draft.product_images) ? draft.product_images.join(', ') : draft.product_images,
                        selling_price_zar: draft.pricing?.selling_price_zar || 0,
                        supplier_cost_zar: draft.pricing?.supplier_cost_zar || 0,
                        original_price_zar: draft.pricing?.original_price_zar || 0,
                        benefit: draft.benefit && draft.benefit.length === 3 ? draft.benefit : ['', '', ''],
                    });
                } catch (e) {
                    console.error('Error loading draft:', e);
                }
            } else {

                function generateProductId() {
                    return Math.random().toString(36).substring(2, 6) + "-" + Math.random().toString(36).substring(2, 14);
                }

                setNewProductForm({
                    ...newProductForm,
                    product_id: generateProductId(),
                })
            }
        }
    }, [isAddProductModalOpen]);

    useEffect(() => {
        setLastSyncTime(new Date().toLocaleTimeString());
    }, []);

    // Helper to get local YYYY-MM-DD string
    const getLocalDayStr = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Sessions statistics aggregation (Calculates for a specific range)
    const getStatsForRange = (range: 'today' | '7d' | '30d' | '3m' | '1y') => {
        let totalVisitors = 0;
        let totalCart = 0;
        let totalCheckout = 0;
        const productStats: { name: string, store: string, icon: string, visitors: number, totalVisitors: number, cart: number, totalCart: number, checkout: number, totalCheckout: number, raw: Product }[] = [];

        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

        const getRangeStart = (r: string) => {
            const date = new Date(startOfToday);
            if (r === '7d') date.setDate(date.getDate() - 7);
            else if (r === '30d') date.setDate(date.getDate() - 30);
            else if (r === '3m') date.setMonth(date.getMonth() - 3);
            else if (r === '1y') date.setFullYear(date.getFullYear() - 1);
            return r === 'today' ? startOfToday : date.getTime();
        };

        const rangeStart = getRangeStart(range);

        // Calculate Revenue & Sales from orders
        let totalSales = 0;
        let totalRevenue = 0;
        let totalOrders = 0;

        orders.forEach(order => {
            const orderDate = new Date(order.createdAt).getTime();
            if (orderDate >= rangeStart) {
                // Only count PAID orders for Revenue, Sales, and the Orders card
                if (order.status.payment === 'PAID') {
                    totalOrders++;
                    totalSales += order.total_amount || 0;
                    order.cart_bucket?.forEach(item => {
                        const profit = (item.pricing?.customer_totalprice || 0) - (item.pricing?.supplier_totalprice || 0);
                        totalRevenue += profit;
                    });
                }
            }
        });

        products.forEach(p => {
            const vCount = p.visitors?.filter(v => new Date(v.timestamp).getTime() >= rangeStart).length || 0;
            const cCount = p.cart_events?.filter(c => new Date(c.timestamp).getTime() >= rangeStart).length || 0;
            const chCount = p.checkout_events?.filter(ch => {
                const ts = new Date(ch.timestamp).getTime();
                const isMatch = ts >= rangeStart;
                if (range === 'today') {
                    console.log(`[Analytics] Product: ${p.product_name}, Event: ${ch.timestamp}, Match: ${isMatch}`);
                }
                return isMatch;
            }).length || 0;

            totalVisitors += vCount;
            totalCart += cCount;
            totalCheckout += chCount;

            productStats.push({
                name: p.product_name,
                store: p.store_id,
                icon: p.product_images[0],
                visitors: vCount,
                totalVisitors: p.visitors?.length || 0,
                cart: cCount,
                totalCart: p.cart_events?.length || 0,
                checkout: chCount,
                totalCheckout: p.checkout_events?.length || 0,
                raw: p
            });
        });

        console.log(`[Analytics] Range: ${range}, Total Checkout Today: ${totalCheckout}, RangeStart: ${new Date(rangeStart).toLocaleString()}`);

        productStats.sort((a, b) => b.visitors - a.visitors);

        return {
            totalVisitors,
            totalCart,
            totalCheckout,
            totalSales,
            totalRevenue,
            totalOrders,
            productStats,
            cartRate: totalVisitors > 0 ? ((totalCart / totalVisitors) * 100).toFixed(1) : '0',
            checkoutRate: totalCart > 0 ? ((totalCheckout / totalCart) * 100).toFixed(1) : '0',
            overallRate: totalVisitors > 0 ? ((totalCheckout / totalVisitors) * 100).toFixed(1) : '0'
        };
    };

    // Calculate all range buckets for independent cards
    const statsToday = getStatsForRange('today');
    const stats7d = getStatsForRange('7d');
    const stats30d = getStatsForRange('30d');
    const stats3m = getStatsForRange('3m');
    const stats1y = getStatsForRange('1y');

    // Stats for the Sessions tab specifically (Product Engagement list)
    const stats = activeTimeRange === '7d' ? stats7d : activeTimeRange === '30d' ? stats30d : activeTimeRange === '3m' ? stats3m : stats1y;

    const getCardData = (label: string) => {
        const range = cardRanges[label] || 'today';
        const current = range === 'today' ? statsToday : range === '7d' ? stats7d : range === '30d' ? stats30d : stats1y;
        const annual = stats1y;

        let val: any = 0;
        let annualVal: any = 0;
        let prefix = '';

        if (label === 'Revenue') { val = current.totalRevenue; annualVal = annual.totalRevenue; prefix = 'R'; }
        else if (label === 'Sales') { val = current.totalSales; annualVal = annual.totalSales; prefix = 'R'; }
        else if (label === 'Orders') { val = current.totalOrders; annualVal = annual.totalOrders; }
        else if (label === 'Sessions') { val = current.totalVisitors; annualVal = annual.totalVisitors; }
        else if (label === 'Total Checkout') { val = current.totalCheckout; annualVal = annual.totalCheckout; }

        const percentage = annualVal > 0 ? Math.min(Math.round((val / annualVal) * 100), 100) : (val > 0 ? 100 : 0);

        return {
            value: typeof val === 'number' ? `${prefix}${Math.round(val).toLocaleString()}` : val,
            percentage,
            range
        };
    };

    // Helper for graph data
    const generateGraphData = (product: Product, type: 'visitor' | 'carter' | 'checkout', range: '7d' | '30d' | '3m' | '1y') => {
        const events = type === 'visitor' ? product.visitors : type === 'carter' ? product.cart_events : product.checkout_events;

        let days = 7;
        if (range === '30d') days = 30;
        else if (range === '3m') days = 90;
        else if (range === '1y') days = 365;

        const data = [];
        const now = new Date();

        for (let i = days; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const dateStr = getLocalDayStr(date);

            const count = events?.filter(e => {
                const eDate = getLocalDayStr(new Date(e.timestamp));
                return eDate === dateStr;
            }).length || 0;

            data.push({
                label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                value: count,
                fullDate: dateStr
            });
        }
        return data;
    };

    // Helper for financial graph data
    const generateFinancialGraphData = (type: 'revenue' | 'sales', range: '7d' | '30d' | '3m' | '1y') => {
        let days = 7;
        if (range === '30d') days = 30;
        else if (range === '3m') days = 90;
        else if (range === '1y') days = 365;

        const data = [];
        const now = new Date();

        for (let i = days; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const dateStr = getLocalDayStr(date);

            let dayTotal = 0;

            orders.forEach(order => {
                const orderDateStr = getLocalDayStr(new Date(order.createdAt));
                if (orderDateStr === dateStr && order.status.payment === 'PAID') {
                    if (type === 'sales') {
                        dayTotal += order.total_amount || 0;
                    } else if (type === 'revenue') {
                        order.cart_bucket?.forEach(item => {
                            const profit = (item.pricing?.customer_totalprice || 0) - (item.pricing?.supplier_totalprice || 0);
                            dayTotal += profit;
                        });
                    }
                }
            });

            data.push({
                label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                value: dayTotal,
                fullDate: dateStr
            });
        }
        return data;
    };

    // Helper for smoothing SVG paths (Catmull-Rom Spline)
    const getSmoothPath = (points: { x: number, y: number }[]) => {
        if (points.length < 2) return '';
        let d = `M ${points[0].x},${points[0].y}`;
        for (let i = 0; i < points.length - 1; i++) {
            const p0 = points[i === 0 ? i : i - 1];
            const p1 = points[i];
            const p2 = points[i + 1];
            const p3 = i + 2 < points.length ? points[i + 2] : p2;

            const cp1x = p1.x + (p2.x - p0.x) / 6;
            const cp1y = p1.y + (p2.y - p0.y) / 6;
            const cp2x = p2.x - (p3.x - p1.x) / 6;
            const cp2y = p2.y - (p3.y - p1.y) / 6;

            d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
        }
        return d;
    };

    // Helper for rendering financial graphs
    const renderFinancialGraph = (type: 'revenue' | 'sales', range: '7d' | '30d' | '3m' | '1y', setRange: (r: any) => void) => {
        const gData = generateFinancialGraphData(type, range);
        const rawMax = Math.max(...gData.map(d => d.value), 0);
        const max = rawMax === 0 ? 5000 : rawMax <= 1000 ? 1000 : rawMax <= 5000 ? 5000 : Math.ceil(rawMax / 5000) * 5000;

        const points = gData.map((d, i) => {
            const x = (i / (gData.length - 1)) * 100;
            const y = 100 - (d.value / max) * 85;
            return { x, y, value: d.value, label: d.label };
        });

        const pathD = getSmoothPath(points);
        const areaD = `${pathD} L 100,100 L 0,100 Z`;
        const strokeColor = type === 'revenue' ? '#9333EA' : '#4F46E5';

        return (
            <div className="bg-white rounded-[2rem] p-8 shadow-soft border border-gray-50 flex flex-col h-full transition-all hover:shadow-xl">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-1">{type}</h3>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{type === 'revenue' ? 'Profit' : 'Gross Sales'} over time</p>
                    </div>
                    <button
                        onClick={() => {
                            const ranges: ('7d' | '30d' | '3m' | '1y')[] = ['7d', '30d', '3m', '1y'];
                            const next = ranges[(ranges.indexOf(range) + 1) % ranges.length];
                            setRange(next);
                        }}
                        className="px-4 py-1.5 rounded-full border border-gray-900 text-[8px] font-black uppercase tracking-widest text-gray-600 hover:bg-gray-900 hover:text-white transition-all active:scale-95"
                    >
                        {range === '7d' ? 'Weekly' : range === '30d' ? '30 Days' : range === '3m' ? '3 Months' : '1 Year'} Trend
                    </button>
                </div>

                <div className="relative h-[250px] w-full bg-gray-50/50 rounded-3xl p-6 overflow-hidden group/graph">
                    {/* Y-Axis Labels */}
                    <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none pb-12">
                        {[max, max / 2, 0].map((val, idx) => (
                            <div key={idx} className="flex items-center gap-4">
                                <span className="text-[7px] font-black text-gray-400 w-8 text-right">R{Math.round(val)}</span>
                                <div className="flex-1 h-[1px] bg-gray-200/50" />
                            </div>
                        ))}
                    </div>

                    {/* X-Axis Labels */}
                    <div className="absolute left-10 right-10 bottom-4 flex justify-between pointer-events-none">
                        {points.filter((_, i) => {
                            const total = points.length;
                            if (total <= 7) return true;
                            return i % Math.floor(total / 4) === 0 || i === total - 1;
                        }).map((p, i) => (
                            <span key={i} className="text-[7px] font-black text-gray-400 uppercase">
                                {p.label}
                            </span>
                        ))}
                    </div>

                    {/* Graph Area Container */}
                    <div className="absolute inset-0 pt-6 pb-12 px-10">
                        <div className="relative w-full h-full">
                            <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id={`financialGradient${type}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={strokeColor} stopOpacity="0.15" />
                                        <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                <path d={areaD} fill={`url(#financialGradient${type})`} className="transition-all duration-700" />
                                <path
                                    d={pathD}
                                    fill="none"
                                    stroke={strokeColor}
                                    strokeWidth="0.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="transition-all duration-700"
                                />
                            </svg>

                            {/* Interaction Dots - Rendered as CSS elements for perfect roundness */}
                            {points.map((p, i) => {
                                const dotSpacing = Math.max(Math.floor(gData.length / 10), 1);
                                const isKeyPoint = i % dotSpacing === 0 || i === points.length - 1;
                                return (
                                    <div key={i}>
                                        {/* Invisible larger hover area */}
                                        <div
                                            className="absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
                                            style={{ left: `${p.x}%`, top: `${p.y}%` }}
                                            onMouseEnter={() => setHoveredFinancialPoint({ ...p, type })}
                                            onMouseLeave={() => setHoveredFinancialPoint(null)}
                                        />
                                        {isKeyPoint && (
                                            <div
                                                className="absolute w-2 h-2 rounded-full bg-white border-2 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-500"
                                                style={{
                                                    left: `${p.x}%`,
                                                    top: `${p.y}%`,
                                                    borderColor: strokeColor,
                                                    boxShadow: `0 0 10px ${strokeColor}40`
                                                }}
                                            />
                                        )}
                                    </div>
                                );
                            })}

                            {/* Tooltip - Moved inside the same relative container for perfect coordinate alignment */}
                            {hoveredFinancialPoint && hoveredFinancialPoint.type === type && (
                                <div
                                    className="absolute z-10 bg-gray-900/95 backdrop-blur-md text-white px-3 py-1.5 rounded-xl shadow-2xl pointer-events-none flex flex-col items-center animate-in zoom-in-95 duration-200"
                                    style={{
                                        left: `${hoveredFinancialPoint.x}%`,
                                        top: `${hoveredFinancialPoint.y}%`,
                                        transform: 'translate(-50%, -120%)'
                                    }}
                                >
                                    <span className="text-[10px] font-black">R{Math.round(hoveredFinancialPoint.value).toLocaleString()}</span>
                                    <span className="text-[7px] font-bold text-gray-400 uppercase tracking-tighter">{hoveredFinancialPoint.label}</span>
                                    <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Helper for generating random footprints (e.g. q7ss-29x9spq21m)
    const generateFootprint = () => {
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        const gen = (len: number) => Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
        return `${gen(4)}-${gen(10)}`;
    };

    // Initialize first comment if empty
    useEffect(() => {
        if (newProductForm.comments.length === 0 && isAddProductModalOpen) {
            setNewProductForm(prev => ({
                ...prev,
                comments: [{
                    name: '',
                    date: new Date().toISOString().split('T')[0],
                    comment: '',
                    picture: '',
                    footprint: generateFootprint()
                }]
            }));
        }
    }, [isAddProductModalOpen, newProductForm.comments.length]);

    // Helper functions for dynamic comments
    const addComment = () => {
        setNewProductForm(prev => ({
            ...prev,
            comments: [...prev.comments, {
                name: '',
                date: new Date().toISOString().split('T')[0], // Pre-fill with today's date too
                comment: '',
                picture: '',
                footprint: generateFootprint()
            }]
        }));
    };

    const updateComment = (index: number, field: string, value: any) => {
        const updated = [...newProductForm.comments];
        updated[index] = { ...updated[index], [field]: value };
        setNewProductForm(prev => ({ ...prev, comments: updated }));
    };

    const removeComment = (index: number) => {
        setNewProductForm(prev => ({
            ...prev,
            comments: prev.comments.filter((_, i) => i !== index)
        }));
    };

    const toggleOrderExpansion = (orderId: string) => {
        setExpandedOrders(prev => {
            const next = new Set(prev);
            if (next.has(orderId)) {
                next.delete(orderId);
            } else {
                next.add(orderId);
            }
            return next;
        });
    };

    const toggleProductOrderExpansion = (orderId: string) => {
        setExpandedProductOrders(prev => {
            const next = new Set(prev);
            if (next.has(orderId)) {
                next.delete(orderId);
            } else {
                next.add(orderId);
            }
            return next;
        });
    };

    const filteredRequests = requests.filter(req => {
        const matchesSearch =
            req.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            req.TrackId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            req.store_id?.toLowerCase().includes(searchQuery.toLowerCase());

        if (!matchesSearch) return false;

        if (activeFilter === 'all') return true;
        if (activeFilter === 'done') return req.status === 'DONE';
        if (activeFilter === 'undone') return req.status === 'PENDING';
        if (activeFilter === 'refunds') return req.refund === true;
        if (activeFilter === 'assist') return req.refund === false;
        return true;
    });

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.order_track_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customer?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.store_id?.toLowerCase().includes(searchQuery.toLowerCase());

        if (!matchesSearch) return false;

        if (activeFilter === 'all') return true;
        if (activeFilter === 'paid') return order.status.payment === 'PAID';
        if (activeFilter === 'unpaid') return order.status.payment === 'PENDING';
        if (activeFilter === 'unfulfilled') return order.status.fulfillment === 'UNFULFILLED';
        if (activeFilter === 'done') return order.status.fulfillment === 'FULFILLED';
        return true;
    });

    const fetchOrders = async () => {
        try {
            const data = await getOrders();
            setOrders(data || []);
            console.log(`[Dashboard] Fetched ${data?.length || 0} orders.`);
        } catch (err) {
            console.error('[Dashboard] Order fetch failed:', err);
        }
    };

    const fetchProducts = async () => {
        try {
            const data = await getAllProducts();
            setProducts(data || []);
            console.log(`[Dashboard] Fetched ${data?.length || 0} products.`);
            // Auto-select first product if none selected and data exists
            if (data && data.length > 0 && !selectedSessionProduct) {
                setSelectedSessionProduct(data[0]);
            }
        } catch (err) {
            console.error('[Dashboard] Product fetch failed:', err);
        }
    };

    useEffect(() => {
        if (isAuthLoading) return; // Don't load data until auth is complete

        const loadDashboard = async () => {
            setLoading(true);
            setFilter('all');

            if (activeTab === 'assistant') {
                await fetchRequests();
            } else if (activeTab === 'orders') {
                await fetchOrders();
            } else if (activeTab === 'dashboard') {
                console.log('[Dashboard] Loading full layout...');
                // Wait for BOTH to complete before stopping spinner
                await Promise.all([fetchProducts(), fetchOrders()]);
            } else if (activeTab === 'products' || activeTab === 'sessions') {
                await fetchProducts();
            }

            setLoading(false);
        };

        loadDashboard();
    }, [activeTab, isAuthLoading]); // Add isAuthLoading to dependencies

    const fetchRequests = async () => {
        try {
            const data = await getAssistanceRequests();
            setRequests(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkDone = async (id: string) => {
        try {
            await markAssistanceDone(id);
            setRequests(prev => prev.map(r => r._id === id ? { ...r, status: 'DONE' } : r));
        } catch (err) {
            console.error(err);
            alert('Failed to mark as done');
        }
    };

    const handleCopyOrder = (order: Order) => {
        const text = `
Order: ${order.order_track_id}
Status: ${order.status.payment} | ${order.status.fulfillment}

PRODUCTS:
${order.cart_bucket.map(p => {
            const variantsStr = Array.isArray(p.variant)
                ? p.variant.map((v: any) => {
                    const key = Object.keys(v)[0];
                    return `${key}: ${v[key]}`;
                }).join(', ')
                : (p.variant?.color || 'N/A');

            return `- ${p.name} (${variantsStr})
  Qty: ${p.quantity}
  Selling: R${p.pricing.selling_price_zar}
  Vendor: R${p.pricing.supplier_cost_zar}
  Source: ${p.source_link}`;
        }).join('\n\n')}

CUSTOMER DETAILS:
Full Name: ${order.customer.name}
Email: ${order.customer.email}
Phone: ${order.customer.phone}
Address: ${order.customer.address}
City: ${order.customer.city}
Suburb: ${order.customer.suburb}
Postal Code: ${order.customer.postal_code}

Total Amount: R${order.total_amount}
`.trim();
        navigator.clipboard.writeText(text);
        alert('Order details copied to clipboard!');
    };

    const handleMarkFulfilled = async (id: string) => {
        try {
            await markOrderFulfilled(id);
            setOrders(prev => prev.map(o => o._id === id ? { ...o, status: { ...o.status, fulfillment: 'FULFILLED' } } : o));
        } catch (err) {
            console.error(err);
            alert('Failed to mark as fulfilled');
        }
    };

    const handleMarkPaid = async (id: string) => {
        try {
            await markOrderPaid(id);
            setOrders(prev => prev.map(o => o._id === id ? { ...o, status: { ...o.status, payment: 'PAID' } } : o));
        } catch (err) {
            console.error(err);
            alert('Failed to mark as paid');
        }
    };

    const handleDeleteOrder = (id: string) => {
        setDeleteModal({ isOpen: true, orderId: id, productId: null });
    };

    const handleDeleteProduct = (id: string) => {
        setDeleteModal({ isOpen: true, orderId: null, productId: id });
    };

    const handleTogglePause = async (id: string) => {
        try {
            await toggleProductPause(id);
            setProducts(prev => prev.map(p => p._id === id ? { ...p, paused: !p.paused } : p));
        } catch (err) {
            console.error(err);
            alert('Failed to update product status');
        }
    };



    const addAttribute = () => {
        // Add a default empty object to the single array
        setNewProductForm(prev => ({ ...prev, variants: [...prev.variants, { "": [] }] }));
    };



    const updateAttribute = (index: number, key: string, valueStr: string) => {
        const updated = [...newProductForm.variants];

        // Split the comma-separated input string into an actual array
        const valueArray = valueStr.split(',').map(v => v.trimStart());

        // Replace the old object with the newly updated key and array
        updated[index] = { [key]: valueArray };

        setNewProductForm(prev => ({ ...prev, variants: updated }));
    };




    const removeAttribute = (index: number) => {
        setNewProductForm(prev => ({
            ...prev,
            variants: prev.variants.filter((_, i) => i !== index)
        }));
    };

    const addFaq = () => setNewProductForm(prev => ({ ...prev, faq: [...prev.faq, { question: '', answer: '' }] }));
    const updateFaq = (index: number, field: string, value: string) => {
        const updated = [...newProductForm.faq];
        (updated[index] as any)[field] = value;
        setNewProductForm(prev => ({ ...prev, faq: updated }));
    };
    const removeFaq = (index: number) => setNewProductForm(prev => ({ ...prev, faq: prev.faq.filter((_, i) => i !== index) }));

    const addSpec = () => setNewProductForm(prev => ({ ...prev, description_specifications: [...prev.description_specifications, { title: '', info: '', image: '' }] }));
    const updateSpec = (index: number, field: string, value: string) => {
        const updated = [...newProductForm.description_specifications];
        (updated[index] as any)[field] = value;
        setNewProductForm(prev => ({ ...prev, description_specifications: updated }));
    };
    const removeSpec = (index: number) => setNewProductForm(prev => ({ ...prev, description_specifications: prev.description_specifications.filter((_, i) => i !== index) }));

    const handleCreateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formattedProduct = {
                ...newProductForm,
                category: newProductForm.category.split(',').map(c => c.trim()).filter(Boolean),
                product_images: newProductForm.product_images.split(',').map(c => c.trim()).filter(Boolean),
                benefit: newProductForm.benefit.filter(Boolean),
                pricing: {
                    original_price_zar: Number(newProductForm.original_price_zar),
                    selling_price_zar: Number(newProductForm.selling_price_zar),
                    supplier_cost_zar: Number(newProductForm.supplier_cost_zar),
                    estimated_profit: Number(newProductForm.selling_price_zar) - Number(newProductForm.supplier_cost_zar)
                },



                variants: newProductForm.variants.map(attr => {
                    // 1. Get the key (e.g., "Color")
                    const key = Object.keys(attr)[0];

                    // 2. Get the value (e.g., "Black, White" or ["Black", "White"])
                    const val = attr[key];

                    // 3. Process the value into a clean array
                    let processedVal = val;

                    if (typeof val === 'string') {
                        // Force TypeScript to treat this as a string safely
                        const strVal = String(val);
                        processedVal = strVal.includes(',')
                            ? strVal.split(',').map(v => v.trim()).filter(Boolean)
                            : [strVal.trim()].filter(Boolean);
                    }

                    // 4. Return the single object for your flat array
                    return { [key]: processedVal };
                }),

                comments: newProductForm.comments.map(c => ({
                    ...c,
                    date: c.date || new Date().toISOString().split('T')[0],
                    footprint: c.footprint || generateFootprint()
                })),
                paused: false
            };
            // Save to localStorage for preview
            localStorage.setItem('test_product', JSON.stringify(formattedProduct));
            router.push('/testproduct');
        } catch (err) {
            console.error('Error preparing preview:', err);
            alert('Error preparing product preview');
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = async () => {
        if (deleteModal.orderId) {
            try {
                await deleteOrder(deleteModal.orderId);
                setOrders(prev => prev.filter(o => o._id !== deleteModal.orderId));
                setDeleteModal({ isOpen: false, orderId: null, productId: null });
            } catch (err) {
                console.error(err);
                alert('Failed to delete order');
            }
        } else if (deleteModal.productId) {
            try {
                await deleteProduct(deleteModal.productId);
                setProducts(prev => prev.filter(p => p._id !== deleteModal.productId));
                setDeleteModal({ isOpen: false, orderId: null, productId: null });
            } catch (err) {
                console.error(err);
                alert('Failed to delete product');
            }
        }
    };

    if (isAuthLoading) {
        return (
            <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-6 relative overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-500/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-500/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />

                <div className="relative z-10 flex flex-col items-center gap-4">
                    <Loader2 className="text-blue-500 animate-spin" size={48} />
                    <div className="text-center">
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">Initializing Secure Protocol</p>
                        <p className="text-gray-600 text-[8px] font-bold uppercase tracking-[0.2em] mt-2">Accessing Founder Portal...</p>
                    </div>
                </div>

                {/* Aesthetic Grain Overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#F8F9FA] font-sans selection:bg-black selection:text-white">
            {/* Top Navigation Bar */}
            <header className="bg-[#121212] text-white">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-12">
                        <span className="text-xl font-black tracking-tighter uppercase font-heading">
                            ECOESTRAS
                        </span>

                        <nav className="hidden md:flex items-center gap-8">
                            {[
                                { id: 'dashboard', label: 'Dashbord', icon: LayoutDashboard },
                                { id: 'orders', label: 'Orders', icon: ShoppingBag },
                                { id: 'products', label: 'Products', icon: Box },
                                { id: 'sessions', label: 'Sessions', icon: Zap },
                                { id: 'assistant', label: 'Assistant', icon: Users },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`text-xs font-black uppercase tracking-widest transition-all px-4 py-2 rounded-full ${activeTab === tab.id
                                        ? 'bg-white/10 text-white shadow-lg backdrop-blur-md'
                                        : 'text-gray-400 hover:text-white'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black text-white uppercase tracking-tighter">
                                {user?.TagKey || 'SUP-XXXX'}
                            </span>
                            <div className="flex items-center gap-1.5 font-black text-blue-400 text-[8px] uppercase tracking-widest">
                                <div className="w-1 h-1 rounded-full bg-blue-400 animate-pulse" />
                                Live Sync
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                logout();
                                router.push('/dashboard/login');
                            }}
                            className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 text-gray-400 hover:text-white transition-all group/logout"
                            title="Logout"
                        >
                            <LogOut size={20} className="group-hover/logout:-translate-x-0.5 transition-transform" />
                        </button>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-6 py-10">
                {/* Analytics Section */}
                <section className="mb-12">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-gray-900 font-heading">
                            ANALYTICS
                        </h2>
                        <div className="flex items-center gap-4">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 flex items-center gap-2">
                                <Clock size={10} /> Last Sync: {lastSyncTime}
                            </p>
                            <button
                                onClick={async () => {
                                    setLoading(true);
                                    await Promise.all([fetchOrders(), fetchProducts()]);
                                    setLastSyncTime(new Date().toLocaleTimeString());
                                    setLoading(false);
                                }}
                                className="p-2.5 bg-black text-white rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2 text-[9px] font-black uppercase tracking-widest"
                                title="Sync Data"
                            >
                                <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> Sync Now
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {['Revenue', 'Sales', 'Orders', 'Sessions', 'Total Checkout'].map((label, i) => {
                            const { value, percentage, range } = getCardData(label);
                            return (
                                <div key={i} className="bg-[#1E2128] rounded-2xl p-6 text-white border border-white/5 relative overflow-hidden group">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="relative w-12 h-12 flex items-center justify-center">
                                            <svg className="w-full h-full transform -rotate-90">
                                                <circle
                                                    cx="24"
                                                    cy="24"
                                                    r="20"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                    fill="transparent"
                                                    className="text-white/10"
                                                />
                                                <circle
                                                    cx="24"
                                                    cy="24"
                                                    r="20"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                    fill="transparent"
                                                    strokeDasharray={125.6}
                                                    strokeDashoffset={125.6 * (1 - percentage / 100)}
                                                    className="text-white shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-1000"
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-[10px] font-black">{percentage}%</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                const ranges: ('today' | '7d' | '30d' | '1y')[] = ['today', '7d', '30d', '1y'];
                                                const next = ranges[(ranges.indexOf(range) + 1) % ranges.length];
                                                setCardRanges(prev => ({ ...prev, [label]: next }));
                                            }}
                                            className="text-[8px] font-black uppercase bg-white/5 px-2 py-1 rounded-full border border-white/10 hover:bg-white/10 transition-all"
                                        >
                                            {range === 'today' ? 'Today' : range === '7d' ? 'Weekly' : range === '30d' ? '30 Days' : '1 Year'}
                                        </button>
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">{label}</p>
                                    <p className="text-xl font-black font-heading">{value}</p>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Content Section */}
                <section>
                    <div className="flex flex-wrap items-center justify-between gap-6 mb-8">
                        <div className="flex flex-wrap items-center gap-4">
                            <button className="px-6 py-2.5 rounded-full border-2 border-black text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-md">
                                New Notification
                            </button>

                            {/* Search Bar */}
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={14} />
                                <input
                                    type="text"
                                    placeholder="Search by Track ID, Name or Email..."
                                    className="pl-11 pr-6 py-2.5 rounded-full border-2 border-gray-100 bg-white text-[10px] font-bold text-gray-900 focus:outline-none focus:border-black transition-all w-64 md:w-80 shadow-sm"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="flex flex-wrap items-center gap-2">
                            {activeTab === 'assistant' ? [
                                { id: 'all', label: 'All' },
                                { id: 'undone', label: 'Undone' },
                                { id: 'done', label: 'Done' },
                                { id: 'refunds', label: 'Refunds' },
                                { id: 'assist', label: 'Assist' },
                            ].map((filter) => (
                                <button
                                    key={filter.id}
                                    onClick={() => setFilter(filter.id as any)}
                                    className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${activeFilter === filter.id
                                        ? 'bg-black text-white border-black shadow-lg scale-105'
                                        : 'bg-white text-gray-500 border-gray-100 hover:border-gray-300'
                                        }`}
                                >
                                    {filter.label}
                                </button>
                            )) : [
                                { id: 'all', label: 'All' },
                                { id: 'unfulfilled', label: `(${orders.filter(e => e.status.fulfillment === "UNFULFILLED").length})Pending` },
                                { id: 'done', label: 'Fulfilled' },
                                { id: 'paid', label: 'Paid' },
                                { id: 'unpaid', label: 'Unpaid' },
                            ].map((filter) => (
                                <button
                                    key={filter.id}
                                    onClick={() => setFilter(filter.id as any)}
                                    className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${activeFilter === filter.id
                                        ? 'bg-black text-white border-black shadow-lg scale-105'
                                        : 'bg-white text-gray-500 border-gray-100 hover:border-gray-300'
                                        }`}
                                >
                                    {filter.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {activeTab === 'dashboard' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {renderFinancialGraph('revenue', revenueGraphRange, setRevenueGraphRange)}
                            {renderFinancialGraph('sales', salesGraphRange, setSalesGraphRange)}

                            {/* Additional Dashboard Overview */}
                            <div className="lg:col-span-2 bg-[#121212] rounded-[2rem] p-10 text-white overflow-hidden relative group">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/10 transition-all duration-700" />
                                <div className="relative z-10">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-2">Performance Overview</h4>
                                    <p className="text-2xl font-black font-heading mb-6">Your store is currently seeing a <span className="text-green-400">+{stats30d.overallRate}%</span> conversion rate this month.</p>
                                    <div className="flex gap-4">
                                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex-1">
                                            <p className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-1">Top Performer</p>
                                            <p className="text-xs font-black uppercase">{stats.productStats[0]?.name || 'N/A'}</p>
                                        </div>
                                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex-1">
                                            <p className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-1">Active Store</p>
                                            <p className="text-xs font-black uppercase">PAP PLUS • LOCAL</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Overview Footer to match design */}
                            <div className="lg:col-span-2 pt-12 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-900 mb-4">Overview</h4>
                                    <p className="text-[9px] font-bold text-gray-400 leading-relaxed uppercase tracking-widest">
                                        Monitor your store's total financial health. Revenue tracks your estimated profit while Sales shows the gross order volume.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-900 mb-4">Performance Goal</h4>
                                    <p className="text-[9px] font-bold text-gray-400 leading-relaxed uppercase tracking-widest">
                                        Aim for a consistent 3%+ conversion rate. High checkout rates indicate strong product intent and correct pricing.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'assistant' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {loading ? (
                                <div className="col-span-full py-20 text-center text-gray-400 font-black uppercase tracking-[0.3em]">
                                    Loading requests...
                                </div>
                            ) : filteredRequests.length === 0 ? (
                                <div className="col-span-full py-20 text-center text-gray-400 font-black uppercase tracking-[0.3em]">
                                    No {activeFilter === 'all' ? '' : activeFilter} requests found
                                </div>
                            ) : (
                                filteredRequests.map((req) => (
                                    <div
                                        key={req._id}
                                        className={`bg-white rounded-2xl p-8 shadow-soft border relative group transition-all duration-500 hover:shadow-xl ${req.status === 'DONE' ? 'opacity-60 saturate-50' : 'border-gray-50'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between mb-6">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-black text-gray-900 text-sm tracking-tight">{req.email}</h3>
                                                    <div className="flex items-center gap-1 text-[8px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 uppercase tracking-tighter">
                                                        <CheckCircle2 size={8} /> Verified
                                                    </div>
                                                    <span className="text-[8px] font-black bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full border border-gray-200 uppercase tracking-tighter">
                                                        {req.store_id || 'pap-plus'}
                                                    </span>
                                                </div>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                    {req.Day}/{req.Month}/{req.Year} - {req.Number}
                                                </p>

                                            </div>
                                            {req.status === 'DONE' && (
                                                <div className="bg-green-50 text-green-600 p-2 rounded-full border border-green-100">
                                                    <CheckCircle2 size={16} />
                                                </div>
                                            )}
                                        </div>

                                        <div className="mb-6">
                                            <span className={`inline-block px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 shadow-sm ${req.refund ? 'bg-black text-white' : 'bg-gray-100 text-gray-900 border border-gray-200'
                                                }`}>
                                                {req.refund ? 'refund' : 'Assistant'}
                                            </span>
                                            <p className="text-xs font-bold text-gray-600 leading-relaxed bg-[#F8F9FA] p-5 rounded-2xl border border-gray-50 italic">
                                                "{req.Message}"
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-50">
                                            {req.TrackId ? (
                                                <span className="bg-gray-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">
                                                    {req.TrackId}
                                                </span>
                                            ) : (
                                                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest flex items-center gap-2">
                                                    <AlertCircle size={12} /> No Track ID
                                                </span>
                                            )}

                                            {req.status === 'PENDING' && (
                                                <button
                                                    onClick={() => handleMarkDone(req._id)}
                                                    className="bg-[#32363D] hover:bg-black text-white px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-md group-hover:scale-105 active:scale-95"
                                                >
                                                    Done
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'orders' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
                            {loading ? (
                                <div className="col-span-full py-20 text-center text-gray-400 font-black uppercase tracking-[0.3em]">
                                    Loading orders...
                                </div>
                            ) : filteredOrders.length === 0 ? (
                                <div className="col-span-full py-20 text-center text-gray-400 font-black uppercase tracking-[0.3em]">
                                    No {activeFilter === 'all' ? '' : activeFilter} orders found
                                </div>
                            ) : (
                                filteredOrders.map((order) => (
                                    <div
                                        key={order._id}
                                        className={`bg-white rounded-[2rem] p-6 shadow-soft border flex flex-col transition-all hover:shadow-xl ${order.status.fulfillment === 'FULFILLED' ? 'opacity-60 grayscale-[0.5]' : 'border-gray-50'
                                            }`}
                                    >
                                        {/* Header: Track ID & Status */}
                                        <div className="mb-6">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-sm font-black text-gray-900 tracking-tighter">
                                                    {order.order_track_id}
                                                </span>
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => handleCopyOrder(order)}
                                                        className="p-2 rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
                                                        title="Copy all details"
                                                    >
                                                        <Box size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteOrder(order._id)}
                                                        className="p-2 rounded-full hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors"
                                                        title="Delete order"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${order.status.payment === 'PAID' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'
                                                    }`}>
                                                    {order.status.payment}
                                                </span>
                                                <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${order.status.fulfillment === 'FULFILLED' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-orange-50 text-orange-600 border border-orange-100'
                                                    }`}>
                                                    {order.status.fulfillment}
                                                </span>
                                                <span className="px-3 py-1 rounded-full text-[8px] font-black bg-gray-100 text-gray-400 border border-gray-200 uppercase tracking-widest">
                                                    {order.store_id || 'ecoestras'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Products Array */}
                                        <div className="mb-8">
                                            <button
                                                onClick={() => toggleProductOrderExpansion(order._id)}
                                                className="w-full flex items-center justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-2 mb-4 hover:text-gray-900 transition-colors"
                                            >
                                                <span>Products ({order.cart_bucket?.length || 0})</span>
                                                {expandedProductOrders.has(order._id) ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                            </button>

                                            {!expandedProductOrders.has(order._id) && order.cart_bucket?.length > 0 && (
                                                <div className="flex items-center gap-4 py-2">
                                                    <div className="flex -space-x-4 overflow-hidden">
                                                        {order.cart_bucket.slice(0, 3).map((item: any, idx: number) => (
                                                            <div key={idx} className="inline-block h-10 w-10 rounded-xl ring-4 ring-white bg-gray-50 border border-gray-100 relative overflow-hidden">
                                                                <img src={item.product_icon} alt="" className="w-full h-full object-cover" />
                                                            </div>
                                                        ))}
                                                        {order.cart_bucket.length > 3 && (
                                                            <div className="inline-block h-10 w-10 rounded-xl ring-4 ring-white bg-black flex items-center justify-center text-[10px] font-black text-white">
                                                                +{order.cart_bucket.length - 3}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                        {order.cart_bucket.length} Items
                                                    </p>
                                                </div>
                                            )}

                                            {expandedProductOrders.has(order._id) && (
                                                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                                    {order.cart_bucket?.map((item, idx) => (
                                                        <div key={idx} className="bg-gray-50 rounded-2xl p-4 space-y-3">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-xl overflow-hidden border border-gray-200 flex-shrink-0 bg-white relative">
                                                                    <img src={item.product_icon} alt="" className="w-full h-full object-cover" />
                                                                    <div className="absolute top-0 right-0 bg-black text-white text-[6px] w-3 h-3 flex items-center justify-center rounded-bl-lg font-black">{item.quantity}</div>
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <p className="text-[10px] font-black text-gray-900 truncate uppercase">{item.name}</p>
                                                                    <div className="flex flex-wrap gap-1">
                                                                        {Array.isArray(item.variant) ? (
                                                                            item.variant.map((v: any, i: number) => {
                                                                                const key = Object.keys(v)[0];
                                                                                return (
                                                                                    <span key={i} className="text-[8px] font-bold text-gray-500 uppercase tracking-wider">
                                                                                        {i > 0 && "• "} {key}: {v[key]}
                                                                                    </span>
                                                                                );
                                                                            })
                                                                        ) : (
                                                                            <span className="text-[8px] font-bold text-gray-500 uppercase tracking-wider">
                                                                                {item.variant?.color} {item.variant?.total_strips ? `• ${item.variant.total_strips} Strips` : ""}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="grid grid-cols-2 gap-2 text-[8px] font-black uppercase tracking-tighter">
                                                                <div className="bg-white p-2 rounded-lg border border-gray-100">
                                                                    <p className="text-gray-400 mb-0.5 text-[7px]">Vendor Price</p>
                                                                    <p className="text-gray-900">R{item.pricing?.supplier_cost_zar}</p>
                                                                </div>
                                                                <div className="bg-white p-2 rounded-lg border border-gray-100">
                                                                    <p className="text-gray-400 mb-0.5 text-[7px]">Selling Price</p>
                                                                    <p className="text-black">R{item.pricing?.selling_price_zar}</p>
                                                                </div>
                                                                <div className="bg-white p-2 rounded-lg border border-gray-100">
                                                                    <p className="text-gray-400 mb-0.5 text-[7px]">Vendor Total</p>
                                                                    <p className="text-gray-900">R{item.pricing?.supplier_totalprice}</p>
                                                                </div>
                                                                <div className="bg-white p-2 rounded-lg border border-gray-100">
                                                                    <p className="text-gray-400 mb-0.5 text-[7px]">Customer Total</p>
                                                                    <p className="text-green-600">R{item.pricing?.customer_totalprice}</p>
                                                                </div>
                                                            </div>

                                                            <a
                                                                href={item.source_link}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="block w-full text-center py-2 bg-white border border-dashed border-gray-300 rounded-xl text-[8px] font-black text-gray-400 hover:text-black hover:border-black transition-all uppercase tracking-widest"
                                                            >
                                                                View Source Link
                                                            </a>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Customer Details */}
                                        <div className="mb-8">
                                            <button
                                                onClick={() => toggleOrderExpansion(order._id)}
                                                className="w-full flex items-center justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-2 mb-4 hover:text-gray-900 transition-colors"
                                            >
                                                <span>Customer Details</span>
                                                {expandedOrders.has(order._id) ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                            </button>

                                            {expandedOrders.has(order._id) && (
                                                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                                    <div>
                                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Full Name</p>
                                                        <p className="text-xs font-black text-gray-900">{order.customer.name}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Email Address</p>
                                                        <p className="text-xs font-black text-gray-900">{order.customer.email}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Phone Number</p>
                                                        <p className="text-xs font-black text-gray-900">{order.customer.phone}</p>
                                                    </div>
                                                    <div className="bg-gray-50 p-4 rounded-2xl space-y-3">
                                                        <div>
                                                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Street Address</p>
                                                            <p className="text-[10px] font-bold text-gray-600 leading-tight">{order.customer.address}</p>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">City</p>
                                                                <p className="text-[10px] font-bold text-gray-600">{order.customer.city}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Suburb</p>
                                                                <p className="text-[10px] font-bold text-gray-600">{order.customer.suburb}</p>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Postal Code</p>
                                                            <p className="text-[10px] font-bold text-gray-600">{order.customer.postal_code}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Action Footer */}
                                        <div className="pt-6 border-t border-gray-50 mt-auto">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Received</span>
                                                <span className="text-xl font-black text-gray-900 font-heading">R{order.total_amount}</span>
                                            </div>
                                            <div className="flex justify-end mb-6">
                                                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">
                                                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </p>
                                            </div>

                                            <div className="space-y-3">
                                                {order.status.payment === 'PENDING' && (
                                                    <button
                                                        onClick={() => handleMarkPaid(order._id)}
                                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                                                    >
                                                        <CreditCard size={14} /> Mark as Paid
                                                    </button>
                                                )}

                                                {order.status.fulfillment === 'UNFULFILLED' && (
                                                    <button
                                                        onClick={() => handleMarkFulfilled(order._id)}
                                                        className="w-full bg-[#121212] hover:bg-black text-white py-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                                                    >
                                                        <ShoppingBag size={14} /> Mark as Fulfilled
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'products' && (
                        <>
                            <div className="flex justify-between items-center mb-10">
                                <h2 className="text-sm font-black uppercase tracking-[0.3em] text-gray-900 font-heading">
                                    Inventory Management
                                </h2>
                                <div className="flex gap-4">
                                    <button
                                        onClick={async () => {
                                            try {
                                                const data = await getHomepage();
                                                if (data && data.hero) {
                                                    setHomeForm(data);
                                                }
                                                setIsEditHomeModalOpen(true);
                                            } catch (err) {
                                                console.error(err);
                                                setIsEditHomeModalOpen(true); // Open even if empty
                                            }
                                        }}
                                        className="bg-white border-2 border-black text-black px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg hover:bg-gray-50 transition-all active:scale-95 flex items-center gap-2"
                                    >
                                        <Settings size={14} /> Edit Homepage
                                    </button>
                                    <button
                                        onClick={() => setIsAddProductModalOpen(true)}
                                        className="bg-black text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-105 transition-all active:scale-95 flex items-center gap-2"
                                    >
                                        <Plus size={14} /> Add Product
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
                                {loading ? (
                                    <div className="col-span-full py-20 text-center text-gray-400 font-black uppercase tracking-[0.3em]">
                                        Loading products...
                                    </div>
                                ) : products.length === 0 ? (
                                    <div className="col-span-full py-20 text-center text-gray-400 font-black uppercase tracking-[0.3em]">
                                        No products found
                                    </div>
                                ) : (
                                    products.filter(p => p.product_name.toLowerCase().includes(searchQuery.toLowerCase())).map((product) => (
                                        <div
                                            key={product._id}
                                            className={`bg-white rounded-2xl p-6 shadow-xl border flex flex-col transition-all hover:shadow-2xl hover:scale-[1.02] ${product.paused ? 'opacity-60 grayscale-[0.5]' : 'border-gray-50'}`}
                                        >
                                            <div className="relative aspect-square rounded-2xl overflow-hidden mb-6 bg-gray-100 group">
                                                <img src={product.product_images[0]} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                                {product.paused && (
                                                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                                                        <span className="text-white text-[10px] font-black uppercase tracking-widest bg-black/50 px-4 py-2 rounded-full border border-white/20">PAUSED</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-[8px] font-black bg-gray-100 text-gray-500 px-2 py-1 rounded-full uppercase tracking-widest border border-gray-200">
                                                        {product.store_id}
                                                    </span>
                                                    <button
                                                        onClick={() => handleDeleteProduct(product._id)}
                                                        className="p-2 rounded-full hover:bg-red-50 text-red-400 transition-colors"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                                <div className="flex items-center justify-between mb-4">
                                                    <div>
                                                        <h3 className="text-sm font-black text-gray-900 uppercase truncate">{product.product_name}</h3>
                                                        <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{product.category.join(' • ')}</p>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-3 mb-8">
                                                    <div className="bg-gray-50 p-3 rounded-2xl">
                                                        <p className="text-[7px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Original</p>
                                                        <p className="text-[10px] font-black text-gray-300 line-through">R{product.pricing.original_price_zar}</p>
                                                    </div>
                                                    <div className="bg-gray-50 p-3 rounded-2xl">
                                                        <p className="text-[7px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Selling</p>
                                                        <p className="text-[10px] font-black text-gray-900">R{product.pricing.selling_price_zar}</p>
                                                    </div>
                                                    <div className="bg-gray-50 p-3 rounded-2xl">
                                                        <p className="text-[7px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Cost</p>
                                                        <p className="text-[10px] font-black text-orange-600">R{product.pricing.supplier_cost_zar}</p>
                                                    </div>
                                                    <div className="bg-gray-50 p-3 rounded-2xl">
                                                        <p className="text-[7px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Profit</p>
                                                        <p className="text-[10px] font-black text-green-600">R{product.pricing.estimated_profit}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <button
                                                    onClick={() => handleTogglePause(product._id)}
                                                    className={`w-full py-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 ${product.paused
                                                        ? 'bg-green-600 hover:bg-green-700 text-white'
                                                        : 'bg-orange-500 hover:bg-orange-600 text-white'
                                                        }`}
                                                >
                                                    {product.paused ? (
                                                        <><Eye size={14} /> Resume Product</>
                                                    ) : (
                                                        <><EyeOff size={14} /> Pause Product</>
                                                    )}
                                                </button>

                                                <a
                                                    href={product.source_link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-full bg-white border-2 border-gray-100 hover:border-gray-200 text-gray-400 hover:text-gray-900 py-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all align-center flex items-center justify-center gap-2"
                                                >
                                                    <ExternalLink size={14} /> Source Link
                                                </a>

                                                <a
                                                    href={`/product/${product.product_id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-full bg-white border-2 border-gray-100 hover:border-gray-200 text-gray-400 hover:text-gray-900 py-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all align-center flex items-center justify-center gap-2"
                                                >
                                                    <ExternalLink size={14} /> Product Link
                                                </a>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </>
                    )}

                    {activeTab === 'sessions' && (
                        <div className="flex flex-col lg:flex-row gap-8 items-start relative min-h-[600px]">
                            {/* Left Side: Product List/Grid - Adjusted to 55% for better balance */}
                            <div className={`transition-all duration-500 ${selectedSessionProduct ? 'w-full lg:w-[55%]' : 'w-full'}`}>
                                <div className="flex justify-between items-center mb-10">
                                    <h2 className="text-sm font-black uppercase tracking-[0.3em] text-gray-900 font-heading">
                                        Product Engagement
                                    </h2>
                                    {!selectedSessionProduct && (
                                        <div className="bg-white border px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400">Total Store Traffic: <span className="text-black ml-1">{stats1y.totalVisitors}</span></div>
                                    )}
                                </div>

                                <div className={`grid gap-4 ${selectedSessionProduct ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
                                    {loading ? (
                                        <div className="col-span-full py-20 text-center text-gray-400 font-black uppercase tracking-[0.3em]">
                                            Loading analytics...
                                        </div>
                                    ) : stats.productStats.length === 0 ? (
                                        <div className="col-span-full py-20 text-center text-gray-400 font-black uppercase tracking-[0.3em]">
                                            No session data available
                                        </div>
                                    ) : (
                                        stats.productStats.map((p, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setSelectedSessionProduct(p.raw)}
                                                className={`bg-white rounded-xl p-6 shadow-xl border flex flex-col text-left transition-all hover:shadow-2xl hover:scale-[1.02] active:scale-95 group ${selectedSessionProduct?.product_id === p.raw.product_id ? 'ring-2 ring-black border-transparent shadow-2xl' : 'border-gray-50'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-4 mb-6">
                                                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0 bg-gray-50 focus-within:ring-2 focus-within:ring-black">
                                                        <img src={p.icon} alt="" className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h3 className="text-[10px] font-black text-gray-900 uppercase truncate mb-1">{p.name}</h3>
                                                        <span className="text-[8px] font-black bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full uppercase tracking-widest border border-gray-200">
                                                            {p.store}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-3 gap-2">
                                                    <div className="bg-blue-50/50 p-2 rounded-lg border border-blue-50">
                                                        <p className="text-[6px] font-black text-blue-400 uppercase tracking-widest mb-1 text-center">Visits</p>
                                                        <p className="text-[10px] font-black text-blue-600 text-center">{p.totalVisitors}</p>
                                                    </div>
                                                    <div className="bg-orange-50/50 p-2 rounded-lg border border-orange-50">
                                                        <p className="text-[6px] font-black text-orange-400 uppercase tracking-widest mb-1 text-center">Carter</p>
                                                        <p className="text-[10px] font-black text-orange-600 text-center">{p.totalCart}</p>
                                                    </div>
                                                    <div className="bg-green-50/50 p-2 rounded-lg border border-green-50">
                                                        <p className="text-[6px] font-black text-green-400 uppercase tracking-widest mb-1 text-center">Check</p>
                                                        <p className="text-[10px] font-black text-green-600 text-center">{p.totalCheckout}</p>
                                                    </div>
                                                </div>
                                            </button>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Right Side: Detailed Analytics Canvas - Wider as requested */}
                            {selectedSessionProduct && (
                                <div className="w-full lg:w-[45%] lg:sticky lg:top-8 bg-white rounded-2xl p-10 border border-gray-100 shadow-2xl animate-in slide-in-from-right-8 duration-700">
                                    <div className="flex justify-between items-center mb-10">
                                        <div>
                                            <h2 className="text-lg font-black text-gray-900 font-heading tracking-tight mb-1">
                                                {selectedSessionProduct.product_name}
                                            </h2>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Performance</p>
                                        </div>
                                        <button
                                            onClick={() => setSelectedSessionProduct(null)}
                                            className="p-3 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
                                            title="Close details"
                                        >
                                            <X size={24} />
                                        </button>
                                    </div>

                                    {/* Metric Toggles */}
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {[
                                            { id: 'visitor', label: 'Visitor', icon: Eye, activeClass: 'bg-blue-500 border-blue-500' },
                                            { id: 'carter', label: 'Carter', icon: ShoppingBag, activeClass: 'bg-orange-500 border-orange-500' },
                                            { id: 'checkout', label: 'Checkout', icon: Zap, activeClass: 'bg-green-500 border-green-500' },
                                        ].map((m) => (
                                            <button
                                                key={m.id}
                                                onClick={() => setActiveGraphMetric(m.id as any)}
                                                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${activeGraphMetric === m.id
                                                    ? `${m.activeClass} text-white shadow-lg`
                                                    : 'bg-white text-gray-400 border-gray-200 hover:border-black hover:text-black'
                                                    }`}
                                            >
                                                <m.icon size={10} /> {m.label}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="flex mb-8">
                                        <button
                                            onClick={() => {
                                                const ranges: ('7d' | '30d' | '3m' | '1y')[] = ['7d', '30d', '3m', '1y'];
                                                const nextIndex = (ranges.indexOf(activeTimeRange) + 1) % ranges.length;
                                                setActiveTimeRange(ranges[nextIndex]);
                                            }}
                                            className="px-4 py-1.5 rounded-full border border-gray-900 text-[8px] font-black uppercase tracking-widest text-gray-600 hover:bg-gray-900 hover:text-white transition-all active:scale-95"
                                        >
                                            {activeTimeRange === '7d' ? 'Weekly' : activeTimeRange === '30d' ? '30 Days' : activeTimeRange === '3m' ? '3 Months' : '1 Year'} Trend
                                        </button>
                                    </div>

                                    {/* Custom SVG Graph - Optimized for narrower width */}
                                    <div className="relative h-[280px] w-full bg-white border border-gray-50 rounded-3xl p-6 shadow-sm overflow-hidden mb-10 group/graph">
                                        {(() => {
                                            const gData = generateGraphData(selectedSessionProduct, activeGraphMetric, activeTimeRange);
                                            const rawMax = Math.max(...gData.map(d => d.value), 0);
                                            // Intelligent Max: Round up to nice intervals (2, 5, 10, 50, etc)
                                            const max = rawMax === 0 ? 5 : rawMax <= 5 ? 5 : rawMax <= 10 ? 10 : Math.ceil(rawMax / 10) * 10;

                                            const points = gData.map((d, i) => {
                                                const x = (i / (gData.length - 1)) * 100;
                                                const y = 100 - (d.value / max) * 85; // Leave 15% top margin
                                                return { x, y, value: d.value, label: d.label };
                                            });

                                            const pathD = getSmoothPath(points);
                                            const areaD = `${pathD} L 100,100 L 0,100 Z`;
                                            const strokeColor = activeGraphMetric === 'visitor' ? '#3B82F6' : activeGraphMetric === 'carter' ? '#F97316' : '#22C55E';

                                            return (
                                                <>
                                                    {/* Y-Axis Labels */}
                                                    <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none pb-12">
                                                        {[max, max / 2, 0].map((val, idx) => (
                                                            <div key={idx} className="flex items-center gap-4">
                                                                <span className="text-[9px] font-black text-gray-500 w-6 text-right">{Math.round(val)}</span>
                                                                <div className="flex-1 h-[1px] bg-gray-100" />
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* X-Axis Labels */}
                                                    <div className="absolute left-10 right-10 bottom-4 flex justify-between pointer-events-none">
                                                        {points.filter((_, i) => {
                                                            const total = points.length;
                                                            if (total <= 7) return true; // Show all for weekly
                                                            return i % Math.floor(total / 4) === 0 || i === total - 1;
                                                        }).map((p, i) => (
                                                            <span key={i} className="text-[8px] font-black text-gray-400 uppercase">
                                                                {p.label}
                                                            </span>
                                                        ))}
                                                    </div>

                                                    {/* Graph Area Container */}
                                                    <div className="absolute inset-0 pt-6 pb-12 px-10">
                                                        <div className="relative w-full h-full">
                                                            <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                                                                <defs>
                                                                    <linearGradient id={`graphGradient${activeGraphMetric}`} x1="0" y1="0" x2="0" y2="1">
                                                                        <stop offset="0%" stopColor={strokeColor} stopOpacity="0.15" />
                                                                        <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
                                                                    </linearGradient>
                                                                </defs>

                                                                {/* Area Fill */}
                                                                <path d={areaD} fill={`url(#graphGradient${activeGraphMetric})`} className="transition-all duration-700" />

                                                                {/* Main Line */}
                                                                <path
                                                                    d={pathD}
                                                                    fill="none"
                                                                    stroke={strokeColor}
                                                                    strokeWidth="0.8"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    className="transition-all duration-700"
                                                                />
                                                            </svg>

                                                            {/* Interaction Dots - CSS for perfect roundness */}
                                                            {points.map((p, i) => {
                                                                const dotSpacing = Math.max(Math.floor(gData.length / 10), 1);
                                                                const isKeyPoint = i % dotSpacing === 0 || i === points.length - 1;

                                                                return (
                                                                    <div key={i}>
                                                                        <div
                                                                            className="absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
                                                                            style={{ left: `${p.x}%`, top: `${p.y}%` }}
                                                                            onMouseEnter={() => setHoveredPoint(p)}
                                                                            onMouseLeave={() => setHoveredPoint(null)}
                                                                        />
                                                                        {isKeyPoint && (
                                                                            <div
                                                                                className="absolute w-1.5 h-1.5 rounded-full bg-white border shadow-sm -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-500"
                                                                                style={{
                                                                                    left: `${p.x}%`,
                                                                                    top: `${p.y}%`,
                                                                                    borderColor: strokeColor
                                                                                }}
                                                                            />
                                                                        )}
                                                                    </div>
                                                                );
                                                            })}

                                                            {/* Tooltip - Moved inside the same relative container for perfect coordinate alignment */}
                                                            {hoveredPoint && (
                                                                <div
                                                                    className="absolute z-10 bg-gray-900 text-white px-2 py-1 rounded-lg shadow-xl pointer-events-none flex flex-col items-center"
                                                                    style={{
                                                                        left: `${hoveredPoint.x}%`,
                                                                        top: `${hoveredPoint.y}%`,
                                                                        transform: 'translate(-50%, -120%)'
                                                                    }}
                                                                >
                                                                    <span className="text-[10px] font-black">{hoveredPoint.value}</span>
                                                                    <span className="text-[6px] uppercase opacity-50">{hoveredPoint.label}</span>
                                                                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-gray-900" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </>
                                            );
                                        })()}
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                                            <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-4">Conversion</h4>
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center bg-white p-3 rounded-2xl border border-gray-100">
                                                    <span className="text-[8px] font-black text-gray-400 uppercase">Cart Conv.</span>
                                                    <span className="text-sm font-black text-gray-900">
                                                        {(() => {
                                                            const pStats = stats.productStats.find(ps => ps.raw.product_id === selectedSessionProduct.product_id);
                                                            if (!pStats || pStats.visitors === 0) return '0.0';
                                                            return ((pStats.cart / pStats.visitors) * 100).toFixed(1);
                                                        })()}%
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center bg-white p-3 rounded-2xl border border-gray-100">
                                                    <span className="text-[8px] font-black text-gray-400 uppercase">Checkout Conv.</span>
                                                    <span className="text-sm font-black text-gray-900">
                                                        {(() => {
                                                            const pStats = stats.productStats.find(ps => ps.raw.product_id === selectedSessionProduct.product_id);
                                                            if (!pStats || pStats.cart === 0) return '0.0';
                                                            return ((pStats.checkout / pStats.cart) * 100).toFixed(1);
                                                        })()}%
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-black p-6 rounded-2xl text-white flex items-center justify-between">
                                            <div>
                                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">{activeTimeRange === '7d' ? 'Weekly' : activeTimeRange === '30d' ? '30d' : activeTimeRange === '3m' ? '3m' : '1y'} Success</p>
                                                <p className="text-2xl font-black text-white">
                                                    {(() => {
                                                        const pStats = stats.productStats.find(ps => ps.raw.product_id === selectedSessionProduct.product_id);
                                                        if (!pStats || pStats.visitors === 0) return '0.0';
                                                        return ((pStats.checkout / pStats.visitors) * 100).toFixed(1);
                                                    })()}%
                                                </p>
                                            </div>
                                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-green-400">
                                                <Zap size={20} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </section>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-300">
                        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                            <AlertCircle className="text-red-500" size={32} />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 text-center uppercase tracking-tighter mb-2 font-heading">
                            Delete Item?
                        </h3>
                        <p className="text-sm font-bold text-gray-400 text-center leading-relaxed mb-8">
                            Are you sure you want to delete this {deleteModal.orderId ? 'order' : 'product'}? This action <span className="text-red-500 underline decoration-red-200 decoration-2 underline-offset-4">cannot be undone</span>.
                        </p>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={confirmDelete}
                                className="w-full bg-[#121212] hover:bg-black text-white py-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95"
                            >
                                Confirm Delete
                            </button>
                            <button
                                onClick={() => setDeleteModal({ isOpen: false, orderId: null, productId: null })}
                                className="w-full bg-white border-2 border-gray-100 hover:border-gray-200 text-gray-400 hover:text-gray-900 py-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Product Modal */}
            {isAddProductModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl p-10 max-w-2xl w-full shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-300 overflow-y-auto max-h-[90vh]">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter font-heading">
                                Create New Product
                            </h3>
                            <button
                                onClick={() => setIsAddProductModalOpen(false)}
                                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateProduct} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Internal ID (unique)</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. vacuum-v1"
                                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-black focus:bg-white transition-all text-xs font-bold"
                                        value={newProductForm.product_id}
                                        onChange={e => setNewProductForm({ ...newProductForm, product_id: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Store Assignment</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. ecoestras"
                                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-black focus:bg-white transition-all text-xs font-bold"
                                        value={newProductForm.store_id}
                                        onChange={e => setNewProductForm({ ...newProductForm, store_id: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Display Name</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g. Portable Vacuum Cleaner"
                                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-black focus:bg-white transition-all text-xs font-bold"
                                    value={newProductForm.product_name}
                                    onChange={e => setNewProductForm({ ...newProductForm, product_name: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Categories (comma separated)</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="Cleaning, Electronics"
                                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-black focus:bg-white transition-all text-xs font-bold"
                                        value={newProductForm.category}
                                        onChange={e => setNewProductForm({ ...newProductForm, category: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Hero Image URL</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="Paste link here..."
                                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-black focus:bg-white transition-all text-xs font-bold"
                                        value={newProductForm.hero_banner}
                                        onChange={e => setNewProductForm({ ...newProductForm, hero_banner: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="bg-blue-50/30 p-8 rounded-[2rem] border border-blue-50/50 space-y-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-black">
                                        <Tag size={14} />
                                    </div>
                                    <h5 className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Pricing & Profitability</h5>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Original Price (ZAR)</label>
                                        <input
                                            type="number"
                                            placeholder="e.g. 599"
                                            className="w-full px-6 py-4 rounded-2xl bg-white border-2 border-transparent focus:border-black transition-all text-xs font-bold"
                                            value={newProductForm.original_price_zar}
                                            onChange={e => setNewProductForm({ ...newProductForm, original_price_zar: Number(e.target.value) })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Selling Price (ZAR)</label>
                                        <input
                                            required
                                            type="number"
                                            placeholder="e.g. 399"
                                            className="w-full px-6 py-4 rounded-2xl bg-white border-2 border-transparent focus:border-black transition-all text-xs font-bold"
                                            value={newProductForm.selling_price_zar}
                                            onChange={e => setNewProductForm({ ...newProductForm, selling_price_zar: Number(e.target.value) })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Supplier Cost (ZAR)</label>
                                        <input
                                            required
                                            type="number"
                                            placeholder="e.g. 150"
                                            className="w-full px-6 py-4 rounded-2xl bg-white border-2 border-transparent focus:border-black transition-all text-xs font-bold"
                                            value={newProductForm.supplier_cost_zar}
                                            onChange={e => setNewProductForm({ ...newProductForm, supplier_cost_zar: Number(e.target.value) })}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between px-6 py-4 bg-white rounded-2xl border border-blue-100/50">
                                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Live Profit Preview</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Est. Profit:</span>
                                        <span className="text-sm font-black text-green-600">
                                            R{(newProductForm.selling_price_zar - newProductForm.supplier_cost_zar).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Source Link (Vendor)</label>
                                <input
                                    type="text"
                                    placeholder="Aliexpress/Supplier link"
                                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-black focus:bg-white transition-all text-xs font-bold"
                                    value={newProductForm.source_link}
                                    onChange={e => setNewProductForm({ ...newProductForm, source_link: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Other Images (comma separated)</label>
                                <textarea
                                    placeholder="Paste URLs separated by commas..."
                                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-black focus:bg-white transition-all text-xs font-bold min-h-[80px]"
                                    value={newProductForm.product_images}
                                    onChange={e => setNewProductForm({ ...newProductForm, product_images: e.target.value })}
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Product Benefits (Add 3)</label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {[0, 1, 2].map((i) => (
                                        <input
                                            key={i}
                                            type="text"
                                            placeholder={`Benefit ${i + 1}`}
                                            className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-black focus:bg-white transition-all text-xs font-bold"
                                            value={newProductForm.benefit[i]}
                                            onChange={e => {
                                                const newBenefits = [...newProductForm.benefit];
                                                newBenefits[i] = e.target.value;
                                                setNewProductForm({ ...newProductForm, benefit: newBenefits });
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>


                            {/* Variants Section */}
                            <div className="space-y-4 pt-4">
                                <div className="flex justify-between items-center">
                                    <div className="space-y-1">
                                        <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Product Attributes</h4>
                                        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Manage your custom attributes (e.g., Color, Size)</p>
                                    </div>
                                    <button type="button" onClick={addAttribute} className="text-[10px] font-black text-blue-500 uppercase tracking-widest px-4 py-2 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors">
                                        + Add Attribute
                                    </button>
                                </div>

                                <div className="p-8 bg-gray-50 rounded-[2.5rem] space-y-6 relative group border border-gray-100/50 shadow-sm">
                                    <div className="grid grid-cols-1 gap-3">
                                        {newProductForm.variants.map((attr, index) => {
                                            const key = Object.keys(attr)[0] || "";

                                            // Join the array back into a string so the input field can display it correctly
                                            const valueArray = attr[key] || [];
                                            const value = Array.isArray(valueArray) ? valueArray.join(', ') : valueArray;

                                            return (
                                                <div key={index} className="flex gap-3 items-center group/attr bg-white p-3 rounded-2xl border border-gray-100">
                                                    <div className="flex-1 grid grid-cols-2 gap-3">
                                                        <div className="space-y-1">
                                                            <label className="text-[8px] font-black text-gray-300 uppercase tracking-[0.2em] ml-2">Label</label>
                                                            <input
                                                                placeholder="e.g. Color"
                                                                className="w-full px-4 py-2.5 rounded-xl border border-gray-50 bg-gray-50 focus:border-black focus:bg-white transition-all text-[10px] font-bold outline-none"
                                                                value={key}
                                                                onChange={e => updateAttribute(index, e.target.value, value)}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[8px] font-black text-gray-300 uppercase tracking-[0.2em] ml-2">Value (use commas for multiple)</label>
                                                            <input
                                                                placeholder="e.g. Black, White"
                                                                className="w-full px-4 py-2.5 rounded-xl border border-gray-50 bg-gray-50 focus:border-black focus:bg-white transition-all text-[10px] font-bold outline-none"
                                                                value={value}
                                                                onChange={e => updateAttribute(index, key, e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeAttribute(index)}
                                                        className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            );
                                        })}

                                        {newProductForm.variants.length === 0 && (
                                            <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-gray-300">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">No attributes added yet</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* FAQ Section */}
                            <div className="space-y-4 pt-4">
                                <div className="flex justify-between items-center">
                                    <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest">FAQ Items</h4>
                                    <button type="button" onClick={addFaq} className="text-[10px] font-black text-blue-500 uppercase tracking-widest">+ Add FAQ</button>
                                </div>
                                {newProductForm.faq.map((item, i) => (
                                    <div key={i} className="p-4 bg-gray-50 rounded-2xl space-y-3 relative group">
                                        <button type="button" onClick={() => removeFaq(i)} className="absolute top-4 right-4 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14} /></button>
                                        <input
                                            placeholder="Question"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black transition-all text-xs font-bold bg-white"
                                            value={item.question}
                                            onChange={e => updateFaq(i, 'question', e.target.value)}
                                        />
                                        <textarea
                                            placeholder="Answer"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black transition-all text-xs font-bold bg-white min-h-[60px]"
                                            value={item.answer}
                                            onChange={e => updateFaq(i, 'answer', e.target.value)}
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Specifications Section */}
                            <div className="space-y-4 pt-4">
                                <div className="flex justify-between items-center">
                                    <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Specifications & Description</h4>
                                    <button type="button" onClick={addSpec} className="text-[10px] font-black text-blue-500 uppercase tracking-widest">+ Add Item</button>
                                </div>
                                {newProductForm.description_specifications.map((spec, i) => (
                                    <div key={i} className="p-4 bg-gray-50 rounded-2xl space-y-3 relative group">
                                        <button type="button" onClick={() => removeSpec(i)} className="absolute top-4 right-4 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14} /></button>
                                        <input
                                            placeholder="Title"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black transition-all text-xs font-bold bg-white"
                                            value={spec.title}
                                            onChange={e => updateSpec(i, 'title', e.target.value)}
                                        />
                                        <textarea
                                            placeholder="Information"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black transition-all text-xs font-bold bg-white min-h-[80px]"
                                            value={spec.info}
                                            onChange={e => updateSpec(i, 'info', e.target.value)}
                                        />
                                        <input
                                            placeholder="Section Image URL"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black transition-all text-xs font-bold bg-white"
                                            value={spec.image}
                                            onChange={e => updateSpec(i, 'image', e.target.value)}
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Comments Section */}
                            <div className="space-y-4 pt-4">
                                <div className="flex justify-between items-center">
                                    <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Product Comments (Reviews)</h4>
                                    <button type="button" onClick={addComment} className="text-[10px] font-black text-blue-500 uppercase tracking-widest">+ Add Comment</button>
                                </div>
                                {newProductForm.comments?.map((comment, i) => (
                                    <div key={i} className="p-6 bg-gray-50 rounded-[2rem] space-y-4 relative group border border-gray-100">
                                        <button type="button" onClick={() => removeComment(i)} className="absolute top-6 right-6 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16} /></button>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Customer Name</label>
                                                <input
                                                    placeholder="e.g. Micerl"
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black transition-all text-xs font-bold bg-white"
                                                    value={comment.name}
                                                    onChange={e => updateComment(i, 'name', e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Date</label>
                                                <input
                                                    placeholder="e.g. 2025-05-04"
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black transition-all text-xs font-bold bg-white"
                                                    value={comment.date}
                                                    onChange={e => updateComment(i, 'date', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Comment</label>
                                            <textarea
                                                placeholder="Write the review here..."
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black transition-all text-xs font-bold bg-white min-h-[80px]"
                                                value={comment.comment}
                                                onChange={e => updateComment(i, 'comment', e.target.value)}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Picture URL</label>
                                                <input
                                                    placeholder="URL to review image"
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black transition-all text-xs font-bold bg-white"
                                                    value={comment.picture}
                                                    onChange={e => updateComment(i, 'picture', e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Footprint</label>
                                                <input
                                                    placeholder="e.g. q7ss-29x9spq21m"
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black transition-all text-xs font-bold bg-white"
                                                    value={comment.footprint}
                                                    onChange={e => updateComment(i, 'footprint', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-10">
                                <button
                                    type="submit"
                                    className="w-full bg-black text-white py-5 rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-[1.02] transition-all active:scale-95"
                                >
                                    Create Product
                                </button>
                            </div>
                        </form>
                    </div>
                </div >
            )
            }

            {/* Edit Homepage Modal */}
            {
                isEditHomeModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                        <div className="bg-white rounded-3xl p-10 max-w-4xl w-full shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-300 overflow-y-auto max-h-[90vh]">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter font-heading">
                                    Modify Landing Page
                                </h3>
                                <button onClick={() => setIsEditHomeModalOpen(false)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={async (e) => {
                                e.preventDefault();
                                try {
                                    await updateHomepage(homeForm);
                                    setIsEditHomeModalOpen(false);
                                    setNotification({
                                        message: 'Homepage updated successfully! Your changes are now live.',
                                        type: 'success'
                                    });
                                } catch (err) {
                                    console.error(err);
                                    setNotification({
                                        message: 'Failed to update homepage. Please try again.',
                                        type: 'error'
                                    });
                                }
                            }} className="space-y-10">

                                {/* Hero Section */}
                                <div className="space-y-6">
                                    <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest border-b pb-2">Hero Section</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Product ID Reference</label>
                                            <input className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-black focus:bg-white transition-all text-xs font-bold" value={homeForm.hero.product_id} onChange={e => setHomeForm({ ...homeForm, hero: { ...homeForm.hero, product_id: e.target.value } })} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Banner Image URL</label>
                                            <input className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-black focus:bg-white transition-all text-xs font-bold" value={homeForm.hero.banner} onChange={e => setHomeForm({ ...homeForm, hero: { ...homeForm.hero, banner: e.target.value } })} />
                                        </div>
                                        <div className="col-span-full space-y-4">
                                            <input placeholder="Title 1" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-black focus:bg-white transition-all text-xs font-bold" value={homeForm.hero.title1} onChange={e => setHomeForm({ ...homeForm, hero: { ...homeForm.hero, title1: e.target.value } })} />
                                            <input placeholder="Title 2" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-black focus:bg-white transition-all text-xs font-bold" value={homeForm.hero.title2} onChange={e => setHomeForm({ ...homeForm, hero: { ...homeForm.hero, title2: e.target.value } })} />
                                            <textarea placeholder="Title 3 (Description)" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-black focus:bg-white transition-all text-xs font-bold min-h-[80px]" value={homeForm.hero.title3} onChange={e => setHomeForm({ ...homeForm, hero: { ...homeForm.hero, title3: e.target.value } })} />
                                        </div>
                                    </div>
                                </div>

                                {/* Grid Sections */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    {[
                                        { key: 'middlesection', label: 'Middle Highlight' },
                                        { key: 'downleft', label: 'Bottom Left' },
                                        { key: 'downmiddle', label: 'Bottom Middle' },
                                        { key: 'downright', label: 'Bottom Right' }
                                    ].map((section) => (
                                        <div key={section.key} className="space-y-6 p-6 bg-gray-50 rounded-3xl border border-gray-100">
                                            <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest">{section.label}</h4>
                                            <div className="space-y-4">
                                                <input placeholder="Product ID" className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-black transition-all text-[10px] font-bold" value={(homeForm as any)[section.key].product_id} onChange={e => setHomeForm({ ...homeForm, [section.key]: { ...(homeForm as any)[section.key], product_id: e.target.value } })} />
                                                <input placeholder="Icon URL" className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-black transition-all text-[10px] font-bold" value={(homeForm as any)[section.key].icon} onChange={e => setHomeForm({ ...homeForm, [section.key]: { ...(homeForm as any)[section.key], icon: e.target.value } })} />
                                                <input placeholder="Title 1" className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-black transition-all text-[10px] font-bold" value={(homeForm as any)[section.key].title1} onChange={e => setHomeForm({ ...homeForm, [section.key]: { ...(homeForm as any)[section.key], title1: e.target.value } })} />
                                                <input placeholder="Title 2" className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-black transition-all text-[10px] font-bold" value={(homeForm as any)[section.key].title2} onChange={e => setHomeForm({ ...homeForm, [section.key]: { ...(homeForm as any)[section.key], title2: e.target.value } })} />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button type="submit" className="w-full bg-black text-white py-6 rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-[1.02] transition-all active:scale-95">
                                    Update Home
                                </button>
                            </form>
                        </div>
                    </div>
                )
            }

            {/* Professional Toast Notification */}
            {
                notification && (
                    <div className="fixed bottom-10 right-10 z-[100] animate-in slide-in-from-right-10 fade-in duration-500">
                        <div className={`
                        relative overflow-hidden
                        backdrop-blur-xl border border-white/10
                        rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)]
                        px-8 py-5 min-w-[320px]
                        flex items-center gap-4
                        ${notification.type === 'success' ? 'bg-black/90' : 'bg-red-950/90'}
                    `}>
                            {/* Glow effect */}
                            <div className={`absolute -left-20 -top-20 w-40 h-40 rounded-full blur-[80px] opacity-20 ${notification.type === 'success' ? 'bg-green-400' : 'bg-red-500'}`} />

                            <div className={`
                            w-10 h-10 rounded-2xl flex items-center justify-center shrink-0
                            ${notification.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}
                        `}>
                                {notification.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                            </div>

                            <div className="flex flex-col gap-0.5">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                                    {notification.type === 'success' ? 'System Notification' : 'Error Detected'}
                                </h4>
                                <p className="text-sm font-bold text-white tracking-tight">
                                    {notification.message}
                                </p>
                            </div>

                            <button
                                onClick={() => setNotification(null)}
                                className="ml-auto p-2 rounded-xl hover:bg-white/5 text-white/20 hover:text-white transition-all"
                            >
                                <X size={16} />
                            </button>

                            {/* Progress Bar */}
                            <div className="absolute bottom-0 left-0 h-[3px] bg-white/10 w-full">
                                <div className={`h-full animate-[progress_5s_linear_forwards] ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
                            </div>
                        </div>
                    </div>
                )
            }
        </main >
    );
}
