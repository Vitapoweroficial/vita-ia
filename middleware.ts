import { NextRequest, NextResponse } from 'next/server';

const FLYPRO_PATH = '/propostas/flypro';

/**
 * Permite publicar a proposta FLYPRO em um projeto Vercel separado, usando
 * o mesmo repositório, sem expor as rotas internas do Vita IA.
 *
 * Para ativar no projeto público, configure:
 * PUBLIC_PROPOSAL_ONLY=flypro
 */
export function middleware(request: NextRequest) {
  if (process.env.PUBLIC_PROPOSAL_ONLY !== 'flypro') {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  if (pathname === '/') {
    return NextResponse.redirect(new URL(FLYPRO_PATH, request.url));
  }

  const isProposal = pathname === FLYPRO_PATH || pathname.startsWith(`${FLYPRO_PATH}/`);
  const isFrameworkAsset = pathname.startsWith('/_next/');
  const isPublicAsset = pathname === '/favicon.ico' || pathname === '/robots.txt';

  if (isProposal || isFrameworkAsset || isPublicAsset) {
    return NextResponse.next();
  }

  return new NextResponse('Página não encontrada.', {
    status: 404,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
};
