import React, { useState, useRef, useEffect } from 'react';
import { X, Bot, RefreshCw } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { STATIC_CONTENT } from '../constants';

interface ChatMsg {
  role: 'bot' | 'user';
  text: string;
  options?: string[]; // Questions to show as clickable chips
}

interface VirtualMechanicProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const VirtualMechanic: React.FC<VirtualMechanicProps> = ({ isOpen, onOpen, onClose }) => {
  const { language } = useLanguage();
  
  // Load content based on language
  const faqContent = STATIC_CONTENT[language].faq;
  const initialGreeting = language === 'ru' 
    ? "Здравствуйте! Я цифровой помощник Bardahl. Выберите вопрос из списка ниже, чтобы получить мгновенный ответ."
    : "Вітаю! Я цифровий помічник Bardahl. Оберіть питання зі списку нижче, щоб отримати миттєву відповідь.";
  
  const supportMsg = language === 'ru'
    ? "Связаться с менеджером"
    : "Зв'язатися з менеджером";

  const restartMsg = language === 'ru' ? "Начать сначала" : "Почати спочатку";

  // State
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat
  useEffect(() => {
    if (messages.length === 0) {
      resetChat();
    }
  }, [language]); // Reset if language changes

  const resetChat = () => {
    const questions = faqContent.items.map(i => i.q);
    setMessages([
      { 
        role: 'bot', 
        text: initialGreeting, 
        options: [...questions, supportMsg] 
      }
    ]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 100);
    }
  }, [messages, isOpen]);

  const handleOptionClick = (option: string) => {
    // 1. Add User Selection
    const userMsg: ChatMsg = { role: 'user', text: option };
    
    // 2. Prepare Bot Response
    let botResponseText = "";
    let nextOptions: string[] = [];

    if (option === supportMsg) {
       botResponseText = language === 'ru' 
         ? "Пожалуйста, позвоните нам по номеру +38 (067) 486-21-17 или оставьте заявку в разделе Контакты."
         : "Будь ласка, зателефонуйте нам за номером +38 (067) 486-21-17 або залиште заявку в розділі Контакти.";
       nextOptions = [restartMsg];
    } else if (option === restartMsg) {
       resetChat();
       return;
    } else {
       // Find FAQ answer
       const faqItem = faqContent.items.find(i => i.q === option);
       botResponseText = faqItem ? faqItem.a : "...";
       
       // Prompt to continue
       const followUp = language === 'ru' ? "Что-то еще интересует?" : "Щось ще цікавить?";
       
       // We'll simulate a double message: Answer -> Follow up options
       const answerMsg: ChatMsg = { role: 'bot', text: botResponseText };
       const followUpMsg: ChatMsg = { 
          role: 'bot', 
          text: followUp, 
          options: [...faqContent.items.map(i => i.q), supportMsg] 
       };
       
       setMessages(prev => [...prev, userMsg, answerMsg, followUpMsg]);
       return;
    }

    setMessages(prev => [...prev, userMsg, { role: 'bot', text: botResponseText, options: nextOptions }]);
  };

  return (
    <>
      {/* Floating Button - Hidden on Mobile now because of Bottom Bar */}
      <button
        onClick={onOpen}
        className={`fixed bottom-6 right-6 z-40 bg-yellow-500 hover:bg-yellow-400 text-black p-4 rounded-full shadow-[0_0_20px_rgba(234,179,8,0.4)] transition-all hover:scale-110 ${isOpen ? 'hidden' : 'hidden md:flex'} items-center gap-2`}
      >
        <Bot size={28} />
        <span className="font-bold text-xs uppercase hidden md:inline">FAQ</span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 md:bottom-6 right-0 md:right-6 w-full md:w-[350px] h-[60vh] md:h-[550px] z-[60] flex flex-col bg-zinc-900 border-t md:border border-zinc-700 rounded-t-2xl md:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
          
          {/* Header */}
          <div className="bg-zinc-950 p-4 border-b border-zinc-800 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-500 p-2 rounded-full relative">
                <Bot size={20} className="text-black" />
                <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-zinc-900 rounded-full"></span>
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Bardahl Support</h3>
                <p className="text-[10px] text-zinc-400">Online Bot</p>
              </div>
            </div>
            <div className="flex gap-2">
                <button onClick={resetChat} className="text-zinc-500 hover:text-white transition-colors" title={restartMsg}>
                    <RefreshCw size={18} />
                </button>
                <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
                    <X size={20} />
                </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/20 custom-scrollbar">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                
                {/* Message Bubble */}
                <div 
                  className={`max-w-[85%] p-3.5 rounded-2xl text-sm shadow-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-yellow-500 text-black rounded-tr-none font-medium' 
                      : 'bg-zinc-800 text-zinc-100 rounded-tl-none border border-zinc-700'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Options Chips (Only for latest bot message) */}
                {msg.role === 'bot' && msg.options && idx === messages.length - 1 && (
                    <div className="mt-3 flex flex-wrap gap-2 w-full">
                        {msg.options.map((opt, optIdx) => (
                            <button
                                key={optIdx}
                                onClick={() => handleOptionClick(opt)}
                                className="text-xs bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-yellow-500/50 text-white py-2 px-3 rounded-lg text-left transition-all active:scale-95 shadow-sm"
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer */}
          <div className="p-3 bg-zinc-950 border-t border-zinc-800 text-center">
             <p className="text-[10px] text-zinc-600">
                {language === 'ru' ? 'Автоматический помощник' : 'Автоматичний помічник'}
             </p>
          </div>
        </div>
      )}
    </>
  );
};

export default VirtualMechanic;