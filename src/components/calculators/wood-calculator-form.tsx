
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
  FENCE_HEIGHT_OPTIONS, 
  WOOD_POST_SPACING_OPTIONS, 
  PICKET_WIDTH_OPTIONS, 
  WOOD_NUM_RAILS_OPTIONS,
  GATE_CHOICE_OPTIONS,
  SINGLE_GATE_WIDTH_OPTIONS,
  DOUBLE_GATE_WIDTH_OPTIONS
} from '@/config/constants';
import type { WoodCalculatorInput, WoodCalculatorResult } from '@/types';
import { WoodCalculatorSchema } from '@/types';
import { ResultsCard } from '@/components/shared/results-card';
import { calculateWood } from '@/lib/calculators';
import { TreePine } from 'lucide-react';

export function WoodCalculatorForm() {
  const [results, setResults] = useState<WoodCalculatorResult | null>(null);

  const form = useForm<WoodCalculatorInput>({
    resolver: zodResolver(WoodCalculatorSchema),
    defaultValues: {
      fenceLength: 100,
      fenceHeight: FENCE_HEIGHT_OPTIONS[0],
      postSpacing: WOOD_POST_SPACING_OPTIONS[0],
      picketWidth: PICKET_WIDTH_OPTIONS[0].value,
      numRails: WOOD_NUM_RAILS_OPTIONS[0],
      ends: 2,
      corners: 0,
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

  function onSubmit(data: WoodCalculatorInput) {
    const calculatedResults = calculateWood(data);
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
                    <FormLabel>Number of Ends (Fence Run)</FormLabel>
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
                    <FormLabel>Number of Corners (Fence Run)</FormLabel>
                    <FormControl><Input type="number" placeholder="e.g., 0" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)}/></FormControl>
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
            <ResultsCard title="Wood Fence Results" data={{
                ...results,
                totalRailLength: results.totalRailLength ? `${results.totalRailLength} ft` : undefined
            }} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
