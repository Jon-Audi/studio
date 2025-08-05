
import type {
  ChainlinkCalculatorInput, ChainlinkCalculatorResult,
  PipeCutCalculatorInput, PipeCutCalculatorResult,
  VinylCalculatorInput, VinylCalculatorResult,
  WoodCalculatorInput, WoodCalculatorResult,
  AluminumCalculatorInput, AluminumCalculatorResult,
  SplitRailCalculatorInput, SplitRailCalculatorResult,
  BallFieldCalculatorInput, BallFieldCalculatorResult,
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

  const topRailSticks = numericFenceLength > 0 ? Math.ceil(numericFenceLength / 21) : 0;
  const tieWires = numericFenceLength > 0 ? Math.ceil(numericFenceLength * 1.5) : 0;
  const loopCaps = interiorLinePosts > 0 ? interiorLinePosts : undefined;


  let result: ChainlinkCalculatorResult = {
    interiorLinePosts: interiorLinePosts > 0 ? interiorLinePosts : undefined,
    fabricType,
    fabricFootage,
    topRailSticks: topRailSticks > 0 ? topRailSticks : undefined,
    tieWires: tieWires > 0 ? tieWires : undefined,
    loopCaps,
    pipeWeight,
    userSpecifiedEnds: numericEnds >= 0 ? numericEnds : undefined,
    userSpecifiedCorners: numericCorners >= 0 ? numericCorners : undefined,
  };

  const terminalPosts = numericEnds + numericCorners;
  if (terminalPosts > 0) {
    const braceBands = (1 * numericEnds) + (2 * numericCorners);
    const tensionBars = (1 * numericEnds) + (2 * numericCorners);
    const tensionBands = (numericFenceHeight * terminalPosts);
    const nutsAndBolts = tensionBands + braceBands;
    const postCapsValue = terminalPosts;

    result = {
      ...result,
      braceBands: braceBands > 0 ? braceBands : undefined,
      tensionBars: tensionBars > 0 ? tensionBars : undefined,
      tensionBands: tensionBands > 0 ? tensionBands : undefined,
      nutsAndBolts: nutsAndBolts > 0 ? nutsAndBolts : undefined,
      postCaps: postCapsValue > 0 ? postCapsValue : undefined,
    };
  }
  return result;
}


