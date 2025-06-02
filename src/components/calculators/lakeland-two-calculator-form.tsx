
"use client";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import type { LakelandTwoCalculatorInput, LakelandTwoCalculatorResult } from '@/types';
import { LakelandTwoCalculatorSchema } from '@/types';
import { ResultsCard } from '@/components/shared/results-card';
import { Layers } from 'lucide-react';

export function LakelandTwoCalculatorForm() {
  const [results, setResults] = useState<LakelandTwoCalculatorResult | null>(null);

  const form = useForm<LakelandTwoCalculatorInput>({
    resolver: zodResolver(LakelandTwoCalculatorSchema),
    defaultValues: {
      numSections: 1,
    },
  });

  function onSubmit(data: LakelandTwoCalculatorInput) {
    const numSections = Number(data.numSections);
    setResults({
      pickets: numSections * 13,
      rails: numSections * 2,
      uChannels: numSections * 2,
    });
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-xl">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Layers className="h-8 w-8 text-primary" />
          <CardTitle className="text-2xl font-headline">Lakeland 2 Section Calculator</CardTitle>
        </div>
        <CardDescription>Enter the number of Lakeland 2 sections to calculate materials.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="numSections"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Sections</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 5" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Calculate Materials</Button>
          </form>
        </Form>

        {results && (
          <div className="mt-8 space-y-4">
            <ResultsCard 
              title="Lakeland 2 Materials" 
              data={{
                'Pickets': results.pickets,
                'Rails': results.rails,
                'U-Channels': results.uChannels,
              }} 
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
