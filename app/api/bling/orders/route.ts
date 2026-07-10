import { NextResponse } from 'next/server';
import { consultarPedidos } from '@/app/services/bling';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get('limit') ?? 10);
    const situacao = url.searchParams.get('situacao') ?? undefined;
    const orders = await consultarPedidos({ limit: Number.isFinite(limit) ? limit : 10, situacao });

    return NextResponse.json({ orders });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao buscar pedidos no Bling.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
