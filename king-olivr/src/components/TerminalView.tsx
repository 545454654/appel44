import React, { useEffect, useState } from 'react';
import { M11Predictions, PlatformType } from '../types';
import { soundEngine } from '../utils/audio';
import {
  generatePredictionsObject,
  isSafeApple,
  TARGET_ROWS_10,
} from '../utils/predictionGenerator';
import { BadAppleIcon, GoodAppleIcon, KingLogoIcon, WoodCoverIcon } from './AssetIcons';
import { Volume2, VolumeX, RefreshCw, Wifi } from 'lucide-react';
import { rtdb, ref, set, onValue } from '../lib/firebase';

interface TerminalViewProps {
  platform: PlatformType;
  userId: string;
  onBackToPlatforms: () => void;
}

export const TerminalView: React.FC<TerminalViewProps> = ({
  platform,
  userId,
  onBackToPlatforms,
}) => {
  const [onlineCount, setOnlineCount] = useState(1441);
  const [predictions, setPredictions] = useState<M11Predictions | null>(null);
  const [hasRevealed, setHasRevealed] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractProgress, setExtractProgress] = useState(0);
  const [revealedCells, setRevealedCells] = useState<Record<string, boolean>>({});
  const [soundOn, setSoundOn] = useState(true);
  const [rtdbConnected, setRtdbConnected] = useState(false);

  // Target row configurations (10 rows standard)
  const targetRows = TARGET_ROWS_10;

  // Firebase Realtime Database Listener on 'm11'
  useEffect(() => {
    const dbRef = ref(rtdb, 'm11');

    const unsubscribe = onValue(dbRef, (snapshot) => {
      setRtdbConnected(true);
      const val = snapshot.val();
      if (val) {
        setPredictions(val);
      }
    }, (err) => {
      console.warn('Firebase RTDB listener notice:', err);
    });

    return () => unsubscribe();
  }, []);

  // Live online players counter animation
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineCount((prev) => {
        const diff = Math.floor(Math.random() * 11) - 5;
        return Math.max(1100, Math.min(2300, prev + diff));
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const handleToggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    soundEngine.setEnabled(next);
    if (next) soundEngine.playClick();
  };

  // Extract Predictions Handler
  const handleExtractPredictions = async () => {
    if (isExtracting) return;

    soundEngine.playClick();
    setIsExtracting(true);
    setExtractProgress(0);
    setHasRevealed(false);
    setRevealedCells({});

    // Progress bar fill animation
    let currentProgress = 0;
    const progressInterval = setInterval(() => {
      currentProgress += 5;
      setExtractProgress(currentProgress);
      if (currentProgress % 20 === 0) {
        soundEngine.playPulse();
      }

      if (currentProgress >= 100) {
        clearInterval(progressInterval);
        setTimeout(() => {
          setIsExtracting(false);
          startSequentialReveal();
        }, 150);
      }
    }, 45);
  };

  // Generate new predictions and perform staggered row-by-row reveal
  const startSequentialReveal = async () => {
    const newPredictions = generatePredictionsObject();
    setPredictions(newPredictions);
    setHasRevealed(true);

    // Sync generated predictions to Firebase RTDB under 'm11'
    try {
      await set(ref(rtdb, 'm11'), newPredictions);
      setRtdbConnected(true);
    } catch (err) {
      console.warn('Firebase RTDB sync fallback:', err);
    }

    soundEngine.playSuccess();

    let maxDelay = 0;

    // Stagger reveal from bottom row (row 0) to top row
    targetRows.forEach((rowConfig) => {
      const rowIdx = rowConfig.row;
      for (let cIdx = 0; cIdx < 5; cIdx++) {
        const cellKey = `${rowIdx}-${cIdx}`;
        const delay = (9 - rowIdx) * 90 + cIdx * 30;
        maxDelay = Math.max(maxDelay, delay);

        setTimeout(() => {
          setRevealedCells((prev) => ({ ...prev, [cellKey]: true }));
          const safe = isSafeApple(rowIdx, cIdx, newPredictions);
          soundEngine.playRevealPop(safe);
        }, delay);
      }
    });
  };

  // Reset board back to wooden covers
  const handleResetBoard = () => {
    soundEngine.playClick();
    setHasRevealed(false);
    setRevealedCells({});
  };

  return (
    <div className="relative z-10 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto flex flex-col items-center px-2 sm:px-4 py-2 sm:py-6 animate-fadeIn">
      {/* Top Bar: Online Count & Configs */}
      <div className="w-full flex items-center justify-between mb-2 sm:mb-4 px-1">
        {/* Online Badge */}
        <div className="flex items-center gap-1.5 sm:gap-2 bg-emerald-500/10 border border-emerald-500/40 rounded-full px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs text-emerald-400 shadow-[0_0_10px_rgba(0,255,102,0.2)] backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#00ff66] animate-pulse"></span>
          <span>
            نشط الآن: <strong className="font-mono">{onlineCount.toLocaleString()}</strong>
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Firebase RTDB Status */}
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-[10px] font-mono font-bold ${
              rtdbConnected
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                : 'bg-amber-500/10 border-amber-500/40 text-amber-400'
            }`}
            title="حالة الاتصال بالسيرفر"
          >
            <Wifi size={12} className={rtdbConnected ? 'animate-pulse' : ''} />
            <span>{rtdbConnected ? 'متصل' : 'تجهيز'}</span>
          </div>

          {/* Sound Toggle Button */}
          <button
            onClick={handleToggleSound}
            className="p-1.5 sm:p-2 rounded-lg bg-slate-900/80 border border-cyan-500/30 text-cyan-400 hover:border-amber-400 transition-all cursor-pointer"
            title="الصوت"
          >
            {soundOn ? <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>

          {/* Back to Platforms */}
          <button
            onClick={onBackToPlatforms}
            className="px-2 sm:px-3 py-1 rounded-lg bg-slate-900/80 border border-amber-400/40 text-amber-400 text-[11px] sm:text-xs font-mono font-bold hover:bg-amber-400 hover:text-black transition-all cursor-pointer"
          >
            {platform}
          </button>
        </div>
      </div>

      {/* Main Branding Logo & Title */}
      <div className="flex flex-col items-center mb-2 sm:mb-4">
        <KingLogoIcon className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 mb-1" />
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-wider text-center font-mono animated-title-glow">
          اسكربت التفاحه مضمون100%
        </h1>
        <div className="text-[10px] sm:text-xs font-mono text-cyan-400/90 tracking-wider">
          سيرفر التوقعات // <span className="text-amber-300 font-bold">مباشر</span>
        </div>
        {userId && (
          <div className="text-[10px] sm:text-xs font-mono text-emerald-400 font-bold tracking-wider mt-0.5">
            {userId}
          </div>
        )}
      </div>

      {/* Main Game Card */}
      <div className="w-full border border-cyan-500/40 rounded-2xl p-2 sm:p-4 bg-slate-950/95 backdrop-blur-md shadow-[0_0_25px_rgba(0,240,255,0.2)] flex flex-col gap-1.5 sm:gap-2.5">
        {/* Game Board Grid */}
        <div className="flex flex-col gap-1 sm:gap-2 w-full">
          {targetRows.map((rowInfo) => (
            <div
              key={rowInfo.row}
              className="flex items-center justify-between bg-slate-900/75 border border-cyan-500/20 rounded-xl p-1 sm:p-2"
            >
              {/* Multiplier Badge */}
              <div className="w-12 sm:w-16 text-center bg-amber-400/15 border border-amber-400 text-amber-400 font-bold font-mono text-[10px] sm:text-xs py-1 sm:py-2 rounded-lg shadow-[0_0_6px_#ffd700] shrink-0">
                {rowInfo.mult}
              </div>

              {/* 5 Apples Grid */}
              <div className="grid grid-cols-5 gap-1 sm:gap-2 flex-1 mx-1.5 sm:mx-3">
                {Array.from({ length: 5 }).map((_, cIdx) => {
                  const cellKey = `${rowInfo.row}-${cIdx}`;
                  const isRevealed = revealedCells[cellKey];
                  const safe = isSafeApple(rowInfo.row, cIdx, predictions);

                  return (
                    <div
                      key={cIdx}
                      className={`aspect-square max-h-[48px] sm:max-h-[56px] md:max-h-[64px] rounded-lg border flex items-center justify-center transition-all duration-300 ${
                        hasRevealed && isRevealed
                          ? safe
                            ? 'border-emerald-500/60 bg-emerald-500/15 shadow-[0_0_12px_rgba(57,255,20,0.4)] scale-102'
                            : 'border-red-500/30 bg-red-950/20 opacity-40'
                          : 'border-cyan-500/20 bg-slate-950/80 hover:border-cyan-400/40'
                      }`}
                    >
                      {hasRevealed && isRevealed ? (
                        safe ? (
                          <div className="w-full h-full p-0.5 animate-zoomIn">
                            <GoodAppleIcon />
                          </div>
                        ) : (
                          <div className="w-full h-full p-0.5">
                            <BadAppleIcon />
                          </div>
                        )
                      ) : (
                        <div className="w-full h-full p-0.5">
                          <WoodCoverIcon />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex gap-2 mt-1 sm:mt-2 w-full">
          <button
            onClick={handleExtractPredictions}
            disabled={isExtracting}
            className="flex-1 bg-amber-400 border-none rounded-xl p-3 sm:p-4 text-black font-black text-xs sm:text-sm md:text-base cursor-pointer shadow-[0_0_15px_rgba(255,215,0,0.35)] hover:bg-emerald-400 hover:shadow-[0_0_20px_#00ff66] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-amber-400 active:scale-95"
          >
            ► إستخراج التوقعات
          </button>

          <button
            onClick={handleResetBoard}
            disabled={isExtracting}
            className="bg-red-500/15 border border-red-500/80 text-red-400 font-bold rounded-xl px-3 sm:px-5 py-3 sm:py-4 text-xs sm:text-sm md:text-base cursor-pointer hover:bg-red-600 hover:text-white hover:shadow-[0_0_15px_#ff3333] transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>إعادة التشغيل</span>
          </button>
        </div>
      </div>

      {/* Extraction Modal Dialog */}
      {isExtracting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md px-4 animate-fadeIn">
          <div className="bg-slate-900/95 border border-amber-400 rounded-2xl p-6 w-full max-w-xs text-center shadow-[0_0_25px_rgba(255,215,0,0.3)]">
            <div className="w-10 h-10 border-3 border-amber-400/20 border-t-emerald-400 rounded-full mx-auto mb-3 animate-spin" />
            <div className="text-amber-400 text-sm font-bold font-mono mb-1">
              جاري إستخراج التوقعات...
            </div>
            <div className="text-cyan-400 text-xs font-mono mb-4">
              يرجى الانتظار لحين الاتصال بالسيرفر
            </div>
            <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-cyan-500/30">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-75"
                style={{ width: `${extractProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
