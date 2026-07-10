import { NextResponse } from 'next/server';
import { consultarPedidos } from '@/app/services/bling';
import { optionalSearchParam, parseLimit } from '@/app/api/bling/utils';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const limit = parseLimit(url.searchParams);
    const situacao = optionalSearchParam(url.searchParams, 'situacao');
    const orders = await consultarPedidos({ limit, situacao });

    return NextResponse.json({ orders });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao buscar pedidos no Bling.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
