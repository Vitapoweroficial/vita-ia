import { promises as fs } from 'fs';
import path from 'path';

export type BlingTokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope?: string;
};

type StoredBlingTokens = BlingTokenResponse & {
  expires_at: number;
  created_at: string;
};

export type BlingProduct = {
  id: number | string;
  nome: string;
  codigo?: string;
  situacao?: string;
  preco?: number;
  tipo?: string;
};

export type BlingOrder = {
  id: number | string;
  numero?: number | string;
  numeroLoja?: string;
  data?: string;
  total?: number;
  situacao?: {
    id?: number | string;
    valor?: number | string;
    nome?: string;
  };
  contato?: {
    id?: number | string;
    nome?: string;
  };
};

export type BlingStockBalance = {
  produto?: {
    id?: number | string;
    nome?: string;
    codigo?: string;
  };
  saldoFisicoTotal?: number;
  saldoVirtualTotal?: number;
  depositos?: Array<{
    id?: number | string;
    nome?: string;
    saldoFisico?: number;
    saldoVirtual?: number;
  }>;
};

export type BlingProductionOrder = {
  id: number | string;
  numero?: number | string;
  data?: string;
  dataPrevista?: string;
  situacao?: string | { id?: number | string; nome?: string; valor?: string };
  produto?: {
    id?: number | string;
    nome?: string;
    codigo?: string;
  };
};

type BlingListResponse<T> = {
  data?: T[];
};

const blingBaseUrl = 'https://www.bling.com.br/Api/v3';
const blingAuthorizeUrl = 'https://www.bling.com.br/Api/v3/oauth/authorize';
const blingTokenUrl = `${blingBaseUrl}/oauth/token`;
const tokenFilePath = path.join(process.cwd(), '.bling-tokens.json');
const expirationSafetyWindowMs = 60_000;

function getBlingCredentials() {
  const clientId = process.env.BLING_CLIENT_ID;
  const clientSecret = process.env.BLING_CLIENT_SECRET;
  const redirectUri = process.env.BLING_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error('Credenciais OAuth do Bling não configuradas. Verifique BLING_CLIENT_ID, BLING_CLIENT_SECRET e BLING_REDIRECT_URI.');
  }

  return { clientId, clientSecret, redirectUri };
}

function buildBasicAuthHeader(clientId: string, clientSecret: string) {
  return `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`;
}

function withExpirationMetadata(token: BlingTokenResponse): StoredBlingTokens {
  return {
    ...token,
    expires_at: Date.now() + token.expires_in * 1000,
    created_at: new Date().toISOString(),
  };
}

async function saveTokens(token: BlingTokenResponse) {
  const storedTokens = withExpirationMetadata(token);
  await fs.writeFile(tokenFilePath, JSON.stringify(storedTokens, null, 2), { mode: 0o600 });
  return storedTokens;
}

async function readTokens() {
  try {
    const file = await fs.readFile(tokenFilePath, 'utf-8');
    return JSON.parse(file) as StoredBlingTokens;
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      return null;
    }

    throw new Error('Não foi possível ler os tokens locais do Bling.');
  }
}

export async function getBlingConnectionStatus() {
  const tokens = await readTokens();

  return {
    connected: Boolean(tokens?.access_token),
    expires_at: tokens?.expires_at ? new Date(tokens.expires_at).toISOString() : null,
    has_refresh_token: Boolean(tokens?.refresh_token),
  };
}

export function getBlingAuthorizationUrl() {
  const { clientId, redirectUri } = getBlingCredentials();
  const url = new URL(blingAuthorizeUrl);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', redirectUri);
  return url.toString();
}

export async function exchangeBlingCodeForToken(code: string): Promise<StoredBlingTokens> {
  const { clientId, clientSecret, redirectUri } = getBlingCredentials();

  const response = await fetch(blingTokenUrl, {
    method: 'POST',
    headers: {
      Authorization: buildBasicAuthHeader(clientId, clientSecret),
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
    }),
  });

  const data = await safeJson(response);

  if (!response.ok) {
    throw new Error(`Falha ao trocar code do Bling: ${formatBlingError(data)}`);
  }

  return saveTokens(data as BlingTokenResponse);
}

