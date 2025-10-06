
// src/config/catalog.ts

/**
 * This file centralizes the entire product catalog and default settings for the Material Estimator Pro app.
 * To customize the options available in the calculators, modify the arrays and objects in the "CATALOG" section.
 * To change the default selections that appear when a calculator loads, modify the "DEFAULTS" section.
 */

// =================================================================================================
//                                        CATALOG
// =================================================================================================
// All available options for the different calculators.

export const CATALOG = {
  /**
   * General Options
   */
  FENCE_HEIGHTS: ["3", "4", "5", "6", "7", "8", "9", "10"], // in feet

  /**
   * Chainlink Fence Options
   */
  CHAINLINK: {
    FENCE_TYPES: ["residential", "commercial"],
  },

  /**
   * Gate Pipe Cut Calculator Options
   */
  GATE_PIPE: {
    FRAME_DIAMETERS: ["1 3/8″", "1 5/8″", "2″"],
    GATE_TYPES: ["Single", "Double", "Barrier", "Double Barrier"],
    FRAME_COLORS: [
      { value: 'galvanized', label: 'Galvanized' },
      { value: 'black', label: 'Black' }
    ],
    BARRIER_HINGE_HEIGHTS: ["36", "42"], // in inches
    BARRIER_LATCH_HEIGHTS: ["24", "30"], // in inches
    PRICING: {
      galvanized: {
        "1 3/8″": 0.74,
        "1 5/8″": 0.87,
        "2″": 1.44,
      },
      black: {
        "1 3/8″": 1.04,
        "1 5/8″": 1.54,
        "2″": 2.85,
      }
    } as Record<string, Record<string, number>>,
  },

  /**
   * Vinyl Fence Options
   */
  VINYL: {
    PANEL_WIDTHS: ["6", "8"], // in feet
  },

  /**
   * Wood Fence Options
   */
  WOOD: {
    POST_SPACINGS: ["6", "7", "8"], // in feet
    PICKET_WIDTHS: [ // in inches
      { value: "3.5", label: "1x4 (3.5″)" },
      { value: "5.5", label: "1x6 (5.5″)" }
    ],
    NUM_RAILS: ["2", "3"],
  },

  /**
   * Aluminum Fence Options
   */
  ALUMINUM: {
    PANEL_WIDTHS: ["6", "8"], // in feet
  },

  /**
   * Split Rail Fence Options
   */
  SPLIT_RAIL: {
    RAILS_PER_SECTION: ["2", "3", "4"],
    POST_SPACING: [{ value: "10", label: "10 ft" }], // Fixed to 10 ft
    SINGLE_GATE_WIDTHS: [
      { value: "3", label: "3 ft" },
      { value: "4", label: "4 ft" },
      { value: "5", label: "5 ft" },
      { value: "6", label: "6 ft" },
    ],
    DOUBLE_GATE_WIDTHS: [
      { value: "6", label: "6 ft (2 x 3ft)" },
      { value: "8", label: "8 ft (2 x 4ft)" },
      { value: "10", label: "10 ft (2 x 5ft)" },
      { value: "12", label: "12 ft (2 x 6ft)" },
    ],
  },
  
  /**
    * Generic Gate Width Options for Vinyl, Wood, Aluminum
    */
  GENERIC_GATES: {
    SINGLE_GATE_WIDTHS: [
      { value: "3", label: "3 ft" },
      { value: "4", label: "4 ft" },
      { value: "5", label: "5 ft" },
    ],
    DOUBLE_GATE_WIDTHS: [
      { value: "6", label: "6 ft (2 x 3ft)" },
      { value: "8", label: "8 ft (2 x 4ft)" },
      { value: "10", label: "10 ft (2 x 5ft)" },
    ],
  },

  /**
   * Ball Field Calculator Options
   */
  BALL_FIELD: {
    BACKSTOP_HEIGHTS: ["10", "12", "14", "16"],
    BACKSTOP_WIDTHS: ["10", "20", "30"],
    FENCE_HEIGHTS: ["4", "6", "8", "10"],
  }
};

// =================================================================================================
//                                        DEFAULTS
// =================================================================================================
// Default selections for the calculators. These values must exist in the CATALOG above.

