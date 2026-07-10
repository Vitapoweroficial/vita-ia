import { NextResponse } from 'next/server';
import { consultarEstoque } from '@/app/services/bling';
import { optionalSearchParam, parseLimit } from '@/app/api/bling/utils';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const query = optionalSearchParam(url.searchParams, 'query');
    const limit = parseLimit(url.searchParams);
    const stock = await consultarEstoque({ query, limit });

    return NextResponse.json({ stock });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao buscar estoque no Bling.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
