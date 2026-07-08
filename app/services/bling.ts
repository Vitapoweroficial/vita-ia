export type BlingTokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope?: string;
};

const blingTokenUrl = 'https://www.bling.com.br/Api/v3/oauth/token';

function getBlingCredentials() {
  const clientId = process.env.BLING_CLIENT_ID;
  const clientSecret = process.env.BLING_CLIENT_SECRET;
  const redirectUri = process.env.BLING_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error('Credenciais OAuth do Bling não configuradas.');
  }

  return { clientId, clientSecret, redirectUri };
}

export async function exchangeBlingCodeForToken(code: string): Promise<BlingTokenResponse> {
  const { clientId, clientSecret, redirectUri } = getBlingCredentials();
  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const response = await fetch(blingTokenUrl, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basicAuth}`,
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

  return data as BlingTokenResponse;
}

export async function consultarEstoque() {
  throw new Error('Função consultarEstoque ainda não implementada.');
}

export async function consultarProdutos() {
  throw new Error('Função consultarProdutos ainda não implementada.');
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
