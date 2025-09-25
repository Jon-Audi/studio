
"use client";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import type { CantileverGateCalculatorInput, CantileverGateCalculatorResult, FullEstimateData } from '@/types';
import { CantileverGateCalculatorSchema } from '@/types';
import { ResultsCard } from '@/components/shared/results-card';
import { CantileverGateShopDrawing } from '@/components/shared/cantilever-gate-shop-drawing';
import { calculateCantileverGate } from '@/lib/calculators';
import { sendEstimateToInvoicingService } from '@/lib/actions';
import { useToast } from "@/hooks/use-toast";
import { ChevronsRightLeft, Calculator, Printer } from 'lucide-react';

export function CantileverGateCalculatorForm() {
  const [results, setResults] = useState<CantileverGateCalculatorResult | null>(null);
  const [formInputs, setFormInputs] = useState<CantileverGateCalculatorInput | null>(null);
  const { toast } = useToast();

  const form = useForm<CantileverGateCalculatorInput>({
    resolver: zodResolver(CantileverGateCalculatorSchema),
    defaultValues: {
      openingSize: 20,
      gateHeight: 6,
      includeDiagonalBrace: true,
    },
  });

  const openingSize = form.watch("openingSize");

  function onSubmit(data: CantileverGateCalculatorInput) {
    setFormInputs(data);
    const calculatedResults = calculateCantileverGate(data);
    setResults(calculatedResults);
  }

  const handleSendToInvoice = async (estimateData: FullEstimateData) => {
    const response = await sendEstimateToInvoicingService(estimateData);
    if (response.success) {
      toast({
        title: "Success",
        description: response.message + (response.quoteId ? ` Quote ID: ${response.quoteId}` : ''),
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
  
  const handlePrint = () => {
    window.print();
  };

  const fullEstimateData: FullEstimateData | undefined = formInputs && results ? {
    calculatorType: "Cantilever Gate",
    inputs: formInputs,
    results: results,
    timestamp: new Date().toISOString(),
  } : undefined;

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto shadow-xl no-print">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <ChevronsRightLeft className="h-8 w-8 text-primary" />
            <CardTitle className="text-2xl font-headline">Cantilever Gate Calculator</CardTitle>
          </div>
          <CardDescription>Enter gate specs to calculate materials and view a shop drawing.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="openingSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Clear Opening Size (ft)</FormLabel>
                      <FormControl><Input type="number" placeholder="e.g., 20" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gateHeight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gate Height (ft)</FormLabel>
                      <FormControl><Input type="number" placeholder="e.g., 6" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {openingSize > 20 && (
                <FormField
                  control={form.control}
                  name="includeDiagonalBrace"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Include Diagonal Brace</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Recommended for gates wider than 20'.
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
              )}

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                <Calculator className="mr-2 h-4 w-4" /> Calculate Materials
              </Button>
            </form>
          </Form>

          {results && (
            <div className="mt-8 space-y-4">
              <ResultsCard
                title="Cantilever Gate Material List"
                data={{
                  'Total Frame Length': `${results.totalFrameLength} ft`,
                  'Counterbalance Length': `${results.counterBalanceLength} ft`,
                  'Top & Bottom Rails (2 ½" SS40)': `2 pieces @ ${results.topAndBottomRails.length} ft`,
                  'Vertical Uprights (2" SS40)': `${results.verticalUprights.count} pieces @ ${results.verticalUprights.length} ft`,
                  'Diagonal Brace Length (2")': results.diagonalBraceLength ? `${results.diagonalBraceLength} ft` : 'Not required',
                  'Cantilever Rollers': results.cantileverRollers,
                  'Gate Roller Posts (4" or 6 5/8")': results.gateRollerPosts.count,
                  'Catch Post (4" or 6 5/8")': results.catchPost.count,
                  'Chain-Link Fabric Needed': `${results.fabricNeeded} linear ft`,
                  'Tension Bars': results.tensionBars,
                  'Tie Wires (approx)': results.tieWires,
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
          <CantileverGateShopDrawing results={results} inputs={formInputs} />
        </div>
      )}
    </>
  );
}
