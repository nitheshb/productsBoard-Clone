// File: app/layout.tsx
import './globals.css';  // Correct import of global CSS
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from "@/components/ui/sonner";

// Google font setup for Inter
const inter = Inter({ subsets: ['latin'] });

// // Metadata for the page
export const metadata = {
  title: 'Product Management App',
  description: 'Manage your products, components, and features',
};

// Root Layout Component
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}

