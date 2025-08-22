
"use client";
import Link from 'next/link';
import { DelawareFenceSolutionsLogoIcon } from '@/components/icons/delaware-fence-solutions-logo-icon';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Settings } from 'lucide-react';
import { useTheme } from '@/context/theme-provider';
import { useState, useEffect } from 'react';

export function AppHeader() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    if (mounted) {
      // setTheme can accept a function to get the current value
      setTheme(currentTheme => (currentTheme === 'dark' ? 'light' : 'dark'));
    }
  };

  // Determine content based on mounted status and theme
  // For SSR and initial client render (mounted === false), default to 'light' theme representation
  // (Moon icon visible, so action is to switch to dark mode)
  const currentAriaLabel = mounted && theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
  const currentIcon = mounted && theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />;

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
            Delaware Fence Solutions Pro Estimator
          </span>
        </Link>
        <div className="ml-auto flex items-center space-x-2">
           <Button asChild variant="ghost" size="icon" aria-label="Settings">
              <Link href="/settings">
                <Settings className="h-5 w-5" />
              </Link>
            </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={currentAriaLabel}
            // Optionally disable until mounted to prevent interaction before theme is fully resolved client-side
            // disabled={!mounted} 
          >
            {currentIcon}
          </Button>
        </div>
      </div>
    </header>
  );
}
