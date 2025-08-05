
"use client";
import type { PipeCutCalculatorInput, PipeCutCalculatorResult } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DelawareFenceSolutionsLogoIcon } from '@/components/icons/delaware-fence-solutions-logo-icon';

interface GateShopDrawingProps {
  results: PipeCutCalculatorResult;
  inputs: PipeCutCalculatorInput;
}

export function GateShopDrawing({ results, inputs }: GateShopDrawingProps) {
  const { gateWidth, gateHeight, frameDiameter, gateType } = inputs;
  const { uprightsLength, horizontalsLength, leafs, horizontalBraceLength, verticalBracePieces } = results;

  const aspectRatio = Number(gateWidth) / Number(gateHeight);

  // A function to render a single gate leaf
  const renderGateLeaf = (key: number, leafWidth: number) => (
    <div key={key} className="flex flex-col items-center justify-center border-4 border-foreground relative" style={{ aspectRatio: `${leafWidth / Number(gateHeight)}` }}>
      {/* Horizontal top bar with label */}
      <div className="w-full relative flex justify-center items-center p-1">
        <div className="w-full h-4 bg-muted-foreground"></div>
        <span className="absolute text-sm font-bold bg-background px-1 text-foreground">{horizontalsLength}" (Cut)</span>
      </div>

      {/* Main body of the gate */}
      <div className="flex-grow w-full flex items-center justify-center relative">
        {/* Vertical bar with label */}
        <div className="h-full w-4 bg-muted-foreground relative flex items-center justify-center">
          <span className="absolute text-sm font-bold bg-background px-1 text-foreground -rotate-90 whitespace-nowrap">{uprightsLength}" (Cut)</span>
        </div>
        <div className="flex-grow h-full relative">
          {/* Bracing */}
          {horizontalBraceLength && (
              <div className="absolute top-1/2 left-0 w-full h-4 bg-muted-foreground/80 -translate-y-1/2 flex justify-center items-center">
                   <span className="absolute text-xs font-bold bg-background px-1 text-foreground">{horizontalBraceLength}" (Cut)</span>
              </div>
          )}
          {verticalBracePieces && (
            <div className="absolute left-1/2 top-0 h-full w-4 bg-muted-foreground/80 -translate-x-1/2 flex flex-col justify-between items-center py-2">
                <div className="h-full flex items-center">
                  <span className="absolute text-xs font-bold bg-background py-1 text-foreground -rotate-90 whitespace-nowrap -translate-y-1/2 top-1/4">{verticalBracePieces.length}" (Cut)</span>
                </div>
                 <div className="h-full flex items-center">
                   <span className="absolute text-xs font-bold bg-background py-1 text-foreground -rotate-90 whitespace-nowrap translate-y-1/2 bottom-1/4">{verticalBracePieces.length}" (Cut)</span>
                </div>
            </div>
          )}
        </div>
        <div className="h-full w-4 bg-muted-foreground"></div>
      </div>
      
      {/* Horizontal bottom bar */}
      <div className="w-full h-4 bg-muted-foreground"></div>
    </div>
  );

  const leafDisplayWidth = leafs > 1 ? (Number(gateWidth) - 2) / leafs : Number(gateWidth);

  return (
    <div className="p-8 bg-background text-foreground">
      <Card className="w-full max-w-4xl mx-auto border-2 border-foreground">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold">Gate Shop Drawing</CardTitle>
              <CardDescription>All measurements in inches</CardDescription>
            </div>
            <DelawareFenceSolutionsLogoIcon className="h-12 w-auto" />
          </div>
        </CardHeader>
        <CardContent>
          {/* Main Drawing Area */}
          <div className="mb-6 p-4 border-2 border-dashed border-muted-foreground">
            <div className="mx-auto" style={{ maxWidth: '800px'}}>

              {/* Overall Width Dimension */}
              <div className="flex justify-center items-center mb-2">
                <div className="border-t-2 border-b-2 border-l-2 border-foreground h-4 w-1"></div>
                <div className="flex-grow border-t-2 border-foreground text-center">
                  <span className="text-lg font-bold bg-background px-2">{gateWidth}" (Overall)</span>
                </div>
                <div className="border-t-2 border-b-2 border-r-2 border-foreground h-4 w-1"></div>
              </div>

              <div className="flex items-start">
                {/* Overall Height Dimension */}
                <div className="flex flex-col justify-center items-center mr-2">
                  <div className="border-l-2 border-r-2 border-t-2 border-foreground w-4 h-1"></div>
                  <div className="flex-grow border-l-2 border-foreground text-center writing-mode-vertical-rl transform -rotate-180">
                    <span className="text-lg font-bold bg-background py-2">{gateHeight}" (Overall)</span>
                  </div>
                   <div className="border-l-2 border-r-2 border-b-2 border-foreground w-4 h-1"></div>
                </div>

                {/* Gate Representation */}
                <div className="flex-grow flex items-stretch gap-2" style={{aspectRatio: `${aspectRatio}`}}>
                   {Array.from({ length: leafs }).map((_, i) => renderGateLeaf(i, leafDisplayWidth))}
                </div>
              </div>
            </div>
          </div>

          {/* Details Table */}
          <div className="grid grid-cols-2 gap-4 text-lg">
            <div className="font-semibold">Gate Type:</div><div>{gateType}</div>
            <div className="font-semibold">Frame Diameter:</div><div>{frameDiameter}</div>
            <div className="font-semibold">Leafs:</div><div>{leafs}</div>
            <div className="font-semibold">Horizontal Cut (per leaf):</div><div>{horizontalsLength}"</div>
            <div className="font-semibold">Vertical Cut (per upright):</div><div>{uprightsLength}"</div>
            {horizontalBraceLength && <div className="font-semibold">Horizontal Brace (Cut):</div>}
            {horizontalBraceLength && <div>{horizontalBraceLength}"</div>}
            {verticalBracePieces && <div className="font-semibold">Vertical Brace (Cut):</div>}
            {verticalBracePieces && <div>{`${verticalBracePieces.count} pieces @ ${verticalBracePieces.length}"`}</div>}
          </div>
        </CardContent>
      </Card>
      <p className="text-center text-muted-foreground mt-4 text-xs no-print">
        © {new Date().getFullYear()} Delaware Fence Solutions Pro Estimator
      </p>
    </div>
  );
}
