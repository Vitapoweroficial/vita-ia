import { NextResponse } from 'next/server';
import { consultarProdutos } from '@/app/services/bling';

export async function GET() {
  try {
    const products = await consultarProdutos(10);
    return NextResponse.json({ products });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao buscar produtos no Bling.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
