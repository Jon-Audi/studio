
import type { 
  ChainlinkCalculatorInput, ChainlinkCalculatorResult, 
  PipeCutCalculatorInput, PipeCutCalculatorResult,
  VinylCalculatorInput, VinylCalculatorResult,
  WoodCalculatorInput, WoodCalculatorResult,
  AluminumCalculatorInput, AluminumCalculatorResult,
  SplitRailCalculatorInput, SplitRailCalculatorResult
} from '@/types';
import { SINGLE_GATE_WIDTH_OPTIONS, DOUBLE_GATE_WIDTH_OPTIONS } from '@/config/constants';


export function calculateChainlink(data: ChainlinkCalculatorInput): ChainlinkCalculatorResult {
  const { fenceLength, fenceHeight, fenceType, ends = 0, corners = 0 } = data;
  const numericFenceLength = Number(fenceLength);
  const numericFenceHeight = parseInt(fenceHeight);
  const numericEnds = Number(ends);
  const numericCorners = Number(corners);

  const linePostSpacing = 10; 
  let interiorLinePosts = 0;
  if (numericFenceLength > 0) {
    const sections = Math.ceil(numericFenceLength / linePostSpacing);
    let postSpots = sections + 1;
    interiorLinePosts = Math.max(0, postSpots - 2 - numericCorners); 
    if(numericEnds === 1 && numericCorners === 0){ 
        interiorLinePosts = Math.max(0, postSpots - 1 - numericCorners);
    } else if(numericEnds === 0 && numericCorners >=0){ 
        interiorLinePosts = Math.max(0, postSpots - numericCorners);
    } else if (numericEnds === 0 && numericCorners === 0 && numericFenceLength > 0) { // A straight run with no specified ends/corners as terminal posts.
        interiorLinePosts = Math.max(0, sections -1); // e.g. 100ft = 10 sections, 9 line posts. plus 2 implicit ends for a total of 11 posts for the line.
    }
  }


  const fabricFootage = numericFenceLength;
  const pipeWeight = fenceType === 'commercial' ? 'SS40 WT' : 'SS20 WT';
  const fabricType = '9ga wire';
  
  const topRailSticks = Math.ceil(numericFenceLength / 21); 
  const tieWires = Math.ceil(numericFenceLength * 1.5); 
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

  const terminalPosts = numericEnds + numericCorners;
  if (terminalPosts > 0) {
    const braceBands = (1 * numericEnds) + (2 * numericCorners); 
    const tensionBars = (1 * numericEnds) + (2 * numericCorners); 
    const tensionBands = (numericFenceHeight * terminalPosts); // Simpler: N per terminal post
    const nutsAndBolts = tensionBands + braceBands; 
    const postCaps = terminalPosts; 

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

  let totalDeduction = 0; 
  if (frameDiameter === "1 3/8″") totalDeduction = 3; 
  else if (frameDiameter === "1 5/8″") totalDeduction = 3.5; 
  else if (frameDiameter === "2″") totalDeduction = 4; 

  const isSingleGate = gateType === "Single";
  const leafs = isSingleGate ? 1 : 2;
  
  const doubleGateGap = isSingleGate ? 0 : 1;
  const adjustedGateWidth = numericGateWidth - totalDeduction - doubleGateGap;
  
  const leafWidth = adjustedGateWidth / leafs;
  
  let cornerFittingDeduction = 0; 
  if (frameDiameter === "1 3/8″") cornerFittingDeduction = 1.5 * 2; 
  else if (frameDiameter === "1 5/8″") cornerFittingDeduction = 1.75 * 2;
  else if (frameDiameter === "2″") cornerFittingDeduction = 2 * 2;


  const horizontalsLength = parseFloat((leafWidth - cornerFittingDeduction).toFixed(2));
  const uprightsLength = numericGateHeight; 
  
  const postCount = isSingleGate ? 2 : (leafs === 2 ? 2 : 0); 
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
  const { fenceLength, panelWidth, ends = 0, corners = 0, gateType, gateWidth } = data;
  const numericFenceLength = Number(fenceLength);
  const numericPanelWidth = Number(panelWidth);
  const numericEnds = Number(ends);
  const numericCorners = Number(corners);

  let results: VinylCalculatorResult = {};
  let fenceLengthForPanels = numericFenceLength;
  let actualGateWidthValue = 0;
  let calculatedGatePosts = 0;
  let calculatedSsPvcHinges = 0;
  let calculatedSsPvcLatches = 0;
  let calculatedSsDropRods = 0;
  let gateWidthLabel: string | undefined = undefined;


  if (gateType && gateType !== "none" && gateWidth) {
    actualGateWidthValue = parseFloat(gateWidth);
    if (actualGateWidthValue > 0) {
      fenceLengthForPanels = Math.max(0, numericFenceLength - actualGateWidthValue);
      calculatedGatePosts = 2; 
      
      const widthOptions = gateType === 'single' ? SINGLE_GATE_WIDTH_OPTIONS : DOUBLE_GATE_WIDTH_OPTIONS;
      const selectedOption = widthOptions.find(opt => opt.value === gateWidth);
      gateWidthLabel = selectedOption ? selectedOption.label : `${actualGateWidthValue} ft`;
      results.gateSectionWidth = gateWidthLabel;


      if (gateType === "single") {
        calculatedSsPvcHinges = 1;
        calculatedSsPvcLatches = 1;
      } else if (gateType === "double") {
        calculatedSsPvcHinges = 2;
        calculatedSsPvcLatches = 1; 
        calculatedSsDropRods = 1;
      }
    }
  }
  
  // If only a gate is specified (fence length effectively becomes zero or less after gate subtraction)
  if (fenceLengthForPanels <= 0 && actualGateWidthValue > 0) {
    results = {
        ...results, // Keep gateSectionWidth
        gatePosts: calculatedGatePosts,
        totalPosts: calculatedGatePosts,
        postCaps: calculatedGatePosts,
        ssPvcHinges: calculatedSsPvcHinges > 0 ? calculatedSsPvcHinges : undefined,
        ssPvcLatches: calculatedSsPvcLatches > 0 ? calculatedSsPvcLatches : undefined,
        ssDropRods: calculatedSsDropRods > 0 ? calculatedSsDropRods : undefined,
        notes: "Calculation for gate only. Fence length is covered by the gate."
    };
    return results;
  }

  const numPanels = Math.ceil(fenceLengthForPanels / numericPanelWidth);
  // Number of post locations needed for the panel sections
  const postLocationsForFencePanels = numPanels > 0 ? numPanels + 1 : 0;
  
  // Terminal posts for the fence run itself (ends and corners)
  const numTerminalPostsFence = numericEnds + numericCorners;
  // Line posts for the fence run
  const numLinePostsFence = numPanels > 0 ? Math.max(0, postLocationsForFencePanels - numTerminalPostsFence) : 0;
  
  const totalCalculatedPosts = numLinePostsFence + numTerminalPostsFence + calculatedGatePosts;
  const totalPostCaps = totalCalculatedPosts;

  results = {
    ...results, // Keep gate related info if any
    numPanels: numPanels > 0 ? numPanels : undefined,
    numLinePosts: numLinePostsFence > 0 ? numLinePostsFence : undefined,
    numTerminalPosts: numTerminalPostsFence > 0 ? numTerminalPostsFence : undefined,
    gatePosts: calculatedGatePosts > 0 ? calculatedGatePosts : undefined,
    totalPosts: totalCalculatedPosts,
    postCaps: totalPostCaps,
    ssPvcHinges: calculatedSsPvcHinges > 0 ? calculatedSsPvcHinges : undefined,
    ssPvcLatches: calculatedSsPvcLatches > 0 ? calculatedSsPvcLatches : undefined,
    ssDropRods: calculatedSsDropRods > 0 ? calculatedSsDropRods : undefined,
  };
  
  return results;
}

export function calculateWood(data: WoodCalculatorInput): WoodCalculatorResult {
  const { fenceLength, postSpacing, picketWidth, numRails, ends = 0, corners = 0, gateType, gateWidth } = data;
  const numericFenceLength = Number(fenceLength);
  const numericPostSpacing = Number(postSpacing);
  const numericPicketWidth = Number(picketWidth); 
  const numericNumRails = Number(numRails);
  const numericEnds = Number(ends);
  const numericCorners = Number(corners);

  let fenceLengthForCalc = numericFenceLength;
  let actualGateWidthValue = 0;

  if (gateType && gateType !== "none" && gateWidth) {
    actualGateWidthValue = parseFloat(gateWidth);
    if (actualGateWidthValue > 0) {
      fenceLengthForCalc = Math.max(0, numericFenceLength - actualGateWidthValue);
    }
  }

  const numSections = fenceLengthForCalc > 0 ? Math.ceil(fenceLengthForCalc / numericPostSpacing) : 0;
  const postLocationsForFence = numSections > 0 ? numSections + 1 : 0;
  const numTerminalPostsFence = numericEnds + numericCorners;
  const numLinePostsFence = numSections > 0 ? Math.max(0, postLocationsForFence - numTerminalPostsFence) : 0;
  
  let gatePostsCount = 0;
  if (gateType && gateType !== "none" && actualGateWidthValue > 0) {
    gatePostsCount = 2; // Assume 2 posts for any gate for now
  }

  const totalPosts = numLinePostsFence + numTerminalPostsFence + gatePostsCount;
  const numPickets = fenceLengthForCalc > 0 ? Math.ceil((fenceLengthForCalc * 12) / numericPicketWidth) : 0; 
  const totalRailLength = numSections * numericPostSpacing * numericNumRails; 
  const bagsOfConcrete = totalPosts; 

  let results: WoodCalculatorResult = {
    numSections,
    numLinePosts: numLinePostsFence,
    numTerminalPosts: numTerminalPostsFence,
    totalPosts,
    numPickets,
    totalRailLength,
    bagsOfConcrete,
  };

  if (gateType && gateType !== "none") {
    results.selectedGateType = gateType === "single" ? "Single Gate" : "Double Gate";
    if (gateWidth) {
      const widthOptions = gateType === 'single' ? SINGLE_GATE_WIDTH_OPTIONS : DOUBLE_GATE_WIDTH_OPTIONS;
      const selectedOption = widthOptions.find(opt => opt.value === gateWidth);
      results.selectedGateWidth = selectedOption ? selectedOption.label : `${gateWidth} ft`;
    }
  }

  return results;
}

export function calculateAluminum(data: AluminumCalculatorInput): AluminumCalculatorResult {
  const { fenceLength, panelWidth, ends = 0, corners = 0, gateType, gateWidth } = data;
  const numericFenceLength = Number(fenceLength);
  const numericPanelWidth = Number(panelWidth);
  const numericEnds = Number(ends);
  const numericCorners = Number(corners);

  let fenceLengthForCalc = numericFenceLength;
  let actualGateWidthValue = 0;

  if (gateType && gateType !== "none" && gateWidth) {
    actualGateWidthValue = parseFloat(gateWidth);
    if (actualGateWidthValue > 0) {
      fenceLengthForCalc = Math.max(0, numericFenceLength - actualGateWidthValue);
    }
  }

  const numPanels = fenceLengthForCalc > 0 ? Math.ceil(fenceLengthForCalc / numericPanelWidth) : 0;
  const postLocationsForFence = numPanels > 0 ? numPanels + 1 : 0;
  const numTerminalPostsFence = numericEnds + numericCorners;
  const numLinePostsFence = numPanels > 0 ? Math.max(0, postLocationsForFence - numTerminalPostsFence) : 0;

  let gatePostsCount = 0;
  if (gateType && gateType !== "none" && actualGateWidthValue > 0) {
    gatePostsCount = 2; 
  }
  
  const totalPosts = numLinePostsFence + numTerminalPostsFence + gatePostsCount;
  const postCaps = totalPosts;

  let results: AluminumCalculatorResult = {
    numPanels,
    numLinePosts: numLinePostsFence,
    numTerminalPosts: numTerminalPostsFence,
    totalPosts,
    postCaps,
  };

  if (gateType && gateType !== "none") {
    results.selectedGateType = gateType === "single" ? "Single Gate" : "Double Gate";
     if (gateWidth) {
      const widthOptions = gateType === 'single' ? SINGLE_GATE_WIDTH_OPTIONS : DOUBLE_GATE_WIDTH_OPTIONS;
      const selectedOption = widthOptions.find(opt => opt.value === gateWidth);
      results.selectedGateWidth = selectedOption ? selectedOption.label : `${gateWidth} ft`;
    }
  }
  
  return results;
}

export function calculateSplitRail(data: SplitRailCalculatorInput): SplitRailCalculatorResult {
  const { fenceLength, numRailsPerSection, postSpacing, gateType, gateWidth } = data;
  const numericFenceLength = Number(fenceLength);
  const numericNumRailsPerSection = Number(numRailsPerSection);
  const numericPostSpacing = Number(postSpacing);

  let fenceLengthForCalc = numericFenceLength;
  let actualGateWidthValue = 0;

  if (gateType && gateType !== "none" && gateWidth) {
    actualGateWidthValue = parseFloat(gateWidth);
    if (actualGateWidthValue > 0) {
      fenceLengthForCalc = Math.max(0, numericFenceLength - actualGateWidthValue);
    }
  }

  const numSections = fenceLengthForCalc > 0 ? Math.ceil(fenceLengthForCalc / numericPostSpacing) : 0;
  // For split rail, posts are typically just one per section + 1, gate posts are often distinct or heavier duty.
  // For simplicity here, we add 2 posts if a gate is selected, assuming they are part of the count.
  let gatePostsCount = 0;
  if (gateType && gateType !== "none" && actualGateWidthValue > 0) {
    gatePostsCount = 2; 
  }

  const numPostsForFence = numSections > 0 ? numSections + 1 : 0;
  const numPosts = numPostsForFence + gatePostsCount - (actualGateWidthValue > 0 && numSections > 0 ? 1: 0) ; // Avoid double counting a post if gate replaces a section end
                                                                                                            // This logic is a bit complex, simpler to assume gate posts are distinct additions for now.
                                                                                                            // Let's simplify: numPosts = (sections for fence) + 1 (for fence end) + (2 for gate if exists)
                                                                                                            // If a gate exists, it implies it needs its own posts.

  const finalNumPosts = (numSections > 0 ? numSections + 1 : 0) + gatePostsCount;


  const numRails = numSections * numericNumRailsPerSection;

  let results: SplitRailCalculatorResult = {
    numSections,
    numPosts: finalNumPosts,
    numRails,
  };

  if (gateType && gateType !== "none") {
    results.selectedGateType = gateType === "single" ? "Single Gate" : "Double Gate";
    if (gateWidth) {
      const widthOptions = gateType === 'single' ? SINGLE_GATE_WIDTH_OPTIONS : DOUBLE_GATE_WIDTH_OPTIONS;
      const selectedOption = widthOptions.find(opt => opt.value === gateWidth);
      results.selectedGateWidth = selectedOption ? selectedOption.label : `${gateWidth} ft`;
    }
  }

  return results;
}
