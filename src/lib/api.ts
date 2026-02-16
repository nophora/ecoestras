const API_URL = 'http://localhost:5000/api';

export async function getProduct(id: string) {
    const res = await fetch(`${API_URL}/product/${id}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch product');
    return res.json();
}

export async function trackVisitor(productId: string, session: string) {
    try {
        await fetch(`${API_URL}/track/visitor`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ product_id: productId, session }),
        });
    } catch (err) {
        console.error('Tracking error:', err);
    }
}

export async function trackCart(productId: string, session: string) {
    try {
        await fetch(`${API_URL}/track/cart`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ product_id: productId, session }),
        });
    } catch (err) {
        console.error('Tracking error:', err);
    }
}

export async function trackCheckout(productId: string, session: string) {
    try {
        await fetch(`${API_URL}/track/checkout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ product_id: productId, session }),
        });
    } catch (err) {
        console.error('Tracking error:', err);
    }
}
