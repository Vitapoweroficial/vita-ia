import OpenAI from 'openai';
import {
  consultarEstoque,
  consultarOrdensProducao,
  consultarPedidos,
  consultarProdutos,
} from '@/app/services/bling';

export type VitaChatMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

const systemPrompt = `Você é a VITA IA, um assistente interno que consulta dados reais do Bling em modo somente leitura. Responda em português do Brasil, seja objetivo e use as ferramentas disponíveis quando o usuário pedir produtos, pedidos, estoque ou ordens de produção. Não prometa criar, editar, excluir, criar OP ou alterar estoque.`;

const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'consultarProdutos',
      description: 'Lista produtos reais do Bling. Use para perguntas como "liste meus produtos".',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Texto para filtrar produto por nome ou código, quando informado.' },
          limit: { type: 'number', description: 'Quantidade máxima de produtos. Padrão: 10.' },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'consultarPedidos',
      description: 'Lista pedidos de venda reais do Bling. Use para perguntas sobre pedidos abertos ou recentes. Se o usuário disser aberto sem informar ID de situação, consulte sem filtro e explique que o Bling depende do cadastro de situações.',
      parameters: {
        type: 'object',
        properties: {
          limit: { type: 'number', description: 'Quantidade máxima de pedidos. Padrão: 10.' },
          situacao: { type: 'string', description: 'ID da situação do pedido no Bling, se o usuário informar.' },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'consultarEstoque',
      description: 'Consulta saldos de estoque reais do Bling. Use quando o usuário perguntar estoque de um produto.',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Nome ou código do produto para localizar antes de consultar estoque.' },
          limit: { type: 'number', description: 'Quantidade máxima de produtos para consultar estoque. Padrão: 10.' },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'consultarOrdensProducao',
      description: 'Lista ordens de produção reais do Bling em modo somente leitura.',
      parameters: {
        type: 'object',
        properties: {
          limit: { type: 'number', description: 'Quantidade máxima de ordens de produção. Padrão: 10.' },
        },
      },
    },
  },
];

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY não configurada. Crie um arquivo .env.local com sua chave da OpenAI.');
  }

  return new OpenAI({ apiKey });
}

function parseToolArguments(argumentsJson: string | undefined) {
  if (!argumentsJson) return {};

  try {
    return JSON.parse(argumentsJson) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function getNumber(value: unknown, fallback: number) {
  if (typeof value === 'number' && Number.isFinite(value)) return value;

  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
}

function getString(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

async function executeToolCall(toolCall: OpenAI.Chat.Completions.ChatCompletionMessageFunctionToolCall) {
  const args = parseToolArguments(toolCall.function.arguments);

  switch (toolCall.function.name) {
    case 'consultarProdutos':
      return consultarProdutos({ query: getString(args.query), limit: getNumber(args.limit, 10) });
    case 'consultarPedidos':
      return consultarPedidos({ situacao: getString(args.situacao), limit: getNumber(args.limit, 10) });
    case 'consultarEstoque':
      return consultarEstoque({ query: getString(args.query), limit: getNumber(args.limit, 10) });
    case 'consultarOrdensProducao':
      return consultarOrdensProducao({ limit: getNumber(args.limit, 10) });
    default:
      throw new Error(`Ferramenta desconhecida: ${toolCall.function.name}`);
  }
}

export async function chatWithVita(messages: VitaChatMessage[]) {
  const client = getOpenAIClient();
  const openAiMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: 'system', content: systemPrompt },
    ...messages,
  ];

  const firstCompletion = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: openAiMessages,
    tools,
    tool_choice: 'auto',
    temperature: 0.2,
  });

  const firstMessage = firstCompletion.choices[0]?.message;

  if (!firstMessage?.tool_calls?.length) {
    return firstMessage?.content ?? 'Não foi possível gerar uma resposta.';
  }

  openAiMessages.push(firstMessage);

  for (const toolCall of firstMessage.tool_calls) {
    if (toolCall.type !== 'function') continue;

    const result = await executeToolCall(toolCall);
    openAiMessages.push({
      role: 'tool',
      tool_call_id: toolCall.id,
      content: JSON.stringify(result),
    });
  }

  const finalCompletion = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: openAiMessages,
    temperature: 0.2,
  });

  return finalCompletion.choices[0]?.message.content ?? 'Consulta realizada, mas não foi possível resumir os dados.';
}
