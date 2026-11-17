"use client";

import { useRef, useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { MessageCircle, Send, X } from "lucide-react";

type ChatMessage = { role: "user" | "assistant"; content: string };

export function AriChatBot() {
  const t = useTranslations("chat");
  const locale = useLocale();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const logRef = useRef<HTMLDivElement>(null);

  async function sendMessage(event?: FormEvent) {
    event?.preventDefault();
    const prompt = input.trim();
    if (!prompt || isThinking) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: prompt }];
    setMessages(nextMessages);
    setInput("");
    setError(null);
    setIsThinking(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages, locale }),
      });
      if (!response.ok) throw new Error("chat request failed");
      const data = (await response.json()) as { reply?: string };
      if (!data.reply) throw new Error("empty reply");
      setMessages((current) => [...current, { role: "assistant", content: data.reply! }]);
      requestAnimationFrame(() => {
        logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
      });
    } catch {
      setError(t("error"));
    } finally {
      setIsThinking(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-80 flex flex-col items-end gap-3 print:hidden sm:bottom-6 sm:right-6">
      {isOpen && (
        <section
          aria-label={t("chatTitle")}
          className="w-[min(22rem,calc(100vw-2.5rem))] overflow-hidden rounded-3xl border border-[#0F2444]/12 bg-white shadow-[0_24px_70px_-24px_rgba(15,36,68,0.45)]"
        >
          <div className="flex items-start justify-between gap-3 bg-[#0F2444] px-5 py-4 text-[#F5F6F4]">
            <div>
              <h2 className="font-display text-base font-semibold">Ari · {t("chatTitle")}</h2>
              <p className="mt-0.5 font-body text-xs text-[#F5F6F4]/65">{t("chatSubtitle")}</p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label={t("closeChat")}
              className="rounded-full p-1.5 text-[#F5F6F4]/75 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>

          <div
            ref={logRef}
            role="log"
            aria-live="polite"
            aria-label={t("chatTitle")}
            className="h-56 space-y-3 overflow-y-auto px-5 py-4"
          >
            <div className="rounded-2xl bg-[#F5F6F4] px-3.5 py-2.5 font-body text-sm leading-relaxed text-[#0F2444]">
              {t("welcome")}
            </div>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`rounded-2xl px-3.5 py-2.5 font-body text-sm leading-relaxed ${
                  message.role === "user"
                    ? "ml-8 bg-[#0F2444] text-[#F5F6F4]"
                    : "mr-4 bg-[#F5F6F4] text-[#0F2444]"
                }`}
              >
                {message.content}
              </div>
            ))}
            {isThinking && (
              <p className="font-body text-xs italic text-[#161B22]/50">{t("thinking")}</p>
            )}
            {error && <p className="font-body text-xs text-[#B42318]">{error}</p>}
          </div>

          <form onSubmit={sendMessage} className="flex items-center gap-2 border-t border-[#0F2444]/8 p-3">
            <input
              value={input}
              onChange={(event) => setInput(event.currentTarget.value)}
              placeholder={t("messagePlaceholder")}
              aria-label={t("messagePlaceholder")}
              maxLength={500}
              className="min-w-0 flex-1 rounded-xl border border-[#0F2444]/15 px-3.5 py-2.5 font-body text-sm text-[#161B22] outline-none transition focus:border-[#B8925A] focus:ring-2 focus:ring-[#B8925A]/20"
            />
            <button
              type="submit"
              disabled={!input.trim() || isThinking}
              aria-label={t("sendMessage")}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0F2444] text-[#F5F6F4] transition-colors hover:bg-[#0F2444]/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send className="h-4 w-4" aria-hidden />
            </button>
          </form>
          <p className="bg-[#F5F6F4] px-5 py-2 font-body text-[10px] leading-snug text-[#161B22]/50">
            {t("disclaimer")}
          </p>
        </section>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-label={isOpen ? t("closeChat") : t("openChat")}
        className="flex items-center gap-2 rounded-full bg-[#0F2444] px-5 py-3 font-body text-sm font-semibold text-[#F5F6F4] shadow-[0_12px_34px_-12px_rgba(15,36,68,0.5)] transition-colors hover:bg-[#0F2444]/90"
      >
        <MessageCircle className="h-5 w-5" aria-hidden />
        <span>{isOpen ? t("closeChat") : t("openChat")}</span>
      </button>
    </div>
  );
}
