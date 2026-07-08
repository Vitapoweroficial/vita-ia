import OpenAI from 'openai';

export type VitaChatMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

const systemPrompt = `Você é a VITA IA, um assistente interno que apoia operações conectadas ao Bling. Responda em português do Brasil, seja objetivo e avise quando uma integração operacional ainda não estiver implementada.`;

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY não configurada.');
  }

  return new OpenAI({ apiKey });
}

export async function chatWithVita(messages: VitaChatMessage[]) {
  const client = getOpenAIClient();

  const completion = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'system', content: systemPrompt }, ...messages],
    temperature: 0.3,
  });

  return completion.choices[0]?.message.content ?? 'Não foi possível gerar uma resposta.';
}
