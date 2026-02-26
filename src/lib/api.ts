const API_URL = 'http://localhost:5000/api';

// Helper to get token from localStorage
const getAuthToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('dashboard_token');
    }
    return null;
};

// Centralized Fetcher with Auth injection
async function authFetch(url: string, options: RequestInit = {}) {
    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        (headers as any)['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(url, { ...options, headers });
    return res;
}

export async function login(credentials: any) {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Login failed');
    }

    const data = await res.json();
    if (typeof window !== 'undefined') {
        localStorage.setItem('dashboard_token', data.token);
        localStorage.setItem('dashboard_user', JSON.stringify(data.user));
    }
    return data;
}

export async function getMe() {
    const res = await authFetch(`${API_URL}/auth/me`);
    if (!res.ok) throw new Error('Failed to fetch user');
    return await res.json();
}

export function logout() {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('dashboard_token');
        localStorage.removeItem('dashboard_user');
    }
}

export async function getProduct(id: string) {
    const res = await fetch(`${API_URL}/product/${id}`, { cache: 'no-store' });
    if (!res.ok) {
        const text = await res.text();
        console.error('API Error:', res.status, res.statusText, text);
        throw new Error(`Failed to fetch product: ${res.status} ${res.statusText}`);
    }
    console.log('res', res);
    const data = await res.json();
    return data;
}

export async function trackVisitor(productId: string, session: string) {
    const res = await fetch(`${API_URL}/track/visitor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId, session }),
    });
    if (!res.ok) throw new Error('Failed to track visitor');
}

export async function trackCart(productId: string, session: string) {
    const res = await fetch(`${API_URL}/track/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId, session }),
    });
    if (!res.ok) throw new Error('Failed to track cart');
}

export async function trackCheckout(productId: string, session: string) {
    const res = await fetch(`${API_URL}/track/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId, session }),
    });
    if (!res.ok) throw new Error('Failed to track checkout');
}

export async function getAssistanceRequests() {
    const res = await authFetch(`${API_URL}/assistance`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch assistance requests');
    return await res.json();
}

export async function markAssistanceDone(id: string) {
    const res = await authFetch(`${API_URL}/assistance/${id}/done`, {
        method: 'PATCH'
    });
    if (!res.ok) throw new Error('Failed to mark request as done');
    return await res.json();
}

export async function getOrders() {
    const res = await authFetch(`${API_URL}/orders`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch orders');
    return await res.json();
}

export async function markOrderFulfilled(id: string) {
    const res = await authFetch(`${API_URL}/orders/${id}/fulfill`, {
        method: 'PATCH'
    });
    if (!res.ok) throw new Error('Failed to mark order as fulfilled');
    return await res.json();
}

export async function markOrderPaid(id: string) {
    const res = await authFetch(`${API_URL}/orders/${id}/pay`, {
        method: 'PATCH'
    });
    if (!res.ok) throw new Error('Failed to mark order as paid');
    return await res.json();
}

export async function deleteOrder(id: string) {
    const res = await authFetch(`${API_URL}/orders/${id}`, {
        method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete order');
    return await res.json();
}

export async function getAllProducts() {
    const res = await authFetch(`${API_URL}/products`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch products');
    return await res.json();
}

export async function toggleProductPause(id: string) {
    const res = await authFetch(`${API_URL}/products/${id}/toggle-pause`, {
        method: 'PATCH'
    });
    if (!res.ok) throw new Error('Failed to toggle product status');
    return await res.json();
}

export async function deleteProduct(id: string) {
    const res = await authFetch(`${API_URL}/products/${id}`, {
        method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete product');
    return await res.json();
}

export async function createProduct(productData: any) {
    const res = await authFetch(`${API_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
    });
    if (!res.ok) throw new Error('Failed to create product');
    return await res.json();
}