export function calculatePipeCuts(data: PipeCutCalculatorInput): PipeCutCalculatorResult {
  const { gateWidth, gateHeight, frameDiameter, gateType } = data;
  const numericGateWidth = Number(gateWidth);
  const numericGateHeight = Number(gateHeight);

  let totalDeduction = 0;
  let numericFrameDiameter = 0;
  if (frameDiameter === "1 3/8″") { totalDeduction = 3; numericFrameDiameter = 1.375; }
  else if (frameDiameter === "1 5/8″") { totalDeduction = 3.5; numericFrameDiameter = 1.625; }
  else if (frameDiameter === "2″") { totalDeduction = 4; numericFrameDiameter = 2; }

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

  const result: PipeCutCalculatorResult = {
    uprightsLength,
    horizontalsLength,
    postCount,
    postSpacing,
    leafs,
  };

  // Horizontal brace for gates over 48" tall
  if (numericGateHeight > 48) {
    const internalLeafWidth = leafWidth - (numericFrameDiameter * 2);
    result.horizontalBraceLength = parseFloat(internalLeafWidth.toFixed(2));
  }

  // Vertical brace for gates over 60" wide
  if (numericGateWidth > 60) {
    const internalLeafHeight = numericGateHeight - (numericFrameDiameter * 2);
    const bracePieceLength = (internalLeafHeight - numericFrameDiameter) / 2;
    result.verticalBracePieces = {
      count: 2,
      length: parseFloat(bracePieceLength.toFixed(2)),
    };
  }

  return result;
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
    userSpecifiedEnds: numericEnds >= 0 ? numericEnds : undefined,
    userSpecifiedCorners: numericCorners >= 0 ? numericCorners : undefined,
    totalGateOpenings: gateData.totalGateOpenings > 0 ? gateData.totalGateOpenings : undefined,
    totalGateLinearFootage: gateData.totalLinearFootage > 0 ? gateData.totalLinearFootage : undefined,
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

  const numTerminalPostsSum = numericEnds + numericCorners;
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
    userSpecifiedEnds: numericEnds >= 0 ? numericEnds : undefined,
    userSpecifiedCorners: numericCorners >= 0 ? numericCorners : undefined,
    totalGateOpenings: gateData.totalGateOpenings > 0 ? gateData.totalGateOpenings : undefined,
    totalGateLinearFootage: gateData.totalLinearFootage > 0 ? gateData.totalLinearFootage : undefined,
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
  const numBackers = totalRailLength > 0 ? Math.ceil(totalRailLength / 8) : undefined; // Assuming 8ft backers

  const bagsOfConcrete = totalPosts > 0 ? totalPosts : undefined;

  const picketsPerSection = numericPostSpacing > 0 && numericPicketWidth > 0
    ? Math.ceil((numericPostSpacing * 12) / numericPicketWidth)
    : undefined;

  results = {
    ...results,
    numSections: numSections > 0 ? numSections : undefined,
    numLinePosts: numLinePostsFence > 0 ? numLinePostsFence : undefined,
    gatePosts: gateData.calculatedGatePosts > 0 ? gateData.calculatedGatePosts : undefined,
    totalPosts: totalPosts > 0 ? totalPosts : undefined,
    numPickets: numPickets > 0 ? numPickets : undefined,
    picketsPerSection: picketsPerSection,
    totalRailLength: totalRailLength > 0 ? totalRailLength : undefined,
    numBackers: numBackers,
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
    userSpecifiedEnds: numericEnds >= 0 ? numericEnds : undefined,
    userSpecifiedCorners: numericCorners >= 0 ? numericCorners : undefined,
    totalGateOpenings: gateData.totalGateOpenings > 0 ? gateData.totalGateOpenings : undefined,
    totalGateLinearFootage: gateData.totalLinearFootage > 0 ? gateData.totalLinearFootage : undefined,
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
    userSpecifiedEnds: numericEnds >= 0 ? numericEnds : undefined,
    userSpecifiedCorners: numericCorners >= 0 ? numericCorners : undefined,
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
        numPosts: gateData.calculatedGatePosts > 0 ? gateData.calculatedGatePosts : undefined,
        gatePosts: gateData.calculatedGatePosts > 0 ? gateData.calculatedGatePosts : undefined,
        screwHookAndEyesSets: screwHookAndEyesSets > 0 ? screwHookAndEyesSets : undefined,
        loopLatches: loopLatches > 0 ? loopLatches : undefined,
        woodDropRods: woodDropRods > 0 ? woodDropRods : undefined,
        notes: "Calculation primarily for gate(s). Fence length covered by gate(s)."
    };
    return results;
  }

  const numSections = fenceLengthForCalc > 0 ? Math.ceil(fenceLengthForCalc / numericPostSpacing) : 0;
  const numPostsForFence = numSections > 0 ? numSections + 1 : 0;
  const totalPosts = numPostsForFence + gateData.calculatedGatePosts;
  const numRails = numSections * numericNumRailsPerSection;

  results = {
    ...results,
    numSections: numSections > 0 ? numSections : undefined,
    numPosts: totalPosts > 0 ? totalPosts : undefined,
    numRails: numRails > 0 ? numRails : undefined,
    gatePosts: gateData.calculatedGatePosts > 0 ? gateData.calculatedGatePosts : undefined,
    screwHookAndEyesSets: screwHookAndEyesSets > 0 ? screwHookAndEyesSets : undefined,
    loopLatches: loopLatches > 0 ? loopLatches : undefined,
    woodDropRods: woodDropRods > 0 ? woodDropRods : undefined,
  };

  return results;
}

