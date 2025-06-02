
export const FENCE_HEIGHT_OPTIONS = ["3", "4", "5", "6", "7", "8"]; // in feet
export const FENCE_TYPE_OPTIONS = ["residential", "commercial"];
export const GATE_FRAME_DIAMETER_OPTIONS = ["1 3/8″", "1 5/8″", "2″"];
export const GATE_TYPE_OPTIONS = ["Single", "Double"]; // Used by PipeCutCalculator

// Vinyl Fence Options
export const VINYL_PANEL_WIDTH_OPTIONS = ["6", "8"]; // in feet

// Wood Fence Options
export const WOOD_POST_SPACING_OPTIONS = ["6", "7", "8"]; // in feet
export const PICKET_WIDTH_OPTIONS = [ // in inches
  { value: "3.5", label: "1x4 (3.5″)" }, 
  { value: "5.5", label: "1x6 (5.5″)" }
];
export const WOOD_NUM_RAILS_OPTIONS = ["2", "3"];

// Aluminum Fence Options
export const ALUMINUM_PANEL_WIDTH_OPTIONS = ["6", "8"]; // in feet

// Split Rail Fence Options
export const SPLIT_RAIL_RAILS_PER_SECTION_OPTIONS = ["2", "3", "4"];
export const SPLIT_RAIL_POST_SPACING_OPTIONS = [{ value: "10", label: "10 ft" }]; // Fixed to 10 ft

export const SPLIT_RAIL_SINGLE_GATE_WIDTH_OPTIONS = [
  { value: "3", label: "3 ft" },
  { value: "4", label: "4 ft" },
  { value: "5", label: "5 ft" },
  { value: "6", label: "6 ft" },
];
export const SPLIT_RAIL_DOUBLE_GATE_WIDTH_OPTIONS = [
  { value: "6", label: "6 ft (2 x 3ft)" },
  { value: "8", label: "8 ft (2 x 4ft)" },
  { value: "10", label: "10 ft (2 x 5ft)" },
  { value: "12", label: "12 ft (2 x 6ft)" },
];


// Gate Width Options for general calculators (Vinyl, Wood, Aluminum)
export const SINGLE_GATE_WIDTH_OPTIONS = [ // For Vinyl, Wood, Aluminum
  { value: "3", label: "3 ft" },
  { value: "4", label: "4 ft" },
  { value: "5", label: "5 ft" },
];

export const DOUBLE_GATE_WIDTH_OPTIONS = [ // For Vinyl, Wood, Aluminum
  { value: "6", label: "6 ft (2 x 3ft)" },
  { value: "8", label: "8 ft (2 x 4ft)" },
  { value: "10", label: "10 ft (2 x 5ft)" },
];

