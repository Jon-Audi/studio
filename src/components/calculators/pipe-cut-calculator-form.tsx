
"use client";
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { GATE_FRAME_DIAMETER_OPTIONS, GATE_TYPE_OPTIONS, GATE_FRAME_COLOR_OPTIONS } from '@/config/constants';
import type { PipeCutCalculatorInput, PipeCutCalculatorResult, FullEstimateData } from '@/types';
import { PipeCutCalculatorSchema } from '@/types';
import { ResultsCard } from '@/components/shared/results-card';
import { GateShopDrawing } from '@/components/shared/gate-shop-drawing';
import { calculatePipeCuts } from '@/lib/calculators';
import { sendEstimateToInvoicingService } from '@/lib/actions';
import { useToast } from "@/hooks/use-toast";
import { Scissors, DoorOpen, Printer, DollarSign } from 'lucide-react';

export function PipeCutCalculatorForm() {
  const [results, setResults] = useState<PipeCutCalculatorResult | null>(null);
  const [formInputs, setFormInputs] = useState<PipeCutCalculatorInput | null>(null);
  const { toast } = useToast();

  const form = useForm<PipeCutCalculatorInput>({
    resolver: zodResolver(PipeCutCalculatorSchema),
    defaultValues: {
      gateWidth: 48, // inches
      gateHeight: 48, // inches
      frameDiameter: GATE_FRAME_DIAMETER_OPTIONS[0],
      gateType: GATE_TYPE_OPTIONS[0],
      frameColor: 'galvanized',
    },
    mode: 'onChange', // Important for live updates
  });

  const watchAllFields = form.watch();

  useEffect(() => {
    const subscription = form.watch((values, { name, type }) => {
      if (type === 'change') {
         form.trigger().then(isValid => {
          if (isValid) {
            const currentValues = form.getValues();
            setFormInputs(currentValues);
            const calculatedResults = calculatePipeCuts(currentValues);
            setResults(calculatedResults);
          } else {
            setResults(null);
          }
        });
      }
    });
    
    // Initial calculation on mount
    form.trigger().then(isValid => {
      if (isValid) {
        const currentValues = form.getValues();
        setFormInputs(currentValues);
        const calculatedResults = calculatePipeCuts(currentValues);
        setResults(calculatedResults);
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);


  function onSubmit(data: PipeCutCalculatorInput) {
    // Submission is now primarily for sending to invoice, as calculation is live
    if (fullEstimateData) {
      handleSendToInvoice(fullEstimateData);
    }
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
    calculatorType: "Gate Pipe Cut",
    inputs: formInputs,
    results: results,
    timestamp: new Date().toISOString(),
  } : undefined;

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto shadow-xl no-print">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <DoorOpen className="h-8 w-8 text-primary" />
            <CardTitle className="text-2xl font-headline">Gate Pipe Cut Calculator</CardTitle>
          </div>
          <CardDescription>Enter gate specs for live calculation of pipe cuts, cost, and drawing.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="gateWidth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gate Width (inches)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 48" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gateHeight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gate Height (inches)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 48" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="frameColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frame Color</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select color" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {GATE_FRAME_COLOR_OPTIONS.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="frameDiameter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frame Diameter</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select diameter" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {GATE_FRAME_DIAMETER_OPTIONS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gateType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gate Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {GATE_TYPE_OPTIONS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>

          {results && (
            <div className="mt-8 space-y-4">
               <ResultsCard
                title="Pipe Cut Results"
                data={{
                  'Uprights Length (each)': `${results.uprightsLength}"`,
                  'Horizontals Length (each)': `${results.horizontalsLength}" (${results.leafs} leaf/leaves)`,
                  'Horizontal Brace Length': results.horizontalBraceLength ? `${results.horizontalBraceLength}"` : undefined,
                  'Vertical Brace (each)': results.verticalBracePieces ? `${results.verticalBracePieces.count} pieces @ ${results.verticalBracePieces.length}"` : undefined,
                  'Number of Gate Posts': results.postCount,
                  'Post Spacing': `${results.postSpacing}"`,
                  'Total Pipe Length': results.totalPipeLength ? `${results.totalPipeLength} ft` : undefined,
                  'Estimated Frame Cost': results.totalCost ? `$${results.totalCost}`: undefined,
                }}
                onSendToInvoice={handleSendToInvoice}
                fullEstimateData={fullEstimateData}
              />
              <Button onClick={handlePrint} variant="outline" className="w-full">
                <Printer className="mr-2 h-4 w-4" /> Print Shop Drawing
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {results && formInputs && (
        <div className="printable-area">
          <GateShopDrawing results={results} inputs={formInputs} />
        </div>
      )}
    </>
  );
}
