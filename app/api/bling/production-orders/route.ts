import { NextResponse } from 'next/server';
import { parseLimit } from '@/app/api/bling/utils';
import { consultarOrdensProducao } from '@/app/services/bling';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const limit = parseLimit(url.searchParams);
    const productionOrders = await consultarOrdensProducao({ limit });

    return NextResponse.json({ productionOrders });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao buscar ordens de produção no Bling.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
