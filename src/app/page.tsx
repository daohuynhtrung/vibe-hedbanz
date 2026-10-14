'use client';

import React, { useState, useEffect } from 'react';
import { Footballer, ChatMessage, GameStatus } from '@/types/footballer';
import { FOOTBALLERS } from '@/data/footballers';
import { answerQuestion } from '@/lib/qa-engine';
import { sound } from '@/lib/audio';
import { HeadbandCard } from '@/components/HeadbandCard';
import { ChatBox } from '@/components/ChatBox';
import { GameHeader } from '@/components/GameHeader';
import { VictoryModal } from '@/components/VictoryModal';
import { GiveUpModal } from '@/components/GiveUpModal';
import { HowToPlayModal } from '@/components/HowToPlayModal';
import { ForeheadPartyModal } from '@/components/ForeheadPartyModal';

function getRandomFootballer(excludeId?: string): Footballer {
  const pool = excludeId
    ? FOOTBALLERS.filter((f) => f.id !== excludeId)
    : FOOTBALLERS;
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex] || FOOTBALLERS[0];
}

const INITIAL_MESSAGE: ChatMessage = {
  id: 'welcome-init',
  sender: 'bot',
  text: "👋 Welcome to Hedbanz Football! A secret footballer is placed on your headband. Ask me any Yes/No question (e.g. 'Is he active?', 'Does he play in the Premier League?', 'Has he won the World Cup?') or guess his name!",
  timestamp: 0,
};

