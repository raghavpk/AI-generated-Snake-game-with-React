import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: "Neon Horizon",
    artist: "AI Synthwave",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=200&h=200"
  },
  {
    id: 2,
    title: "Cybernetic Dreams",
    artist: "Neural Network",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=200&h=200"
  },
  {
    id: 3,
    title: "Digital Rain",
    artist: "Algorithm",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=200&h=200"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const playNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const playPrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleTrackEnd = () => {
    playNext();
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setProgress(value);
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = (value / 100) * audioRef.current.duration;
    }
  };

  return (
    <div className="bg-black border-4 border-[#ff00ff] p-6 w-full max-w-sm shadow-[-8px_8px_0_#00ffff]">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
      />
      
      <div className="flex items-center gap-4 mb-6">
        <div className="relative w-16 h-16 overflow-hidden border-2 border-[#00ffff] shadow-[4px_4px_0_#ff00ff]">
          <img 
            src={currentTrack.cover} 
            alt={currentTrack.title}
            className={`w-full h-full object-cover grayscale contrast-200 ${isPlaying ? 'animate-[spin_4s_steps(8)_infinite]' : ''}`}
          />
          <div className="absolute inset-0 bg-[#ff00ff]/30 mix-blend-overlay"></div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[#00ffff] font-black truncate text-xl uppercase glitch" data-text={currentTrack.title}>
            {currentTrack.title}
          </h3>
          <p className="text-[#ff00ff] text-sm truncate uppercase tracking-widest">{currentTrack.artist}</p>
        </div>
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className="text-[#00ffff] hover:text-[#ff00ff] transition-colors"
        >
          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-6 group">
        <input
          type="range"
          min="0"
          max="100"
          value={progress || 0}
          onChange={handleSeek}
          className="w-full h-2 bg-neutral-900 appearance-none cursor-pointer accent-[#ff00ff] hover:accent-[#00ffff] border border-[#00ffff]"
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-8">
        <button 
          onClick={playPrev}
          className="text-[#ff00ff] hover:text-[#00ffff] transition-colors"
        >
          <SkipBack size={32} />
        </button>
        
        <button 
          onClick={togglePlay}
          className="w-16 h-16 flex items-center justify-center bg-black border-4 border-[#00ffff] text-[#00ffff] shadow-[4px_4px_0_#ff00ff] hover:bg-[#00ffff] hover:text-black transition-colors"
        >
          {isPlaying ? <Pause size={32} className="fill-current" /> : <Play size={32} className="fill-current ml-2" />}
        </button>
        
        <button 
          onClick={playNext}
          className="text-[#ff00ff] hover:text-[#00ffff] transition-colors"
        >
          <SkipForward size={32} />
        </button>
      </div>

      {/* Visualizer bars (decorative) */}
      <div className="flex justify-center items-end gap-1 h-12 mt-8 opacity-80">
        {[...Array(16)].map((_, i) => (
          <div 
            key={i}
            className={`w-2 ${i % 2 === 0 ? 'bg-[#00ffff]' : 'bg-[#ff00ff]'} origin-bottom`}
            style={{
              height: '100%',
              transform: isPlaying ? 'scaleY(1)' : 'scaleY(0.1)',
              animationName: isPlaying ? 'visualizer' : 'none',
              animationDuration: '0.5s',
              animationTimingFunction: 'steps(4)',
              animationIterationCount: 'infinite',
              animationDirection: 'alternate',
              animationDelay: `${i * 0.05}s`,
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes visualizer {
          0% { transform: scaleY(0.1); }
          50% { transform: scaleY(0.9); }
          100% { transform: scaleY(0.3); }
        }
      `}</style>
    </div>
  );
}
