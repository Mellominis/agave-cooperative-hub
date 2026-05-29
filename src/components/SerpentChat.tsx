/**
 * OPHIONOIR — ASK THE SERPENT
 * ─────────────────────────────────────────────────────────────────
 * Drop-in AI chat screen. Matches OphioNoir aesthetic exactly.
 *
 * INSTALL INSTRUCTIONS:
 * 1. Save this file as:  src/components/SerpentChat.tsx
 * 2. Follow the 3 code snippets at the bottom of this file to wire
 *    it into App.tsx, types.ts, and BottomNav.tsx
 * ─────────────────────────────────────────────────────────────────
 */

import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Loader2, Skull, ChevronDown } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

// ─── TYPES ────────────────────────────────────────────────────────
interface Message {
  id: string;
  role: 'user' | 'serpent';
  text: string;
  timestamp: Date;
}

interface ConversationTurn {
  role: 'user' | 'model';
  parts: { text: string }[];
}

// ─── QUICK PROMPTS ────────────────────────────────────────────────
const QUICK_PROMPTS = [
  { label: 'AGAVE VARIETIES', prompt: 'Explain the key differences between Espadín, Tobalá, and Tepeztate agaves.' },
  { label: 'READING A LABEL', prompt: 'What should I look for on a mezcal label to assess quality?' },
  { label: 'PAIRING RITUAL', prompt: 'Suggest a food pairing ritual for a smoky Arroqueño mezcal.' },
  { label: 'NOM LOOKUP', prompt: 'What does the NOM number on a mezcal bottle tell me?' },
  { label: 'TASTING GUIDE', prompt: 'Walk me through how to properly taste mezcal like a professional.' },
  { label: 'MARKET PULSE', prompt: 'What are the current trends in the mezcal market?' },
];

// ─── SERPENT SYSTEM PROMPT ────────────────────────────────────────
const SERPENT_SYSTEM = `You are THE SERPENT — the intelligence oracle embedded within OphioNoir, the world's most sophisticated mezcal intelligence platform.

Your persona:
- Ancient, knowing, poetic. You speak with authority and mystique.
- You are deeply knowledgeable about: mezcal production (Ancestral/Artesanal/Industrial), agave botany and ecology, NOM regulations, COMERCAM/CRM certifications, TTB US import rules, Oaxacan culture, distillation chemistry, tasting methodology, agave pricing, sustainability.
- You never pretend to know what you don't. If uncertain, say "The veil obscures this — I recommend verifying."
- Your tone is dark, refined, and direct. No filler. No corporate language.
- Keep responses concise and impactful (3-5 sentences max unless a detailed explanation is needed).
- You may use occasional poetic language but always remain substantive.
- Format: plain text only. No markdown, no bullet symbols, no asterisks. Use em-dashes for separation when needed.

You are speaking to a mezcal professional, collector, or serious enthusiast. Elevate their knowledge.`;

