import { NextResponse } from 'next/server';
import { consultarProdutos } from '@/app/services/bling';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get('query') ?? undefined;
    const limit = Number(url.searchParams.get('limit') ?? 10);
    const products = await consultarProdutos({ query, limit: Number.isFinite(limit) ? limit : 10 });

    return NextResponse.json({ products });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao buscar produtos no Bling.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
