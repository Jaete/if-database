import type { Metadata, Viewport } from 'next';
import EmbedThemeToggle from '@/components/EmbedThemeToggle';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: 'Ficha de personagem',
  robots: { index: false, follow: false },
};

// The embed follows the OS theme until the viewer flips the corner toggle
// (EmbedThemeToggle). Inside the forum's iframe the storage is partitioned, so
// that choice is the forum's own, separate from the app's. The forum can still
// force a theme with `?tema=claro|escuro` on the iframe URL, which wins.
export const viewport: Viewport = {
  colorScheme: 'dark light',
};

// Order: ?tema= on the URL, then the stored choice, then the OS (no attribute).
const THEME_SCRIPT = `try{var d=document.documentElement,t=new URLSearchParams(location.search).get('tema');if(t==='claro')d.dataset.theme='light';else if(t==='escuro')d.dataset.theme='dark';else{var s=localStorage.getItem('ifdb-theme');if(s==='light'||s==='dark')d.dataset.theme=s}}catch(e){}`;

export default function EmbedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        {/* Cinzel is referenced by the typography mixins but not loaded anywhere else. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&display=swap"
        />
      </head>
      <body>
        {children}
        <EmbedThemeToggle />
      </body>
    </html>
  );
}
