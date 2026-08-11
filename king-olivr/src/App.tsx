import React, { useState } from 'react';
import { PlatformType, ScreenState } from './types';
import { MatrixBackground } from './components/MatrixBackground';
import { LoginView } from './components/LoginView';
import { PlatformView } from './components/PlatformView';
import { TerminalView } from './components/TerminalView';

export default function App() {
  const [screen, setScreen] = useState<ScreenState>('login');
  const [userId, setUserId] = useState<string>('');
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType>('1xBet');

  const handleLoginSuccess = (id: string) => {
    setUserId(id);
    setScreen('platform');
  };

  const handlePlatformSelect = (platform: PlatformType) => {
    setSelectedPlatform(platform);
    setScreen('terminal');
  };

  return (
    <div className="relative min-h-screen bg-[#050811] text-[#00f0ff] font-sans selection:bg-amber-400 selection:text-black overflow-x-hidden flex flex-col justify-center items-center">
      {/* Matrix Canvas Rain Background */}
      <MatrixBackground />

      {/* Screen Render */}
      <main className="w-full relative z-10 flex-1 flex flex-col justify-center items-center">
        {screen === 'login' && (
          <LoginView onSuccess={handleLoginSuccess} />
        )}

        {screen === 'platform' && (
          <PlatformView onSelectPlatform={handlePlatformSelect} />
        )}

        {screen === 'terminal' && (
          <TerminalView
            platform={selectedPlatform}
            userId={userId}
            onBackToPlatforms={() => setScreen('platform')}
          />
        )}
      </main>
    </div>
  );
}
