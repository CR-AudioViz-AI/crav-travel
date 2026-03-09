import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = { className: 'font-sans' }; // system font fallback
;

export const metadata: Metadata = {
  title: 'CRAVTravel - AI-Powered Travel Deals Worldwide',
  description: 'Find the best travel deals with AI price predictions. Hotels, flights, and vacation packages at unbeatable prices.',
  keywords: 'travel deals, cheap flights, hotel discounts, vacation packages, AI travel, price predictions',
  openGraph: {
    title: 'CRAVTravel - Travel Smarter',
    description: 'AI-powered travel deals across the globe',
    url: 'https://cravtravel.com',
    siteName: 'CRAVTravel',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
