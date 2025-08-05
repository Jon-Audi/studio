
"use client";
import type { PipeCutCalculatorInput, PipeCutCalculatorResult } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DelawareFenceSolutionsLogoIcon } from '@/components/icons/delaware-fence-solutions-logo-icon';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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
    <div key={key} className="flex flex-col items-center justify-center border-4 border-foreground relative bg-background" style={{ aspectRatio: `${leafWidth / Number(gateHeight)}` }}>
      {/* Horizontal top bar with label */}
      <div className="w-full relative flex justify-center items-center p-1">
        <div className="w-full h-2 bg-foreground"></div>
      </div>

      {/* Main body of the gate */}
      <div className="flex-grow w-full flex items-center justify-center relative">
        {/* Vertical bar with label */}
        <div className="h-full w-2 bg-foreground relative flex items-center justify-center"></div>
        <div className="flex-grow h-full relative">
          {/* Bracing */}
          {horizontalBraceLength && (
              <div className="absolute top-1/2 left-0 w-full h-2 bg-foreground/80 -translate-y-1/2 flex justify-center items-center">
                   <span className="absolute text-xs font-bold bg-background px-1 text-foreground -mt-5">{horizontalBraceLength}"</span>
              </div>
          )}
          {verticalBracePieces && (
            <div className="absolute left-1/2 top-0 h-full w-2 bg-foreground/80 -translate-x-1/2 flex flex-col justify-between items-center py-2">
                <div className="absolute top-0 bottom-1/2 mb-1 left-0 right-0 flex items-center justify-center">
                   <span className="absolute text-xs font-bold bg-background px-1 text-foreground">{verticalBracePieces.length}"</span>
                </div>
                <div className="absolute bottom-0 top-1/2 mt-1 left-0 right-0 flex items-center justify-center">
                   <span className="absolute text-xs font-bold bg-background px-1 text-foreground">{verticalBracePieces.length}"</span>
                </div>
            </div>
          )}
        </div>
        <div className="h-full w-2 bg-foreground"></div>
      </div>
      
      {/* Horizontal bottom bar */}
      <div className="w-full h-2 bg-foreground"></div>
    </div>
  );

  const leafDisplayWidth = leafs > 1 ? (Number(gateWidth) - 2) / leafs : Number(gateWidth);

  // Create Cut List
  const cutList = [
    { qty: leafs * 2, length: `${uprightsLength}"`, description: 'Frame Uprights (Cut)' },
    { qty: leafs * 2, length: `${horizontalsLength}"`, description: 'Frame Horizontals (Cut)' },
  ];

  if (horizontalBraceLength) {
    cutList.push({ qty: leafs, length: `${horizontalBraceLength}"`, description: 'Horizontal Brace (Cut & Notch)' });
  }

  if (verticalBracePieces) {
    cutList.push({ qty: leafs * verticalBracePieces.count, length: `${verticalBracePieces.length}"`, description: 'Vertical Brace Pieces (Cut & Notch)' });
  }

  return (
    <div className="p-8 bg-background text-foreground">
      <Card className="w-full max-w-4xl mx-auto border-2 border-foreground">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-3xl font-bold">Gate Shop Drawing</CardTitle>
              <CardDescription className="text-base">For Fabrication - All measurements in inches</CardDescription>
            </div>
            <DelawareFenceSolutionsLogoIcon className="h-12 w-auto" />
          </div>
           <div className="grid grid-cols-4 gap-x-4 gap-y-1 text-sm pt-4">
            <div className="font-semibold">Gate Type:</div><div>{gateType}</div>
            <div className="font-semibold">Overall Width:</div><div>{gateWidth}"</div>
            <div className="font-semibold">Frame Diameter:</div><div>{frameDiameter}</div>
            <div className="font-semibold">Overall Height:</div><div>{gateHeight}"</div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Main Drawing Area */}
          <div className="mb-6 p-4 border-2 border-dashed border-muted-foreground">
            <div className="mx-auto" style={{ maxWidth: '800px'}}>
              {/* Overall Width Dimension */}
              <div className="flex justify-center items-center mb-2">
                <div className="border-t-2 border-b-2 border-l-2 border-foreground h-4 w-1"></div>
                <div className="flex-grow border-t-2 border-foreground text-center relative">
                  <span className="text-lg font-bold bg-background px-2 absolute -top-3 left-1/2 -translate-x-1/2">{gateWidth}"</span>
                </div>
                <div className="border-t-2 border-b-2 border-r-2 border-foreground h-4 w-1"></div>
              </div>

              <div className="flex items-start">
                {/* Overall Height Dimension */}
                <div className="flex flex-col justify-center items-center mr-2">
                  <div className="border-l-2 border-r-2 border-t-2 border-foreground w-4 h-1"></div>
                  <div className="flex-grow border-l-2 border-foreground text-center writing-mode-vertical-rl transform -rotate-180 relative">
                    <span className="text-lg font-bold bg-background py-2 absolute -left-3 top-1/2 -translate-y-1/2">{gateHeight}"</span>
                  </div>
                   <div className="border-l-2 border-r-2 border-b-2 border-foreground w-4 h-1"></div>
                </div>

                {/* Gate Representation */}
                <div className="flex-grow flex items-stretch gap-2 relative" style={{aspectRatio: `${aspectRatio}`}}>
                   {Array.from({ length: leafs }).map((_, i) => renderGateLeaf(i, leafDisplayWidth))}
                   {/* Labels for internal cuts */}
                   <div className="absolute top-1/4 -translate-y-1/2 left-1/2 -translate-x-1/2 text-sm font-bold bg-background px-1 text-foreground">{horizontalsLength}"</div>
                   <div className="absolute bottom-1/4 translate-y-1/2 left-1/2 -translate-x-1/2 text-sm font-bold bg-background px-1 text-foreground">{horizontalsLength}"</div>
                   <div className="absolute left-1/4 -translate-x-1/2 top-1/2 -translate-y-1/2 text-sm font-bold bg-background px-1 text-foreground -rotate-90 whitespace-nowrap">{uprightsLength}"</div>
                   <div className="absolute right-1/4 translate-x-1/2 top-1/2 -translate-y-1/2 text-sm font-bold bg-background px-1 text-foreground -rotate-90 whitespace-nowrap">{uprightsLength}"</div>
                </div>
              </div>
            </div>
          </div>

          {/* Cut List Table */}
          <div>
            <h3 className="text-xl font-bold mb-2">Cut & Notch List</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Quantity</TableHead>
                  <TableHead className="w-[150px]">Cut Length</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cutList.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.qty}</TableCell>
                    <TableCell>{item.length}</TableCell>
                    <TableCell>{item.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

        </CardContent>
      </Card>
      <p className="text-center text-muted-foreground mt-4 text-xs no-print">
        © {new Date().getFullYear()} Delaware Fence Solutions Pro Estimator
      </p>
    </div>
  );
}
