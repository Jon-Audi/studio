
import { AppHeader } from '@/components/layout/app-header';
import { AppFooter } from '@/components/layout/app-footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChainlinkCalculatorForm } from '@/components/calculators/chainlink-calculator-form';
import { VinylCalculatorForm } from '@/components/calculators/vinyl-calculator-form';
import { WoodCalculatorForm } from '@/components/calculators/wood-calculator-form';
import { AluminumCalculatorForm } from '@/components/calculators/aluminum-calculator-form';
import { SplitRailCalculatorForm } from '@/components/calculators/split-rail-calculator-form';
import { PipeCutCalculatorForm } from '@/components/calculators/pipe-cut-calculator-form';
import { AiRecommenderForm } from '@/components/tools/ai-recommender-form';
import { UnitConverterForm } from '@/components/tools/unit-converter-form';
import { Fence, Scissors, Sparkles, Scale, TreePine, LayoutPanelLeft, BarChartHorizontalBig } from 'lucide-react';

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
              <Fence className="mr-2 h-4 w-4" /> Chain-link
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
            <TabsTrigger value="gatepipe" className="flex-grow data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Scissors className="mr-2 h-4 w-4" /> Gate Pipe
            </TabsTrigger>
            <TabsTrigger value="unitconverter" className="flex-grow data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Scale className="mr-2 h-4 w-4" /> Unit Converter
            </TabsTrigger>
            <TabsTrigger value="airecommend" className="flex-grow data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Sparkles className="mr-2 h-4 w-4" /> AI Recommends
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chainlink">
            <ChainlinkCalculatorForm />
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
          <TabsContent value="gatepipe">
            <PipeCutCalculatorForm />
          </TabsContent>
          <TabsContent value="unitconverter">
            <UnitConverterForm />
          </TabsContent>
          <TabsContent value="airecommend">
            <AiRecommenderForm />
          </TabsContent>
        </Tabs>
      </main>
      <AppFooter />
    </div>
  );
}
