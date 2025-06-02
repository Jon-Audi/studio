"use client";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FENCE_HEIGHT_OPTIONS, FENCE_TYPE_OPTIONS } from '@/config/constants';
import type { ChainlinkCalculatorInput, ChainlinkCalculatorResult } from '@/types';
import { ChainlinkCalculatorSchema } from '@/types';
import { ResultsCard } from '@/components/shared/results-card';
import { calculateChainlink } from '@/lib/calculators';
import { Fence, CornerRightUp, PilcrowSquare } from 'lucide-react';

export function ChainlinkCalculatorForm() {
  const [results, setResults] = useState<ChainlinkCalculatorResult | null>(null);

  const form = useForm<ChainlinkCalculatorInput>({
    resolver: zodResolver(ChainlinkCalculatorSchema),
    defaultValues: {
      fenceLength: 100,
      fenceHeight: FENCE_HEIGHT_OPTIONS[0],
      fenceType: FENCE_TYPE_OPTIONS[0],
      ends: 2,
      corners: 0,
    },
  });

  function onSubmit(data: ChainlinkCalculatorInput) {
    const calculatedResults = calculateChainlink(data);
    setResults(calculatedResults);
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Fence className="h-8 w-8 text-primary" />
          <CardTitle className="text-2xl font-headline">Chain-link Fence Calculator</CardTitle>
        </div>
        <CardDescription>Enter your fence specifications to calculate required materials.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fenceLength"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fence Length (ft)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 150" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fenceHeight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fence Height (ft)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select height" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {FENCE_HEIGHT_OPTIONS.map(h => <SelectItem key={h} value={h}>{h}'</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fenceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {FENCE_TYPE_OPTIONS.map(t => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ends"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Ends</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 2" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="corners"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Corners</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 0" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              Calculate Materials
            </Button>
          </form>
        </Form>

        {results && (
          <div className="mt-8 space-y-4">
            <ResultsCard title="Calculation Results" data={results} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
