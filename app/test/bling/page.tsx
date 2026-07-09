'use client';

import { useState } from 'react';

type BlingProduct = {
  id: number | string;
  nome: string;
  codigo?: string;
  situacao?: string;
};

export default function BlingTestPage() {
  const [products, setProducts] = useState<BlingProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchProducts() {
    setIsLoading(true);
    setError(null);
    setProducts([]);

    try {
      const response = await fetch('/api/bling/products');
      const data = (await response.json()) as { products?: BlingProduct[]; error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? 'Não foi possível buscar produtos no Bling.');
      }

      setProducts(data.products ?? []);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Erro inesperado ao buscar produtos.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
      <section className="mx-auto max-w-5xl rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-cyan-950/30">
        <div className="flex flex-col gap-4 border-b border-slate-800 pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-cyan-300">Validação Bling</p>
            <h1 className="mt-2 text-3xl font-bold">Produtos do Bling</h1>
            <p className="mt-2 text-sm text-slate-400">
              Use esta tela para validar a autenticação OAuth e a leitura dos 10 primeiros produtos.
            </p>
          </div>
          <button
            className="rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isLoading}
            onClick={fetchProducts}
            type="button"
          >
            {isLoading ? 'Buscando...' : 'Buscar Produtos'}
          </button>
        </div>

        <div className="pt-6">
          {error ? (
            <div className="rounded-2xl border border-red-800 bg-red-950/60 p-4 text-sm text-red-100">
              <p className="font-semibold">Erro ao consultar o Bling</p>
              <p className="mt-2">{error}</p>
              <p className="mt-3 text-red-200">
                Se ainda não autorizou o app, acesse <code className="rounded bg-red-900 px-1">/api/auth/bling</code>.
              </p>
            </div>
          ) : null}

          {!error && products.length === 0 ? (
            <p className="rounded-2xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-400">
              Clique em “Buscar Produtos” para carregar dados reais da API do Bling.
            </p>
          ) : null}

          {products.length > 0 ? (
            <div className="overflow-hidden rounded-2xl border border-slate-800">
              <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-slate-950 text-slate-300">
                  <tr>
                    <th className="px-4 py-3">Nome</th>
                    <th className="px-4 py-3">Código</th>
                    <th className="px-4 py-3">Situação</th>
                    <th className="px-4 py-3">ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {products.map((product) => (
                    <tr key={product.id} className="bg-slate-900/70">
                      <td className="px-4 py-3 font-medium text-slate-100">{product.nome}</td>
                      <td className="px-4 py-3 text-slate-300">{product.codigo || '-'}</td>
                      <td className="px-4 py-3 text-slate-300">{product.situacao || '-'}</td>
                      <td className="px-4 py-3 text-slate-300">{product.id}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
