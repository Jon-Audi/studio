"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Construction } from 'lucide-react';

interface PlaceholderCalculatorProps {
  materialName: string;
  icon?: React.ReactNode;
}

export function PlaceholderCalculator({ materialName, icon }: PlaceholderCalculatorProps) {
  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
         <div className="flex items-center space-x-2">
          {icon || <Construction className="h-8 w-8 text-primary" />}
          <CardTitle className="text-2xl font-headline">{materialName} Calculator</CardTitle>
        </div>
        <CardDescription>This calculator is currently under development. Check back soon!</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center min-h-[200px] text-center">
        <Construction className="h-16 w-16 text-muted-foreground mb-4" />
        <p className="text-lg font-medium text-muted-foreground">Coming Soon!</p>
        <p className="text-sm text-muted-foreground">
          We are working hard to bring you the {materialName} material estimator.
        </p>
      </CardContent>
    </Card>
  );
}
