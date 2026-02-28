import type { Metadata } from 'next';
import { Inter, Outfit, Caveat } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });
const caveat = Caveat({ subsets: ['latin'], variable: '--font-script', weight: '700' });

export const metadata: Metadata = {
  title: 'PAP PLUS | Professional Teeth Whitening',
  description: 'Premium peroxide-free teeth whitening strips.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} ${caveat.variable} font-sans bg-gray-50 text-gray-900`}>
        {children}
      </body>
    </html>
  );
}
