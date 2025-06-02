
import type {
  ChainlinkCalculatorInput, ChainlinkCalculatorResult,
  PipeCutCalculatorInput, PipeCutCalculatorResult,
  VinylCalculatorInput, VinylCalculatorResult,
  WoodCalculatorInput, WoodCalculatorResult,
  AluminumCalculatorInput, AluminumCalculatorResult,
  SplitRailCalculatorInput, SplitRailCalculatorResult
} from '@/types';
import {
  SINGLE_GATE_WIDTH_OPTIONS,
  DOUBLE_GATE_WIDTH_OPTIONS,
  SPLIT_RAIL_SINGLE_GATE_WIDTH_OPTIONS,
  SPLIT_RAIL_DOUBLE_GATE_WIDTH_OPTIONS
} from '@/config/constants';


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

export function calculateVinyl(data: VinylCalculatorInput): VinylCalculatorResult {
  const { fenceLength, panelWidth, ends = 0, corners = 0, numSingleGates = 0, singleGateWidth, numDoubleGates = 0, doubleGateWidth } = data;
  const numericFenceLength = Number(fenceLength);
  const numericPanelWidth = Number(panelWidth);
  const numericEnds = Number(ends);
  const numericCorners = Number(corners);
  const numericNumSingleGates = Number(numSingleGates);
  const numericNumDoubleGates = Number(numDoubleGates);

  let results: VinylCalculatorResult = {};
  let fenceLengthForPanels = numericFenceLength;
  let totalGateLinearFootage = 0;
  let calculatedGatePosts = 0;
  let calculatedSsPvcHinges = 0;
  let calculatedSsPvcLatches = 0;
  let calculatedSsDropRods = 0;

  if (numericNumSingleGates > 0 && singleGateWidth) {
    const sgWidth = parseFloat(singleGateWidth);
    totalGateLinearFootage += numericNumSingleGates * sgWidth;
    const selectedOption = SINGLE_GATE_WIDTH_OPTIONS.find(opt => opt.value === singleGateWidth);
    results.singleGateWidthLabel = selectedOption ? selectedOption.label : `${sgWidth} ft`;
    results.numSingleGates = numericNumSingleGates;
  }

  if (numericNumDoubleGates > 0 && doubleGateWidth) {
    const dgWidth = parseFloat(doubleGateWidth);
    totalGateLinearFootage += numericNumDoubleGates * dgWidth;
    const selectedOption = DOUBLE_GATE_WIDTH_OPTIONS.find(opt => opt.value === doubleGateWidth);
    results.doubleGateWidthLabel = selectedOption ? selectedOption.label : `${dgWidth} ft`;
    results.numDoubleGates = numericNumDoubleGates;
  }
  
  fenceLengthForPanels = Math.max(0, numericFenceLength - totalGateLinearFootage);
  
  if (numericNumSingleGates > 0 || numericNumDoubleGates > 0) {
      calculatedGatePosts = (numericNumSingleGates + numericNumDoubleGates) * 2;
      calculatedSsPvcHinges = (numericNumSingleGates * 1) + (numericNumDoubleGates * 2); // 1 set for single, 2 sets for double
      calculatedSsPvcLatches = numericNumSingleGates + numericNumDoubleGates; // 1 latch per gate opening
      calculatedSsDropRods = numericNumDoubleGates * 1; // 1 drop rod per double gate
  }


  if (fenceLengthForPanels <= 0 && totalGateLinearFootage > 0) {
    results = {
        ...results,
        gatePosts: calculatedGatePosts > 0 ? calculatedGatePosts : undefined,
        totalPosts: calculatedGatePosts > 0 ? calculatedGatePosts : undefined,
        postCaps: calculatedGatePosts > 0 ? calculatedGatePosts : undefined,
        ssPvcHinges: calculatedSsPvcHinges > 0 ? calculatedSsPvcHinges : undefined,
        ssPvcLatches: calculatedSsPvcLatches > 0 ? calculatedSsPvcLatches : undefined,
        ssDropRods: calculatedSsDropRods > 0 ? calculatedSsDropRods : undefined,
        notes: "Calculation primarily for gate(s). Fence length covered by gate(s)."
    };
    return results;
  }

  const numPanels = Math.ceil(fenceLengthForPanels / numericPanelWidth);
  const postLocationsForFencePanels = numPanels > 0 ? numPanels + 1 : 0;

  const numTerminalPostsFence = numericEnds + numericCorners;
  const numLinePostsFence = numPanels > 0 ? Math.max(0, postLocationsForFencePanels - numTerminalPostsFence) : 0;
  
  const totalFencePosts = numLinePostsFence + numTerminalPostsFence;
  const totalCalculatedPosts = totalFencePosts + calculatedGatePosts;
  const totalPostCaps = totalCalculatedPosts;

  results = {
    ...results,
    numPanels: numPanels > 0 ? numPanels : undefined,
    numLinePosts: numLinePostsFence > 0 ? numLinePostsFence : undefined,
    numTerminalPosts: numTerminalPostsFence > 0 ? numTerminalPostsFence : undefined,
    gatePosts: calculatedGatePosts > 0 ? calculatedGatePosts : undefined,
    totalPosts: totalCalculatedPosts > 0 ? totalCalculatedPosts : undefined,
    postCaps: totalPostCaps > 0 ? totalPostCaps : undefined,
    ssPvcHinges: calculatedSsPvcHinges > 0 ? calculatedSsPvcHinges : undefined,
    ssPvcLatches: calculatedSsPvcLatches > 0 ? calculatedSsPvcLatches : undefined,
    ssDropRods: calculatedSsDropRods > 0 ? calculatedSsDropRods : undefined,
  };

  return results;
}

