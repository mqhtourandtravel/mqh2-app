'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    bhldScript?: boolean;
  }
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace React {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSX {
      interface IntrinsicElements {
        'behold-widget': { 'feed-id': string };
      }
    }
  }
}

// Embed widget Instagram resmi Behold.so (Opsi A — tanpa API key di server).
// Feed ID diset via prop; script widget hanya di-inject sekali per halaman.
export default function InstagramEmbed({ feedId }: { feedId: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Inject script widget hanya sekali (Behold guard sendiri via window.bhldScript,
    // tapi kita jaga juga agar aman terhadap Strict Mode double-effect).
    if (!window.bhldScript) {
      window.bhldScript = true;
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://w.behold.so/widget.js';
      document.head.appendChild(script);
    }

    // Behold menscanning <behold-widget> saat script dimuat. Jika script sudah
    // ada (navigasi client-side), widget mungkin perlu dipicu ulang — aman diabaikan
    // karena Behold memproses elemen yang sudah ada di DOM saat load.
  }, [feedId]);

  return (
    <div ref={containerRef}>
      <behold-widget feed-id={feedId} />
    </div>
  );
}
