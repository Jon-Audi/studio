"use client";
import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import type { UnitConverterInput } from '@/types';
import { UnitConverterSchema } from '@/types';
import { ArrowRightLeft, Scale } from 'lucide-react';

const lengthUnits = [
  { value: 'ft', label: 'Feet (ft)' },
  { value: 'm', label: 'Meters (m)' },
  { value: 'in', label: 'Inches (in)' },
  { value: 'cm', label: 'Centimeters (cm)' },
];

const conversionFactors: Record<string, Record<string, number>> = {
  ft: { m: 0.3048, in: 12, cm: 30.48 },
  m: { ft: 3.28084, in: 39.3701, cm: 100 },
  in: { ft: 1/12, m: 0.0254, cm: 2.54 },
  cm: { ft: 1/30.48, m: 0.01, in: 1/2.54 },
};

export function UnitConverterForm() {
  const [convertedValue, setConvertedValue] = useState<string | null>(null);

  const form = useForm<UnitConverterInput>({
    resolver: zodResolver(UnitConverterSchema),
    defaultValues: {
      value: 1,
      fromUnit: 'ft',
      toUnit: 'm',
    },
  });

  const { watch, setValue } = form;
  const watchedValues = watch();

  useEffect(() => {
    if (watchedValues.value !== undefined && watchedValues.fromUnit && watchedValues.toUnit) {
      handleConversion(watchedValues);
    }
  }, [watchedValues.value, watchedValues.fromUnit, watchedValues.toUnit]);


  function handleConversion(data: UnitConverterInput) {
    const { value, fromUnit, toUnit } = data;
    if (fromUnit === toUnit) {
      setConvertedValue(value.toString());
      return;
    }
    const factor = conversionFactors[fromUnit]?.[toUnit];
    if (factor) {
      setConvertedValue((value * factor).toFixed(4));
    } else {
      setConvertedValue('N/A'); // Should not happen with current setup
    }
  }
  
  function swapUnits() {
    const currentFrom = form.getValues("fromUnit");
    const currentTo = form.getValues("toUnit");
    setValue("fromUnit", currentTo);
    setValue("toUnit", currentFrom);
    // Recalculate with swapped units. Current value remains the same.
    handleConversion({value: form.getValues("value"), fromUnit: currentTo, toUnit: currentFrom});
  }


  return (
    <Card className="w-full max-w-md mx-auto shadow-xl">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Scale className="h-8 w-8 text-primary" />
          <CardTitle className="text-2xl font-headline">Unit Converter</CardTitle>
        </div>
        <CardDescription>Quickly convert between common length units.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6">
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter value" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-end space-x-2">
              <FormField
                control={form.control}
                name="fromUnit"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>From</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="From unit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {lengthUnits.map(u => <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="button" variant="ghost" size="icon" onClick={swapUnits} aria-label="Swap units">
                <ArrowRightLeft className="h-5 w-5" />
              </Button>
              <FormField
                control={form.control}
                name="toUnit"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>To</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="To unit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {lengthUnits.map(u => <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {convertedValue !== null && (
              <div className="mt-6 p-4 bg-muted rounded-md">
                <Label className="text-sm text-muted-foreground">Converted Value</Label>
                <p className="text-2xl font-bold text-primary">{convertedValue} {form.getValues("toUnit")}</p>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