export const DEFAULTS = {
  /**
   * Chainlink Calculator Defaults
   */
  CHAINLINK: {
    fenceHeight: CATALOG.FENCE_HEIGHTS[0], // 3'
    fenceType: CATALOG.CHAINLINK.FENCE_TYPES[0], // residential
  },

  /**
   * Gate Pipe Cut Calculator Defaults
   */
  GATE_PIPE: {
    frameDiameter: CATALOG.GATE_PIPE.FRAME_DIAMETERS[0], // 1 3/8"
    gateType: CATALOG.GATE_PIPE.GATE_TYPES[0], // Single
    frameColor: CATALOG.GATE_PIPE.FRAME_COLORS[0].value, // galvanized
    barrierHingeHeight: CATALOG.GATE_PIPE.BARRIER_HINGE_HEIGHTS[0], // 36"
    barrierLatchHeight: CATALOG.GATE_PIPE.BARRIER_LATCH_HEIGHTS[0], // 24"
  },

  /**
   * Vinyl Calculator Defaults
   */
  VINYL: {
    fenceHeight: CATALOG.FENCE_HEIGHTS[0], // 3'
    panelWidth: CATALOG.VINYL.PANEL_WIDTHS.includes('8') ? '8' : CATALOG.VINYL.PANEL_WIDTHS[0], // 8'
    singleGateWidth: CATALOG.GENERIC_GATES.SINGLE_GATE_WIDTHS[0].value,
    doubleGateWidth: CATALOG.GENERIC_GATES.DOUBLE_GATE_WIDTHS[0].value,
  },
  
  /**
   * Wood Calculator Defaults
   */
  WOOD: {
      fenceHeight: CATALOG.FENCE_HEIGHTS[0], // 3'
      postSpacing: CATALOG.WOOD.POST_SPACINGS.includes('8') ? '8' : CATALOG.WOOD.POST_SPACINGS[0],
      picketWidth: CATALOG.WOOD.PICKET_WIDTHS[0].value,
      numRails: CATALOG.WOOD.NUM_RAILS[0],
      singleGateWidth: CATALOG.GENERIC_GATES.SINGLE_GATE_WIDTHS[0].value,
      doubleGateWidth: CATALOG.GENERIC_GATES.DOUBLE_GATE_WIDTHS[0].value,
  },

  /**
   * Aluminum Calculator Defaults
   */
  ALUMINUM: {
      fenceHeight: CATALOG.FENCE_HEIGHTS[0],
      panelWidth: CATALOG.ALUMINUM.PANEL_WIDTHS[0],
      singleGateWidth: CATALOG.GENERIC_GATES.SINGLE_GATE_WIDTHS[0].value,
      doubleGateWidth: CATALOG.GENERIC_GATES.DOUBLE_GATE_WIDTHS[0].value,
  },

  /**
   * Split Rail Calculator Defaults
   */
  SPLIT_RAIL: {
      numRailsPerSection: CATALOG.SPLIT_RAIL.RAILS_PER_SECTION[0], // 2-Rail
      postSpacing: CATALOG.SPLIT_RAIL.POST_SPACING[0].value, // 10'
      singleGateWidth: CATALOG.SPLIT_RAIL.SINGLE_GATE_WIDTHS[0].value,
      doubleGateWidth: CATALOG.SPLIT_RAIL.DOUBLE_GATE_WIDTHS[0].value,
  },

  /**
   * Ball Field Calculator Defaults
   */
  BALL_FIELD: {
      backstopHeight: CATALOG.BALL_FIELD.BACKSTOP_HEIGHTS[1], // 12'
      backstopWidth: CATALOG.BALL_FIELD.BACKSTOP_WIDTHS[1], // 20'
      fenceHeight: CATALOG.BALL_FIELD.FENCE_HEIGHTS[0], // 4'
  },
  /**
   * Picket Calculator Defaults
   */
  PICKET: {
    fenceOrientation: 'vertical',
    picketType: CATALOG.WOOD.PICKET_WIDTHS[0].value,
    sectionWidth: 8,
    sectionHeight: 6,
    numRails: 2,
    pricePerPicket: 0,
    pricePerBacker: 0,
  }
};
