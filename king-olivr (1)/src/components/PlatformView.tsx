import React, { useState } from 'react';
import { PlatformType } from '../types';
import { soundEngine } from '../utils/audio';

interface PlatformViewProps {
  onSelectPlatform: (platform: PlatformType) => void;
}

export const PlatformView: React.FC<PlatformViewProps> = ({ onSelectPlatform }) => {
  const [selected, setSelected] = useState<PlatformType>('1xBet');
  const [isConnecting, setIsConnecting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [modalSub, setModalSub] = useState('يرجى الانتظار لحين فحص السيرفر');
  const [modalTitle, setModalTitle] = useState('جاري الاتصال بـ 1xBet...');
  const [isConnectedSuccess, setIsConnectedSuccess] = useState(false);

  const handleSelect = (platform: PlatformType) => {
    soundEngine.playClick();
    setSelected(platform);
  };

  const handleConnect = () => {
    soundEngine.playClick();
    setIsConnecting(true);

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 5;
      setProgress(currentProgress);

      if (currentProgress === 60) {
        setModalSub('تمت الموافقة على جلسة 1xBet...');
      }

      if (currentProgress >= 100) {
        clearInterval(interval);
        soundEngine.playSuccess();
        setIsConnectedSuccess(true);
        setModalTitle('تم الاتصال بنجاح!');
        setModalSub('جاري التحويل لصفحة التوقعات...');

        setTimeout(() => {
          onSelectPlatform('1xBet');
        }, 800);
      }
    }, 50);
  };

  return (
    <div className="relative z-10 w-full max-w-sm sm:max-w-md md:max-w-lg mx-auto flex flex-col items-center px-3 sm:px-6 py-4 sm:py-8 animate-fadeIn">
      {/* Title */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-wider text-center mb-1 sm:mb-2 font-mono animated-title-glow">
        اسكربت التفاحه مضمون100%
      </h1>
      <div className="text-xs sm:text-sm font-mono tracking-wider text-cyan-400 text-center mb-5 sm:mb-8 drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]">
        اختيار المنصة . سيرفرات 1xBet المباشرة
      </div>

      {/* Platform Card */}
      <div className="w-full border border-cyan-500/40 rounded-2xl p-4 sm:p-6 bg-slate-950/90 backdrop-blur-md shadow-[inset_0_0_15px_rgba(0,240,255,0.1),0_0_25px_rgba(0,240,255,0.15)]">
        {/* Header */}
        <div className="flex justify-between items-center pb-3 mb-6 border-b border-amber-400/30 text-xs font-mono font-bold text-amber-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#00ff66] animate-pulse"></span>
            PLATFORM // 1xBET
          </div>
          <div className="text-cyan-400 bg-cyan-950/80 border border-cyan-500/40 px-2 py-0.5 rounded font-mono text-[10px]">
            سيرفر نشط
          </div>
        </div>

        {/* Single Platform Choice: 1xBet */}
        <div className="flex flex-col items-center mb-6">
          <div
            onClick={() => handleSelect('1xBet')}
            className={`w-full relative flex flex-col items-center p-5 rounded-2xl border cursor-pointer transition-all ${
              selected === '1xBet'
                ? 'border-emerald-400 bg-emerald-500/10 shadow-[0_0_25px_rgba(0,255,102,0.4)] scale-102'
                : 'border-cyan-500/30 bg-slate-900/70 hover:border-amber-400'
            }`}
          >
            <span className="absolute top-3 right-3 text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400 font-bold font-mono">
              ✓ نشط ومحدد
            </span>
            <span className="text-amber-400 text-base font-bold tracking-wider mb-1 mt-2">
              منصة 1xBet الرسمية
            </span>
            <span className="text-cyan-400 text-xs font-bold font-mono">
              سيرفر التوقعات المباشر
            </span>
          </div>
        </div>

        {/* Enter Button */}
        <div className="animate-fadeIn mt-2">
          <button
            onClick={handleConnect}
            className="w-full bg-amber-400 border-none rounded-xl p-3.5 text-black font-black text-base tracking-wider cursor-pointer shadow-[0_0_15px_rgba(255,215,0,0.4)] hover:bg-emerald-400 hover:shadow-[0_0_25px_#00ff66] transition-all active:scale-95"
          >
            ► دخول المنصة (1xBet)
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-xs font-mono tracking-wider text-cyan-400/70 text-center">
        اتصال مشفر وآمن 100% . FIREBASE RTDB CONNECTED
      </div>

      {/* Modal Dialog */}
      {isConnecting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md px-4 animate-fadeIn">
          <div className="bg-slate-900/95 border border-cyan-400 rounded-2xl p-7 w-full max-w-xs text-center shadow-[0_0_30px_rgba(0,240,255,0.3)]">
            <div
              className={`w-12 h-12 border-4 border-cyan-400/20 rounded-full mx-auto mb-4 animate-spin ${
                isConnectedSuccess ? 'border-t-emerald-400 border-emerald-400' : 'border-t-amber-400'
              }`}
            />
            <div
              className={`text-base font-bold mb-1 font-mono transition-colors ${
                isConnectedSuccess ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {modalTitle}
            </div>
            <div className="text-cyan-400 text-xs font-mono mb-5">{modalSub}</div>
            <div className="w-full h-1.5 bg-cyan-950 rounded-full overflow-hidden border border-cyan-500/40">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 shadow-[0_0_10px_#00ff66] transition-all duration-75"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
