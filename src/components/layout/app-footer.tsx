
"use client";

export function AppFooter() {
  return (
    <footer className="py-6 md:px-8 md:py-0 border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex flex-col items-center justify-center gap-4 md:h-20 md:flex-row">
        <p className="text-balance text-center text-sm leading-loose text-muted-foreground">
          © {new Date().getFullYear()} Delaware Fence Solutions Pro Estimator. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
