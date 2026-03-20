'use client'; // Error components must always be Client Components in Next.js

import { useEffect } from 'react';
// Next.js optimized Image component
import Image from 'next/image'; 
// Import the WifiOff icon from lucide-react
import { WifiOff } from 'lucide-react'; 

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Silently log the error in your terminal for your own monitoring
    console.error('EcoEstras Frontend Error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] px-6 text-center bg-white">
      
      {/* Logo Section.
        Positioned at the very top with significant bottom margin (mb-20) 
        to separate it from the main error content block.
      */}
      <div className="mb-20">
        <Image
          src="https://res.cloudinary.com/platformtour/image/upload/v1718636228/Picsart_24-06-01_19-54-15-468-removebg-preview_1_e6lydr.png"
          alt="EcoEstras Logo"
          width={220} // Adjusted size for premium feel, not too big, not too small
          height={80}  // Height will adjust automatically with object-contain
          priority // Tells Next.js to load this image first (critical path)
          className="object-contain h-auto w-auto"
        />
      </div>

      {/* Container for the WifiOff Icon. 
        It has a light neutral background and is a perfect circle.
      */}
      <div className="flex items-center justify-center w-20 h-20 mb-10 rounded-full bg-neutral-100">
        <WifiOff 
          className="w-10 h-10 text-neutral-900" 
          strokeWidth={1.2} // Thinner stroke for a cleaner, high-end look
        />
      </div>
      
      {/* Headline uses tracking-tight and neutral-950 for a clean, sharp look.
      */}
      <h2 className="text-4xl font-extrabold tracking-tight text-neutral-950 mb-4">
        Connection Interrupted
      </h2>
      
      {/* Paragraph text uses neutral-600 to be subtle, 
        and adds leading-relaxed for better readability.
      */}
      <p className="max-w-md text-lg leading-relaxed text-neutral-600 mb-12">
We temporarily lost your connection. This usually happens if your network briefly dropped or the signal is slightly unstable. This usually resolves quickly upon refreshing the secure connection.
      </p>
      
      {/* Primary button is strict black and white. 
        It has sharp corners (rounded-none) to feel architectural and premium.
        Single point of action.
      */}
      <button
        onClick={() => reset()}
        className="
          px-10 
          py-4 
          text-sm 
          font-semibold 
          tracking-wide 
          rounded-full
          uppercase 
          text-white 
          bg-black 
          hover:bg-neutral-800 
          transition-colors 
          duration-200
        "
      >
        Retry Connection
      </button>
    </div>
  );
}