export default function HedbanzPage() {
  const [currentPlayer, setCurrentPlayer] = useState<Footballer>(FOOTBALLERS[0]);
  const [status, setStatus] = useState<GameStatus>('playing');
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [questionCount, setQuestionCount] = useState<number>(0);
  const [guessCount, setGuessCount] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [peekSecret, setPeekSecret] = useState<boolean>(false);

  // Modals
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState<boolean>(false);
  const [isVictoryModalOpen, setIsVictoryModalOpen] = useState<boolean>(false);
  const [isGiveUpModalOpen, setIsGiveUpModalOpen] = useState<boolean>(false);
  const [isGiveUpConfirming, setIsGiveUpConfirming] = useState<boolean>(true);
  const [isPartyModeOpen, setIsPartyModeOpen] = useState<boolean>(false);

  // Load saved stats and randomize player after hydration
  useEffect(() => {
    queueMicrotask(() => {
      try {
        const savedScore = localStorage.getItem('hedbanz_score');
        const savedStreak = localStorage.getItem('hedbanz_streak');
        if (savedScore) setScore(parseInt(savedScore, 10) || 0);
        if (savedStreak) setStreak(parseInt(savedStreak, 10) || 0);
      } catch {
        // localStorage may fail in private mode
      }

      const randomFirstPlayer = getRandomFootballer();
      setCurrentPlayer(randomFirstPlayer);
    });
  }, []);

  // Start new round
  const startNewRound = (customPlayer?: Footballer) => {
    setCurrentPlayer((prev) => customPlayer || getRandomFootballer(prev?.id));
    setStatus('playing');
    setQuestionCount(0);
    setGuessCount(0);
    setPeekSecret(false);
    setIsVictoryModalOpen(false);
    setIsGiveUpModalOpen(false);
    setIsGiveUpConfirming(true);

    const welcomeMsg: ChatMessage = {
      id: `welcome-${Date.now()}`,
      sender: 'bot',
      text: "👋 Welcome to Hedbanz Football! A secret footballer is placed on your headband. Ask me any Yes/No question (e.g. 'Is he active?', 'Does he play in the Premier League?', 'Has he won the World Cup?') or guess his name!",
      timestamp: Date.now(),
    };
    setMessages([welcomeMsg]);
  };

  // Handle Sound toggle
  const handleToggleSound = () => {
    const nextVal = !soundEnabled;
    setSoundEnabled(nextVal);
    sound.enabled = nextVal;
  };

  // Handle user sending message (either question or guess)
  const handleSendMessage = (text: string) => {
    if (status !== 'playing') return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: Date.now(),
    };

    // Evaluate answer with QA Engine
    const result = answerQuestion(text, currentPlayer);

    if (result.isGuess) {
      setGuessCount((prev) => prev + 1);
    } else {
      setQuestionCount((prev) => prev + 1);
    }

    // Play sounds
    if (result.type === 'correct_guess') {
      sound.playWin();
    } else if (result.type === 'wrong_guess' || result.type === 'no') {
      sound.playNo();
    } else if (result.type === 'yes') {
      sound.playYes();
    } else {
      sound.playWhistle();
    }

    const botMsg: ChatMessage = {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: result.response,
      answerType: result.type,
      timestamp: Date.now() + 100,
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);

    // Check for victory
    if (result.type === 'correct_guess') {
      setStatus('won');
      const newScore = score + 1;
      const newStreak = streak + 1;
      setScore(newScore);
      setStreak(newStreak);

      try {
        localStorage.setItem('hedbanz_score', newScore.toString());
        localStorage.setItem('hedbanz_streak', newStreak.toString());
      } catch {
        // ignore
      }

      // Small delay before opening victory modal so user sees card flip
      setTimeout(() => {
        setIsVictoryModalOpen(true);
      }, 700);
    }
  };

  // Handle giving up
  const handleOpenGiveUp = () => {
    if (status !== 'playing') return;
    setIsGiveUpConfirming(true);
    setIsGiveUpModalOpen(true);
  };

  const handleConfirmGiveUp = () => {
    setStatus('given_up');
    setStreak(0);
    try {
      localStorage.setItem('hedbanz_streak', '0');
    } catch {
      // ignore
    }

    sound.playCardFlip();
    setIsGiveUpConfirming(false);

    const giveUpNotice: ChatMessage = {
      id: `system-${Date.now()}`,
      sender: 'system',
      text: `🏳️ You gave up! The secret footballer on your headband was ${currentPlayer.name}.`,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, giveUpNotice]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-zinc-950 via-zinc-900 to-black text-zinc-100 p-3 sm:p-5">
      {/* App Header */}
      <GameHeader
        score={score}
        streak={streak}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
        onOpenPartyMode={() => setIsPartyModeOpen(true)}
        onNewGame={() => startNewRound()}
      />

      {/* Main Game Arena */}
      <main className="w-full max-w-5xl mx-auto flex-1 flex flex-col lg:flex-row items-center lg:items-start justify-center gap-6 lg:gap-10 mt-2">
        {/* Left Column: Hedbanz Card */}
        <div className="w-full lg:w-auto flex flex-col items-center">
          <HeadbandCard
            player={currentPlayer}
            status={status}
            questionCount={questionCount}
            guessCount={guessCount}
            peekSecret={peekSecret}
            onTogglePeek={() => setPeekSecret(!peekSecret)}
            onGiveUp={handleOpenGiveUp}
          />

          {/* Quick tips below card */}
          <div className="mt-4 px-4 py-2 bg-zinc-900/60 rounded-xl border border-zinc-800 text-[11px] text-zinc-400 max-w-xs text-center flex items-center gap-1.5 shadow-sm">
            <span>💡</span>
            <span>
              <strong>Hedbanz Rule:</strong> The card is on your head! Ask RefBot yes/no questions to narrow down the player.
            </span>
          </div>
        </div>

        {/* Right Column: ChatBox & RefBot */}
        <div className="w-full lg:flex-1 max-w-xl">
          <ChatBox
            messages={messages}
            status={status}
            onSendMessage={handleSendMessage}
            onRestart={() => startNewRound()}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-xl mx-auto text-center py-4 text-xs text-zinc-500 flex flex-col sm:flex-row items-center justify-between border-t border-zinc-800/60 mt-6 gap-2">
        <span>Hedbanz Football • 100% Free & Open Source</span>
        <span>Made with Next.js, React 19 & Tailwind CSS</span>
      </footer>

      {/* Modals */}
      <HowToPlayModal
        isOpen={isHowToPlayOpen}
        onClose={() => setIsHowToPlayOpen(false)}
      />

      <VictoryModal
        isOpen={isVictoryModalOpen}
        player={currentPlayer}
        questionCount={questionCount}
        guessCount={guessCount}
        onNextRound={() => startNewRound()}
      />

      <GiveUpModal
        isOpen={isGiveUpModalOpen}
        isConfirming={isGiveUpConfirming}
        player={currentPlayer}
        onCancel={() => setIsGiveUpModalOpen(false)}
        onConfirmGiveUp={handleConfirmGiveUp}
        onNextRound={() => startNewRound()}
      />

      <ForeheadPartyModal
        isOpen={isPartyModeOpen}
        player={currentPlayer}
        onClose={() => setIsPartyModeOpen(false)}
      />
    </div>
  );
}