export function calculateWood(data: WoodCalculatorInput): WoodCalculatorResult {
  const { fenceLength, postSpacing, picketWidth, numRails, ends = 0, corners = 0, numSingleGates = 0, singleGateWidth, numDoubleGates = 0, doubleGateWidth } = data;
  const numericFenceLength = Number(fenceLength);
  const numericPostSpacing = Number(postSpacing);
  const numericPicketWidth = Number(picketWidth);
  const numericNumRails = Number(numRails);
  const numericEnds = Number(ends);
  const numericCorners = Number(corners);
  const numericNumSingleGates = Number(numSingleGates);
  const numericNumDoubleGates = Number(numDoubleGates);
  
  let results: WoodCalculatorResult = {};
  let fenceLengthForCalc = numericFenceLength;
  let totalGateLinearFootage = 0;
  let calculatedGatePosts = 0;

  if (numericNumSingleGates > 0 && singleGateWidth) {
    const sgWidth = parseFloat(singleGateWidth);
    totalGateLinearFootage += numericNumSingleGates * sgWidth;
    const selectedOption = SINGLE_GATE_WIDTH_OPTIONS.find(opt => opt.value === singleGateWidth);
    results.singleGateWidthLabel = selectedOption ? selectedOption.label : `${sgWidth} ft`;
    results.numSingleGates = numericNumSingleGates;
  }

  if (numericNumDoubleGates > 0 && doubleGateWidth) {
    const dgWidth = parseFloat(doubleGateWidth);
    totalGateLinearFootage += numericNumDoubleGates * dgWidth;
    const selectedOption = DOUBLE_GATE_WIDTH_OPTIONS.find(opt => opt.value === doubleGateWidth);
    results.doubleGateWidthLabel = selectedOption ? selectedOption.label : `${dgWidth} ft`;
    results.numDoubleGates = numericNumDoubleGates;
  }

  fenceLengthForCalc = Math.max(0, numericFenceLength - totalGateLinearFootage);

  if (numericNumSingleGates > 0 || numericNumDoubleGates > 0) {
    calculatedGatePosts = (numericNumSingleGates + numericNumDoubleGates) * 2;
  }
  
  const numSections = fenceLengthForCalc > 0 ? Math.ceil(fenceLengthForCalc / numericPostSpacing) : 0;
  const postLocationsForFence = numSections > 0 ? numSections + 1 : 0;
  const numTerminalPostsFence = numericEnds + numericCorners;
  const numLinePostsFence = numSections > 0 ? Math.max(0, postLocationsForFence - numTerminalPostsFence) : 0;

  const totalFencePosts = numLinePostsFence + numTerminalPostsFence;
  const totalPosts = totalFencePosts + calculatedGatePosts;
  const numPickets = fenceLengthForCalc > 0 ? Math.ceil((fenceLengthForCalc * 12) / numericPicketWidth) : 0;
  const totalRailLength = numSections * numericPostSpacing * numericNumRails;
  const bagsOfConcrete = totalPosts > 0 ? totalPosts : undefined;


  results = {
    ...results,
    numSections: numSections > 0 ? numSections : undefined,
    numLinePosts: numLinePostsFence > 0 ? numLinePostsFence : undefined,
    numTerminalPosts: numTerminalPostsFence > 0 ? numTerminalPostsFence : undefined,
    gatePosts: calculatedGatePosts > 0 ? calculatedGatePosts : undefined,
    totalPosts: totalPosts > 0 ? totalPosts : undefined,
    numPickets: numPickets > 0 ? numPickets : undefined,
    totalRailLength: totalRailLength > 0 ? totalRailLength : undefined,
    bagsOfConcrete,
  };
  
  if (fenceLengthForCalc <= 0 && totalGateLinearFootage > 0) {
    results.notes = "Calculation primarily for gate(s). Fence length covered by gate(s).";
  }

  return results;
}

