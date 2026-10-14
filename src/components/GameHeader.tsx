'use client';

import React from 'react';
import { Volume2, VolumeX, HelpCircle, RotateCcw, Smartphone, Flame, Trophy } from 'lucide-react';

interface GameHeaderProps {
  score: number;
  streak: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenHowToPlay: () => void;
  onOpenPartyMode: () => void;
  onNewGame: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  score,
  streak,
  soundEnabled,
  onToggleSound,
  onOpenHowToPlay,
  onOpenPartyMode,
  onNewGame,
}) => {
  return (
    <header className="w-full max-w-xl mx-auto flex flex-col gap-2.5 pt-2 pb-3">
      {/* Top Navbar */}
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-xl shadow-lg shadow-amber-500/20 border border-amber-300">
            ⚽
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
                HEDBANZ
              </span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-400/30 px-1.5 py-0.2 rounded font-black tracking-wider">
                FOOTBALL
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-medium">Who is on your headband?</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5">
          {/* Party Forehead Mode */}
          <button
            onClick={onOpenPartyMode}
            type="button"
            title="Forehead Party Mode (Hold phone to your head)"
            className="p-2 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-xl border border-zinc-700/60 transition"
          >
            <Smartphone className="w-4 h-4" />
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            type="button"
            title={soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
            className="p-2 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-xl border border-zinc-700/60 transition"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-zinc-500" />
            )}
          </button>

          {/* How to Play */}
          <button
            onClick={onOpenHowToPlay}
            type="button"
            title="How to Play"
            className="p-2 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-xl border border-zinc-700/60 transition"
          >
            <HelpCircle className="w-4 h-4 text-amber-400" />
          </button>

          {/* New Game / Random Player */}
          <button
            onClick={onNewGame}
            type="button"
            title="New Secret Player"
            className="p-2 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-xl border border-zinc-700/60 transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Score and Streak Bar */}
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-zinc-900/80 backdrop-blur rounded-xl border border-zinc-800 text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 font-bold text-zinc-300">
            <Trophy className="w-3.5 h-3.5 text-yellow-400" />
            <span>Solved: <strong className="text-white">{score}</strong></span>
          </div>

          <div className="flex items-center gap-1.5 font-bold text-zinc-300">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span>Streak: <strong className="text-orange-400">{streak}</strong></span>
          </div>
        </div>

        <div className="text-[11px] text-zinc-400 font-medium">
          Single Player vs RefBot
        </div>
      </div>
    </header>
  );
};
