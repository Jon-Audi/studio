
import { z } from 'zod';

export const ChainlinkCalculatorSchema = z.object({
  fenceLength: z.coerce.number().min(0, "Fence length must be positive"),
  fenceHeight: z.string().min(1, "Fence height is required"),
  fenceType: z.string().min(1, "Fence type is required"),
  ends: z.coerce.number().min(0, "Ends must be non-negative").optional().default(0),
  corners: z.coerce.number().min(0, "Corners must be non-negative").optional().default(0),
});
export type ChainlinkCalculatorInput = z.infer<typeof ChainlinkCalculatorSchema>;

export interface ChainlinkCalculatorResult {
  interiorLinePosts?: number;
  fabricType: string;
  fabricFootage: number;
  topRailSticks?: number;
  tieWires?: number;
  loopCaps?: number;
  postCaps?: number;
  braceBands?: number;
  tensionBars?: number;
  tensionBands?: number;
  nutsAndBolts?: number;
  pipeWeight: string;
  userSpecifiedEnds?: number;
  userSpecifiedCorners?: number;
}

export const PipeCutCalculatorSchema = z.object({
  calculationMode: z.enum(['opening', 'frame']).default('opening'),
  gateWidth: z.coerce.number().min(1, "Gate width must be positive"),
  gateHeight: z.coerce.number().min(1, "Gate height must be positive"),
  frameDiameter: z.string().min(1, "Frame diameter is required"),
  gateType: z.string().min(1, "Gate type is required"),
  frameColor: z.enum(['galvanized', 'black']),
});
export type PipeCutCalculatorInput = z.infer<typeof PipeCutCalculatorSchema>;

export interface PipeCutCalculatorResult {
  frameWidth: number;
  frameHeight: number;
  uprightsLength: number;
  horizontalsLength: number;
  postCount: number;
  postSpacing: number;
  leafs: number;
  horizontalBraceLength?: number;
  verticalBracePieces?: {
    count: number;
    length: number;
  };
  totalPipeLength?: number;
  totalCost?: number;
  requiredOpening?: number;
}

const GateEntrySchema = z.object({
  quantity: z.coerce.number().min(1, "Quantity must be at least 1").default(1),
  width: z.string().min(1, "Gate width is required"),
});
export type GateEntry = z.infer<typeof GateEntrySchema>;

export const VinylCalculatorSchema = z.object({
  fenceLength: z.coerce.number().min(1, "Fence length must be positive"),
  fenceHeight: z.string().min(1, "Fence height is required"),
  panelWidth: z.string().min(1, "Panel width is required"),
  ends: z.coerce.number().min(0).optional().default(0),
  corners: z.coerce.number().min(0).optional().default(0),
  singleGates: z.array(GateEntrySchema).optional().default([]),
  doubleGates: z.array(GateEntrySchema).optional().default([]),
});
export type VinylCalculatorInput = z.infer<typeof VinylCalculatorSchema>;
export interface VinylCalculatorResult {
  numPanels?: number;
  numLinePosts?: number;
  userSpecifiedEnds?: number;
  userSpecifiedCorners?: number;
  gatePosts?: number;
  totalPosts?: number;
  postCaps?: number;
  ssPvcHinges?: number;
  ssPvcLatches?: number;
  ssDropRods?: number;
  totalGateOpenings?: number;
  totalGateLinearFootage?: number;
  notes?: string;
}

export const WoodCalculatorSchema = z.object({
  fenceLength: z.coerce.number().min(1, "Fence length must be positive"),
  fenceHeight: z.string().min(1, "Fence height is required"),
  postSpacing: z.string().min(1, "Post spacing is required"),
  picketWidth: z.string().min(1, "Picket width is required"),
  numRails: z.string().min(1, "Number of rails is required"),
  ends: z.coerce.number().min(0).optional().default(0),
  corners: z.coerce.number().min(0).optional().default(0),
  singleGates: z.array(GateEntrySchema).optional().default([]),
  doubleGates: z.array(GateEntrySchema).optional().default([]),
});
export type WoodCalculatorInput = z.infer<typeof WoodCalculatorSchema>;
export interface WoodCalculatorResult {
  numSections?: number;
  numLinePosts?: number;
  userSpecifiedEnds?: number;
  userSpecifiedCorners?: number;
  totalPosts?: number;
  numPickets?: number;
  picketsPerSection?: number;
  totalRailLength?: number;
  numBackers?: number;
  bagsOfConcrete?: number;
  gatePosts?: number;
  totalGateOpenings?: number;
  totalGateLinearFootage?: number;
  notes?: string;
}

