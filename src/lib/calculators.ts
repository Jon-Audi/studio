import type { 
  ChainlinkCalculatorInput, ChainlinkCalculatorResult, 
  PipeCutCalculatorInput, PipeCutCalculatorResult,
  VinylCalculatorInput, VinylCalculatorResult,
  WoodCalculatorInput, WoodCalculatorResult,
  AluminumCalculatorInput, AluminumCalculatorResult,
  SplitRailCalculatorInput, SplitRailCalculatorResult
} from '@/types';

export function calculateChainlink(data: ChainlinkCalculatorInput): ChainlinkCalculatorResult {
  const { fenceLength, fenceHeight, fenceType, ends = 0, corners = 0 } = data;
  const numericFenceLength = Number(fenceLength);
  const numericFenceHeight = parseInt(fenceHeight);
  const numericEnds = Number(ends);
  const numericCorners = Number(corners);

  // A common spacing for line posts is 10 feet.
  // Total posts for a straight run (ends=2, corners=0) would be Math.floor(length/10) + 1.
  // Terminal posts are ends and corners.
  // Line posts = Total posts slots - terminal posts slots.
  // Number of sections = Math.ceil(fenceLength / 10).
  // Total post locations = sections + 1.
  // Interior line posts = (sections + 1) - (ends + corners) if ends/corners are part of the length.
  // Or, if ends/corners are additional:
  const linePostSpacing = 10; // feet
  let interiorLinePosts = 0;
  if (numericFenceLength > 0) {
    interiorLinePosts = Math.max(0, Math.floor(numericFenceLength / linePostSpacing) -1); 
    // If length is 20ft, 20/10 - 1 = 1 line post. Total 3 posts with 2 ends.
    // If length is 10ft, 10/10 - 1 = 0 line posts. Total 2 posts with 2 ends.
  }
   // Ensure ends are accounted for even in short fences
  if (numericFenceLength > 0 && numericEnds > 0 && numericFenceLength <= linePostSpacing && interiorLinePosts === 0 && numericCorners === 0) {
     // For a single section fence e.g. 10ft with 2 ends, it will need 0 interiorLinePosts
     // but if ends are specified they are terminal posts.
     // The original logic was `Math.floor(numericFenceLength / 10) - 2` which is different.
     // Let's refine: assume ends and corners are distinct posts.
     // Number of sections is fenceLength / 10. Number of post 'slots' = sections + 1
     // If we have `ends` and `corners`, these are terminal posts.
     // Line posts = (fenceLength / 10 (rounded up perhaps, or down for strict 10ft sections)) -1 for first post, minus corners
     interiorLinePosts = Math.max(0, Math.ceil(numericFenceLength / linePostSpacing) - 1 - numericCorners);
     if (numericEnds === 1 && numericCorners === 0 && numericFenceLength > 0) { // One end, like a fence ending at a house
        interiorLinePosts = Math.ceil(numericFenceLength / linePostSpacing) -1;
     } else if (numericEnds === 0 && numericFenceLength > 0) { // A stretch of fence between two corners or other existing structures
        interiorLinePosts = Math.ceil(numericFenceLength / linePostSpacing) + 1 - numericCorners;
     }
  }


  const fabricFootage = numericFenceLength;
  const pipeWeight = fenceType === 'commercial' ? 'SS40 WT' : 'SS20 WT';
  const fabricType = '9ga wire';
  
  const topRailSticks = Math.ceil(numericFenceLength / 21); // Rails are often 21ft
  const tieWires = Math.ceil(numericFenceLength * 1.5); // Approximation: 1 tie wire per foot, plus some for top rail.
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
    const braceBands = (1 * numericEnds) + (2 * numericCorners); // Typically 1 per end, 2 per corner for top rail
    const tensionBars = (1 * numericEnds) + (2 * numericCorners); // 1 per end, 2 per corner
    const tensionBands = (numericFenceHeight * numericEnds) + (numericFenceHeight * 2 * numericCorners);
    const nutsAndBolts = tensionBands + braceBands; // Each band needs a nut & bolt
    const postCaps = numericEnds + numericCorners; // Dome caps for terminal posts

    result = {
      ...result,
      braceBands,
      tensionBars,
      tensionBands,
      nutsAndBolts,
      postCaps,
    };
  }
  return result;
}


