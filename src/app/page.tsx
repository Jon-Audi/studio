
import { AppHeader } from '@/components/layout/app-header';
import { AppFooter } from '@/components/layout/app-footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChainlinkCalculatorForm } from '@/components/calculators/chainlink-calculator-form';
import { VinylCalculatorForm } from '@/components/calculators/vinyl-calculator-form';
import { WoodCalculatorForm } from '@/components/calculators/wood-calculator-form';
import { AluminumCalculatorForm } from '@/components/calculators/aluminum-calculator-form';
import { SplitRailCalculatorForm } from '@/components/calculators/split-rail-calculator-form';
import { PipeCutCalculatorForm } from '@/components/calculators/pipe-cut-calculator-form';
import { UnitConverterForm } from '@/components/tools/unit-converter-form';
import { LakelandTwoCalculatorForm } from '@/components/calculators/lakeland-two-calculator-form';
import { BallFieldCalculatorForm } from '@/components/calculators/ball-field-calculator-form';
import { Fence, Scissors, Scale, TreePine, LayoutPanelLeft, BarChartHorizontalBig, Layers, Wrench, CircleDot } from 'lucide-react';

const SplitRailIconTab = () => (
 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4 lucide lucide-grip-horizontal"><circle cx="12" cy="9" r="1"></circle><circle cx="19" cy="9" r="1"></circle><circle cx="5" cy="9" r="1"></circle><circle cx="12" cy="15" r="1"></circle><circle cx="19" cy="15" r="1"></circle><circle cx="5" cy="15" r="1"></circle></svg>
);

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Tabs defaultValue="chainlink" className="w-full">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-4 md:grid-cols-8 gap-2 mb-6 h-auto flex-wrap justify-start">
            <TabsTrigger value="chainlink" className="flex-grow data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Fence className="mr-2 h-4 w-4" /> Chain Link
            </TabsTrigger>
            <TabsTrigger value="gatepipe" className="flex-grow data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Scissors className="mr-2 h-4 w-4" /> Gate Pipe
            </TabsTrigger>
            <TabsTrigger value="vinyl" className="flex-grow data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <LayoutPanelLeft className="mr-2 h-4 w-4" /> Vinyl
            </TabsTrigger>
            <TabsTrigger value="wood" className="flex-grow data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <TreePine className="mr-2 h-4 w-4" /> Wood
            </TabsTrigger>
            <TabsTrigger value="aluminum" className="flex-grow data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <BarChartHorizontalBig className="mr-2 h-4 w-4" /> Aluminum
            </TabsTrigger>
            <TabsTrigger value="splitrail" className="flex-grow data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <SplitRailIconTab />
              Split Rail
            </TabsTrigger>
            <TabsTrigger value="ballfield" className="flex-grow data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <CircleDot className="mr-2 h-4 w-4" /> Ball Field
            </TabsTrigger>
            <TabsTrigger value="tools" className="flex-grow data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Wrench className="mr-2 h-4 w-4" /> Tools
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chainlink">
            <ChainlinkCalculatorForm />
          </TabsContent>
          <TabsContent value="gatepipe">
            <PipeCutCalculatorForm />
          </TabsContent>
          <TabsContent value="vinyl">
            <VinylCalculatorForm />
          </TabsContent>
          <TabsContent value="wood">
            <WoodCalculatorForm />
          </TabsContent>
          <TabsContent value="aluminum">
            <AluminumCalculatorForm />
          </TabsContent>
           <TabsContent value="splitrail">
            <SplitRailCalculatorForm />
          </TabsContent>
          <TabsContent value="ballfield">
            <BallFieldCalculatorForm />
          </TabsContent>
          <TabsContent value="tools">
            <div className="space-y-12">
              <div>
                <h2 className="text-xl font-semibold mb-3 flex items-center">
                  <Layers className="mr-2 h-5 w-5 text-primary" />
                  Lakeland 2 Section Calculator
                </h2>
                <LakelandTwoCalculatorForm />
              </div>
              <div>
                 <h2 className="text-xl font-semibold mb-3 flex items-center">
                  <Scale className="mr-2 h-5 w-5 text-primary" />
                  Unit Converter
                </h2>
                <UnitConverterForm />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <AppFooter />
    </div>
  );
}