export function calculateAluminum(data: AluminumCalculatorInput): AluminumCalculatorResult {
  const { fenceLength, panelWidth, ends = 0, corners = 0, numSingleGates = 0, singleGateWidth, numDoubleGates = 0, doubleGateWidth } = data;
  const numericFenceLength = Number(fenceLength);
  const numericPanelWidth = Number(panelWidth);
  const numericEnds = Number(ends);
  const numericCorners = Number(corners);
  const numericNumSingleGates = Number(numSingleGates);
  const numericNumDoubleGates = Number(numDoubleGates);

  let results: AluminumCalculatorResult = {};
  let fenceLengthForCalc = numericFenceLength;
  let totalGateLinearFootage = 0;
  let calculatedGatePosts = 0;
  
  if (numericNumSingleGates > 0 && singleGateWidth) {
    const sgWidth = parseFloat(singleGateWidth);
    totalGateLinearFootage += numericNumSingleGates * sgWidth;
    const selectedOption = SINGLE_GATE_WIDTH_OPTIONS.find(opt => opt.value === singleGateWidth);
    results.singleGateWidthLabel = selectedOption ? selectedOption.label : `${sgWidth} ft`;
    results.numSingleGates = numericNumSingleGates;
  }

  if (numericNumDoubleGates > 0 && doubleGateWidth) {
    const dgWidth = parseFloat(doubleGateWidth);
    totalGateLinearFootage += numericNumDoubleGates * dgWidth;
    const selectedOption = DOUBLE_GATE_WIDTH_OPTIONS.find(opt => opt.value === doubleGateWidth);
    results.doubleGateWidthLabel = selectedOption ? selectedOption.label : `${dgWidth} ft`;
    results.numDoubleGates = numericNumDoubleGates;
  }

  fenceLengthForCalc = Math.max(0, numericFenceLength - totalGateLinearFootage);

  if (numericNumSingleGates > 0 || numericNumDoubleGates > 0) {
    calculatedGatePosts = (numericNumSingleGates + numericNumDoubleGates) * 2;
  }

  const numPanels = fenceLengthForCalc > 0 ? Math.ceil(fenceLengthForCalc / numericPanelWidth) : 0;
  const postLocationsForFence = numPanels > 0 ? numPanels + 1 : 0;
  const numTerminalPostsFence = numericEnds + numericCorners;
  const numLinePostsFence = numPanels > 0 ? Math.max(0, postLocationsForFence - numTerminalPostsFence) : 0;

  const totalFencePosts = numLinePostsFence + numTerminalPostsFence;
  const totalPosts = totalFencePosts + calculatedGatePosts;
  const postCaps = totalPosts > 0 ? totalPosts : undefined;

  results = {
    ...results,
    numPanels: numPanels > 0 ? numPanels : undefined,
    numLinePosts: numLinePostsFence > 0 ? numLinePostsFence : undefined,
    numTerminalPosts: numTerminalPostsFence > 0 ? numTerminalPostsFence : undefined,
    gatePosts: calculatedGatePosts > 0 ? calculatedGatePosts : undefined,
    totalPosts: totalPosts > 0 ? totalPosts : undefined,
    postCaps,
  };
  
  if (fenceLengthForCalc <= 0 && totalGateLinearFootage > 0) {
    results.notes = "Calculation primarily for gate(s). Fence length covered by gate(s).";
  }

  return results;
}

