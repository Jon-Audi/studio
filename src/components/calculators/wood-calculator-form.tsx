
"use client";
import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  FENCE_HEIGHT_OPTIONS,
  WOOD_POST_SPACING_OPTIONS,
  PICKET_WIDTH_OPTIONS,
  WOOD_NUM_RAILS_OPTIONS,
  SINGLE_GATE_WIDTH_OPTIONS,
  DOUBLE_GATE_WIDTH_OPTIONS
} from '@/config/constants';
import type { WoodCalculatorInput, WoodCalculatorResult, FullEstimateData } from '@/types';
import { WoodCalculatorSchema } from '@/types';
import { ResultsCard } from '@/components/shared/results-card';
import { calculateWood } from '@/lib/calculators';
import { sendEstimateToInvoicingService } from '@/lib/actions';
import { useToast } from "@/hooks/use-toast";
import { TreePine, PlusCircle, Trash2 } from 'lucide-react';

export function WoodCalculatorForm() {
  const [results, setResults] = useState<WoodCalculatorResult | null>(null);
  const [formInputs, setFormInputs] = useState<WoodCalculatorInput | null>(null);
  const { toast } = useToast();

  const form = useForm<WoodCalculatorInput>({
    resolver: zodResolver(WoodCalculatorSchema),
    defaultValues: {
      fenceLength: 100,
      fenceHeight: FENCE_HEIGHT_OPTIONS[0],
      postSpacing: WOOD_POST_SPACING_OPTIONS.includes('8') ? '8' : WOOD_POST_SPACING_OPTIONS[0],
      picketWidth: PICKET_WIDTH_OPTIONS[0].value,
      numRails: WOOD_NUM_RAILS_OPTIONS[0],
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

  function onSubmit(data: WoodCalculatorInput) {
    setFormInputs(data);
    const calculatedResults = calculateWood(data);
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
    calculatorType: "Wood",
    inputs: formInputs,
    results: results,
    timestamp: new Date().toISOString(),
  } : undefined;

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <TreePine className="h-8 w-8 text-primary" />
          <CardTitle className="text-2xl font-headline">Wood Fence Calculator</CardTitle>
        </div>
        <CardDescription>Enter your wood fence specifications to calculate required materials.</CardDescription>
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
                name="fenceHeight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fence Height (ft)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select height" /></SelectTrigger></FormControl>
                      <SelectContent>{FENCE_HEIGHT_OPTIONS.map(h => <SelectItem key={h} value={h}>{h}'</SelectItem>)}</SelectContent>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select spacing" /></SelectTrigger></FormControl>
                      <SelectContent>{WOOD_POST_SPACING_OPTIONS.map(s => <SelectItem key={s} value={s}>{s}'</SelectItem>)}</SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="picketWidth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Picket Width</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select picket width" /></SelectTrigger></FormControl>
                      <SelectContent>{PICKET_WIDTH_OPTIONS.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}</SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="numRails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Rails</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select rails" /></SelectTrigger></FormControl>
                      <SelectContent>{WOOD_NUM_RAILS_OPTIONS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
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
                    <FormControl><Input type="number" placeholder="e.g., 0" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)}/></FormControl>
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
                        <Select onValueChange={f.onChange} defaultValue={f.value || SINGLE_GATE_WIDTH_OPTIONS[0].value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select width" /></SelectTrigger></FormControl>
                          <SelectContent>{SINGLE_GATE_WIDTH_OPTIONS.map(w => <SelectItem key={w.value} value={w.value}>{w.label}</SelectItem>)}</SelectContent>
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
              <Button type="button" variant="outline" size="sm" onClick={() => singleGateAppend({ width: SINGLE_GATE_WIDTH_OPTIONS[0].value, quantity: 1 })}>
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
                        <Select onValueChange={f.onChange} defaultValue={f.value || DOUBLE_GATE_WIDTH_OPTIONS[0].value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select width" /></SelectTrigger></FormControl>
                          <SelectContent>{DOUBLE_GATE_WIDTH_OPTIONS.map(w => <SelectItem key={w.value} value={w.value}>{w.label}</SelectItem>)}</SelectContent>
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
              <Button type="button" variant="outline" size="sm" onClick={() => doubleGateAppend({ width: DOUBLE_GATE_WIDTH_OPTIONS[0].value, quantity: 1 })}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Double Gate
              </Button>
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Calculate Materials</Button>
          </form>
        </Form>

        {results && (
          <div className="mt-8 space-y-4">
            <ResultsCard title="Wood Fence Results" data={{
                'Number of Sections': results.numSections,
                'Line Posts': results.numLinePosts,
                'Ends': results.userSpecifiedEnds,
                'Corners': results.userSpecifiedCorners,
                'Gate Posts': results.gatePosts,
                'Total Posts': results.totalPosts,
                'Total Pickets': results.numPickets,
                'Pickets per Section': results.picketsPerSection,
                'Total Rail Length (ft)': results.totalRailLength,
                "Number of Backers (2x4x8')": results.numBackers,
                'Bags of Concrete': results.bagsOfConcrete,
                'Total Gate Openings': results.totalGateOpenings,
                'Total Gate Linear Footage': results.totalGateLinearFootage,
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
