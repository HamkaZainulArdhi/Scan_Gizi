'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { CheckCheck } from 'lucide-react';
import { marked } from 'marked';
import { toAbsoluteUrl } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarIndicator,
  AvatarStatus,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface Message {
  avatar: string;
  text: string;
  time: string;
  in?: boolean;
  out?: boolean;
  read?: boolean;
}

export function ChatSheet({ trigger }: { trigger: ReactNode }) {
  const [emailInput, setEmailInput] = useState('');
  const avatar = toAbsoluteUrl('/media/BGN_LOGO.png');
  const [messages, setMessages] = useState<Message[]>([
    {
      avatar: avatar,
      text: 'Halo! Saya asisten gizi pemerintah. Ada yang bisa saya bantu?',
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      in: true,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const chatBodyRef = useRef<HTMLDivElement | null>(null);

  // Fungsi kirim pesan
  async function handleSend() {
    if (!emailInput.trim()) return;

    const userMessage: Message = {
      avatar: '/media/avatars/300-2.pn',
      text: emailInput,
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      out: true,
      read: true,
    };

    setMessages((prev) => [...prev, userMessage]);
    setEmailInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: emailInput }),
      });

      const data = await res.json();

      const aiReply: Message = {
        avatar: avatar,
        text: data.reply || data.error || 'Maaf, terjadi kesalahan.',
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        in: true,
      };

      setMessages((prev) => [...prev, aiReply]);
    } catch (error) {
      console.error('Chatbot error:', error);
      setMessages((prev) => [
        ...prev,
        {
          avatar: avatar,
          text: '⚠️ Terjadi kesalahan saat menghubungi server chatbot.',
          time: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          in: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  // Auto scroll ke bawah saat ada pesan baru
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent
        className="p-0 gap-0 sm:w-[450px] sm:max-w-none inset-5 start-auto 
               h-[calc(100vh-80px)] rounded-lg flex flex-col overflow-hidden"
      >
        {/* HEADER */}
        <SheetHeader>
          <div className="flex items-center justify-between p-3 border-b border-border">
            <SheetTitle>Chat</SheetTitle>
          </div>
          <div className="border-b border-border p-3 shadow-xs">
            <div className="flex items-center gap-2">
              <div className="w-11 h-11 rounded-full bg-accent/60 border border-border flex items-center justify-center">
                <img src={avatar} className="w-7 h-7" alt="" />
              </div>
              <div>
                <Link
                  href="#"
                  className="text-sm font-semibold text-mono hover:text-primary"
                >
                  Asisten Gizi
                </Link>
                <span className="text-xs italic text-muted-foreground block">
                  {isLoading ? 'Mengetik...' : 'Online'}
                </span>
              </div>
            </div>
          </div>
        </SheetHeader>

        {/* BODY CHAT */}
        <SheetBody
          ref={chatBodyRef}
          className="flex-1 overflow-y-auto grow space-y-3.5 p-4 scroll-smooth"
        >
          {messages.map((message, index) =>
            message.out ? (
              // Pesan dari user
              <div
                key={index}
                className="flex items-end justify-end gap-3 px-2"
              >
                <div className="flex flex-col gap-1 max-w-[75%]">
                  <div
                    className={cn(
                      'bg-primary text-primary-foreground text-sm font-medium p-3 rounded-lg shadow-xs break-words',
                    )}
                    dangerouslySetInnerHTML={{
                      __html: marked.parse(message.text),
                    }}
                  />
                  <div className="flex items-center justify-end gap-1">
                    <span className="text-xs text-secondary-foreground">
                      {message.time}
                    </span>
                    <CheckCheck
                      className={cn(
                        'w-4 h-4',
                        message.read
                          ? 'text-green-500'
                          : 'text-muted-foreground',
                      )}
                    />
                  </div>
                </div>
                <Avatar className="size-9">
                  <AvatarImage
                    src={toAbsoluteUrl('/media/avatars/300-2.png')}
                    alt=""
                  />
                  <AvatarFallback>CH</AvatarFallback>
                  <AvatarIndicator className="-end-2 -bottom-2">
                    <AvatarStatus variant="online" className="size-2.5" />
                  </AvatarIndicator>
                </Avatar>
              </div>
            ) : (
              // Pesan dari AI
              <div key={index} className="flex items-end gap-3 px-2">
                <Avatar className="size-9">
                  <AvatarImage src={toAbsoluteUrl(message.avatar)} alt="" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1 max-w-[75%]">
                  <div
                    className="bg-accent/50 text-secondary-foreground text-sm font-medium p-3 rounded-lg shadow-xs break-words"
                    dangerouslySetInnerHTML={{
                      __html: marked.parse(message.text),
                    }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {message.time}
                  </span>
                </div>
              </div>
            ),
          )}
        </SheetBody>

        {/* FOOTER */}
        <SheetFooter className="block p-0 sm:space-x-0 border-t border-border bg-background">
          <div className="p-5 flex items-center gap-2 relative">
            <img
              src={toAbsoluteUrl('/media/avatars/300-2.png')}
              className="w-8 h-8 rounded-full absolute left-7 top-1/2 -translate-y-1/2"
              alt=""
            />
            <Input
              type="text"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Tulis pesan..."
              className="w-full ps-12 pe-24 py-4 h-auto"
              disabled={isLoading}
            />
            <div className="absolute end-7 top-1/2 -translate-y-1/2 flex gap-2">
              <Button
                size="sm"
                variant="mono"
                onClick={handleSend}
                disabled={isLoading}
              >
                {isLoading ? '...' : 'Send'}
              </Button>
            </div>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
