import { Zap, Droplet, Smile, Sparkles } from 'lucide-react';

interface IngredientsProps {
    ingredients: string[];
}

export default function Ingredients({ ingredients }: IngredientsProps) {
    if (!ingredients) return null;

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">Key Ingredients</h2>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                    {ingredients.map((ing, idx) => (
                        <div key={idx} className="flex flex-col items-center text-center p-6 border rounded-2xl hover:shadow-lg transition-shadow">
                            <div className="bg-violet-100 p-4 rounded-full mb-4 text-violet-600">
                                {idx % 4 === 0 ? <Zap /> : idx % 4 === 1 ? <Droplet /> : idx % 4 === 2 ? <Smile /> : <Sparkles />}
                            </div>
                            <span className="font-medium text-gray-800">{ing}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
