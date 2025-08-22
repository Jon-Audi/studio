
"use client";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CATALOG, DEFAULTS } from '@/config/catalog';
import type { ChainlinkCalculatorInput, ChainlinkCalculatorResult, FullEstimateData } from '@/types';
import { ChainlinkCalculatorSchema } from '@/types';
import { ResultsCard } from '@/components/shared/results-card';
import { calculateChainlink } from '@/lib/calculators';
import { sendEstimateToInvoicingService } from '@/lib/actions';
import { useToast } from "@/hooks/use-toast";
import { Fence } from 'lucide-react';

export function ChainlinkCalculatorForm() {
  const [results, setResults] = useState<ChainlinkCalculatorResult | null>(null);
  const [formInputs, setFormInputs] = useState<ChainlinkCalculatorInput | null>(null);
  const { toast } = useToast();

  const form = useForm<ChainlinkCalculatorInput>({
    resolver: zodResolver(ChainlinkCalculatorSchema),
    defaultValues: {
      fenceLength: 100,
      fenceHeight: DEFAULTS.CHAINLINK.fenceHeight,
      fenceType: DEFAULTS.CHAINLINK.fenceType,
      ends: 2,
      corners: 0,
    },
  });

  function onSubmit(data: ChainlinkCalculatorInput) {
    setFormInputs(data);
    const calculatedResults = calculateChainlink(data);
    setResults(calculatedResults);
  }

  const handleSendToInvoice = async (estimateData: FullEstimateData) => {
    const response = await sendEstimateToInvoicingService(estimateData);
    if (response.success) {
      toast({
        title: "Success",
        description: response.message + (response.quoteId ? ` Quote ID: ${response.quoteId}` : ''),
        variant: "default",
      });
    } else {
      toast({
        title: "Error",
        description: response.message,
        variant: "destructive",
      });
    }
    return response;
  };

  const fullEstimateData: FullEstimateData | undefined = formInputs && results ? {
    calculatorType: "Chainlink",
    inputs: formInputs,
    results: results,
    timestamp: new Date().toISOString(),
  } : undefined;

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
                        {CATALOG.FENCE_HEIGHTS.map(h => <SelectItem key={h} value={h}>{h}'</SelectItem>)}
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
                        {CATALOG.CHAINLINK.FENCE_TYPES.map(t => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}
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
            <ResultsCard 
              title="Chain-link Fence Results" 
              data={{
                'Line Posts': results.interiorLinePosts,
                'Ends': results.userSpecifiedEnds,
                'Corners': results.userSpecifiedCorners,
                'Post Caps': results.postCaps,
                'Brace Bands': results.braceBands,
                'Tension Bars': results.tensionBars,
                'Tension Bands': results.tensionBands,
                'Nuts & Bolts': results.nutsAndBolts,
                'Loop Caps': results.loopCaps,
                'Fabric Footage (ft)': results.fabricFootage,
                'Fabric Type': results.fabricType,
                'Top Rail Sticks': results.topRailSticks,
                'Tie Wires': results.tieWires,
                'Pipe Weight': results.pipeWeight,
              }}
              onSendToInvoice={handleSendToInvoice}
              fullEstimateData={fullEstimateData}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
