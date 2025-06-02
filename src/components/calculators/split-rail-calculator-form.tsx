
"use client";
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { 
  SPLIT_RAIL_RAILS_PER_SECTION_OPTIONS, 
  SPLIT_RAIL_POST_SPACING_OPTIONS,
  GATE_CHOICE_OPTIONS,
  SINGLE_GATE_WIDTH_OPTIONS,
  DOUBLE_GATE_WIDTH_OPTIONS
} from '@/config/constants';
import type { SplitRailCalculatorInput, SplitRailCalculatorResult } from '@/types';
import { SplitRailCalculatorSchema } from '@/types';
import { ResultsCard } from '@/components/shared/results-card';
import { calculateSplitRail } from '@/lib/calculators';

const SplitRailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary lucide lucide-grip-horizontal">
    <circle cx="12" cy="9" r="1"></circle><circle cx="19" cy="9" r="1"></circle><circle cx="5" cy="9" r="1"></circle>
    <circle cx="12" cy="15" r="1"></circle><circle cx="19" cy="15" r="1"></circle><circle cx="5" cy="15" r="1"></circle>
  </svg>
);


export function SplitRailCalculatorForm() {
  const [results, setResults] = useState<SplitRailCalculatorResult | null>(null);

  const form = useForm<SplitRailCalculatorInput>({
    resolver: zodResolver(SplitRailCalculatorSchema),
    defaultValues: {
      fenceLength: 100,
      numRailsPerSection: SPLIT_RAIL_RAILS_PER_SECTION_OPTIONS[0],
      postSpacing: SPLIT_RAIL_POST_SPACING_OPTIONS[0],
      gateType: "none",
      gateWidth: undefined,
    },
  });

  const gateType = form.watch("gateType");

  useEffect(() => {
    if (gateType === "none" && form.getValues("gateWidth") !== undefined) {
      form.setValue("gateWidth", undefined);
    }
  }, [gateType, form]);

  function onSubmit(data: SplitRailCalculatorInput) {
    const calculatedResults = calculateSplitRail(data);
    setResults(calculatedResults);
  }
  
  const currentGateWidthOptions = gateType === "single" 
    ? SINGLE_GATE_WIDTH_OPTIONS 
    : gateType === "double" 
    ? DOUBLE_GATE_WIDTH_OPTIONS 
    : [];

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
                      <SelectContent>{SPLIT_RAIL_RAILS_PER_SECTION_OPTIONS.map(r => <SelectItem key={r} value={r}>{r}-Rail</SelectItem>)}</SelectContent>
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
                      <FormControl><SelectTrigger><SelectValue placeholder="Select post spacing" /></SelectTrigger></FormControl>
                      <SelectContent>{SPLIT_RAIL_POST_SPACING_OPTIONS.map(s => <SelectItem key={s} value={s}>{s}'</SelectItem>)}</SelectContent>
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
                    <FormLabel>Gate Option</FormLabel>
                     <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.setValue("gateWidth", undefined); 
                      }} 
                      defaultValue={field.value}
                    >
                      <FormControl><SelectTrigger><SelectValue placeholder="Select gate type" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {GATE_CHOICE_OPTIONS.map(g => <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {gateType && gateType !== "none" && (
                <FormField
                  control={form.control}
                  name="gateWidth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gate Width</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""} defaultValue={field.value || ""}>
                        <FormControl><SelectTrigger><SelectValue placeholder={`Select ${gateType} gate width`} /></SelectTrigger></FormControl>
                        <SelectContent>
                          {currentGateWidthOptions.map(w => <SelectItem key={w.value} value={w.value}>{w.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Calculate Materials</Button>
          </form>
        </Form>

        {results && (
          <div className="mt-8 space-y-4">
            <ResultsCard title="Split Rail Fence Results" data={results} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
