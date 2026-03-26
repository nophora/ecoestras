import type { Metadata } from 'next';
import { Inter, Outfit, Caveat } from 'next/font/google';
import './globals.css';
import MetaPixel from '@/components/MetaPixel'; // (Adjust path if needed)

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });
const caveat = Caveat({ subsets: ['latin'], variable: '--font-script', weight: '700' });

export const metadata = {
  title: 'EcoEstras | Premium Quality, Sustainably Sourced',
  description: 'Experience the intersection of luxury and sustainability. EcoEstras offers curated, high-quality products designed for the modern South African lifestyle. Fast nationwide delivery and secure PayFast checkout.',
  keywords: [
    'EcoEstras',
    'online shopping South Africa',
    'premium lifestyle products',
    'sustainable brands SA',
    'luxury essentials Cape Town',
    'EcoEstras store',
    'eco-friendly products South Africa',
    'buy quality goods online SA'
  ],
  authors: [{ name: 'EcoEstras Team' }],
  metadataBase: new URL('https://ecoestras.co.za'),
  alternates: {
    canonical: '/',
  },

  openGraph: {
    title: 'EcoEstras | Premium Quality, Sustainably Sourced',
    description: 'Elevate your daily life with EcoEstras. Discover our exclusive range of premium products with secure shipping across South Africa.',
    url: 'https://ecoestras.co.za',
    siteName: 'EcoEstras',
    locale: 'en_ZA',
    type: 'website',
    images: [
      {
        url: 'https://res.cloudinary.com/platformtour/image/upload/v1774015265/unnamed_4_aosfgd.jpg',
        width: 1200,
        height: 630,
        alt: 'EcoEstras Premium Collection',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'EcoEstras | Premium Quality Online Store',
    description: 'Shop premium, sustainably sourced products at EcoEstras. Secure PayFast payments and fast delivery nationwide.',
    images: ['https://res.cloudinary.com/platformtour/image/upload/v1774015265/unnamed_4_aosfgd.jpg'],
  },

  icons: {
    icon: '/favicon.ico', // Make sure you have a favicon in your /public folder
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} ${caveat.variable} font-sans bg-gray-50 text-gray-900`}>
        <MetaPixel />
        {children}
      </body>
    </html>
  );
}
