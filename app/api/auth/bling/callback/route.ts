import { NextResponse } from 'next/server';
import { exchangeBlingCodeForToken } from '@/app/services/bling';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const oauthError = url.searchParams.get('error');

  if (oauthError) {
    return NextResponse.json({ error: `Bling retornou erro OAuth: ${oauthError}` }, { status: 400 });
  }

  if (!code) {
    return NextResponse.json({ error: 'Parâmetro code não informado pelo Bling.' }, { status: 400 });
  }

  try {
    const token = await exchangeBlingCodeForToken(code);

    return NextResponse.json({
      message: 'Autorização do Bling concluída com sucesso.',
      token_type: token.token_type,
      expires_in: token.expires_in,
      scope: token.scope,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao concluir OAuth do Bling.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
