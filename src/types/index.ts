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
  interiorLinePosts: number;
  fabricType: string;
  fabricFootage: number;
  topRailSticks: number;
  tieWires: number;
  loopCaps: number;
  postCaps?: number;
  braceBands?: number;
  tensionBars?: number;
  tensionBands?: number;
  nutsAndBolts?: number;
  pipeWeight: string;
}

export const PipeCutCalculatorSchema = z.object({
  gateWidth: z.coerce.number().min(0, "Gate width must be positive"),
  gateHeight: z.coerce.number().min(0, "Gate height must be positive"),
  frameDiameter: z.string().min(1, "Frame diameter is required"),
  gateType: z.string().min(1, "Gate type is required"),
});
export type PipeCutCalculatorInput = z.infer<typeof PipeCutCalculatorSchema>;

export interface PipeCutCalculatorResult {
  uprightsLength: number;
  horizontalsLength: number;
  postCount: number;
  postSpacing: number;
  leafs: number;
}

export const AiRecommenderSchema = z.object({
  projectSize: z.string().min(1, "Project size is required"),
  selectedMaterials: z.string().min(3, "Selected materials must be at least 3 characters"),
});
export type AiRecommenderInput = z.infer<typeof AiRecommenderSchema>;

export const UnitConverterSchema = z.object({
  value: z.coerce.number(),
  fromUnit: z.string(),
  toUnit: z.string(),
});
export type UnitConverterInput = z.infer<typeof UnitConverterSchema>;
