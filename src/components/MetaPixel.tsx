'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';

// 1. We move the dynamic hooks into their own tiny component
function PixelEvents() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        // This tells Facebook a new page was loaded whenever the URL changes
        if (typeof window !== 'undefined' && (window as any).fbq) {
            (window as any).fbq('track', 'PageView');
        }
    }, [pathname, searchParams]);

    return null; // This component doesn't render anything visible
}

// 2. We wrap that tiny component in Suspense inside the main export
export default function MetaPixel() {
    const pixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

    if (!pixelId) return null;

    return (
        <>
            <Suspense fallback={null}>
                <PixelEvents />
            </Suspense>

            <Script
                id="fb-pixel"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
                    !function(f,b,e,v,n,t,s)
                    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                    n.queue=[];t=b.createElement(e);t.async=!0;
                    t.src=v;s=b.getElementsByTagName(e)[0];
                    s.parentNode.insertBefore(t,s)}(window, document,'script',
                    'https://connect.facebook.net/en_US/fbevents.js');
                    fbq('init', '${pixelId}');
                    `,
                }}
            />
        </>
    );
}