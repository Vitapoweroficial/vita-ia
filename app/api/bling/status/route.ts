import { NextResponse } from 'next/server';
import { getBlingConnectionStatus } from '@/app/services/bling';

export async function GET() {
  try {
    return NextResponse.json(await getBlingConnectionStatus());
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao verificar conexão com o Bling.';
    return NextResponse.json({ connected: false, error: message }, { status: 500 });
  }
}
