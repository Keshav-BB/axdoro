import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  X,
  Minimize2,
  RotateCcw,
  Bot,
  User,
  ArrowRight,
  ShoppingBag,
  Ruler,
  MessageCircle,
  ExternalLink,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import {
  ChatMessage,
  QUICK_PROMPTS,
  processUserQuery,
  ChatActionButton,
} from '../../data/chatbotKnowledge';
import { formatINR } from '../../utils/currency';
import { getWhatsAppSupportUrl } from '../../utils/whatsapp';

export const AIChatbot: React.FC = () => {
  const {
    products,
    setCurrentView,
    setSelectedCategory,
    setSelectedProduct,
    setIs3DSpinFitOpen,
    setIsSizeGuideOpen,
    showToast,
  } = useStore();

  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'bot',
      text: `Vanakkam! 👋 I am your **AXDORO AI Fashion Stylist & Concierge**.\n\nI can calculate your exact size from your **Height & Weight**, explain the physics of our **240 GSM anti-cling combed cotton**, recommend drops, or check Tamil Nadu delivery speeds.`,
      timestamp: 'Just now',
      actionButtons: [
        { label: '📏 Find My Size (Height/Weight)', actionType: 'open3DStudio' },
        { label: '🧵 Why 240 GSM for TN?', actionType: 'navigate', payload: 'shop' },
        { label: '🔥 Top Streetwear Drops', actionType: 'filterCategory', payload: 't-shirts' },
      ],
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    const userMsgId = `user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const { reply, actionButtons, suggestedProducts } = processUserQuery(text, products);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionButtons,
        suggestedProducts,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 650);
  };

  const handleActionButtonClick = (btn: ChatActionButton) => {
    if (btn.actionType === 'open3DStudio') {
      setIsOpen(false);
      setIs3DSpinFitOpen(true);
      showToast('Opening 3D Personal Avatar Studio', 'info');
    } else if (btn.actionType === 'navigate') {
      if (btn.payload) setCurrentView(btn.payload as any);
    } else if (btn.actionType === 'filterCategory') {
      if (btn.payload) {
        setSelectedCategory(btn.payload);
        setCurrentView('shop');
      }
    } else if (btn.actionType === 'sizeGuide') {
      setIsSizeGuideOpen(true);
    } else if (btn.actionType === 'whatsapp') {
      window.open(getWhatsAppSupportUrl(), '_blank');
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `msg-reset-${Date.now()}`,
        sender: 'bot',
        text: `Chat cleared! How can I assist you with your 240 GSM wardrobe today?`,
        timestamp: 'Just now',
        actionButtons: [
          { label: '📏 Calculate Size (Height/Weight)', actionType: 'open3DStudio' },
          { label: '🔥 Best Streetwear Drops', actionType: 'navigate', payload: 'shop' },
        ],
      },
    ]);
  };

  return (
    <>
      {/* FLOATING TRIGGER BUTTON */}
      <aside aria-label="AI Stylist Assistant" className="fixed bottom-6 right-24 sm:right-44 z-40">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="group relative flex items-center gap-2 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 hover:from-black hover:to-zinc-900 text-white font-bold p-3.5 sm:px-4 sm:py-3 rounded-full shadow-2xl shadow-zinc-950/40 border border-amber-400/40 transition-all hover:scale-105 cursor-pointer"
          title="Open AXDORO AI Fashion Stylist"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping" />
          </div>
          <span className="hidden sm:inline text-xs font-mono font-bold tracking-tight text-amber-400">
            Ask AI Stylist
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 hidden lg:inline">
            3D Fit
          </span>
        </button>
      </aside>

      {/* CHATBOT WINDOW */}
      {isOpen && (
        <div
          className="fixed bottom-22 right-4 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-[410px] h-[580px] max-h-[82vh] bg-[#121215] border border-zinc-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-zinc-100 animate-scaleUp font-sans backdrop-blur-xl"
          role="dialog"
          aria-label="AXDORO AI Concierge Chat"
        >
          {/* HEADER */}
          <div className="px-5 py-3.5 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-zinc-950 border border-amber-400/40 flex items-center justify-center text-amber-400 font-bold shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs sm:text-sm font-bold font-mono tracking-wide text-white">
                    AXDORO AI Stylist
                  </h3>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Online
                  </span>
                </div>
                <div className="text-[10px] font-mono text-zinc-400">
                  Biometric & 240 GSM Fabric Intelligence
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleClearChat}
                className="p-1.5 text-zinc-400 hover:text-amber-400 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                title="Clear conversation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                title="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* MESSAGES THREAD */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-xl bg-zinc-900 border border-amber-400/30 text-amber-400 flex items-center justify-center text-xs shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[85%] space-y-2`}>
                  <div
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 font-medium rounded-tr-xs shadow-md font-sans'
                        : 'bg-zinc-900/90 border border-zinc-800 text-zinc-200 rounded-tl-xs shadow-sm font-sans'
                    }`}
                  >
                    <div className="whitespace-pre-line">
                      {msg.text.split('**').map((part, i) =>
                        i % 2 === 1 ? (
                          <strong key={i} className={msg.sender === 'user' ? 'text-black font-extrabold' : 'text-amber-400 font-bold'}>
                            {part}
                          </strong>
                        ) : (
                          part
                        )
                      )}
                    </div>
                  </div>

                  {/* SUGGESTED PRODUCT MINI CARDS */}
                  {msg.suggestedProducts && msg.suggestedProducts.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {msg.suggestedProducts.map((prod) => (
                        <div
                          key={prod.id}
                          className="bg-zinc-900 border border-zinc-800 hover:border-amber-400/40 rounded-xl p-2 flex items-center gap-2.5 transition-all shadow-xs"
                        >
                          <img
                            src={prod.images[0]}
                            alt={prod.name}
                            className="w-12 h-14 object-cover rounded-lg bg-zinc-950 shrink-0 border border-zinc-800"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="text-[11px] font-bold text-white truncate font-sans">
                              {prod.name}
                            </div>
                            <div className="text-[10px] font-mono text-amber-400 font-semibold">
                              {formatINR(prod.price)}
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedProduct(prod);
                                setCurrentView('product-detail');
                                setIsOpen(false);
                              }}
                              className="mt-1 text-[9px] font-mono text-zinc-300 hover:text-white flex items-center gap-1 cursor-pointer bg-zinc-800 hover:bg-zinc-700 px-2 py-0.5 rounded-md"
                            >
                              <span>View Drop</span>
                              <ArrowRight className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* INTERACTIVE ACTION BUTTONS */}
                  {msg.actionButtons && msg.actionButtons.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.actionButtons.map((btn, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleActionButtonClick(btn)}
                          className="text-[11px] font-mono font-semibold px-3 py-1.5 rounded-xl bg-zinc-800/90 hover:bg-amber-400 hover:text-zinc-950 text-amber-300 border border-amber-400/30 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <span>{btn.label}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  <div className={`text-[9px] font-mono text-zinc-500 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                    {msg.timestamp}
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-xl bg-amber-500 text-zinc-950 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {/* TYPING INDICATOR */}
            {isTyping && (
              <div className="flex items-center gap-2 text-zinc-400 text-xs font-mono">
                <div className="w-7 h-7 rounded-xl bg-zinc-900 border border-amber-400/30 text-amber-400 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-zinc-900 border border-zinc-800 px-3.5 py-2 rounded-2xl flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* QUICK PROMPT SUGGESTIONS CAROUSEL */}
          <div className="px-4 py-2 border-t border-zinc-800/80 bg-zinc-900/40 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {QUICK_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSendMessage(prompt)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full text-[10px] font-mono font-medium bg-zinc-800/70 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700/60 transition-all cursor-pointer shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* INPUT BAR */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 border-t border-zinc-800 bg-zinc-900/80 flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about fit, 240 GSM, size, or drops..."
              className="flex-1 bg-zinc-950 border border-zinc-700/80 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none transition-colors font-sans"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className={`p-2.5 rounded-xl transition-all flex items-center justify-center cursor-pointer ${
                inputValue.trim()
                  ? 'bg-amber-400 hover:bg-amber-300 text-zinc-950 shadow-md scale-105'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
              }`}
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
