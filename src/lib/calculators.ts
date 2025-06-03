
import type {
  ChainlinkCalculatorInput, ChainlinkCalculatorResult,
  PipeCutCalculatorInput, PipeCutCalculatorResult,
  VinylCalculatorInput, VinylCalculatorResult,
  WoodCalculatorInput, WoodCalculatorResult,
  AluminumCalculatorInput, AluminumCalculatorResult,
  SplitRailCalculatorInput, SplitRailCalculatorResult,
  GateEntry
} from '@/types';

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
    } else if (numericEnds === 0 && numericCorners === 0 && numericFenceLength > 0) { 
        interiorLinePosts = Math.max(0, sections -1); 
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
    const tensionBands = (numericFenceHeight * terminalPosts); 
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

function calculateTotalGateData(singleGates: GateEntry[] = [], doubleGates: GateEntry[] = []) {
  let totalLinearFootage = 0;
  let totalSingleGateOpenings = 0;
  let totalDoubleGateOpenings = 0;

  singleGates.forEach(gate => {
    totalLinearFootage += gate.quantity * parseFloat(gate.width);
    totalSingleGateOpenings += gate.quantity;
  });

  doubleGates.forEach(gate => {
    totalLinearFootage += gate.quantity * parseFloat(gate.width);
    totalDoubleGateOpenings += gate.quantity;
  });
  
  const totalGateOpenings = totalSingleGateOpenings + totalDoubleGateOpenings;
  const calculatedGatePosts = totalGateOpenings * 2;

  return {
    totalLinearFootage,
    totalSingleGateOpenings,
    totalDoubleGateOpenings,
    totalGateOpenings,
    calculatedGatePosts
  };
}


export function calculateVinyl(data: VinylCalculatorInput): VinylCalculatorResult {
  const { fenceLength, panelWidth, ends = 0, corners = 0, singleGates = [], doubleGates = [] } = data;
  const numericFenceLength = Number(fenceLength);
  const numericPanelWidth = Number(panelWidth);
  const numericEnds = Number(ends);
  const numericCorners = Number(corners);

  const gateData = calculateTotalGateData(singleGates, doubleGates);
  
  let results: VinylCalculatorResult = {
    totalGateOpenings: gateData.totalGateOpenings > 0 ? gateData.totalGateOpenings : undefined,
    totalGateLinearFootage: gateData.totalLinearFootage > 0 ? gateData.totalLinearFootage : undefined,
    userSpecifiedEnds: numericEnds > 0 ? numericEnds : undefined,
    userSpecifiedCorners: numericCorners > 0 ? numericCorners : undefined,
  };
  
  let fenceLengthForPanels = Math.max(0, numericFenceLength - gateData.totalLinearFootage);
  
  let calculatedSsPvcHinges = 0;
  let calculatedSsPvcLatches = 0;
  let calculatedSsDropRods = 0;

  if (gateData.totalGateOpenings > 0) {
      calculatedSsPvcHinges = (gateData.totalSingleGateOpenings * 1) + (gateData.totalDoubleGateOpenings * 2);
      calculatedSsPvcLatches = gateData.totalSingleGateOpenings + gateData.totalDoubleGateOpenings;
      calculatedSsDropRods = gateData.totalDoubleGateOpenings * 1;
  }

  if (fenceLengthForPanels <= 0 && gateData.totalGateOpenings > 0) {
    results = {
        ...results,
        gatePosts: gateData.calculatedGatePosts > 0 ? gateData.calculatedGatePosts : undefined,
        totalPosts: gateData.calculatedGatePosts > 0 ? gateData.calculatedGatePosts : undefined,
        postCaps: gateData.calculatedGatePosts > 0 ? gateData.calculatedGatePosts : undefined,
        ssPvcHinges: calculatedSsPvcHinges > 0 ? calculatedSsPvcHinges : undefined,
        ssPvcLatches: calculatedSsPvcLatches > 0 ? calculatedSsPvcLatches : undefined,
        ssDropRods: calculatedSsDropRods > 0 ? calculatedSsDropRods : undefined,
        notes: "Calculation primarily for gate(s). Fence length covered by gate(s)."
    };
    return results;
  }

  const numPanels = Math.ceil(fenceLengthForPanels / numericPanelWidth);
  const postLocationsForFencePanels = numPanels > 0 ? numPanels + 1 : 0;

  const numTerminalPostsSum = numericEnds + numericCorners; // Sum of actual terminal locations
  const numLinePostsFence = numPanels > 0 ? Math.max(0, postLocationsForFencePanels - numTerminalPostsSum) : 0;
  
  const totalFencePosts = numLinePostsFence + numTerminalPostsSum;
  const totalCalculatedPosts = totalFencePosts + gateData.calculatedGatePosts;
  const totalPostCaps = totalCalculatedPosts;

  results = {
    ...results,
    numPanels: numPanels > 0 ? numPanels : undefined,
    numLinePosts: numLinePostsFence > 0 ? numLinePostsFence : undefined,
    gatePosts: gateData.calculatedGatePosts > 0 ? gateData.calculatedGatePosts : undefined,
    totalPosts: totalCalculatedPosts > 0 ? totalCalculatedPosts : undefined,
    postCaps: totalPostCaps > 0 ? totalPostCaps : undefined,
    ssPvcHinges: calculatedSsPvcHinges > 0 ? calculatedSsPvcHinges : undefined,
    ssPvcLatches: calculatedSsPvcLatches > 0 ? calculatedSsPvcLatches : undefined,
    ssDropRods: calculatedSsDropRods > 0 ? calculatedSsDropRods : undefined,
  };

  return results;
}

export function calculateWood(data: WoodCalculatorInput): WoodCalculatorResult {
  const { fenceLength, postSpacing, picketWidth, numRails, ends = 0, corners = 0, singleGates = [], doubleGates = [] } = data;
  const numericFenceLength = Number(fenceLength);
  const numericPostSpacing = Number(postSpacing);
  const numericPicketWidth = Number(picketWidth);
  const numericNumRails = Number(numRails);
  const numericEnds = Number(ends);
  const numericCorners = Number(corners);
  
  const gateData = calculateTotalGateData(singleGates, doubleGates);

  let results: WoodCalculatorResult = {
    totalGateOpenings: gateData.totalGateOpenings > 0 ? gateData.totalGateOpenings : undefined,
    totalGateLinearFootage: gateData.totalLinearFootage > 0 ? gateData.totalLinearFootage : undefined,
    userSpecifiedEnds: numericEnds > 0 ? numericEnds : undefined,
    userSpecifiedCorners: numericCorners > 0 ? numericCorners : undefined,
  };

  let fenceLengthForCalc = Math.max(0, numericFenceLength - gateData.totalLinearFootage);
  
  const numSections = fenceLengthForCalc > 0 ? Math.ceil(fenceLengthForCalc / numericPostSpacing) : 0;
  const postLocationsForFence = numSections > 0 ? numSections + 1 : 0;
  const numTerminalPostsSum = numericEnds + numericCorners;
  const numLinePostsFence = numSections > 0 ? Math.max(0, postLocationsForFence - numTerminalPostsSum) : 0;

  const totalFencePosts = numLinePostsFence + numTerminalPostsSum;
  const totalPosts = totalFencePosts + gateData.calculatedGatePosts;
  const numPickets = fenceLengthForCalc > 0 ? Math.ceil((fenceLengthForCalc * 12) / numericPicketWidth) : 0;
  const totalRailLength = numSections * numericPostSpacing * numericNumRails;
  const bagsOfConcrete = totalPosts > 0 ? totalPosts : undefined;


  results = {
    ...results,
    numSections: numSections > 0 ? numSections : undefined,
    numLinePosts: numLinePostsFence > 0 ? numLinePostsFence : undefined,
    gatePosts: gateData.calculatedGatePosts > 0 ? gateData.calculatedGatePosts : undefined,
    totalPosts: totalPosts > 0 ? totalPosts : undefined,
    numPickets: numPickets > 0 ? numPickets : undefined,
    totalRailLength: totalRailLength > 0 ? totalRailLength : undefined,
    bagsOfConcrete,
  };
  
  if (fenceLengthForCalc <= 0 && gateData.totalGateOpenings > 0) {
    results.notes = "Calculation primarily for gate(s). Fence length covered by gate(s).";
  }

  return results;
}

export function calculateAluminum(data: AluminumCalculatorInput): AluminumCalculatorResult {
  const { fenceLength, panelWidth, ends = 0, corners = 0, singleGates = [], doubleGates = [] } = data;
  const numericFenceLength = Number(fenceLength);
  const numericPanelWidth = Number(panelWidth);
  const numericEnds = Number(ends);
  const numericCorners = Number(corners);

  const gateData = calculateTotalGateData(singleGates, doubleGates);

  let results: AluminumCalculatorResult = {
    totalGateOpenings: gateData.totalGateOpenings > 0 ? gateData.totalGateOpenings : undefined,
    totalGateLinearFootage: gateData.totalLinearFootage > 0 ? gateData.totalLinearFootage : undefined,
    userSpecifiedEnds: numericEnds > 0 ? numericEnds : undefined,
    userSpecifiedCorners: numericCorners > 0 ? numericCorners : undefined,
  };
  
  let fenceLengthForCalc = Math.max(0, numericFenceLength - gateData.totalLinearFootage);

  const numPanels = fenceLengthForCalc > 0 ? Math.ceil(fenceLengthForCalc / numericPanelWidth) : 0;
  const postLocationsForFence = numPanels > 0 ? numPanels + 1 : 0;
  const numTerminalPostsSum = numericEnds + numericCorners;
  const numLinePostsFence = numPanels > 0 ? Math.max(0, postLocationsForFence - numTerminalPostsSum) : 0;

  const totalFencePosts = numLinePostsFence + numTerminalPostsSum;
  const totalPosts = totalFencePosts + gateData.calculatedGatePosts;
  const postCaps = totalPosts > 0 ? totalPosts : undefined;

  results = {
    ...results,
    numPanels: numPanels > 0 ? numPanels : undefined,
    numLinePosts: numLinePostsFence > 0 ? numLinePostsFence : undefined,
    gatePosts: gateData.calculatedGatePosts > 0 ? gateData.calculatedGatePosts : undefined,
    totalPosts: totalPosts > 0 ? totalPosts : undefined,
    postCaps,
  };
  
  if (fenceLengthForCalc <= 0 && gateData.totalGateOpenings > 0) {
    results.notes = "Calculation primarily for gate(s). Fence length covered by gate(s).";
  }

  return results;
}

export function calculateSplitRail(data: SplitRailCalculatorInput): SplitRailCalculatorResult {
  const { fenceLength, numRailsPerSection, postSpacing, ends = 2, corners = 0, singleGates = [], doubleGates = [] } = data;
  const numericFenceLength = Number(fenceLength);
  const numericNumRailsPerSection = Number(numRailsPerSection);
  const numericPostSpacing = Number(postSpacing); 
  const numericEnds = Number(ends);
  const numericCorners = Number(corners);

  const gateData = calculateTotalGateData(singleGates, doubleGates);

  let results: SplitRailCalculatorResult = {
    userSpecifiedEnds: numericEnds >= 0 ? numericEnds : undefined, // Ensure 0 is included if inputted
    userSpecifiedCorners: numericCorners >= 0 ? numericCorners : undefined, // Ensure 0 is included
    totalGateOpenings: gateData.totalGateOpenings > 0 ? gateData.totalGateOpenings : undefined,
    totalGateLinearFootage: gateData.totalLinearFootage > 0 ? gateData.totalLinearFootage : undefined,
  };
  
  let fenceLengthForCalc = Math.max(0, numericFenceLength - gateData.totalLinearFootage);

  let screwHookAndEyesSets = 0;
  let loopLatches = 0;
  let woodDropRods = 0;

  if (gateData.totalGateOpenings > 0) {
    screwHookAndEyesSets = (gateData.totalSingleGateOpenings * 1) + (gateData.totalDoubleGateOpenings * 2);
    loopLatches = gateData.totalSingleGateOpenings + gateData.totalDoubleGateOpenings;
    woodDropRods = gateData.totalDoubleGateOpenings * 1;
  }

  if (fenceLengthForCalc <= 0 && gateData.totalGateOpenings > 0) {
    results = {
        ...results,
        numPosts: gateData.calculatedGatePosts > 0 ? gateData.calculatedGatePosts : undefined, // Total posts are just gate posts here
        gatePosts: gateData.calculatedGatePosts > 0 ? gateData.calculatedGatePosts : undefined,
        screwHookAndEyesSets: screwHookAndEyesSets > 0 ? screwHookAndEyesSets : undefined,
        loopLatches: loopLatches > 0 ? loopLatches : undefined,
        woodDropRods: woodDropRods > 0 ? woodDropRods : undefined,
        notes: "Calculation primarily for gate(s). Fence length covered by gate(s)."
    };
    return results;
  }

  const numSections = fenceLengthForCalc > 0 ? Math.ceil(fenceLengthForCalc / numericPostSpacing) : 0;
  const numPostsForFence = numSections > 0 ? numSections + 1 : 0; // Line posts, end posts, corner posts for fence sections
  const totalPosts = numPostsForFence + gateData.calculatedGatePosts;
  const numRails = numSections * numericNumRailsPerSection;

  results = {
    ...results,
    numSections: numSections > 0 ? numSections : undefined,
    numPosts: totalPosts > 0 ? totalPosts : undefined, // This is the grand total of all posts
    numRails: numRails > 0 ? numRails : undefined,
    gatePosts: gateData.calculatedGatePosts > 0 ? gateData.calculatedGatePosts : undefined,
    screwHookAndEyesSets: screwHookAndEyesSets > 0 ? screwHookAndEyesSets : undefined,
    loopLatches: loopLatches > 0 ? loopLatches : undefined,
    woodDropRods: woodDropRods > 0 ? woodDropRods : undefined,
  };

  return results;
}
