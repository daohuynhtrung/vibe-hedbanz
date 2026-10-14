'use client';

import React from 'react';
import { Footballer, GameStatus } from '@/types/footballer';
import { Sparkles, Trophy, HelpCircle, Eye, EyeOff, Shield } from 'lucide-react';

interface HeadbandCardProps {
  player: Footballer;
  status: GameStatus;
  questionCount: number;
  guessCount: number;
  peekSecret: boolean;
  onTogglePeek: () => void;
  onGiveUp: () => void;
}

export const HeadbandCard: React.FC<HeadbandCardProps> = ({
  player,
  status,
  questionCount,
  guessCount,
  peekSecret,
  onTogglePeek,
  onGiveUp,
}) => {
  const isRevealed = status === 'won' || status === 'given_up';

  return (
    <div className="w-full flex flex-col items-center">
      {/* Hedbanz Headband Strap */}
      <div className="w-full relative max-w-xl mx-auto flex items-center justify-center">
        {/* Headband Belt */}
        <div className="absolute top-7 left-0 right-0 h-11 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 rounded-full shadow-lg border-2 border-amber-300 flex items-center justify-between px-6 z-0 overflow-hidden">
          <div className="flex gap-2 opacity-60">
            <span className="text-xs font-black tracking-widest text-amber-950 uppercase">HEDBANZ</span>
            <span className="text-xs font-black tracking-widest text-amber-950 uppercase">⚽ FOOTBALL</span>
          </div>
          <div className="flex gap-2 opacity-60">
            <span className="text-xs font-black tracking-widest text-amber-950 uppercase">WHO AM I?</span>
          </div>
          {/* Subtle shine effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
        </div>

        {/* Center Card Holder Clip */}
        <div className="relative z-10 flex flex-col items-center">
          {/* Card Clip Bracket */}
          <div className="w-16 h-5 bg-gradient-to-b from-zinc-700 to-zinc-900 rounded-t-md shadow-md border border-zinc-600 flex items-center justify-center">
            <div className="w-8 h-1 bg-amber-400 rounded-full" />
          </div>

          {/* The Hedbanz Card (3D Flip Container) */}
          <div className="w-64 sm:w-72 h-84 sm:h-92 relative perspective-1000 -mt-1">
            <div
              className={`w-full h-full duration-700 preserve-3d transition-transform ${
                isRevealed ? 'rotate-y-180' : ''
              }`}
              style={{
                transformStyle: 'preserve-3d',
                transform: isRevealed ? 'rotateY(180deg)' : 'rotateY(0deg)',
                transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {/* FRONT: Mystery Card (Hidden from user during play) */}
              <div
                className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-950 border-4 border-amber-400/80 shadow-2xl p-5 flex flex-col items-center justify-between text-white backface-hidden overflow-hidden"
                style={{ backfaceVisibility: 'hidden' }}
              >
                {/* Holographic shimmer overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none animate-pulse" />

                {/* Top Card Header */}
                <div className="w-full flex justify-between items-center z-10">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-black/40 backdrop-blur rounded-full border border-amber-400/40 text-[11px] font-bold tracking-wider text-amber-300">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
                    SECRET FOOTBALLER
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold">
                    <span className="bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-md border border-amber-400/30">
                      Q: {questionCount}
                    </span>
                    {guessCount > 0 && (
                      <span className="bg-red-400/20 text-red-300 px-1.5 py-0.5 rounded-md border border-red-400/30">
                        G: {guessCount}
                      </span>
                    )}
                  </div>
                </div>

                {/* Center Mystery Display */}
                <div className="flex flex-col items-center justify-center my-auto z-10 text-center">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center shadow-lg shadow-amber-500/30 animate-bounce" style={{ animationDuration: '3s' }}>
                      <HelpCircle className="w-14 h-14 text-zinc-950 stroke-[2.5]" />
                    </div>
                    <span className="absolute -bottom-1 -right-1 text-2xl">⚽</span>
                  </div>

                  <h3 className="mt-4 text-xl sm:text-2xl font-black tracking-tight text-amber-200">
                    WHO AM I?
                  </h3>
                  <p className="text-xs text-zinc-300 max-w-[200px] mt-1 font-medium">
                    Ask Yes/No questions in the chat to discover my identity!
                  </p>

                  {/* Peek Mode for testing or party host */}
                  {peekSecret && (
                    <div className="mt-3 px-3 py-1.5 bg-red-950/80 border border-red-500/60 rounded-lg text-xs font-bold text-red-200 animate-pulse">
                      🤫 Secret: {player.name}
                    </div>
                  )}
                </div>

                {/* Bottom Card Controls */}
                <div className="w-full flex items-center justify-between z-10 pt-2 border-t border-white/10 text-xs">
                  <button
                    onClick={onTogglePeek}
                    type="button"
                    title={peekSecret ? 'Hide Peek' : 'Peek Player (for party host or testing)'}
                    className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white transition-colors"
                  >
                    {peekSecret ? <EyeOff className="w-3.5 h-3.5 text-amber-400" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{peekSecret ? 'Hide' : 'Peek'}</span>
                  </button>

                  <button
                    onClick={onGiveUp}
                    type="button"
                    className="px-2.5 py-1 bg-red-600/30 hover:bg-red-600/50 border border-red-500/40 text-red-300 rounded text-[11px] font-semibold transition"
                  >
                    Give Up
                  </button>
                </div>
              </div>

              {/* BACK: Revealed Player Card (FIFA / EA FC style) */}
              <div
                className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-yellow-700 border-4 border-yellow-200 shadow-2xl p-5 flex flex-col justify-between text-zinc-950 backface-hidden overflow-hidden"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
              >
                {/* Card Header: Rating, Position, Nationality */}
                <div className="w-full flex justify-between items-start z-10">
                  <div className="flex flex-col items-center leading-none">
                    <span className="text-3xl font-black tracking-tighter text-zinc-950 drop-shadow">
                      {player.rating || 90}
                    </span>
                    <span className="text-xs font-black tracking-widest text-zinc-900 uppercase">
                      {player.position === 'Goalkeeper'
                        ? 'GK'
                        : player.position === 'Defender'
                        ? 'DF'
                        : player.position === 'Midfielder'
                        ? 'MF'
                        : 'FW'}
                    </span>
                    <span className="text-xs mt-1 font-semibold">{player.countryCode}</span>
                  </div>

                  <div className="px-2.5 py-1 rounded-full bg-zinc-950/80 text-amber-300 text-xs font-black uppercase tracking-wider flex items-center gap-1 shadow">
                    {status === 'won' ? (
                      <>
                        <Trophy className="w-3.5 h-3.5 text-yellow-400" />
                        SOLVED!
                      </>
                    ) : (
                      <>
                        <Shield className="w-3.5 h-3.5 text-red-400" />
                        REVEALED
                      </>
                    )}
                  </div>
                </div>

                {/* Player Photo / Avatar Silhouette & Name */}
                <div className="flex flex-col items-center justify-center my-auto z-10 text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-b from-white/90 to-amber-200 border-2 border-zinc-900 shadow-inner flex items-center justify-center text-3xl font-black text-zinc-900">
                    {player.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>

                  <h2 className="mt-2 text-xl font-black text-zinc-950 tracking-tight leading-tight uppercase">
                    {player.name}
                  </h2>
                  <p className="text-xs font-bold text-zinc-900">
                    {player.currentClub} • {player.nationality}
                  </p>
                </div>

                {/* Key Facts Quick Grid */}
                <div className="w-full bg-zinc-950/20 backdrop-blur-sm rounded-xl p-2.5 z-10 border border-zinc-950/20 grid grid-cols-3 gap-1 text-center">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-medium text-zinc-800 uppercase">Foot</span>
                    <span className="text-xs font-black">{player.dominantFoot}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-medium text-zinc-800 uppercase">Status</span>
                    <span className="text-xs font-black">{player.isActive ? 'Active' : 'Legend'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-medium text-zinc-800 uppercase">No.</span>
                    <span className="text-xs font-black">#{player.shirtNumbers[0]}</span>
                  </div>
                </div>

                {/* Trophies highlights */}
                <div className="w-full flex items-center justify-center gap-2 text-xs font-bold text-zinc-900 z-10 pt-1">
                  {player.trophies.worldCup && (
                    <span className="flex items-center gap-0.5 bg-yellow-300/60 px-1.5 py-0.5 rounded border border-yellow-400/80">
                      🏆 World Cup
                    </span>
                  )}
                  {player.trophies.championsLeague && (
                    <span className="flex items-center gap-0.5 bg-yellow-300/60 px-1.5 py-0.5 rounded border border-yellow-400/80">
                      ⭐ UCL ({player.trophies.championsLeagueCount || 1})
                    </span>
                  )}
                  {player.trophies.ballonDor && (
                    <span className="flex items-center gap-0.5 bg-yellow-300/60 px-1.5 py-0.5 rounded border border-yellow-400/80">
                      🥇 Ballon d&apos;Or
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