export const AluminumCalculatorSchema = z.object({
  fenceLength: z.coerce.number().min(1, "Fence length must be positive"),
  fenceHeight: z.string().min(1, "Fence height is required"),
  panelWidth: z.string().min(1, "Panel width is required"),
  ends: z.coerce.number().min(0).optional().default(0),
  corners: z.coerce.number().min(0).optional().default(0),
  singleGates: z.array(GateEntrySchema).optional().default([]),
  doubleGates: z.array(GateEntrySchema).optional().default([]),
});
export type AluminumCalculatorInput = z.infer<typeof AluminumCalculatorSchema>;
export interface AluminumCalculatorResult {
  numPanels?: number;
  numLinePosts?: number;
  userSpecifiedEnds?: number;
  userSpecifiedCorners?: number;
  totalPosts?: number;
  postCaps?: number;
  gatePosts?: number;
  totalGateOpenings?: number;
  totalGateLinearFootage?: number;
  notes?: string;
}

export const SplitRailCalculatorSchema = z.object({
  fenceLength: z.coerce.number().min(1, "Fence length must be positive"),
  numRailsPerSection: z.string().min(1, "Rails per section is required"),
  postSpacing: z.string().min(1, "Post spacing is required"),
  ends: z.coerce.number().min(0, "Ends must be non-negative").optional().default(2),
  corners: z.coerce.number().min(0, "Corners must be non-negative").optional().default(0),
  singleGates: z.array(GateEntrySchema).optional().default([]),
  doubleGates: z.array(GateEntrySchema).optional().default([]),
});
export type SplitRailCalculatorInput = z.infer<typeof SplitRailCalculatorSchema>;
export interface SplitRailCalculatorResult {
  numSections?: number;
  numPosts?: number;
  numRails?: number;
  userSpecifiedEnds?: number;
  userSpecifiedCorners?: number;
  gatePosts?: number;
  totalGateOpenings?: number;
  totalGateLinearFootage?: number;
  screwHookAndEyesSets?: number;
  loopLatches?: number;
  woodDropRods?: number;
  notes?: string;
}

export const BallFieldCalculatorSchema = z.object({
  backstopHeight: z.string().min(1, "Backstop height is required"),
  backstopWidth: z.string().min(1, "Backstop width is required"),
  sidelineLength: z.coerce.number().min(1, "Sideline length must be positive"),
  homerunLength: z.coerce.number().min(1, "Homerun fence length must be positive"),
  fenceHeight: z.string().min(1, "Fence height is required"),
});
export type BallFieldCalculatorInput = z.infer<typeof BallFieldCalculatorSchema>;

export interface BallFieldCalculatorResult {
  // Backstop
  backstopMainPosts: number;
  backstopWingPosts: number;
  backstopFabricRolls: number;
  backstopTopRail: number;
  backstopBraceRail: number;
  backstopBraceBands: number;
  backstopTensionBands: number;
  backstopTensionBars: number;
  backstopPostCaps: number;
  backstopLoopCaps: number;
  backstopRailEnds: number;
  backstopTieWires: number;
  backstopHogRings: number;
  backstopTensionWireCoils: number;
  // Fence Lines
  fenceLinePosts: number;
  fenceTerminalPosts: number;
  fenceTotalPosts: number;
  fenceFabricRolls: number;
  fenceTopRail: number;
  fenceBraceBands: number;
  fenceTensionBands: number;
  fenceTensionBars: number;
  fencePostCaps: number;
  fenceLoopCaps: number;
  fenceRailEnds: number;
  fenceTieWires: number;
  fenceHogRings: number;
  fenceTensionWireCoils: number;
}


export const UnitConverterSchema = z.object({
  value: z.coerce.number(),
  fromUnit: z.string(),
  toUnit: z.string(),
});
export type UnitConverterInput = z.infer<typeof UnitConverterSchema>;

export const LakelandTwoCalculatorSchema = z.object({
  numSections: z.coerce.number().min(1, "Number of sections must be at least 1"),
});
export type LakelandTwoCalculatorInput = z.infer<typeof LakelandTwoCalculatorSchema>;
export interface LakelandTwoCalculatorResult {
  pickets: number;
  rails: number;
  uChannels: number;
}

// Generic type for sending data to invoicing
export interface FullEstimateData {
  calculatorType: string;
  inputs: any; // Could be more specific with a union of all input types
  results: any; // Could be more specific with a union of all result types
  timestamp: string;
}
