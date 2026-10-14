'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, GameStatus } from '@/types/footballer';
import { Send, Bot, User, CheckCircle2, XCircle, AlertCircle, Sparkles, HelpCircle, Target } from 'lucide-react';

interface ChatBoxProps {
  messages: ChatMessage[];
  status: GameStatus;
  onSendMessage: (text: string) => void;
  onRestart: () => void;
}

const QUICK_QUESTIONS = [
  'Is he an active player?',
  'Is he a forward / striker?',
  'Is he a midfielder?',
  'Is he from Europe?',
  'Is he from South America?',
  'Does he play in the Premier League?',
  'Has he played for Real Madrid?',
  'Has he won the World Cup?',
  'Has he won the Champions League?',
  'Has he won the Ballon d\'Or?',
  'Is he left-footed?',
  'Is he over 30 years old?',
];

export const ChatBox: React.FC<ChatBoxProps> = ({
  messages,
  status,
  onSendMessage,
  onRestart,
}) => {
  const [inputText, setInputText] = useState('');
  const [isGuessMode, setIsGuessMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed || status !== 'playing') return;

    if (isGuessMode && !trimmed.toLowerCase().startsWith('is it') && !trimmed.toLowerCase().startsWith('is he')) {
      onSendMessage(`Is it ${trimmed}?`);
    } else {
      onSendMessage(trimmed);
    }

    setInputText('');
    setIsGuessMode(false);
  };

  const handleQuickQuestion = (question: string) => {
    if (status !== 'playing') return;
    onSendMessage(question);
    inputRef.current?.focus();
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col h-[520px] bg-zinc-900/90 backdrop-blur-md rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden">
      {/* Chat Header */}
      <div className="px-4 py-3 bg-zinc-950/80 border-b border-zinc-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-zinc-950 shadow-md">
              <Bot className="w-5 h-5" />
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-zinc-950 rounded-full" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-1.5">
              RefBot
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-500/30">
                Hedbanz AI
              </span>
            </h3>
            <p className="text-[11px] text-zinc-400">Ask Yes/No questions or guess his name</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsGuessMode(!isGuessMode)}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition flex items-center gap-1 ${
              isGuessMode
                ? 'bg-amber-500 text-zinc-950 border-amber-400 shadow-md shadow-amber-500/20'
                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            {isGuessMode ? 'Guessing Mode' : 'Make a Guess'}
          </button>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin scrollbar-thumb-zinc-700">
        {messages.map((msg) => {
          if (msg.sender === 'system') {
            return (
              <div key={msg.id} className="flex justify-center my-2">
                <div className="bg-zinc-800/80 text-zinc-300 text-xs px-3 py-1.5 rounded-full border border-zinc-700/60 flex items-center gap-1.5 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{msg.text}</span>
                </div>
              </div>
            );
          }

          if (msg.sender === 'user') {
            return (
              <div key={msg.id} className="flex justify-end gap-2 items-end">
                <div className="max-w-[80%] bg-blue-600 text-white rounded-2xl rounded-br-none px-3.5 py-2 text-sm shadow-md">
                  <p>{msg.text}</p>
                </div>
                <div className="w-6 h-6 rounded-full bg-blue-500/30 border border-blue-400/40 flex items-center justify-center text-blue-300 flex-shrink-0">
                  <User className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          }

          // Bot response
          const isCorrect = msg.answerType === 'correct_guess';
          const isWrongGuess = msg.answerType === 'wrong_guess';
          const isYes = msg.answerType === 'yes';
          const isNo = msg.answerType === 'no';

          return (
            <div key={msg.id} className="flex justify-start gap-2 items-start">
              <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 flex-shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
              <div className="max-w-[85%] flex flex-col gap-1">
                {/* Badge Indicator */}
                {isCorrect && (
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-yellow-500 text-zinc-950 shadow-md">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    CORRECT GUESS! 🏆
                  </div>
                )}
                {isWrongGuess && (
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-red-500/20 text-red-300 border border-red-500/40">
                    <XCircle className="w-3 h-3 text-red-400" />
                    NOT HIM ❌
                  </div>
                )}
                {isYes && (
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    YES! ✅
                  </div>
                )}
                {isNo && (
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                    <XCircle className="w-3 h-3 text-rose-400" />
                    NO ❌
                  </div>
                )}
                {msg.answerType === 'unclear' && (
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    <AlertCircle className="w-3 h-3 text-amber-400" />
                    NEED CLARIFICATION 🤔
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={`rounded-2xl rounded-tl-none px-3.5 py-2 text-sm shadow-sm border ${
                    isCorrect
                      ? 'bg-gradient-to-r from-amber-950/80 to-yellow-950/80 text-amber-100 border-amber-500/60'
                      : 'bg-zinc-800 text-zinc-200 border-zinc-700/60'
                  }`}
                >
                  <p className="leading-relaxed">{msg.text}</p>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Questions */}
      {status === 'playing' && (
        <div className="px-3 py-2 bg-zinc-950/60 border-t border-zinc-800/80">
          <div className="flex items-center gap-1 text-[11px] text-zinc-400 mb-1.5 font-medium">
            <HelpCircle className="w-3 h-3 text-amber-400" />
            <span>Suggested Questions:</span>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {QUICK_QUESTIONS.slice(0, 6).map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => handleQuickQuestion(q)}
                className="whitespace-nowrap px-2.5 py-1 bg-zinc-800/90 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-lg border border-zinc-700/60 text-[11px] transition"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input / Action Bar */}
      <div className="p-3 bg-zinc-950 border-t border-zinc-800">
        {status === 'playing' ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={
                    isGuessMode
                      ? 'Type footballer name to guess (e.g. Messi, Haaland)...'
                      : 'Ask a yes/no question (e.g. Has he won the UCL?)...'
                  }
                  className={`w-full bg-zinc-900 border rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none transition ${
                    isGuessMode
                      ? 'border-amber-500 focus:ring-2 focus:ring-amber-500/30'
                      : 'border-zinc-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                  }`}
                />
              </div>

              <button
                type="submit"
                disabled={!inputText.trim()}
                className={`px-4 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 transition disabled:opacity-40 disabled:cursor-not-allowed ${
                  isGuessMode
                    ? 'bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-lg shadow-amber-500/20'
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20'
                }`}
              >
                <span>{isGuessMode ? 'Guess' : 'Ask'}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        ) : (
          <div className="flex items-center justify-between py-1">
            <div className="text-xs text-zinc-300 font-medium">
              {status === 'won' ? '🎉 Brilliant win!' : 'Card revealed! Ready for another round?'}
            </div>
            <button
              onClick={onRestart}
              type="button"
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 text-xs font-black rounded-xl shadow-lg transition"
            >
              Play Again ⚽
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
