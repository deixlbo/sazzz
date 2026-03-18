'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { MessageCircle, X, Send, Bot, ChevronDown } from 'lucide-react';
import { axlFaqData, suggestedQuestions } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';

type Message = {
  id: string;
  content: string;
  sender: 'user' | 'axl';
  timestamp: Date;
};

export function AxlChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm AXL, your AI assistant for Barangay Santiago. How can I help you today? Click on a suggested question below or type your own!",
      sender: 'axl',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const findAnswer = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    // Search through FAQ data for matching answers
    for (const faq of axlFaqData) {
      const faqQuestion = faq.question.toLowerCase();
      const keywords = faqQuestion.split(' ').filter(word => word.length > 3);
      
      // Check for keyword matches
      const matchCount = keywords.filter(keyword => 
        lowerQuestion.includes(keyword.toLowerCase())
      ).length;
      
      if (matchCount >= 2 || lowerQuestion.includes(faqQuestion.slice(0, 20))) {
        return faq.answer;
      }
    }

    // Check for specific keywords
    if (lowerQuestion.includes('office hour') || lowerQuestion.includes('open')) {
      return axlFaqData.find(f => f.question.includes('office hours'))?.answer || '';
    }
    if (lowerQuestion.includes('clearance') || lowerQuestion.includes('document')) {
      return axlFaqData.find(f => f.question.includes('Barangay Clearance'))?.answer || '';
    }
    if (lowerQuestion.includes('emergency') || lowerQuestion.includes('hotline')) {
      return axlFaqData.find(f => f.question.includes('emergency hotline'))?.answer || '';
    }
    if (lowerQuestion.includes('evacuation') || lowerQuestion.includes('evacuate')) {
      return axlFaqData.find(f => f.question.includes('evacuation'))?.answer || '';
    }
    if (lowerQuestion.includes('health') || lowerQuestion.includes('center') || lowerQuestion.includes('clinic')) {
      return axlFaqData.find(f => f.question.includes('health center'))?.answer || '';
    }
    if (lowerQuestion.includes('program') || lowerQuestion.includes('activity') || lowerQuestion.includes('event')) {
      return axlFaqData.find(f => f.question.includes('programs'))?.answer || '';
    }
    if (lowerQuestion.includes('complaint') || lowerQuestion.includes('report') || lowerQuestion.includes('noise')) {
      return axlFaqData.find(f => f.question.includes('noise complaint'))?.answer || '';
    }
    if (lowerQuestion.includes('captain') || lowerQuestion.includes('official') || lowerQuestion.includes('kagawad')) {
      return axlFaqData.find(f => f.question.includes('Barangay Captain'))?.answer || '';
    }
    if (lowerQuestion.includes('location') || lowerQuestion.includes('where') || lowerQuestion.includes('hall')) {
      return axlFaqData.find(f => f.question.includes('located'))?.answer || '';
    }
    if (lowerQuestion.includes('contact') || lowerQuestion.includes('number') || lowerQuestion.includes('phone')) {
      return axlFaqData.find(f => f.question.includes('contact number'))?.answer || '';
    }
    if (lowerQuestion.includes('fee') || lowerQuestion.includes('cost') || lowerQuestion.includes('price')) {
      return axlFaqData.find(f => f.question.includes('fee'))?.answer || '';
    }
    if (lowerQuestion.includes('typhoon') || lowerQuestion.includes('flood') || lowerQuestion.includes('disaster')) {
      return axlFaqData.find(f => f.question.includes('typhoon'))?.answer || '';
    }
    if (lowerQuestion.includes('vaccination') || lowerQuestion.includes('vaccine')) {
      return axlFaqData.find(f => f.question.includes('vaccination'))?.answer || '';
    }
    if (lowerQuestion.includes('requirement') || lowerQuestion.includes('residency')) {
      return axlFaqData.find(f => f.question.includes('Certificate of Residency'))?.answer || '';
    }
    if (lowerQuestion.includes('process') || lowerQuestion.includes('long') || lowerQuestion.includes('day')) {
      return axlFaqData.find(f => f.question.includes('process'))?.answer || '';
    }

    // Default response
    return "I'm sorry, I don't have specific information about that. Please try rephrasing your question or contact the barangay office directly at 0912-345-6789. You can also visit the barangay hall during office hours (Mon-Fri: 8 AM - 5 PM, Sat: 8 AM - 12 PM).";
  };

  const handleSend = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setShowSuggestions(false);
    setIsTyping(true);

    // Simulate AI processing delay
    setTimeout(() => {
      const answer = findAnswer(text);
      const axlMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: answer,
        sender: 'axl',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, axlMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 500);
  };

  const handleSuggestedClick = (question: string) => {
    handleSend(question);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg flex items-center justify-center transition-all z-50 ${
          open ? 'scale-0' : 'scale-100'
        }`}
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-6 right-6 w-[360px] sm:w-[400px] h-[600px] max-h-[80vh] bg-card border border-border rounded-2xl shadow-2xl flex flex-col z-50 animate-scaleIn overflow-hidden">
          {/* Header */}
          <div className="bg-primary text-primary-foreground p-4 flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-primary rounded-full" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold">AXL</h3>
              <p className="text-xs text-primary-foreground/80">Barangay Santiago AI Assistant</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-2 hover:bg-primary-foreground/10 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-2 ${
                  message.sender === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                {message.sender === 'axl' && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-md'
                      : 'bg-card border border-border rounded-bl-md'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-primary-foreground" />
                </div>
                <div className="bg-card border border-border p-3 rounded-2xl rounded-bl-md">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {showSuggestions && (
            <div className="px-4 py-3 bg-card border-t border-border">
              <button
                onClick={() => setShowSuggestions(false)}
                className="flex items-center gap-1 text-xs text-muted-foreground mb-2 hover:text-foreground"
              >
                Suggested questions
                <ChevronDown className="w-3 h-3" />
              </button>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.slice(0, 4).map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestedClick(question)}
                    className="text-xs px-3 py-1.5 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition text-left"
                  >
                    {question.length > 35 ? question.slice(0, 35) + '...' : question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-4 border-t border-border bg-card"
          >
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-2 bg-muted rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <Button
                type="submit"
                size="sm"
                disabled={!input.trim() || isTyping}
                className="w-10 h-10 rounded-full bg-primary hover:bg-primary/90 p-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
