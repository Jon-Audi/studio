
import type {
  ChainlinkCalculatorInput, ChainlinkCalculatorResult,
  PipeCutCalculatorInput, PipeCutCalculatorResult,
  VinylCalculatorInput, VinylCalculatorResult,
  WoodCalculatorInput, WoodCalculatorResult,
  AluminumCalculatorInput, AluminumCalculatorResult,
  SplitRailCalculatorInput, SplitRailCalculatorResult,
  BallFieldCalculatorInput, BallFieldCalculatorResult,
  PicketCalculatorInput, PicketCalculatorResult,
  CantileverGateCalculatorInput, CantileverGateCalculatorResult,
  GateEntry
} from '@/types';
import { CATALOG } from '@/config/catalog';


export function calculateChainlink(data: ChainlinkCalculatorInput): ChainlinkCalculatorResult {
  const { runs = [], fenceHeight, fenceType, ends = 0, corners = 0 } = data;

  const numericFenceLength = runs.reduce((acc, run) => acc + (Number(run.length) || 0), 0);
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
  const { calculationMode, gateWidth, gateHeight, frameDiameter, gateType, frameColor, includeHorizontalBrace, includeVerticalBrace, hingeSideHeight, latchSideHeight } = data;
  const numericGateWidth = Number(gateWidth);
  const pricePerFoot = CATALOG.GATE_PIPE.PRICING[frameColor]?.[frameDiameter] || 0;
  const isBarrierGate = gateType === 'Barrier';

  let totalDeduction = 0;
  let numericFrameDiameter = 0;
  if (frameDiameter === "1 3/8″") { totalDeduction = 3; numericFrameDiameter = 1.375; }
  else if (frameDiameter === "1 5/8″") { totalDeduction = 3.5; numericFrameDiameter = 1.625; }
  else if (frameDiameter === "2″") { totalDeduction = 4; numericFrameDiameter = 2; }
  
  const isDouble = gateType.toLowerCase().includes('double');
  const leafs = isDouble ? 2 : 1;
  const doubleGateGap = isDouble ? 1 : 0;
  
  let frameWidth, frameHeight = 0, requiredOpening, postSpacing;

  if (calculationMode === 'opening') {
    frameWidth = numericGateWidth - totalDeduction;
    postSpacing = numericGateWidth;
    requiredOpening = undefined;
  } else { // calculationMode === 'frame'
    frameWidth = numericGateWidth;
    postSpacing = numericGateWidth + totalDeduction;
    requiredOpening = postSpacing;
  }

  const adjustedFrameWidthForLeaves = frameWidth - doubleGateGap;
  const leafWidth = adjustedFrameWidthForLeaves / leafs;

  const postCount = 2; // Always 2 posts for single, double, or barrier
  
  const result: PipeCutCalculatorResult = {
    frameWidth: parseFloat(leafWidth.toFixed(2)),
    frameHeight: 0, // Will be set below
    postCount,
    postSpacing,
    leafs,
    requiredOpening,
  };

  let totalPipeInches = 0;

  // Barrier Gate specific calculations
  if (isBarrierGate && hingeSideHeight && latchSideHeight) {
    result.frameHeight = Number(hingeSideHeight);
    result.hingeSideHeight = Number(hingeSideHeight);
    result.latchSideHeight = Number(latchSideHeight);
    
    result.frameWidth = parseFloat(leafWidth.toFixed(2));
    
    const heightDifference = result.hingeSideHeight - result.latchSideHeight;
    result.topRailLength = parseFloat(Math.sqrt(leafWidth ** 2 + heightDifference ** 2).toFixed(2));
    result.mainDiagonalBraceLength = parseFloat(Math.sqrt(leafWidth ** 2 + result.hingeSideHeight ** 2).toFixed(2));
    
    // Vertical brace is positioned at midpoint of the leaf width
    const verticalBraceHeightAtMidpoint = result.latchSideHeight + (heightDifference / 2);
    result.barrierVerticalBraceLength = parseFloat(verticalBraceHeightAtMidpoint.toFixed(2));

    totalPipeInches = (result.hingeSideHeight + result.latchSideHeight + result.topRailLength + result.mainDiagonalBraceLength + (result.barrierVerticalBraceLength || 0)) * leafs;

  } else { // Standard Gate calculations
    const numericGateHeight = Number(gateHeight);
    result.frameHeight = numericGateHeight;

    let cornerFittingDeduction = 0;
    if (frameDiameter === "1 3/8″") cornerFittingDeduction = 1.5 * 2;
    else if (frameDiameter === "1 5/8″") cornerFittingDeduction = 1.75 * 2;
    else if (frameDiameter === "2″") cornerFittingDeduction = 2 * 2;
    
    result.horizontalsLength = parseFloat((leafWidth - cornerFittingDeduction).toFixed(2));
    result.uprightsLength = numericGateHeight;

    totalPipeInches = (result.uprightsLength * 2 + result.horizontalsLength * 2) * leafs;
    
    // Horizontal brace for gates over 48" tall, if included
    if (result.frameHeight > 48 && includeHorizontalBrace) {
      const internalLeafWidth = leafWidth - (numericFrameDiameter * 2);
      result.horizontalBraceLength = parseFloat(internalLeafWidth.toFixed(2));
      totalPipeInches += result.horizontalBraceLength * leafs;
    }

    // Vertical brace for gates over 60" wide, if included
    if (leafWidth > 60 && includeVerticalBrace) {
        const internalLeafHeight = result.frameHeight - (numericFrameDiameter * 2);
        const bracePieceLength = (internalLeafHeight - (includeHorizontalBrace ? numericFrameDiameter : 0)) / 2;
        result.verticalBracePieces = {
            count: 2,
            length: parseFloat(bracePieceLength.toFixed(2)),
        };
        totalPipeInches += (result.verticalBracePieces.length * result.verticalBracePieces.count) * leafs;
    }
  }
  
  if (totalPipeInches > 0) {
    result.totalPipeLength = parseFloat((totalPipeInches / 12).toFixed(2));
  }

  if (result.totalPipeLength && pricePerFoot > 0) {
    result.totalCost = parseFloat((result.totalPipeLength * pricePerFoot).toFixed(2));
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


export function calculatePickets(data: PicketCalculatorInput): PicketCalculatorResult {
  const { fenceOrientation, picketType, sectionWidth, sectionHeight, numRails, pricePerPicket, pricePerBacker } = data;
  const numericPicketWidth = Number(picketType); // This is the actual width in inches
  const numericSectionWidth = Number(sectionWidth); // in feet
  const numericSectionHeight = Number(sectionHeight); // in feet
  const numericNumRails = Number(numRails);
  const numericPricePerPicket = Number(pricePerPicket) || 0;
  const numericPricePerBacker = Number(pricePerBacker) || 0;

  let picketsPerSection = 0;
  let notes: string | undefined;

  if (fenceOrientation === 'vertical') {
    if (numericSectionWidth > 0 && numericPicketWidth > 0) {
      const sectionWidthInches = numericSectionWidth * 12;
      picketsPerSection = Math.ceil(sectionWidthInches / numericPicketWidth);
      notes = `Each picket is assumed to be ${numericSectionHeight} ft tall.`
    }
  } else { // horizontal
    if (numericSectionHeight > 0 && numericPicketWidth > 0) {
      const sectionHeightInches = numericSectionHeight * 12;
      picketsPerSection = Math.ceil(sectionHeightInches / numericPicketWidth);
      notes = `Each picket is assumed to be ${numericSectionWidth} ft long.`
    }
  }

  // Calculate backers
  const totalRailLength = numericSectionWidth * numericNumRails;
  const backersPerSection = Math.ceil(totalRailLength / 8); // Assuming 8ft backers (2x4x8)

  // Calculate costs
  const picketCost = picketsPerSection > 0 && numericPricePerPicket > 0 
    ? parseFloat((picketsPerSection * numericPricePerPicket).toFixed(2)) 
    : undefined;
    
  const backerCost = backersPerSection > 0 && numericPricePerBacker > 0
    ? parseFloat((backersPerSection * numericPricePerBacker).toFixed(2))
    : undefined;

  const totalSectionCost = picketCost || backerCost 
    ? parseFloat(((picketCost || 0) + (backerCost || 0)).toFixed(2))
    : undefined;

  return {
    picketsPerSection,
    backersPerSection,
    picketCost,
    backerCost,
    totalSectionCost,
    notes,
  };
}

export function calculateCantileverGate(data: CantileverGateCalculatorInput): CantileverGateCalculatorResult {
  const { openingSize, gateHeight, gateType, includeDiagonalBrace } = data;
  const numericOpeningSize = Number(openingSize);
  const numericGateHeight = Number(gateHeight);
  const isDoubleGate = gateType === 'double';

  const leafOpeningSize = isDoubleGate ? numericOpeningSize / 2 : numericOpeningSize;

  // Counterbalance length = ½ of true opening size (of one leaf)
  const counterBalanceLength = leafOpeningSize * 0.5;

  // Total frame length is the opening plus the counterbalance (for one leaf)
  const totalFrameLength = leafOpeningSize + counterBalanceLength;

  // Top & Bottom Rails for one leaf
  const topAndBottomRailsPerLeaf = {
    count: 2,
    length: parseFloat(totalFrameLength.toFixed(2)),
  };

  // Uprights for one leaf
  const uprightSpacing = 4; // 4 feet
  const numUprightsPerLeaf = Math.floor(totalFrameLength / uprightSpacing) + 1;
  const verticalUprightsPerLeaf = {
    count: numUprightsPerLeaf,
    length: numericGateHeight,
    spacing: uprightSpacing,
  };

  // Optional diagonal brace for one leaf
  let diagonalBraceLength: number | undefined;
  if (leafOpeningSize > 20 && includeDiagonalBrace) {
    const braceBase = uprightSpacing;
    const braceHeight = numericGateHeight;
    diagonalBraceLength = parseFloat(Math.sqrt(braceBase ** 2 + braceHeight ** 2).toFixed(2));
  }
  
  // Gate Hardware
  const rollersPerLeaf = 4;
  const postSize = "4” or 6 5/8” SS40";
  const rollerPostPlacement = parseFloat((totalFrameLength / 2).toFixed(2));
  
  // For a double gate, we need posts for both sides, but only one catch post in the middle (or two if they latch to each other)
  // Let's assume two catch posts for a robust double gate setup.
  const numLeaves = isDoubleGate ? 2 : 1;

  const gateRollerPosts = {
    count: 2 * numLeaves,
    size: postSize,
    placement: rollerPostPlacement,
  };
  const catchPost = { 
    count: isDoubleGate ? 2 : 1, 
    size: postSize 
  };
  const cantileverRollers = rollersPerLeaf * numLeaves;

  // Chain-Link Fill for the entire setup
  const fabricNeeded = totalFrameLength * numLeaves;
  const tensionBars = 2 * numLeaves; // One for each end of each frame
  const tieWires = Math.ceil(totalFrameLength * 1.5 * 2) * numLeaves;

  return {
    totalFrameLength, // This is per leaf
    counterBalanceLength, // Per leaf
    topAndBottomRails: {
      count: topAndBottomRailsPerLeaf.count * numLeaves,
      length: topAndBottomRailsPerLeaf.length,
    },
    verticalUprights: {
      count: verticalUprightsPerLeaf.count * numLeaves,
      length: verticalUprightsPerLeaf.length,
      spacing: verticalUprightsPerLeaf.spacing,
    },
    diagonalBraceLength, // This is per leaf, if applicable
    cantileverRollers,
    gateRollerPosts,
    catchPost,
    fabricNeeded,
    tensionBars,
    tieWires,
  };
}

    
