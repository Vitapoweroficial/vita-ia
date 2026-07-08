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

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Falha ao trocar code do Bling: ${JSON.stringify(data)}`);
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

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Falha ao renovar token do Bling. Refaça a autorização OAuth. Detalhes: ${JSON.stringify(data)}`);
  }

  return saveTokens(data as BlingTokenResponse);
}

async function getValidAccessToken() {
  const tokens = await readTokens();

  if (!tokens) {
    throw new Error('Bling ainda não autorizado. Acesse /api/auth/bling para iniciar o OAuth.');
  }

  if (Date.now() < tokens.expires_at - expirationSafetyWindowMs) {
    return tokens.access_token;
  }

  if (!tokens.refresh_token) {
    throw new Error('Token do Bling expirado e refresh_token indisponível. Refaça a autorização OAuth.');
  }

  const refreshedTokens = await refreshBlingAccessToken(tokens.refresh_token);
  return refreshedTokens.access_token;
}

async function blingGet<T>(resourcePath: string, searchParams?: Record<string, string>) {
  const url = new URL(`${blingBaseUrl}${resourcePath}`);

  for (const [key, value] of Object.entries(searchParams ?? {})) {
    url.searchParams.set(key, value);
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
      throw new Error('A sessão do Bling expirou e não há refresh_token salvo. Refaça a autorização OAuth.');
    }

    accessToken = (await refreshBlingAccessToken(tokens.refresh_token)).access_token;
    response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    });
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Erro ao consultar API do Bling: ${JSON.stringify(data)}`);
  }

  return data as T;
}

export async function consultarProdutos(limit = 10) {
  const data = await blingGet<{ data?: BlingProduct[] }>('/produtos', {
    pagina: '1',
    limite: String(limit),
  });

  return data.data ?? [];
}

export async function consultarEstoque() {
  throw new Error('Função consultarEstoque ainda não implementada.');
}

export async function consultarPedidos() {
  throw new Error('Função consultarPedidos ainda não implementada.');
}

export async function criarOrdemProducao() {
  throw new Error('Função criarOrdemProducao ainda não implementada.');
}

export async function consultarOrdensProducao() {
  throw new Error('Função consultarOrdensProducao ainda não implementada.');
}