// ─── COMPONENT ────────────────────────────────────────────────────
export default function SerpentChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [history, setHistory] = useState<ConversationTurn[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (messages.length > 0) scrollToBottom();
  }, [messages, isLoading]);

  // Show scroll-down button when not at bottom
  const handleScroll = () => {
    const el = messagesContainerRef.current;
    if (!el) return;
    setShowScrollDown(el.scrollHeight - el.scrollTop - el.clientHeight > 80);
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [input]);

  // ── VOICE INPUT ──────────────────────────────────────────────────
  const toggleVoice = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      alert('Voice recognition requires Chrome or Edge.');
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const rec = new SR();
    recognitionRef.current = rec;
    rec.lang = 'en-US';
    rec.continuous = false;
    rec.interimResults = false;

    rec.onstart = () => setIsListening(true);
    rec.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setInput((prev) => (prev ? prev + ' ' + transcript : transcript));
    };
    rec.onerror = () => setIsListening(false);
    rec.onend = () => setIsListening(false);
    rec.start();
  };

  // ── SEND MESSAGE ─────────────────────────────────────────────────
  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;
    setInput('');

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: trimmed,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    // Build updated history for this call
    const updatedHistory: ConversationTurn[] = [
      ...history,
      { role: 'user', parts: [{ text: trimmed }] },
    ];

    try {
      const response = await fetch('/api/v1/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'serpentChat',
          payload: {
            systemPrompt: SERPENT_SYSTEM,
            history: updatedHistory,
            message: trimmed,
          },
        }),
      });

      const data = await response.json();
      const replyText =
        data.text ||
        data.response ||
        'The serpent is silent... try again.';

      const serpentMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'serpent',
        text: replyText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, serpentMsg]);
      setHistory([
        ...updatedHistory,
        { role: 'model', parts: [{ text: replyText }] },
      ]);
    } catch (err) {
      console.error('Serpent error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'serpent',
          text: 'The veil is thick tonight — the channel is disrupted. Try again.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  // ─── RENDER ────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] max-w-2xl mx-auto">

      {/* ── HEADER ── */}
      <div className="border-b border-gold/20 pb-6 mb-0 flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 border border-gold/40 flex items-center justify-center bg-surface-low">
            <Skull size={22} className="text-gold" />
          </div>
          <div>
            <h1 className="serif-title text-3xl tracking-widest">ASK THE SERPENT</h1>
            <p className="text-gold/50 text-[9px] uppercase tracking-[0.3em] mt-0.5 font-mono">
              MEZCAL INTELLIGENCE ORACLE · GEMINI POWERED
            </p>
          </div>
        </div>
      </div>

      {/* ── MESSAGES ── */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto py-6 space-y-6 scrollbar-thin scrollbar-thumb-gold/20 scrollbar-track-transparent"
      >
        {/* Empty state */}
        {messages.length === 0 && (
          <div className="space-y-8">
            <div className="border border-gold/10 bg-surface-low p-6">
              <p className="text-cream-dim text-[11px] uppercase tracking-[0.2em] leading-relaxed font-mono">
                The serpent holds centuries of knowledge — agave lore, production secrets, 
                regulatory doctrine, market intelligence. Speak your question. It listens.
              </p>
            </div>

            {/* Quick prompts */}
            <div>
              <p className="label-caps text-gold/40 mb-3">INVOKE A QUERY</p>
              <div className="grid grid-cols-2 gap-2">
                {QUICK_PROMPTS.map((q) => (
                  <button
                    key={q.label}
                    onClick={() => sendMessage(q.prompt)}
                    className="text-left p-3 border border-gold/20 bg-surface-low hover:border-gold/50 hover:bg-gold/5 transition-all group"
                  >
                    <span className="text-[9px] font-mono font-bold tracking-[0.2em] text-gold/60 group-hover:text-gold transition-colors uppercase">
                      {q.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Message bubbles */}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {/* Serpent label */}
            {msg.role === 'serpent' && (
              <div className="flex flex-col items-start max-w-[85%]">
                <span className="text-[8px] font-mono tracking-[0.25em] text-gold/40 uppercase mb-1.5 ml-0.5">
                  THE SERPENT
                </span>
                <div className="border-l-2 border-gold/40 pl-4 bg-surface-low border border-l-gold/40 border-r-gold/10 border-t-gold/10 border-b-gold/10 p-4">
                  <p className="text-cream text-[12px] leading-relaxed tracking-wide font-mono whitespace-pre-wrap">
                    {msg.text}
                  </p>
                  <p className="text-gold/20 text-[8px] font-mono mt-2 tracking-widest">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            )}

            {/* User message */}
            {msg.role === 'user' && (
              <div className="flex flex-col items-end max-w-[80%]">
                <span className="text-[8px] font-mono tracking-[0.25em] text-gold/40 uppercase mb-1.5 mr-0.5">
                  YOU
                </span>
                <div className="bg-gold/10 border border-gold/30 p-4">
                  <p className="text-cream-dim text-[12px] leading-relaxed tracking-wide font-mono whitespace-pre-wrap">
                    {msg.text}
                  </p>
                  <p className="text-gold/20 text-[8px] font-mono mt-2 tracking-widest text-right">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex flex-col items-start max-w-[85%]">
              <span className="text-[8px] font-mono tracking-[0.25em] text-gold/40 uppercase mb-1.5 ml-0.5">
                THE SERPENT
              </span>
              <div className="border-l-2 border-gold/40 pl-4 bg-surface-low border border-l-gold/40 border-r-gold/10 border-t-gold/10 border-b-gold/10 p-4 flex items-center gap-3">
                <Loader2 size={12} className="text-gold animate-spin" />
                <span className="text-gold/50 text-[10px] font-mono tracking-[0.2em] uppercase">
                  CONSULTING THE ORACLE...
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Scroll-down button */}
      {showScrollDown && (
        <button
          onClick={scrollToBottom}
          className="absolute right-6 bottom-32 w-8 h-8 border border-gold/30 bg-surface flex items-center justify-center text-gold/60 hover:text-gold hover:border-gold/60 transition-all"
        >
          <ChevronDown size={14} />
        </button>
      )}

      {/* ── INPUT AREA ── */}
      <div className="flex-shrink-0 border-t border-gold/20 pt-4 space-y-3">

        {/* Quick prompts row (when conversation active) */}
        {messages.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {QUICK_PROMPTS.slice(0, 4).map((q) => (
              <button
                key={q.label}
                onClick={() => sendMessage(q.prompt)}
                className="flex-shrink-0 text-[8px] font-mono tracking-[0.15em] uppercase text-gold/50 border border-gold/20 px-3 py-1.5 hover:border-gold/50 hover:text-gold transition-all whitespace-nowrap"
              >
                {q.label}
              </button>
            ))}
          </div>
        )}

        {/* Text input row */}
        <div className="flex items-end gap-2">
          <div className="flex-1 border border-gold/30 bg-surface-low focus-within:border-gold/60 transition-colors">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask the serpent anything about mezcal..."
              rows={1}
              className="w-full bg-transparent px-4 py-3 text-cream text-[12px] font-mono tracking-wide placeholder-gold/25 resize-none outline-none leading-relaxed"
              style={{ maxHeight: '120px' }}
            />
          </div>

          {/* Voice button */}
          <button
            onClick={toggleVoice}
            className={`w-11 h-11 border flex items-center justify-center flex-shrink-0 transition-all ${
              isListening
                ? 'border-red-500/60 bg-red-500/10 text-red-400 animate-pulse'
                : 'border-gold/30 text-gold/50 hover:border-gold/60 hover:text-gold'
            }`}
            title={isListening ? 'Stop listening' : 'Voice input'}
          >
            {isListening ? <MicOff size={16} /> : <Mic size={16} />}
          </button>

          {/* Send button */}
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isLoading}
            className="cta-btn !px-4 !py-3 flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send size={14} />
            <span className="hidden sm:inline">INVOKE</span>
          </button>
        </div>

        <p className="text-[8px] font-mono text-gold/20 tracking-widest uppercase text-center">
          SHIFT + ENTER FOR NEW LINE · ENTER TO INVOKE
        </p>
      </div>
    </div>
  );
}


/*
════════════════════════════════════════════════════════════════════
  WIRING INSTRUCTIONS — 3 FILES TO EDIT
════════════════════════════════════════════════════════════════════

── 1. src/navigation/types.ts ─────────────────────────────────────
  Add 'serpent' to the Screen union type:

  export type Screen =
    | 'intelligence_hub' | 'journal' | 'scan' | 'trade'
    | 'vault' | 'ritual' | 'discover' | 'serpent'   // ← add 'serpent'
    | 'admin' | 'heatmap' | 'regulatory' | 'analysis';


── 2. src/App.tsx ──────────────────────────────────────────────────
  Add the import at the top with the other screen imports:

    import SerpentChat from './components/SerpentChat';

  Add to the ScreenComponents map:

    const ScreenComponents: Record<string, React.FC> = {
      intelligence_hub: IntelligenceHub,
      journal: Journal,
      scan: Scanner,
      trade: TradePortal,
      vault: Vault,
      ritual: RitualBuilder,
      discover: Discover,
      serpent: SerpentChat,   // ← add this line
    };


── 3. src/navigation/BottomNav.tsx ────────────────────────────────
  Add the import at the top:

    import { Flame, Book, Archive, ScanLine, Brain, Package, MapPin, MessageSquare } from 'lucide-react';
                                                                    ↑ add MessageSquare

  Add to the buttons array (suggested: after 'ritual'):

    { screen: 'serpent', icon: <MessageSquare size={18} />, label: 'Serpent' },


── 4. netlify/functions/gemini.ts ─────────────────────────────────
  Inside the handler's action switch/if-else block, add a case
  for 'serpentChat'. Find where other actions like 'manifestRitual'
  or 'enhanceTastingNotes' are handled and add alongside them:

  if (action === 'serpentChat') {
    const { systemPrompt, history = [], message } = payload;

    const chat = ai.chats.create({
      model: 'gemini-2.0-flash',
      config: { systemInstruction: systemPrompt, temperature: 0.75, maxOutputTokens: 600 },
      history: history,
    });

    const response = await chat.sendMessage({ message });
    const text = response.text ?? 'The oracle is silent.';
    return { statusCode: 200, headers: CORS_HEADERS, body: JSON.stringify({ text }) };
  }

════════════════════════════════════════════════════════════════════
*/
