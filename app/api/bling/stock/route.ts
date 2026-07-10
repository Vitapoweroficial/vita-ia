import { NextResponse } from 'next/server';
import { consultarEstoque } from '@/app/services/bling';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get('query') ?? undefined;
    const limit = Number(url.searchParams.get('limit') ?? 10);
    const stock = await consultarEstoque({ query, limit: Number.isFinite(limit) ? limit : 10 });

    return NextResponse.json({ stock });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao buscar estoque no Bling.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
