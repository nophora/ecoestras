interface StickyCartProps {
    price: number;
    onAddToCart: () => void;
}

export default function StickyCart({ price, onAddToCart }: StickyCartProps) {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-[0_-5px_20px_rgba(0,0,0,0.1)] md:hidden z-50 flex items-center justify-between border-t border-gray-100">
            <div className="flex flex-col">
                <span className="text-sm text-gray-500">Total</span>
                <span className="text-xl font-bold text-violet-700">R{price}</span>
            </div>
            <button
                onClick={onAddToCart}
                className="bg-violet-600 text-white font-bold py-3 px-8 rounded-full shadow-lg active:scale-95 transition-transform"
            >
                Add to Cart
            </button>
        </div>
    );
}
