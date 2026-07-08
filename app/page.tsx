'use client';

import { FormEvent, useState } from 'react';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Olá! Sou a VITA IA. Posso ajudar com dúvidas internas e, em breve, consultas ao Bling.',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = input.trim();

    if (!content || isLoading) return;

    const nextMessages = [...messages, { role: 'user' as const, content }];
    setMessages(nextMessages);
    setInput('');
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages }),
      });

      const data = (await response.json()) as { message?: string; error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? 'Não foi possível conversar com a VITA IA.');
      }

      setMessages((currentMessages) => [
        ...currentMessages,
        { role: 'assistant', content: data.message ?? 'Não recebi uma resposta.' },
      ]);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Erro inesperado.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-8 text-slate-100">
      <section className="flex h-[min(760px,92vh)] w-full max-w-3xl flex-col rounded-3xl border border-slate-800 bg-slate-900/80 shadow-2xl shadow-cyan-950/30">
        <header className="border-b border-slate-800 p-6">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-cyan-300">Assistente interno</p>
          <h1 className="mt-2 text-3xl font-bold">VITA IA</h1>
          <p className="mt-2 text-sm text-slate-400">OpenAI conectada ao ecossistema Bling com OAuth 2.0.</p>
        </header>

        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                message.role === 'user'
                  ? 'ml-auto bg-cyan-500 text-slate-950'
                  : 'bg-slate-800 text-slate-100'
              }`}
            >
              {message.content}
            </div>
          ))}
          {isLoading ? <p className="text-sm text-slate-400">VITA IA está digitando...</p> : null}
          {error ? <p className="rounded-xl bg-red-950/60 p-3 text-sm text-red-200">{error}</p> : null}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-3 border-t border-slate-800 p-4">
          <input
            className="min-w-0 flex-1 rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none transition focus:border-cyan-300"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Digite sua mensagem..."
          />
          <button
            className="rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isLoading || !input.trim()}
            type="submit"
          >
            Enviar
          </button>
        </form>
      </section>
    </main>
  );
}
