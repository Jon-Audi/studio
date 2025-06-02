
"use client";
import Link from 'next/link';
import { DelawareFenceSolutionsLogoIcon } from '@/components/icons/delaware-fence-solutions-logo-icon';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/theme-provider';

export function AppHeader() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <a
          href="https://www.Delawarefencesolutions.com"
          target="_blank"
          rel="noopener noreferrer"
          className="mr-4 flex items-center space-x-2"
          aria-label="Delaware Fence Solutions Website"
        >
          <DelawareFenceSolutionsLogoIcon className="h-10 w-auto text-primary" />
        </a>
        <Link href="/" className="flex items-center">
          <span className="font-bold font-headline sm:inline-block text-xl">
            Material Estimator Pro
          </span>
        </Link>
        <div className="ml-auto flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </header>
  );
}
