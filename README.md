# VITA IA

VITA IA é um assistente interno em Next.js + TypeScript que conversa com a OpenAI e consulta dados reais do Bling em modo somente leitura.

## Funcionalidades

- Chat web com a VITA IA.
- Integração server-side com OpenAI.
- OAuth 2.0 do Bling com `access_token`, `refresh_token` e renovação automática.
- Consulta real ao Bling para:
  - Produtos
  - Pedidos de venda
  - Estoque
  - Ordens de produção
- Página `/test/bling` para autenticar, validar conexão e testar endpoints.
- Nenhuma criação, edição, exclusão, criação de OP ou alteração de estoque.

## Requisitos

- Node.js 20 ou superior.
- Conta OpenAI com API key.
- Aplicativo OAuth cadastrado no Bling com redirect URI:

```text
http://localhost:3000/api/auth/bling/callback
```

## Instalação

```bash
npm install
```

## Configuração do ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```bash
cp .env.example .env.local
```

Preencha as variáveis:

```env
OPENAI_API_KEY=sk-...
BLING_CLIENT_ID=...
BLING_CLIENT_SECRET=...
BLING_REDIRECT_URI=http://localhost:3000/api/auth/bling/callback
```

> Os tokens do Bling são salvos temporariamente em `.bling-tokens.json` durante o desenvolvimento. Esse arquivo é ignorado pelo Git e não deve ser enviado para repositórios.

## Rodando localmente

```bash
npm run dev
```

Abra:

```text
http://localhost:3000
```

## Autenticando no Bling

1. Rode o projeto com `npm run dev`.
2. Acesse:

```text
http://localhost:3000/test/bling
```

3. Clique em **Autenticar no Bling**.
4. Autorize o aplicativo no Bling.
5. Após o callback, volte para `/test/bling`.
6. Use os botões para testar Produtos, Pedidos, Estoque e OPs.

## Endpoints disponíveis

### Chat

```http
POST /api/chat
```

Body:

```json
{
  "messages": [
    { "role": "user", "content": "Liste meus produtos" }
  ]
}
```

### Status da conexão Bling

```http
GET /api/bling/status
```

### Produtos

```http
GET /api/bling/products?query=Creatina&limit=10
```

### Pedidos

```http
GET /api/bling/orders?limit=10
```

### Estoque

```http
GET /api/bling/stock?query=Creatina&limit=10
```

### Ordens de produção

```http
GET /api/bling/production-orders?limit=10
```

## Perguntas suportadas no chat

Exemplos:

- `Liste meus produtos`
- `Quais pedidos estão abertos?`
- `Qual o estoque da Creatina?`
- `Quais OPs estão em andamento?`

A IA usa ferramentas server-side para consultar o Bling. Tokens e secrets nunca são enviados ao frontend.

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run typecheck
```

## Testes e validação

Antes de abrir uma PR, execute:

```bash
npm run lint
npm run typecheck
npm run build
```

Também valide manualmente:

1. `/test/bling` autentica no Bling.
2. `/api/bling/products` retorna produtos.
3. `/api/bling/orders` retorna pedidos.
4. `/api/bling/stock` retorna estoque.
5. `/api/bling/production-orders` retorna OPs.
6. O chat responde usando dados reais do Bling.

## Segurança

- Não exponha `OPENAI_API_KEY`, `BLING_CLIENT_SECRET`, `access_token` ou `refresh_token` no frontend.
- Não faça commit de `.env.local` ou `.bling-tokens.json`.
- Operações de escrita no Bling estão fora do escopo desta versão.
