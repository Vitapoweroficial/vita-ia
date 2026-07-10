'use client';

import { useEffect, useState } from 'react';

type BlingRecord = Record<string, unknown>;

type ApiState = {
  products: BlingRecord[];
  orders: BlingRecord[];
  stock: BlingRecord[];
  productionOrders: BlingRecord[];
};

type ConnectionStatus = {
  connected: boolean;
  expires_at?: string | null;
  has_refresh_token?: boolean;
  error?: string;
};

const emptyState: ApiState = {
  products: [],
  orders: [],
  stock: [],
  productionOrders: [],
};

function asText(value: unknown) {
  if (value === null || value === undefined || value === '') return '-';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

export default function BlingTestPage() {
  const [data, setData] = useState<ApiState>(emptyState);
  const [status, setStatus] = useState<ConnectionStatus | null>(null);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stockQuery, setStockQuery] = useState('');

  async function loadStatus() {
    try {
      const response = await fetch('/api/bling/status');
      const payload = (await response.json()) as ConnectionStatus;
      setStatus(payload);
    } catch {
      setStatus({ connected: false, error: 'Não foi possível verificar o status da conexão.' });
    }
  }

  useEffect(() => {
    void loadStatus();
  }, []);

  async function fetchResource<T extends keyof ApiState>(key: T, url: string) {
    setIsLoading(key);
    setError(null);

    try {
      const response = await fetch(url);
      const payload = (await response.json()) as Record<string, BlingRecord[] | string>;

      if (!response.ok) {
        throw new Error(typeof payload.error === 'string' ? payload.error : 'Erro ao consultar o Bling.');
      }

      const firstArray = Object.values(payload).find(Array.isArray) as BlingRecord[] | undefined;
      setData((current) => ({ ...current, [key]: firstArray ?? [] }));
      await loadStatus();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Erro inesperado ao consultar o Bling.');
    } finally {
      setIsLoading(null);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
      <section className="mx-auto max-w-6xl rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-cyan-950/30">
        <div className="flex flex-col gap-4 border-b border-slate-800 pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-cyan-300">Validação Bling</p>
            <h1 className="mt-2 text-3xl font-bold">Conexão VITA IA + Bling</h1>
            <p className="mt-2 text-sm text-slate-400">
              Autentique no Bling e valide consultas reais de produtos, pedidos, estoque e ordens de produção.
            </p>
          </div>
          <a
            className="rounded-2xl bg-cyan-300 px-5 py-3 text-center text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
            href="/api/auth/bling"
          >
            Autenticar no Bling
          </a>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-300">
          <p>
            Status:{' '}
            <strong className={status?.connected ? 'text-emerald-300' : 'text-yellow-300'}>
              {status?.connected ? 'Conectado' : 'Não conectado'}
            </strong>
          </p>
          {status?.expires_at ? <p className="mt-1">Token expira em: {new Date(status.expires_at).toLocaleString('pt-BR')}</p> : null}
          {status?.error ? <p className="mt-1 text-red-200">{status.error}</p> : null}
        </div>

        {error ? (
          <div className="mt-6 rounded-2xl border border-red-800 bg-red-950/60 p-4 text-sm text-red-100">
            <p className="font-semibold">Erro ao consultar o Bling</p>
            <p className="mt-2">{error}</p>
          </div>
        ) : null}

        <div className="mt-6 grid gap-3 md:grid-cols-4">
          <button className="rounded-2xl bg-slate-800 px-4 py-3 text-sm font-semibold hover:bg-slate-700" disabled={isLoading !== null} onClick={() => fetchResource('products', '/api/bling/products')} type="button">
            {isLoading === 'products' ? 'Buscando...' : 'Buscar Produtos'}
          </button>
          <button className="rounded-2xl bg-slate-800 px-4 py-3 text-sm font-semibold hover:bg-slate-700" disabled={isLoading !== null} onClick={() => fetchResource('orders', '/api/bling/orders')} type="button">
            {isLoading === 'orders' ? 'Buscando...' : 'Buscar Pedidos'}
          </button>
          <button className="rounded-2xl bg-slate-800 px-4 py-3 text-sm font-semibold hover:bg-slate-700" disabled={isLoading !== null} onClick={() => fetchResource('productionOrders', '/api/bling/production-orders')} type="button">
            {isLoading === 'productionOrders' ? 'Buscando...' : 'Buscar OPs'}
          </button>
          <button className="rounded-2xl bg-slate-800 px-4 py-3 text-sm font-semibold hover:bg-slate-700" disabled={isLoading !== null} onClick={() => fetchResource('stock', `/api/bling/stock?query=${encodeURIComponent(stockQuery)}`)} type="button">
            {isLoading === 'stock' ? 'Buscando...' : 'Buscar Estoque'}
          </button>
        </div>

        <label className="mt-4 block text-sm text-slate-300">
          Filtro opcional para estoque
          <input
            className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none transition focus:border-cyan-300"
            onChange={(event) => setStockQuery(event.target.value)}
            placeholder="Ex.: Creatina"
            value={stockQuery}
          />
        </label>

        <div className="mt-8 grid gap-6">
          <ResultTable records={data.products} title="Produtos" columns={[['nome', 'Nome'], ['codigo', 'Código'], ['situacao', 'Situação'], ['id', 'ID']]} />
          <ResultTable records={data.orders} title="Pedidos" columns={[['numero', 'Número'], ['data', 'Data'], ['total', 'Total'], ['situacao', 'Situação'], ['id', 'ID']]} />
          <ResultTable records={data.stock} title="Estoque" columns={[['produto', 'Produto'], ['saldoFisicoTotal', 'Saldo físico'], ['saldoVirtualTotal', 'Saldo virtual']]} />
          <ResultTable records={data.productionOrders} title="Ordens de produção" columns={[['numero', 'Número'], ['data', 'Data'], ['dataPrevista', 'Previsão'], ['situacao', 'Situação'], ['id', 'ID']]} />
        </div>
      </section>
    </main>
  );
}

function ResultTable({ title, records, columns }: { title: string; records: BlingRecord[]; columns: Array<[string, string]> }) {
  return (
    <section>
      <h2 className="mb-3 text-xl font-semibold">{title}</h2>
      {records.length === 0 ? (
        <p className="rounded-2xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-400">Nenhum dado carregado.</p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-800">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-slate-950 text-slate-300">
              <tr>
                {columns.map(([, label]) => (
                  <th className="px-4 py-3" key={label}>{label}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {records.map((record, index) => (
                <tr className="bg-slate-900/70" key={`${title}-${index}`}>
                  {columns.map(([key, label]) => (
                    <td className="px-4 py-3 text-slate-300" key={label}>{asText(record[key])}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
