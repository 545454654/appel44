import React from 'react';
import goodAppleImg from '../assets/images/full_bright_apple_1786381333655.jpg';
import badAppleImg from '../assets/images/bad_apple_icon_1786381080325.jpg';
import woodCoverImg from '../assets/images/wood_cover_icon_1786381095571.jpg';

/**
 * KING OLIVR Skull Crown Logo Component
 */
export const KingLogoIcon: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => {
  return (
    <div className={`relative flex items-center justify-center rounded-full bg-black border-2 border-amber-400/80 p-2 shadow-[0_0_20px_rgba(255,215,0,0.4)] ${className}`}>
      <svg viewBox="0 0 200 200" className="w-full h-full text-white fill-current">
        {/* Crown */}
        <path d="M 40 75 L 55 110 L 100 80 L 145 110 L 160 75 L 140 120 L 60 120 Z" fill="#ffd700" stroke="#000" strokeWidth="3" />
        <circle cx="40" cy="70" r="7" fill="#ffd700" />
        <circle cx="70" cy="55" r="7" fill="#ffd700" />
        <circle cx="100" cy="45" r="8" fill="#ffd700" />
        <circle cx="130" cy="55" r="7" fill="#ffd700" />
        <circle cx="160" cy="70" r="7" fill="#ffd700" />
        
        {/* Skull head */}
        <path d="M 65 105 C 65 75, 135 75, 135 105 C 135 125, 125 135, 125 145 L 75 145 C 75 135, 65 125, 65 105 Z" fill="#ffffff" />
        
        {/* Eye sockets */}
        <ellipse cx="82" cy="110" rx="11" ry="14" fill="#000" />
        <ellipse cx="118" cy="110" rx="11" ry="14" fill="#000" />
        
        {/* Nose cavity */}
        <polygon points="100,122 94,132 106,132" fill="#000" />
        
        {/* Teeth */}
        <path d="M 80 145 L 80 155 M 90 145 L 90 155 M 100 145 L 100 155 M 110 145 L 110 155 M 120 145 L 120 155" stroke="#000" strokeWidth="3" />
        
        {/* KING text below */}
        <text x="100" y="185" textAnchor="middle" fill="#ffffff" fontWeight="900" fontSize="32" fontFamily="Courier New, monospace" letterSpacing="2">KING</text>
      </svg>
    </div>
  );
};

/**
 * Fresh Good Apple Icon (Safe - Whole glossy red apple on green badge)
 */
export const GoodAppleIcon: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => {
  return (
    <div className={`relative flex items-center justify-center rounded-full overflow-hidden shadow-[0_0_12px_rgba(0,255,102,0.6)] ${className}`}>
      <img
        src={goodAppleImg}
        alt="تفاحة سليمة"
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover rounded-full"
      />
    </div>
  );
};

/**
 * Cut / Eaten Apple Core Icon (Bad / Bomb / Trap)
 */
export const BadAppleIcon: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => {
  return (
    <div className={`relative flex items-center justify-center rounded-full overflow-hidden shadow-[0_0_10px_rgba(255,0,0,0.5)] ${className}`}>
      <img
        src={badAppleImg}
        alt="تفاحة تالفة"
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover rounded-full"
      />
    </div>
  );
};

/**
 * Wooden Cover Button Icon (Unrevealed state - Arrow tied with cyan rope)
 */
export const WoodCoverIcon: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => {
  return (
    <div className={`relative flex items-center justify-center rounded-full overflow-hidden ${className}`}>
      <img
        src={woodCoverImg}
        alt="غطاء خشبي"
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover rounded-full"
      />
    </div>
  );
};

/**
 * 1xBet Platform Logo
 */
export const OneXBetLogo: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => {
  return (
    <div className={`flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-700 via-sky-600 to-cyan-500 border border-sky-300 shadow-[0_0_15px_rgba(14,165,233,0.6)] ${className}`}>
      <span className="text-white font-black text-xl italic tracking-tighter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">1xBET</span>
    </div>
  );
};
