import { NextResponse } from 'next/server';
import { getBlingAuthorizationUrl } from '@/app/services/bling';

export async function GET() {
  try {
    return NextResponse.redirect(getBlingAuthorizationUrl());
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao iniciar OAuth do Bling.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
