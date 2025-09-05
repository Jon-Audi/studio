
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
import type { PicketCalculatorInput, PicketCalculatorResult, FullEstimateData } from '@/types';
import { PicketCalculatorSchema } from '@/types';
import { ResultsCard } from '@/components/shared/results-card';
import { calculatePickets } from '@/lib/calculators';
import { sendEstimateToInvoicingService } from '@/lib/actions';
import { useToast } from "@/hooks/use-toast";
import { Shapes, Calculator } from 'lucide-react';

export function PicketCalculatorForm() {
  const [results, setResults] = useState<PicketCalculatorResult | null>(null);
  const [formInputs, setFormInputs] = useState<PicketCalculatorInput | null>(null);
  const { toast } = useToast();

  const form = useForm<PicketCalculatorInput>({
    resolver: zodResolver(PicketCalculatorSchema),
    defaultValues: DEFAULTS.PICKET,
  });

  function onSubmit(data: PicketCalculatorInput) {
    setFormInputs(data);
    const calculatedResults = calculatePickets(data);
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
    calculatorType: "Picket",
    inputs: formInputs,
    results: results,
    timestamp: new Date().toISOString(),
  } : undefined;

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Shapes className="h-8 w-8 text-primary" />
          <CardTitle className="text-2xl font-headline">Picket Calculator</CardTitle>
        </div>
        <CardDescription>Calculate the number of pickets for regular or horizontal fences.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <FormField
                control={form.control}
                name="fenceOrientation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fence Orientation</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select orientation" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="vertical">Vertical</SelectItem>
                        <SelectItem value="horizontal">Horizontal</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="picketType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Picket Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select picket type" /></SelectTrigger></FormControl>
                      <SelectContent>{CATALOG.WOOD.PICKET_WIDTHS.map(w => <SelectItem key={w.value} value={w.value}>{w.label}</SelectItem>)}</SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sectionWidth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Section Width (ft)</FormLabel>
                    <FormControl><Input type="number" placeholder="e.g., 8" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sectionHeight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Section Height (ft)</FormLabel>
                    <FormControl><Input type="number" placeholder="e.g., 6" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              <Calculator className="mr-2 h-4 w-4" /> Calculate Pickets
            </Button>
          </form>
        </Form>

        {results && (
          <div className="mt-8 space-y-4">
            <ResultsCard 
                title="Picket Calculation Results" 
                data={{
                    'Pickets per Section': results.picketsPerSection,
                    'Total Pickets Needed': results.totalPickets,
                    'Notes': results.notes,
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
