'use client';

import React, { useState, FormEvent, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, XSquare, RotateCcw, StopCircleIcon, MessageSquarePlus } from 'lucide-react';
import { useChat, Message } from '@ai-sdk/react';

interface ChatbotUIProps {
  initialIsOpen?: boolean;
  api?: string;
  systemPrompt?: string;
}

const ChatbotUI: React.FC<ChatbotUIProps> = ({ 
  initialIsOpen = false, 
  api = '/api/chatbot',
  systemPrompt 
}) => {
  const [isOpen, setIsOpen] = useState(initialIsOpen);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    stop,
    reload,
    setMessages
  } = useChat({
    api: api,
    body: {
      ...(systemPrompt && { system_prompt: systemPrompt })
    },
    onFinish: (message) => {
      console.log('Message finished streaming:', message);
    },
    onError: (err) => {
      console.error('Chat error:', err);
    }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(e);
  };

  const handleReload = () => {
    if (messages.length > 0 && !isLoading) {
        reload();
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-4 rounded-full shadow-xl hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all transform hover:scale-105 z-50"
        aria-label="Open Chatbot"
      >
        <MessageSquarePlus size={28} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-[350px] sm:w-[380px] h-[calc(100vh-100px)] max-h-[550px] sm:max-h-[600px] bg-white border border-gray-200 rounded-xl shadow-2xl flex flex-col z-50 transition-all duration-300 ease-in-out transform-gpu">
      <header className="bg-slate-100 p-4 flex justify-between items-center border-b border-slate-200 rounded-t-xl">
        <h3 className="font-semibold text-slate-800 text-lg">ReelsPro Assistant</h3>
        <div className="flex items-center space-x-2">
            {messages.length > 0 && (
                 <button onClick={handleReload} title="Regenerate last response" className="text-slate-500 hover:text-slate-700 p-1 rounded-md hover:bg-slate-200 transition-colors" disabled={isLoading}>
                    <RotateCcw size={18}/>
                </button>
            )}
            {isLoading && (
                <button onClick={() => stop()} title="Stop generation" className="text-slate-500 hover:text-slate-700 p-1 rounded-md hover:bg-slate-200 transition-colors">
                    <StopCircleIcon size={18} />
                </button>
            )}
            <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-slate-700 p-1 rounded-md hover:bg-slate-200 transition-colors" aria-label="Close Chatbot">
                <XSquare size={20} />
            </button>
        </div>
      </header>
      <div className="flex-grow p-4 overflow-y-auto space-y-3 bg-slate-50 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 scrollbar-thumb-rounded-full">
        {messages.map((m: Message) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] py-2 px-3.5 rounded-xl text-sm flex items-start space-x-2.5 shadow-sm ${m.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'}`}>
              {m.role !== 'user' && <Bot size={18} className="flex-shrink-0 text-blue-600 mt-0.5" />}
              <p className="whitespace-pre-wrap break-words leading-relaxed">{m.content}</p>
              {m.role === 'user' && <User size={18} className="flex-shrink-0 text-slate-100 mt-0.5" />}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
        {isLoading && messages.length > 0 && messages[messages.length-1].role === 'user' && (
          <div className="flex justify-start">
            <div className="max-w-[80%] py-2 px-3.5 rounded-xl text-sm flex items-start space-x-2.5 shadow-sm bg-white text-slate-800 border border-slate-200 rounded-bl-none">
              <Bot size={18} className="flex-shrink-0 text-blue-600 mt-0.5" />
              <span className="italic text-slate-500">Thinking... <Loader2 size={14} className="inline-block animate-spin ml-1"/></span>
            </div>
          </div>
        )}
      </div>
      {error && (
          <div className="p-3 border-t border-slate-200 bg-red-50 text-red-700 text-sm">
            <p><strong>Error:</strong> {error.message}</p>
          </div>
      )}
      <form onSubmit={handleFormSubmit} className="p-3 border-t border-slate-200 bg-slate-50 rounded-b-xl">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Ask anything..."
            className="flex-grow p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-sm text-slate-700 placeholder-slate-400 transition-shadow focus:shadow-md"
            disabled={isLoading && messages.length > 0 && messages[messages.length-1].role === 'user'}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleFormSubmit(e as any);
              }
            }}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white p-2.5 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
            disabled={(isLoading && messages.length > 0 && messages[messages.length-1].role === 'user') || !input.trim()}
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatbotUI; 