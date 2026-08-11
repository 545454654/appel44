import React, { useState } from 'react';
import { soundEngine } from '../utils/audio';
import { OneXBetLogo } from './AssetIcons';

interface LoginViewProps {
  onSuccess: (userId: string) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onSuccess }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [progress, setProgress] = useState(0);

  const REQUIRED_PASS = 'd!8w3fle$Am$6Kg';

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'Enter' && e.key !== 'Tab') {
      soundEngine.playKeyClick();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId.trim()) return;

    setErrorMsg('');

    // Check Password
    if (password !== REQUIRED_PASS) {
      soundEngine.playKeyClick();
      setErrorMsg('كلمة السر غير صحيحة، يرجى التأكد من كلمة السر والمحاولة مجدداً.');
      return;
    }

    soundEngine.playKeyClick();
    setIsVerifying(true);
    soundEngine.playSuccess();

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 5;
      setProgress(currentProgress);

      if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          onSuccess(userId);
        }, 300);
      }
    }, 50);
  };

  return (
    <div className="relative z-10 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto flex flex-col items-center px-3 sm:px-6 py-4 sm:py-8 animate-fadeIn">
      {/* Main Title */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-wider text-center mb-1 sm:mb-2 font-mono animated-title-glow">
        اسكربت التفاحه مضمون100%
      </h1>
      <div className="text-[11px] sm:text-xs md:text-sm font-mono tracking-[1px] sm:tracking-[2px] text-cyan-400 text-center mb-5 sm:mb-8 drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]">
        سيرفرات آمنة . نظام التوقعات . تسجيل الدخول
      </div>

      {/* Login Box */}
      <div className="w-full border border-cyan-500/40 rounded-2xl p-4 sm:p-6 md:p-8 bg-slate-950/85 backdrop-blur-md shadow-[inset_0_0_15px_rgba(0,240,255,0.1),0_0_25px_rgba(0,240,255,0.15)]">
        {/* Card Header */}
        <div className="flex justify-between items-center pb-3 mb-6 border-b border-amber-400/30 text-xs font-mono font-bold text-amber-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#00ff66] animate-pulse"></span>
            AUTH // LOGIN
          </div>
          <div className="text-cyan-400 bg-cyan-950/80 border border-cyan-500/40 px-2 py-0.5 rounded font-mono text-[10px]">
            v3.7.1
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-950/80 border border-red-500/80 text-red-300 font-bold text-xs rounded-xl text-center shadow-[0_0_12px_rgba(255,0,0,0.3)] animate-fadeIn">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-mono tracking-wider text-amber-400 mb-2 font-bold">
              ID الحساب
            </label>
            <input
              type="text"
              required
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="ID الحساب فقط"
              className="w-full bg-slate-900/90 border border-cyan-500/50 rounded-lg p-3.5 text-white font-mono text-sm outline-none tracking-wider focus:border-amber-400 focus:shadow-[0_0_12px_rgba(255,215,0,0.5)] transition-all placeholder:text-slate-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono tracking-wider text-amber-400 mb-2 font-bold">
              PASSWORD
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              onKeyDown={handleKeyDown}
              placeholder="••••••••"
              className="w-full bg-slate-900/90 border border-cyan-500/50 rounded-lg p-3.5 text-white font-mono text-sm outline-none tracking-wider focus:border-amber-400 focus:shadow-[0_0_12px_rgba(255,215,0,0.5)] transition-all placeholder:text-slate-500"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 bg-transparent border border-amber-400 rounded-lg p-3.5 text-amber-400 font-mono text-lg font-bold tracking-widest cursor-pointer shadow-[0_0_10px_rgba(255,215,0,0.2)] hover:bg-amber-400 hover:text-black hover:shadow-[0_0_20px_#ffd700] transition-all active:scale-95"
          >
            ► LOGIN
          </button>
        </form>

        {/* Supported Platform */}
        <div className="flex justify-center items-center pt-5 mt-6 border-t border-white/10">
          <div className="flex flex-col items-center gap-1.5">
            <OneXBetLogo className="w-28 h-12" />
            <span className="text-amber-400 text-xs font-bold font-mono tracking-wider uppercase mt-1">
              المنصة المدعومة: 1xBet
            </span>
            <span className="text-cyan-400 text-[10px] font-bold font-mono">سيرفر مباشر 100%</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-[11px] font-mono tracking-widest text-cyan-400/70 text-center">
        اتصال مشفر وآمن 100% . SCRIPT ENGINE
      </div>

      {/* Modal Dialog */}
      {isVerifying && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md transition-all animate-fadeIn px-4">
          <div className="bg-slate-900/95 border border-emerald-400 rounded-2xl p-8 w-full max-w-xs text-center shadow-[0_0_30px_rgba(0,255,102,0.3)] transform transition-transform">
            <div className="text-4xl text-emerald-400 mb-3 drop-shadow-[0_0_15px_#00ff66]">
              ✓
            </div>
            <div className="text-amber-400 text-lg font-bold font-mono tracking-wider mb-2">
              تم التحقق بنجاح
            </div>
            <div className="text-cyan-400 text-xs font-mono tracking-wider mb-5">
              جاري تحضير قائمة المنصات...
            </div>
            <div className="w-full h-1.5 bg-emerald-950 rounded-full overflow-hidden border border-emerald-500/40">
              <div
                className="h-full bg-emerald-400 shadow-[0_0_10px_#00ff66] transition-all duration-75"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