export async function refreshBlingAccessToken(refreshToken: string): Promise<StoredBlingTokens> {
  const { clientId, clientSecret } = getBlingCredentials();

  const response = await fetch(blingTokenUrl, {
    method: 'POST',
    headers: {
      Authorization: buildBasicAuthHeader(clientId, clientSecret),
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });

  const data = await safeJson(response);

  if (!response.ok) {
    throw new Error(`Falha ao renovar token do Bling. Refaça a autorização OAuth. Detalhes: ${formatBlingError(data)}`);
  }

  return saveTokens(data as BlingTokenResponse);
}

async function safeJson(response: Response) {
  const text = await response.text();

  if (!text) return null;

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

function formatBlingError(error: unknown) {
  if (typeof error === 'string') return error;
  return JSON.stringify(error);
}

async function getValidAccessToken() {
  const tokens = await readTokens();

  if (!tokens) {
    throw new Error('Bling ainda não autorizado. Acesse /test/bling e clique em “Autenticar no Bling”.');
  }

  if (Date.now() < tokens.expires_at - expirationSafetyWindowMs) {
    return tokens.access_token;
  }

  if (!tokens.refresh_token) {
    throw new Error('Token do Bling expirado e refresh_token indisponível. Refaça a autorização OAuth em /test/bling.');
  }

  const refreshedTokens = await refreshBlingAccessToken(tokens.refresh_token);
  return refreshedTokens.access_token;
}

async function blingGet<T>(resourcePath: string, searchParams?: Record<string, string | string[] | undefined>) {
  const url = new URL(`${blingBaseUrl}${resourcePath}`);

  for (const [key, value] of Object.entries(searchParams ?? {})) {
    if (value === undefined || value === '') continue;

    if (Array.isArray(value)) {
      for (const item of value) {
        url.searchParams.append(key, item);
      }
    } else {
      url.searchParams.set(key, value);
    }
  }

  let accessToken = await getValidAccessToken();
  let response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
  });

  if (response.status === 401) {
    const tokens = await readTokens();

    if (!tokens?.refresh_token) {
      throw new Error('A sessão do Bling expirou e não há refresh_token salvo. Refaça a autorização OAuth em /test/bling.');
    }

    accessToken = (await refreshBlingAccessToken(tokens.refresh_token)).access_token;
    response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    });
  }

  const data = await safeJson(response);

  if (!response.ok) {
    throw new Error(`Erro ao consultar API do Bling em ${resourcePath}: ${formatBlingError(data)}`);
  }

  return data as T;
}

export async function consultarProdutos(options: { limit?: number; query?: string } = {}) {
  const data = await blingGet<BlingListResponse<BlingProduct>>('/produtos', {
    pagina: '1',
    limite: String(options.limit ?? 10),
    criterio: options.query,
  });

  return data.data ?? [];
}

export async function consultarPedidos(options: { limit?: number; situacao?: string } = {}) {
  const data = await blingGet<BlingListResponse<BlingOrder>>('/pedidos/vendas', {
    pagina: '1',
    limite: String(options.limit ?? 10),
    idSituacao: options.situacao,
  });

  return data.data ?? [];
}

export async function consultarEstoque(options: { query?: string; limit?: number } = {}) {
  const products = await consultarProdutos({ query: options.query, limit: options.limit ?? 10 });
  const productIds = products.map((product) => String(product.id)).filter(Boolean);

  if (productIds.length === 0) {
    return [];
  }

  const data = await blingGet<BlingListResponse<BlingStockBalance>>('/estoques/saldos', {
    'idsProdutos[]': productIds,
  });

  return data.data ?? [];
}

export async function consultarOrdensProducao(options: { limit?: number } = {}) {
  const data = await blingGet<BlingListResponse<BlingProductionOrder>>('/ordens-producao', {
    pagina: '1',
    limite: String(options.limit ?? 10),
  });

  return data.data ?? [];
}

export async function criarOrdemProducao() {
  throw new Error('Criação de ordem de produção não implementada. A VITA IA está limitada a consultas no Bling.');
}