export function calculateBallField(data: BallFieldCalculatorInput): BallFieldCalculatorResult {
    const { backstopHeight, backstopWidth, sidelineLength, homerunLength, fenceHeight } = data;
    const numBackstopHeight = Number(backstopHeight);
    const numBackstopWidth = Number(backstopWidth);
    const numSidelineLength = Number(sidelineLength);
    const numHomerunLength = Number(homerunLength);
    const numFenceHeight = Number(fenceHeight);

    const postSpacing = 10;
    const fabricRollLength = 50;

    // Backstop Calculations
    // A typical backstop has a center section and two 45-degree wings.
    // We'll assume the wings are the same width as the center for simplicity.
    const backstopWingLength = numBackstopWidth;
    const totalBackstopFootage = numBackstopWidth + (2 * backstopWingLength);

    const backstopMainPosts = 4; // 3" posts for corners and braces
    const backstopWingPosts = Math.ceil(backstopWingLength / postSpacing) * 2; // 2.5" posts
    const backstopFabricRolls = Math.ceil(totalBackstopFootage / fabricRollLength);
    const backstopTopRail = Math.ceil(totalBackstopFootage / 21);
    const backstopBraceRail = backstopMainPosts * 2;
    const backstopBraceBands = backstopMainPosts * 4; // Top and bottom brace
    const backstopTensionBars = 4; // Ends of the two wings
    const backstopTensionBands = backstopTensionBars * numBackstopHeight;
    const backstopPostCaps = backstopMainPosts + backstopWingPosts;
    const backstopLoopCaps = backstopWingPosts;
    const backstopRailEnds = backstopMainPosts * 2;
    const backstopTieWires = Math.ceil(totalBackstopFootage * 1.5);
    const backstopTensionWireCoils = Math.ceil((totalBackstopFootage * 3) / 500); // Top, middle, bottom
    const backstopHogRings = backstopTieWires; // Approximation

    // Fence Line Calculations
    const totalFenceFootage = (numSidelineLength * 2) + numHomerunLength;
    const fenceSections = Math.ceil(totalFenceFootage / postSpacing);
    const fenceLinePosts = Math.max(0, fenceSections - 1);
    const fenceTerminalPosts = 2; // Where sidelines meet homerun fence
    const fenceTotalPosts = fenceLinePosts + fenceTerminalPosts;
    
    const fenceFabricRolls = Math.ceil(totalFenceFootage / fabricRollLength);
    const fenceTopRail = Math.ceil(totalFenceFootage / 21);
    const fenceBraceBands = fenceTerminalPosts * 2;
    const fenceTensionBars = fenceTerminalPosts;
    const fenceTensionBands = fenceTensionBars * numFenceHeight;
    const fencePostCaps = fenceTotalPosts;
    const fenceLoopCaps = fenceLinePosts;
    const fenceRailEnds = fenceTerminalPosts;
    const fenceTieWires = Math.ceil(totalFenceFootage * 1.5);
    const fenceTensionWireCoils = Math.ceil((totalFenceFootage * 3) / 500);
    const fenceHogRings = fenceTieWires;

    return {
        // Backstop
        backstopMainPosts,
        backstopWingPosts,
        backstopFabricRolls,
        backstopTopRail,
        backstopBraceRail,
        backstopBraceBands,
        backstopTensionBands,
        backstopTensionBars,
        backstopPostCaps,
        backstopLoopCaps,
        backstopRailEnds,
        backstopTieWires,
        backstopHogRings,
        backstopTensionWireCoils,
        // Fence Lines
        fenceLinePosts,
        fenceTerminalPosts,
        fenceTotalPosts,
        fenceFabricRolls,
        fenceTopRail,
        fenceBraceBands,
        fenceTensionBands,
        fenceTensionBars,
        fencePostCaps,
        fenceLoopCaps,
        fenceRailEnds,
        fenceTieWires,
        fenceHogRings,
        fenceTensionWireCoils,
    };
}
