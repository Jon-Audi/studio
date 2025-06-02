import type { ChainlinkCalculatorInput, ChainlinkCalculatorResult, PipeCutCalculatorInput, PipeCutCalculatorResult } from '@/types';

export function calculateChainlink(data: ChainlinkCalculatorInput): ChainlinkCalculatorResult {
  const { fenceLength, fenceHeight, fenceType, ends = 0, corners = 0 } = data;
  const numericFenceLength = Number(fenceLength);
  const numericFenceHeight = parseInt(fenceHeight);
  const numericEnds = Number(ends);
  const numericCorners = Number(corners);

  const interiorLinePosts = Math.max(0, Math.floor(numericFenceLength / 10) - 2);
  const fabricFootage = numericFenceLength;
  const pipeWeight = fenceType === 'commercial' ? 'SS40 WT' : 'SS20 WT';
  const fabricType = '9ga wire';
  
  const topRailSticks = Math.ceil(numericFenceLength / 21);
  const tieWires = Math.ceil(numericFenceLength / 2);
  const loopCaps = interiorLinePosts;

  let result: ChainlinkCalculatorResult = {
    interiorLinePosts,
    fabricType,
    fabricFootage,
    topRailSticks,
    tieWires,
    loopCaps,
    pipeWeight,
  };

  if (numericEnds > 0 || numericCorners > 0) {
    const braceBands = (1 * numericEnds) + (2 * numericCorners);
    const tensionBars = (1 * numericEnds) + (2 * numericCorners);
    // Tension Bands: For an end: same as height in feet. For a corner: twice the height.
    const tensionBands = (numericFenceHeight * numericEnds) + (numericFenceHeight * 2 * numericCorners);
    const nutsAndBolts = tensionBands + braceBands;
    const postCaps = numericEnds + numericCorners;
    // Assuming rail end cups are 1 per end, 2 per corner
    // const railEndCups = (1 * numericEnds) + (2 * numericCorners);

    result = {
      ...result,
      braceBands,
      tensionBars,
      tensionBands,
      nutsAndBolts,
      postCaps,
      // railEndCups, // Not in provided output structure, but logic is there
    };
  }

  return result;
}


export function calculatePipeCuts(data: PipeCutCalculatorInput): PipeCutCalculatorResult {
  const { gateWidth, gateHeight, frameDiameter, gateType } = data;
  const numericGateWidth = Number(gateWidth);
  const numericGateHeight = Number(gateHeight);

  let totalDeduction = 0;
  if (frameDiameter === "1 3/8″") totalDeduction = 6;
  else if (frameDiameter === "1 5/8″") totalDeduction = 7.32;
  else if (frameDiameter === "2″") totalDeduction = 7.8;

  const isSingleGate = gateType === "Single";
  const leafs = isSingleGate ? 1 : 2;
  const leafWidth = numericGateWidth / leafs;
  
  const horizontalsLength = parseFloat((leafWidth - totalDeduction).toFixed(2));
  const uprightsLength = numericGateHeight;
  
  const postCount = isSingleGate ? 2 : 3;
  const postSpacing = postCount > 1 ? parseFloat((numericGateWidth / (postCount - 1)).toFixed(2)) : 0;

  return {
    uprightsLength,
    horizontalsLength,
    postCount,
    postSpacing,
    leafs,
  };
}
