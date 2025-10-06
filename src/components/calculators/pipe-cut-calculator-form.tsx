
"use client";
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { CATALOG, DEFAULTS } from '@/config/catalog';
import type { PipeCutCalculatorInput, PipeCutCalculatorResult, FullEstimateData } from '@/types';
import { PipeCutCalculatorSchema } from '@/types';
import { ResultsCard } from '@/components/shared/results-card';
import { GateShopDrawing } from '@/components/shared/gate-shop-drawing';
import { calculatePipeCuts } from '@/lib/calculators';
import { sendEstimateToInvoicingService } from '@/lib/actions';
import { useToast } from "@/hooks/use-toast";
import { Scissors, DoorOpen, Printer } from 'lucide-react';

export function PipeCutCalculatorForm() {
  const [results, setResults] = useState<PipeCutCalculatorResult | null>(null);
  const [formInputs, setFormInputs] = useState<PipeCutCalculatorInput | null>(null);
  const { toast } = useToast();

  const form = useForm<PipeCutCalculatorInput>({
    resolver: zodResolver(PipeCutCalculatorSchema),
    defaultValues: {
      calculationMode: 'opening',
      gateWidth: 48, // inches
      gateHeight: 48, // inches - for standard gates
      hingeSideHeight: DEFAULTS.GATE_PIPE.barrierHingeHeight,
      latchSideHeight: DEFAULTS.GATE_PIPE.barrierLatchHeight,
      frameDiameter: DEFAULTS.GATE_PIPE.frameDiameter,
      gateType: DEFAULTS.GATE_PIPE.gateType,
      frameColor: DEFAULTS.GATE_PIPE.frameColor,
      includeHorizontalBrace: true,
      includeVerticalBrace: true,
    },
    mode: 'onChange',
  });
  
  const calculationMode = form.watch('calculationMode');
  const gateType = form.watch('gateType');

  const handleCalculation = () => {
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
  };

  useEffect(() => {
    const subscription = form.watch((values, { name, type }) => {
      if (type === 'change') {
        handleCalculation();
      }
    });
    handleCalculation(); // Initial calculation
    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onSubmit(data: PipeCutCalculatorInput) {
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

  const widthLabel = calculationMode === 'opening' ? 'Opening Width (inches)' : 'Frame Width (inches)';
  const heightLabel = calculationMode === 'opening' ? 'Opening Height (inches)' : 'Frame Height (inches)';
  
  const showHorizontalBraceCheckbox = (results?.frameHeight || 0) > 48;
  const showVerticalBraceCheckbox = (results?.frameWidth || 0) > 60;
  const isBarrierGate = gateType === 'Barrier';

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
              <FormField
                control={form.control}
                name="calculationMode"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Calculate By</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex items-center space-x-4"
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="opening" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Opening Size
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="frame" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Frame Size
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="gateWidth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{widthLabel}</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 48" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {isBarrierGate ? (
                  <>
                    <FormField
                      control={form.control}
                      name="hingeSideHeight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hinge Side Height</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>{CATALOG.GATE_PIPE.BARRIER_HINGE_HEIGHTS.map(h => <SelectItem key={h} value={h}>{h}"</SelectItem>)}</SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="latchSideHeight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Latch Side Height</FormLabel>
                           <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>{CATALOG.GATE_PIPE.BARRIER_LATCH_HEIGHTS.map(h => <SelectItem key={h} value={h}>{h}"</SelectItem>)}</SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                ) : (
                  <FormField
                    control={form.control}
                    name="gateHeight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{heightLabel}</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 48" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

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
                          {CATALOG.GATE_PIPE.FRAME_COLORS.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
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
                          {CATALOG.GATE_PIPE.FRAME_DIAMETERS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
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
                          {CATALOG.GATE_PIPE.GATE_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {!isBarrierGate && (
                <div className="space-y-4">
                  <FormLabel>Bracing Options</FormLabel>
                  {showHorizontalBraceCheckbox && (
                      <FormField
                        control={form.control}
                        name="includeHorizontalBrace"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                Include Horizontal Brace
                              </FormLabel>
                              <FormDescription>
                                Recommended for gates over 48" tall.
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    )}
                    {showVerticalBraceCheckbox && (
                      <FormField
                        control={form.control}
                        name="includeVerticalBrace"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                Include Vertical Brace
                              </FormLabel>
                              <FormDescription>
                                Recommended for gates over 60" wide.
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    )}
                    {!showHorizontalBraceCheckbox && !showVerticalBraceCheckbox && (
                      <p className="text-sm text-muted-foreground p-4 border rounded-md">No bracing required for a gate of this size.</p>
                    )}
                </div>
              )}
            </form>
          </Form>

          {results && (
            <div className="mt-8 space-y-4">
               <ResultsCard
                title="Pipe Cut Results"
                data={{
                  'Calculation Mode': formInputs?.calculationMode === 'opening' ? 'Opening Size' : 'Frame Size',
                  'Required Opening': results.requiredOpening ? `${results.requiredOpening}"` : undefined,
                  'Final Frame Size': `${results.frameWidth}" W x ${results.frameHeight}" H`,
                  'Hinge Upright': isBarrierGate ? `${results.hingeSideHeight}"` : undefined,
                  'Latch Upright': isBarrierGate ? `${results.latchSideHeight}"` : undefined,
                  'Uprights Length (each)': !isBarrierGate ? `${results.uprightsLength}"` : undefined,
                  'Horizontals Length (each)': !isBarrierGate ? `${results.horizontalsLength}" (${results.leafs} leaf/leaves)` : undefined,
                  'Top Rail (Tapered)': isBarrierGate ? `${results.topRailLength}"` : undefined,
                  'Main Diagonal Brace': isBarrierGate ? `${results.mainDiagonalBraceLength}"` : undefined,
                  'Vertical Brace': isBarrierGate ? `${results.barrierVerticalBraceLength}"` : undefined,
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
