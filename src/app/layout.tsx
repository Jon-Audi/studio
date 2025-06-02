
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/context/theme-provider";

export const metadata: Metadata = {
  title: 'Delaware Fence Solutions Pro Estimator',
  description: 'Estimate materials for your construction projects with ease. Calculators for chain-link, vinyl, wood, aluminum, split rail fences, and more. Features AI-powered recommendations.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col">
        <ThemeProvider
          defaultTheme="system"
          storageKey="material-estimator-theme"
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
