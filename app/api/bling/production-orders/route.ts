import { NextResponse } from 'next/server';
import { consultarOrdensProducao } from '@/app/services/bling';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get('limit') ?? 10);
    const productionOrders = await consultarOrdensProducao({ limit: Number.isFinite(limit) ? limit : 10 });

    return NextResponse.json({ productionOrders });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao buscar ordens de produção no Bling.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
