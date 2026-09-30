import type { Metadata, Viewport } from 'next';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: 'Ficha de personagem',
  robots: { index: false, follow: false },
};

// The embed always renders dark: the forum it lives in is dark, and the
// Sass tokens only switch to light through prefers-color-scheme.
export const viewport: Viewport = {
  colorScheme: 'dark',
};

export default function EmbedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" style={{ colorScheme: 'dark' }}>
      <head>
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
      <body>{children}</body>
    </html>
  );
}
