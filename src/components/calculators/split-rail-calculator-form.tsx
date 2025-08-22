
"use client";
import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CATALOG, DEFAULTS } from '@/config/catalog';
import type { SplitRailCalculatorInput, SplitRailCalculatorResult, FullEstimateData } from '@/types';
import { SplitRailCalculatorSchema } from '@/types';
import { ResultsCard } from '@/components/shared/results-card';
import { calculateSplitRail } from '@/lib/calculators';
import { sendEstimateToInvoicingService } from '@/lib/actions';
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Trash2 } from 'lucide-react';

const SplitRailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary lucide lucide-grip-horizontal">
    <circle cx="12" cy="9" r="1"></circle><circle cx="19" cy="9" r="1"></circle><circle cx="5" cy="9" r="1"></circle>
    <circle cx="12" cy="15" r="1"></circle><circle cx="19" cy="15" r="1"></circle><circle cx="5" cy="15" r="1"></circle>
  </svg>
);


export function SplitRailCalculatorForm() {
  const [results, setResults] = useState<SplitRailCalculatorResult | null>(null);
  const [formInputs, setFormInputs] = useState<SplitRailCalculatorInput | null>(null);
  const { toast } = useToast();

  const form = useForm<SplitRailCalculatorInput>({
    resolver: zodResolver(SplitRailCalculatorSchema),
    defaultValues: {
      fenceLength: 100,
      numRailsPerSection: DEFAULTS.SPLIT_RAIL.numRailsPerSection,
      postSpacing: DEFAULTS.SPLIT_RAIL.postSpacing,
      ends: 2,
      corners: 0,
      singleGates: [],
      doubleGates: [],
    },
  });
  
  const { fields: singleGateFields, append: singleGateAppend, remove: singleGateRemove } = useFieldArray({
    control: form.control,
    name: "singleGates"
  });

  const { fields: doubleGateFields, append: doubleGateAppend, remove: doubleGateRemove } = useFieldArray({
    control: form.control,
    name: "doubleGates"
  });

  function onSubmit(data: SplitRailCalculatorInput) {
    setFormInputs(data);
    // Ensure postSpacing is explicitly set, even if the field is disabled, to avoid zod errors if it's somehow undefined.
    const dataWithFixedPostSpacing = { ...data, postSpacing: data.postSpacing || DEFAULTS.SPLIT_RAIL.postSpacing };
    const calculatedResults = calculateSplitRail(dataWithFixedPostSpacing);
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
    calculatorType: "Split Rail",
    inputs: formInputs,
    results: results,
    timestamp: new Date().toISOString(),
  } : undefined;

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <SplitRailIcon />
          <CardTitle className="text-2xl font-headline">Split Rail Fence Calculator</CardTitle>
        </div>
        <CardDescription>Enter your split rail fence specifications to calculate required materials.</CardDescription>
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
                    <FormControl><Input type="number" placeholder="e.g., 150" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="numRailsPerSection"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rails per Section</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select rails per section" /></SelectTrigger></FormControl>
                      <SelectContent>{CATALOG.SPLIT_RAIL.RAILS_PER_SECTION.map(r => <SelectItem key={r} value={r}>{r}-Rail</SelectItem>)}</SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="postSpacing"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Post Spacing (ft)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select post spacing" /></SelectTrigger></FormControl>
                      <SelectContent>{CATALOG.SPLIT_RAIL.POST_SPACING.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
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
                    <FormControl><Input type="number" placeholder="e.g., 2" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} /></FormControl>
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
                    <FormControl><Input type="number" placeholder="e.g., 0" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <FormLabel>Single Gates</FormLabel>
              {singleGateFields.map((field, index) => (
                <div key={field.id} className="flex items-end space-x-2 p-3 border rounded-md bg-muted/50">
                  <FormField
                    control={form.control}
                    name={`singleGates.${index}.width`}
                    render={({ field: f }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="text-xs">Width</FormLabel>
                        <Select onValueChange={f.onChange} defaultValue={f.value || DEFAULTS.SPLIT_RAIL.singleGateWidth}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select width" /></SelectTrigger></FormControl>
                          <SelectContent>{CATALOG.SPLIT_RAIL.SINGLE_GATE_WIDTHS.map(w => <SelectItem key={w.value} value={w.value}>{w.label}</SelectItem>)}</SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`singleGates.${index}.quantity`}
                    render={({ field: f }) => (
                      <FormItem className="w-24">
                        <FormLabel className="text-xs">Qty</FormLabel>
                        <FormControl><Input type="number" placeholder="Qty" {...f} onChange={e => f.onChange(parseInt(e.target.value) || 1)} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="button" variant="ghost" size="icon" onClick={() => singleGateRemove(index)} className="text-destructive hover:text-destructive/80">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => singleGateAppend({ width: DEFAULTS.SPLIT_RAIL.singleGateWidth, quantity: 1 })}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Single Gate
              </Button>
            </div>
            
            <div className="space-y-4">
              <FormLabel>Double Gates</FormLabel>
              {doubleGateFields.map((field, index) => (
                <div key={field.id} className="flex items-end space-x-2 p-3 border rounded-md bg-muted/50">
                  <FormField
                    control={form.control}
                    name={`doubleGates.${index}.width`}
                    render={({ field: f }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="text-xs">Width</FormLabel>
                        <Select onValueChange={f.onChange} defaultValue={f.value || DEFAULTS.SPLIT_RAIL.doubleGateWidth}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select width" /></SelectTrigger></FormControl>
                          <SelectContent>{CATALOG.SPLIT_RAIL.DOUBLE_GATE_WIDTHS.map(w => <SelectItem key={w.value} value={w.value}>{w.label}</SelectItem>)}</SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`doubleGates.${index}.quantity`}
                    render={({ field: f }) => (
                      <FormItem className="w-24">
                        <FormLabel className="text-xs">Qty</FormLabel>
                        <FormControl><Input type="number" placeholder="Qty" {...f} onChange={e => f.onChange(parseInt(e.target.value) || 1)} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="button" variant="ghost" size="icon" onClick={() => doubleGateRemove(index)} className="text-destructive hover:text-destructive/80">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => doubleGateAppend({ width: DEFAULTS.SPLIT_RAIL.doubleGateWidth, quantity: 1 })}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Double Gate
              </Button>
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Calculate Materials</Button>
          </form>
        </Form>

        {results && (
          <div className="mt-8 space-y-4">
            <ResultsCard 
              title="Split Rail Fence Results" 
              data={{
                'Number of Sections': results.numSections,
                'Total Posts': results.numPosts,
                'Rails': results.numRails,
                'Ends': results.userSpecifiedEnds,
                'Corners': results.userSpecifiedCorners,
                'Gate Posts': results.gatePosts,
                'Total Gate Openings': results.totalGateOpenings,
                'Total Gate Linear Footage': results.totalGateLinearFootage,
                'Screw Hook & Eyes Sets': results.screwHookAndEyesSets,
                'Loop Latches': results.loopLatches,
                'Wood Drop Rods': results.woodDropRods,
                Notes: results.notes,
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