export function calculateSplitRail(data: SplitRailCalculatorInput): SplitRailCalculatorResult {
  const { fenceLength, numRailsPerSection, postSpacing, ends = 2, corners = 0, numSingleGates = 0, singleGateWidth, numDoubleGates = 0, doubleGateWidth } = data;
  const numericFenceLength = Number(fenceLength);
  const numericNumRailsPerSection = Number(numRailsPerSection);
  const numericPostSpacing = Number(postSpacing); 
  const numericEnds = Number(ends);
  const numericCorners = Number(corners);
  const numericNumSingleGates = Number(numSingleGates);
  const numericNumDoubleGates = Number(numDoubleGates);

  let results: SplitRailCalculatorResult = {
    userSpecifiedEnds: numericEnds,
    userSpecifiedCorners: numericCorners,
  };
  let fenceLengthForCalc = numericFenceLength;
  let totalGateLinearFootage = 0;
  let calculatedGatePosts = 0;
  let screwHookAndEyesSets = 0;
  let loopLatches = 0;
  let woodDropRods = 0;

  if (numericNumSingleGates > 0 && singleGateWidth) {
    const sgWidth = parseFloat(singleGateWidth);
    totalGateLinearFootage += numericNumSingleGates * sgWidth;
    const selectedOption = SPLIT_RAIL_SINGLE_GATE_WIDTH_OPTIONS.find(opt => opt.value === singleGateWidth);
    results.singleGateWidthLabel = selectedOption ? selectedOption.label : `${sgWidth} ft`;
    results.numSingleGates = numericNumSingleGates;
  }

  if (numericNumDoubleGates > 0 && doubleGateWidth) {
    const dgWidth = parseFloat(doubleGateWidth);
    totalGateLinearFootage += numericNumDoubleGates * dgWidth;
    const selectedOption = SPLIT_RAIL_DOUBLE_GATE_WIDTH_OPTIONS.find(opt => opt.value === doubleGateWidth);
    results.doubleGateWidthLabel = selectedOption ? selectedOption.label : `${dgWidth} ft`;
    results.numDoubleGates = numericNumDoubleGates;
  }
  
  fenceLengthForCalc = Math.max(0, numericFenceLength - totalGateLinearFootage);

  if (numericNumSingleGates > 0 || numericNumDoubleGates > 0) {
    calculatedGatePosts = (numericNumSingleGates + numericNumDoubleGates) * 2;
    screwHookAndEyesSets = (numericNumSingleGates * 1) + (numericNumDoubleGates * 2);
    loopLatches = numericNumSingleGates + numericNumDoubleGates;
    woodDropRods = numericNumDoubleGates * 1;
  }

  if (fenceLengthForCalc <= 0 && totalGateLinearFootage > 0) {
    results = {
        ...results,
        numPosts: calculatedGatePosts > 0 ? calculatedGatePosts : undefined,
        gatePosts: calculatedGatePosts > 0 ? calculatedGatePosts : undefined,
        screwHookAndEyesSets: screwHookAndEyesSets > 0 ? screwHookAndEyesSets : undefined,
        loopLatches: loopLatches > 0 ? loopLatches : undefined,
        woodDropRods: woodDropRods > 0 ? woodDropRods : undefined,
        notes: "Calculation primarily for gate(s). Fence length covered by gate(s)."
    };
    return results;
  }

  const numSections = fenceLengthForCalc > 0 ? Math.ceil(fenceLengthForCalc / numericPostSpacing) : 0;
  const numPostsForFence = numSections > 0 ? numSections + 1 : 0;
  const totalPosts = numPostsForFence + calculatedGatePosts;
  const numRails = numSections * numericNumRailsPerSection;

  results = {
    ...results,
    numSections: numSections > 0 ? numSections : undefined,
    numPosts: totalPosts > 0 ? totalPosts : undefined,
    numRails: numRails > 0 ? numRails : undefined,
    gatePosts: calculatedGatePosts > 0 ? calculatedGatePosts : undefined,
    screwHookAndEyesSets: screwHookAndEyesSets > 0 ? screwHookAndEyesSets : undefined,
    loopLatches: loopLatches > 0 ? loopLatches : undefined,
    woodDropRods: woodDropRods > 0 ? woodDropRods : undefined,
  };

  return results;
}
