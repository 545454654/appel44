import { M11Predictions, RowConfig } from '../types';

/**
 * Row Configurations and Multipliers
 * Displayed from highest row (Row 9, highest multiplier) at top
 * down to lowest row (Row 0, lowest multiplier) at bottom.
 */
export const TARGET_ROWS_10: RowConfig[] = [
  { mult: "x349.68", row: 9, goodCount: 1, badCount: 4 }, // Highest row
  { mult: "x69.93",  row: 8, goodCount: 2, badCount: 3 },
  { mult: "x27.92",  row: 7, goodCount: 2, badCount: 3 },
  { mult: "x11.18",  row: 6, goodCount: 3, badCount: 2 },
  { mult: "x6.71",   row: 5, goodCount: 3, badCount: 2 },
  { mult: "x4.02",   row: 4, goodCount: 3, badCount: 2 },
  { mult: "x2.41",   row: 3, goodCount: 4, badCount: 1 },
  { mult: "x1.93",   row: 2, goodCount: 4, badCount: 1 },
  { mult: "x1.54",   row: 1, goodCount: 4, badCount: 1 },
  { mult: "x1.23",   row: 0, goodCount: 4, badCount: 1 }, // Lowest row (Start)
];

export const TARGET_ROWS_8: RowConfig[] = [
  { mult: "x27.97",  row: 7, goodCount: 2, badCount: 3 },
  { mult: "x11.18",  row: 6, goodCount: 3, badCount: 2 },
  { mult: "x6.71",   row: 5, goodCount: 3, badCount: 2 },
  { mult: "x4.02",   row: 4, goodCount: 3, badCount: 2 },
  { mult: "x2.41",   row: 3, goodCount: 4, badCount: 1 },
  { mult: "x1.93",   row: 2, goodCount: 4, badCount: 1 },
  { mult: "x1.54",   row: 1, goodCount: 4, badCount: 1 },
  { mult: "x1.23",   row: 0, goodCount: 4, badCount: 1 },
];

/**
 * 1️⃣ & 2️⃣ Generates full 10-row (m1 to m50) predictions object formatted exactly as required by Firebase RTDB:
 * {
 *   "m1": { "m1": "1" },
 *   "m2": { "m2": "0" },
 *   ...
 *   "m50": { "m50": "1" }
 * }
 */
export const generatePredictionsObject = (): M11Predictions => {
  const finalObject: M11Predictions = {};

  // Loop over 10 rows (0 to 9)
  for (let r = 0; r < 10; r++) {
    // Determine safe apples count per row based on difficulty formula
    let safeCount = 4; // Rows 0, 1, 2, 3
    if (r >= 4 && r < 7) safeCount = 3;  // Rows 4, 5, 6
    if (r >= 7 && r < 9) safeCount = 2;  // Rows 7, 8
    if (r >= 9) safeCount = 1;           // Row 9 (Final)

    // Randomly pick safe column indices (0 to 4)
    const safeCols: number[] = [];
    while (safeCols.length < safeCount) {
      const randomCol = Math.floor(Math.random() * 5);
      if (!safeCols.includes(randomCol)) {
        safeCols.push(randomCol);
      }
    }

    // Assign values for each cell in row using magic formula: mIndex = r * 5 + c + 1
    for (let c = 0; c < 5; c++) {
      const mIndex = r * 5 + c + 1;
      const keyName = `m${mIndex}`;
      const value = safeCols.includes(c) ? "1" : "0"; // "1" = safe apple, "0" = bad apple

      // Nested structure required by Firebase
      finalObject[keyName] = { [keyName]: value };
    }
  }

  return finalObject;
};

/**
 * 3️⃣ & 4️⃣ Magical Checker function to inspect if an apple at (rowIdx, colIdx) is safe ("1") or bad ("0")
 */
export const isSafeApple = (
  rowIdx: number,
  colIdx: number,
  predictions: M11Predictions | null
): boolean => {
  if (!predictions || Object.keys(predictions).length === 0) return false;

  // 1. Calculate unique cell number m1..m50
  const mIndex = rowIdx * 5 + colIdx + 1;
  const mKey = `m${mIndex}`;

  // 2. Read corresponding object
  const mObj = predictions[mKey];

  // 3. Check if value equals "1"
  if (mObj && typeof mObj === 'object' && mObj[mKey] === "1") {
    return true; // Safe apple!
  }

  return false; // Bad apple / bomb
};
