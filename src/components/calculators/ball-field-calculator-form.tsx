
"use client";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { 
  BALL_FIELD_BACKSTOP_HEIGHT_OPTIONS,
  BALL_FIELD_BACKSTOP_WIDTH_OPTIONS,
  BALL_FIELD_FENCE_HEIGHT_OPTIONS,
  SINGLE_GATE_WIDTH_OPTIONS
} from '@/config/constants';
import type { BallFieldCalculatorInput, BallFieldCalculatorResult, FullEstimateData } from '@/types';
import { BallFieldCalculatorSchema } from '@/types';
import { ResultsCard } from '@/components/shared/results-card';
import { calculateBallField } from '@/lib/calculators';
import { sendEstimateToInvoicingService } from '@/lib/actions';
import { useToast } from "@/hooks/use-toast";
import { CircleDot, Calculator } from 'lucide-react';

export function BallFieldCalculatorForm() {
  const [results, setResults] = useState<BallFieldCalculatorResult | null>(null);
  const [formInputs, setFormInputs] = useState<BallFieldCalculatorInput | null>(null);
  const { toast } = useToast();

  const form = useForm<BallFieldCalculatorInput>({
    resolver: zodResolver(BallFieldCalculatorSchema),
    defaultValues: {
      backstopHeight: BALL_FIELD_BACKSTOP_HEIGHT_OPTIONS[1], // Default to 12'
      backstopWidth: BALL_FIELD_BACKSTOP_WIDTH_OPTIONS[1], // Default to 20'
      sidelineLength: 150,
      homerunLength: 200,
      fenceHeight: BALL_FIELD_FENCE_HEIGHT_OPTIONS[0], // Default to 4'
    },
  });

  function onSubmit(data: BallFieldCalculatorInput) {
    setFormInputs(data);
    const calculatedResults = calculateBallField(data);
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
    calculatorType: "Ball Field",
    inputs: formInputs,
    results: results,
    timestamp: new Date().toISOString(),
  } : undefined;

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-xl">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <CircleDot className="h-8 w-8 text-primary" />
          <CardTitle className="text-2xl font-headline">Ball Field Fence Calculator</CardTitle>
        </div>
        <CardDescription>Enter the specifications for the ball field to calculate required materials.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Backstop Section */}
            <div className="p-4 border rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Backstop</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="backstopHeight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Backstop Height (ft)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select height" /></SelectTrigger></FormControl>
                        <SelectContent>{BALL_FIELD_BACKSTOP_HEIGHT_OPTIONS.map(h => <SelectItem key={h} value={h}>{h}'</SelectItem>)}</SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="backstopWidth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Backstop Center Width (ft)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select width" /></SelectTrigger></FormControl>
                        <SelectContent>{BALL_FIELD_BACKSTOP_WIDTH_OPTIONS.map(w => <SelectItem key={w} value={w}>{w}'</SelectItem>)}</SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Fence Lines Section */}
            <div className="p-4 border rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Fence Lines</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="sidelineLength"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>1st & 3rd Base Line Length (ft)</FormLabel>
                      <FormControl><Input type="number" placeholder="e.g., 150" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="homerunLength"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Home Run Fence Length (ft)</FormLabel>
                      <FormControl><Input type="number" placeholder="e.g., 200" {...field} /></FormControl>
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
                        <FormControl><SelectTrigger><SelectValue placeholder="Select height" /></SelectTrigger></FormControl>
                        <SelectContent>{BALL_FIELD_FENCE_HEIGHT_OPTIONS.map(h => <SelectItem key={h} value={h}>{h}'</SelectItem>)}</SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              <Calculator className="mr-2 h-4 w-4" /> Calculate Ball Field Materials
            </Button>
          </form>
        </Form>

        {results && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ResultsCard 
                title="Backstop Materials"
                data={{
                    'Backstop Main Posts (3")': results.backstopMainPosts,
                    'Backstop Wing Posts (2.5")': results.backstopWingPosts,
                    'Fabric Rolls (9ga)': results.backstopFabricRolls,
                    'Top Rail (1 5/8")': results.backstopTopRail,
                    'Brace Rail (1 5/8")': results.backstopBraceRail,
                    'Brace Bands': results.backstopBraceBands,
                    'Tension Bands': results.backstopTensionBands,
                    'Tension Bars': results.backstopTensionBars,
                    'Post Caps': results.backstopPostCaps,
                    'Loop Caps': results.backstopLoopCaps,
                    'Rail Ends': results.backstopRailEnds,
                    'Tie Wires': results.backstopTieWires,
                    'Hog Rings': results.backstopHogRings,
                    'Tension Wire Coils': results.backstopTensionWireCoils,
                }}
            />
             <ResultsCard 
                title="Fence Line Materials"
                data={{
                    'Line Posts (2.5")': results.fenceLinePosts,
                    'Terminal Posts (3")': results.fenceTerminalPosts,
                    'Total Posts': results.fenceTotalPosts,
                    'Fabric Rolls (9ga)': results.fenceFabricRolls,
                    'Top Rail (1 5/8")': results.fenceTopRail,
                    'Brace Bands': results.fenceBraceBands,
                    'Tension Bands': results.fenceTensionBands,
                    'Tension Bars': results.fenceTensionBars,
                    'Post Caps': results.fencePostCaps,
                    'Loop Caps': results.fenceLoopCaps,
                    'Rail Ends': results.fenceRailEnds,
                    'Tie Wires': results.fenceTieWires,
                    'Hog Rings': results.fenceHogRings,
                    'Tension Wire Coils': results.fenceTensionWireCoils,
                }}
            />
            {fullEstimateData && (
                <div className="lg:col-span-2">
                    <Button onClick={() => handleSendToInvoice(fullEstimateData)} className="w-full bg-accent hover:bg-accent/90">
                        Send Full Estimate to DFS Invoicing
                    </Button>
                </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
