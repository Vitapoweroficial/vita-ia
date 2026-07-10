import { NextResponse } from 'next/server';
import { consultarProdutos } from '@/app/services/bling';
import { optionalSearchParam, parseLimit } from '@/app/api/bling/utils';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const query = optionalSearchParam(url.searchParams, 'query');
    const limit = parseLimit(url.searchParams);
    const products = await consultarProdutos({ query, limit });

    return NextResponse.json({ products });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao buscar produtos no Bling.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