export function calculatePipeCuts(data: PipeCutCalculatorInput): PipeCutCalculatorResult {
  const { gateWidth, gateHeight, frameDiameter, gateType } = data;
  const numericGateWidth = Number(gateWidth);
  const numericGateHeight = Number(gateHeight);

  let totalDeduction = 0; // Deduction for fittings, hinges, latch for overall width
  // These deductions are typical for weld-on hinges and a standard latch.
  if (frameDiameter === "1 3/8″") totalDeduction = 3; // Approx 1.5" per side
  else if (frameDiameter === "1 5/8″") totalDeduction = 3.5; // Approx 1.75" per side
  else if (frameDiameter === "2″") totalDeduction = 4; // Approx 2" per side

  const isSingleGate = gateType === "Single";
  const leafs = isSingleGate ? 1 : 2;
  
  // For double gates, add center gap deduction, e.g., 1 inch
  const doubleGateGap = isSingleGate ? 0 : 1;
  const adjustedGateWidth = numericGateWidth - totalDeduction - doubleGateGap;
  
  const leafWidth = adjustedGateWidth / leafs;
  
  // Frame pipe cuts (these are inside dimensions of the frame usually)
  // The uprights are usually the full height. Horizontals fit between them.
  // Deduction for corner fittings (e.g., malleable corners or welded)
  let cornerFittingDeduction = 0; // assume this is for *each end* of a horizontal pipe
  if (frameDiameter === "1 3/8″") cornerFittingDeduction = 1.5 * 2; // 1.5" per corner fitting
  else if (frameDiameter === "1 5/8″") cornerFittingDeduction = 1.75 * 2;
  else if (frameDiameter === "2″") cornerFittingDeduction = 2 * 2;


  const horizontalsLength = parseFloat((leafWidth - cornerFittingDeduction).toFixed(2));
  const uprightsLength = numericGateHeight; // Assuming height is finished height of frame
  
  const postCount = isSingleGate ? 2 : (leafs === 2 ? 2 : 0); // 2 posts for single, 2 for double (drop rods handle center)
  // Post spacing is the opening width for the gate itself
  const postSpacing = numericGateWidth;


  return {
    uprightsLength,
    horizontalsLength,
    postCount,
    postSpacing,
    leafs,
  };
}

export function calculateVinyl(data: VinylCalculatorInput): VinylCalculatorResult {
  const { fenceLength, panelWidth, ends = 0, corners = 0 } = data;
  const numericFenceLength = Number(fenceLength);
  const numericPanelWidth = Number(panelWidth);
  const numericEnds = Number(ends);
  const numericCorners = Number(corners);

  const numPanels = Math.ceil(numericFenceLength / numericPanelWidth);
  // Standard post calculation: one post per panel, plus one final post.
  // Terminals (ends/corners) replace line posts at those positions.
  const totalPostLocations = numPanels + 1;
  const numTerminalPosts = numericEnds + numericCorners;
  const numLinePosts = Math.max(0, totalPostLocations - numTerminalPosts);
  const totalPosts = numLinePosts + numTerminalPosts;
  const postCaps = totalPosts;

  return {
    numPanels,
    numLinePosts,
    numTerminalPosts,
    totalPosts,
    postCaps,
  };
}

export function calculateWood(data: WoodCalculatorInput): WoodCalculatorResult {
  const { fenceLength, postSpacing, picketWidth, numRails, ends = 0, corners = 0 } = data;
  const numericFenceLength = Number(fenceLength);
  const numericPostSpacing = Number(postSpacing);
  const numericPicketWidth = Number(picketWidth); // inches
  const numericNumRails = Number(numRails);
  const numericEnds = Number(ends);
  const numericCorners = Number(corners);

  const numSections = Math.ceil(numericFenceLength / numericPostSpacing);
  
  const totalPostLocations = numSections + 1;
  const numTerminalPosts = numericEnds + numericCorners;
  const numLinePosts = Math.max(0, totalPostLocations - numTerminalPosts);
  const totalPosts = numLinePosts + numTerminalPosts;
  
  // Assuming pickets are placed edge-to-edge for privacy fence
  const numPickets = Math.ceil((numericFenceLength * 12) / numericPicketWidth); 
  const totalRailLength = numSections * numericPostSpacing * numericNumRails; // Total linear feet of rail
  const bagsOfConcrete = totalPosts; // Typically 1 bag per post, can vary

  return {
    numSections,
    numLinePosts,
    numTerminalPosts,
    totalPosts,
    numPickets,
    totalRailLength,
    bagsOfConcrete,
  };
}

export function calculateAluminum(data: AluminumCalculatorInput): AluminumCalculatorResult {
  const { fenceLength, panelWidth, ends = 0, corners = 0 } = data;
  // Logic is very similar to Vinyl
  const numericFenceLength = Number(fenceLength);
  const numericPanelWidth = Number(panelWidth);
  const numericEnds = Number(ends);
  const numericCorners = Number(corners);

  const numPanels = Math.ceil(numericFenceLength / numericPanelWidth);
  const totalPostLocations = numPanels + 1;
  const numTerminalPosts = numericEnds + numericCorners;
  const numLinePosts = Math.max(0, totalPostLocations - numTerminalPosts);
  const totalPosts = numLinePosts + numTerminalPosts;
  const postCaps = totalPosts;

  return {
    numPanels,
    numLinePosts,
    numTerminalPosts,
    totalPosts,
    postCaps,
  };
}

export function calculateSplitRail(data: SplitRailCalculatorInput): SplitRailCalculatorResult {
  const { fenceLength, numRailsPerSection, postSpacing } = data;
  const numericFenceLength = Number(fenceLength);
  const numericNumRailsPerSection = Number(numRailsPerSection);
  const numericPostSpacing = Number(postSpacing);

  const numSections = Math.ceil(numericFenceLength / numericPostSpacing);
  const numPosts = numSections + 1; // Includes end posts
  const numRails = numSections * numericNumRailsPerSection;

  return {
    numSections,
    numPosts,
    numRails,
  };
}
