import { NextResponse } from 'next/server';
import { chatWithVita, type VitaChatMessage } from '@/app/services/openai';

function isValidMessage(message: unknown): message is VitaChatMessage {
  if (!message || typeof message !== 'object') return false;

  const candidate = message as Record<string, unknown>;
  return (
    (candidate.role === 'user' || candidate.role === 'assistant' || candidate.role === 'system') &&
    typeof candidate.content === 'string'
  );
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { messages?: unknown };
    const messages = Array.isArray(body.messages) ? body.messages.filter(isValidMessage) : [];

    if (messages.length === 0) {
      return NextResponse.json({ error: 'Envie ao menos uma mensagem válida.' }, { status: 400 });
    }

    const message = await chatWithVita(messages);

    return NextResponse.json({ message });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro interno ao processar o chat.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
