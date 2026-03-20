import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Gamepad2 } from 'lucide-react';

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen bg-black text-[#00ffff] font-mono overflow-hidden selection:bg-[#ff00ff]/50 screen-tear">
      {/* Background Effects */}
      <div className="scanlines"></div>
      <div className="static-noise"></div>
      
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#00ffff]/10 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#ff00ff]/10 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between mb-12 border-b-4 border-[#ff00ff] pb-4">
          <div className="flex items-center gap-3">
            <Gamepad2 className="w-12 h-12 text-[#00ffff] drop-shadow-[4px_4px_0_#ff00ff]" />
            <h1 className="text-5xl font-black tracking-tighter glitch" data-text="NEON_SNAKE.EXE">
              NEON_SNAKE.EXE
            </h1>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xl font-mono text-[#ff00ff] uppercase tracking-widest">SYS.SCORE</span>
            <span className="text-5xl font-mono font-bold text-[#00ffff] drop-shadow-[3px_3px_0_#ff00ff]">
              {score.toString().padStart(4, '0')}
            </span>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24">
          {/* Game Container */}
          <div className="w-full max-w-2xl flex flex-col items-center">
            <div className="w-full aspect-square max-w-[500px] relative group border-4 border-[#00ffff] shadow-[8px_8px_0_#ff00ff]">
              <SnakeGame onScoreChange={setScore} />
            </div>
            <p className="mt-6 text-xl font-mono text-[#00ffff] text-center bg-black border-2 border-[#ff00ff] p-2">
              INPUT: <kbd className="px-2 py-1 bg-[#ff00ff] text-black mx-1">W</kbd>
              <kbd className="px-2 py-1 bg-[#ff00ff] text-black mx-1">A</kbd>
              <kbd className="px-2 py-1 bg-[#ff00ff] text-black mx-1">S</kbd>
              <kbd className="px-2 py-1 bg-[#ff00ff] text-black mx-1">D</kbd>
              || ARROWS. [SPACE] TO HALT.
            </p>
          </div>

          {/* Music Player Container */}
          <div className="w-full max-w-sm flex flex-col items-center lg:items-start">
            <div className="w-full relative group border-4 border-[#ff00ff] shadow-[-8px_8px_0_#00ffff] bg-black">
              <MusicPlayer />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
