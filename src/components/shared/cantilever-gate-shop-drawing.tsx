
"use client";
import type { CantileverGateCalculatorInput, CantileverGateCalculatorResult } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DelawareFenceSolutionsLogoIcon } from '@/components/icons/delaware-fence-solutions-logo-icon';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface CantileverGateShopDrawingProps {
  results: CantileverGateCalculatorResult;
  inputs: CantileverGateCalculatorInput;
}

export function CantileverGateShopDrawing({ results, inputs }: CantileverGateShopDrawingProps) {
  const { openingSize, gateHeight, gateType } = inputs;
  const { 
    totalFrameLength, 
    counterBalanceLength,
    topAndBottomRails,
    verticalUprights,
    diagonalBraceLength,
    gateRollerPosts
  } = results;

  const drawingWidth = 800; // pixels
  const drawingHeight = (gateHeight / (gateType === 'double' ? totalFrameLength * 2 : totalFrameLength)) * drawingWidth;
  const scale = drawingWidth / (gateType === 'double' ? totalFrameLength * 2 : totalFrameLength);

  const leafOpeningSize = gateType === 'double' ? openingSize / 2 : openingSize;
  const leafFrameWidth = totalFrameLength;

  const counterBalanceDrawingWidth = counterBalanceLength * scale;
  const openingDrawingWidth = leafOpeningSize * scale;

  const uprightPositions = Array.from({ length: Math.ceil(topAndBottomRails.count / (gateType === 'double' ? 2 : 1)) / (gateHeight > 0 ? (verticalUprights.count / (topAndBottomRails.count / 2)) : 1) }).map((_, i) => {
      return i * verticalUprights.spacing * scale;
  });

  const rollerPostPlacement = gateRollerPosts.placement * scale;

  // Create Cut List
  const cutList = [
    { qty: topAndBottomRails.count, length: `${topAndBottomRails.length}'`, description: 'Top & Bottom Rails (2 ½" SS40)' },
    { qty: verticalUprights.count, length: `${verticalUprights.length}'`, description: `Vertical Uprights (2" SS40)` },
  ];
  if (diagonalBraceLength) {
     cutList.push({ qty: (gateType === 'double' ? 2 : 1), length: `${diagonalBraceLength}'`, description: 'Diagonal Brace (2")' });
  }

  return (
    <div className="p-8 bg-background text-foreground">
      <Card className="w-full max-w-5xl mx-auto border-2 border-foreground">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-3xl font-bold">Cantilever Gate Shop Drawing</CardTitle>
              <CardDescription className="text-base">
                {gateType === 'double' ? 'For Fabrication - Drawing shows ONE of TWO identical leaves.' : 'For Fabrication - All measurements in feet'}
              </CardDescription>
            </div>
            <DelawareFenceSolutionsLogoIcon className="h-12 w-auto" />
          </div>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-1 text-sm pt-4">
            <div className="font-semibold">Total Opening Size:</div><div>{openingSize}'</div>
            <div className="font-semibold">Gate Height:</div><div>{gateHeight}'</div>
            <div className="font-semibold">Gate Type:</div><div className="capitalize">{gateType}</div>
            <div className="font-semibold">Frame Length (per leaf):</div><div>{leafFrameWidth}'</div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Main Drawing Area */}
          <div className="mb-6 p-4 border-2 border-dashed border-muted-foreground overflow-x-auto">
            <div className="relative mx-auto" style={{ width: leafFrameWidth * scale, height: drawingHeight + 80 }}>

              {/* Gate Frame */}
              <div className="absolute border-4 border-foreground bg-background" style={{ width: leafFrameWidth * scale, height: drawingHeight }}>
                {/* Top and Bottom Rails */}
                <div className="absolute top-0 left-0 w-full h-2 bg-foreground"></div>
                <div className="absolute bottom-0 left-0 w-full h-2 bg-foreground"></div>
                
                {/* Vertical Uprights */}
                {uprightPositions.map((pos, i) => (
                    <div key={i} className="absolute top-0 h-full w-2 bg-foreground" style={{ left: pos }}></div>
                ))}
                
                {/* Diagonal Brace */}
                {diagonalBraceLength && leafOpeningSize > 20 && (
                    <div className="absolute top-0 w-2 bg-foreground/80 origin-top-left" 
                         style={{ 
                             height: Math.sqrt(drawingHeight**2 + (verticalUprights.spacing * scale)**2),
                             left: (uprightPositions[1]),
                             transform: `rotate(${Math.atan(drawingHeight / (verticalUprights.spacing * scale)) * -180 / Math.PI}deg)`
                         }}>
                    </div>
                )}

                {/* Counterbalance/Opening Divider */}
                <div className="absolute top-0 bottom-0 border-l-2 border-dashed border-red-500" style={{ left: counterBalanceDrawingWidth }}></div>
              </div>
              
              {/* Dimensions and Labels */}
              <div className="absolute -top-10 left-0" style={{ width: counterBalanceDrawingWidth }}>
                <div className="text-center text-sm font-semibold text-red-500">Counterbalance: {counterBalanceLength}'</div>
                <div className="h-1 border-t-2 border-red-500 mx-1"></div>
              </div>
              <div className="absolute -top-10" style={{ left: counterBalanceDrawingWidth, width: openingDrawingWidth }}>
                <div className="text-center text-sm font-semibold">Opening (leaf): {leafOpeningSize}'</div>
                <div className="h-1 border-t-2 border-foreground mx-1"></div>
              </div>
              <div className="absolute -top-16 left-0 w-full">
                <div className="text-center text-lg font-bold">Frame Length: {leafFrameWidth}'</div>
                <div className="flex justify-center items-center">
                    <div className="border-t-2 border-b-2 border-l-2 border-foreground h-4 w-1"></div>
                    <div className="flex-grow border-t-2 border-foreground"></div>
                    <div className="border-t-2 border-b-2 border-r-2 border-foreground h-4 w-1"></div>
                </div>
              </div>

               {/* Roller Post Placements */}
               <div className="absolute top-full mt-4" style={{ left: 0 }}>
                    <div className="w-4 h-4 bg-primary rounded-full transform -translate-x-1/2" title="Roller Post 1"></div>
                    <div className="text-xs absolute top-full mt-1 -translate-x-1/2">Post 1</div>
               </div>
               <div className="absolute top-full mt-4" style={{ left: rollerPostPlacement }}>
                    <div className="w-4 h-4 bg-primary rounded-full transform -translate-x-1/2" title={`Roller Post 2 (${gateRollerPosts.placement}' from end)`}></div>
                     <div className="text-xs absolute top-full mt-1 -translate-x-1/2 whitespace-nowrap">Post 2 ({gateRollerPosts.placement}')</div>
               </div>
                <div className="absolute top-full mt-4" style={{ left: counterBalanceDrawingWidth }}>
                    <div className="w-4 h-4 bg-accent rounded-full transform -translate-x-1/2" title="Catch Post"></div>
                     <div className="text-xs absolute top-full mt-1 -translate-x-1/2">Catch Post</div>
               </div>
            </div>
          </div>

          {/* Cut List Table */}
          <div>
            <h3 className="text-xl font-bold mb-2">Total Cut List for {gateType === 'double' ? 'Two Gates' : 'Gate'}</h3>
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

    