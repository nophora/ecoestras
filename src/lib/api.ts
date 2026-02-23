const API_URL = 'http://localhost:5000/api';

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
