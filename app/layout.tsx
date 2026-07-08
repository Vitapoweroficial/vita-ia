import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'VITA IA',
  description: 'Assistente interno integrado à OpenAI e ao Bling.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
