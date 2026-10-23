import React, { useState, useRef, useEffect } from 'react';
import { ChefHat, Sparkles, Send, Bot, User, RefreshCw, ThumbsUp, Lightbulb } from 'lucide-react';
import { FamilyProfile } from '../types/mealPlanner';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

interface ChefAssistantViewProps {
  familyProfile: FamilyProfile;
  initialQuery?: string;
}

export const ChefAssistantView: React.FC<ChefAssistantViewProps> = ({
  familyProfile,
  initialQuery,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      role: 'model',
      text: `Greetings! I am Chef Auguste, your BistroChef AI culinary companion. Whether you need an intelligent ingredient substitution, wine or beverage pairing, zero-waste kitchen techniques, or kid-friendly seasoning adjustments, I am at your service. What shall we prepare together today?`,
      timestamp: 'Just now',
    },
  ]);
  const [inputValue, setInputValue] = useState(initialQuery || '');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const presetQuestions = [
    'How do I substitute heavy cream for dairy-free creaminess?',
    'What is a kid-friendly twist for roasted salmon?',
    'How do I keep prepped quinoa fluffy and fresh for 4 days?',
    'Quick 5-minute balsamic glaze recipe from pantry staples',
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (initialQuery) {
      handleSendMessage(initialQuery);
    }
  }, [initialQuery]);

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputValue;
    if (!textToSend.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: 'u_' + Date.now(),
      role: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chef-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend.trim(),
          history: messages.slice(-6).map((m) => ({ role: m.role, text: m.text })),
          userPreferences: familyProfile,
        }),
      });

      const data = await response.json();
      const replyText = data.reply || "Bon appétit! Chef Auguste is reviewing the technique. Let's try that again.";

      const aiMsg: ChatMessage = {
        id: 'ai_' + Date.now(),
        role: 'model',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: 'err_' + Date.now(),
        role: 'model',
        text: 'Chef Auguste encountered a kitchen glitch. Please try asking again in a moment.',
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-[calc(100vh-180px)] flex flex-col bg-[#211715] border border-[#3A2925] rounded-3xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-5 border-b border-[#3A2925] flex items-center justify-between bg-[#19100F]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center border border-emerald-400/30 text-white shadow-md">
            <ChefHat className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-lg font-bold text-[#F5F0E8]">
                Chef Auguste
              </h2>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                Gemini 3.8 Flash
              </span>
            </div>
            <p className="text-xs text-[#A9A09A]">
              Executive Culinary Advisor & Family Dietary Specialist
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            setMessages([
              {
                id: 'm_new',
                role: 'model',
                text: 'Kitchen refreshed! What culinary topic or recipe adjustment shall we explore next?',
                timestamp: 'Just now',
              },
            ])
          }
          className="text-xs text-[#A9A09A] hover:text-[#F5F0E8] transition-colors"
        >
          Clear Chat
        </button>
      </div>

      {/* Messages Thread */}
      <div ref={scrollRef} className="flex-1 p-5 overflow-y-auto space-y-4">
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={m.id}
              className={`flex items-start gap-3 max-w-3xl ${
                isUser ? 'ml-auto flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-mono ${
                  isUser
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <ChefHat className="w-4 h-4" />}
              </div>

              <div
                className={`p-4 rounded-2xl text-xs md:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-[#2E201D] text-[#F5F0E8] border border-[#48332E]'
                    : 'bg-[#181110] text-[#F5F0E8] border border-[#3A2925] shadow-md'
                }`}
              >
                <p className="whitespace-pre-line">{m.text}</p>
                <span className="block text-[10px] font-mono text-[#A9A09A] mt-2 text-right">
                  {m.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-start gap-3 max-w-xl">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center justify-center shrink-0">
              <ChefHat className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-2xl bg-[#181110] border border-[#3A2925] text-xs text-[#A9A09A] flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
              <span>Chef Auguste is composing culinary guidance...</span>
            </div>
          </div>
        )}
      </div>

      {/* Preset Chips Bar */}
      <div className="px-5 py-2.5 bg-[#19100F] border-t border-[#3A2925]/70 flex items-center gap-2 overflow-x-auto scrollbar-none">
        <Lightbulb className="w-3.5 h-3.5 text-[#E8AD48] shrink-0" />
        {presetQuestions.map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => handleSendMessage(chip)}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-[#211715] hover:bg-[#2F1F1C] text-[#A9A09A] hover:text-[#F5F0E8] border border-[#3A2925] whitespace-nowrap shrink-0 transition-colors"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input box */}
      <div className="p-4 bg-[#160E0D] border-t border-[#3A2925]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-3"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask Chef Auguste anything about ingredients, substitutions, or cooking tips..."
            className="flex-1 bg-[#211715] border border-[#3A2925] focus:border-emerald-500 rounded-xl px-4 py-3 text-sm text-[#F5F0E8] placeholder:text-[#A9A09A]/60 outline-none"
          />

          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-md disabled:opacity-40 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
