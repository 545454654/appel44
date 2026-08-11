export type ScreenState = 'login' | 'platform' | 'terminal';

export type PlatformType = '1xBet' | '';

export interface RowConfig {
  row: number; // 0 to 9
  mult: string;
  goodCount: number;
  badCount: number;
}

export interface CellValue {
  [key: string]: '1' | '0'; // e.g. { "m1": "1" }
}

export interface M11Predictions {
  [key: string]: CellValue; // e.g. "m1": { "m1": "1" }
}

export interface AppState {
  screen: ScreenState;
  userId: string;
  selectedPlatform: PlatformType;
  soundEnabled: boolean;
  onlineCount: number;
  rowCount: 10 | 8;
  predictions: M11Predictions | null;
  isExtracting: boolean;
  hasRevealed: boolean;
  firebaseConnected: boolean;
  firebasePath: string;
}
