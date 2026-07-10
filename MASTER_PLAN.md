# MASTER PLAN — VITA IA

## 1. Visão do produto

O **VITA IA** é um assistente interno para apoiar operações de negócio por meio de uma interface conversacional segura, conectada à OpenAI e integrada ao Bling. O produto deve centralizar consultas operacionais, reduzir tarefas manuais repetitivas e evoluir gradualmente para uma camada inteligente de automação assistida.

A visão de longo prazo é que a VITA IA atue como uma ponte confiável entre usuários internos, dados operacionais e APIs corporativas, sempre com governança, rastreabilidade e limites claros para ações sensíveis.

## 2. Objetivos

### 2.1 Objetivos de negócio

- Acelerar consultas internas sobre produtos, estoque, pedidos e ordens de produção.
- Reduzir retrabalho operacional causado por buscas manuais em sistemas externos.
- Criar uma base segura para automações futuras com validações e aprovações humanas.
- Disponibilizar uma experiência simples para usuários internos não técnicos.

### 2.2 Objetivos técnicos

- Manter uma arquitetura modular em Next.js, TypeScript e API Routes.
- Isolar integrações externas em serviços server-side para não expor secrets no frontend.
- Implementar OAuth 2.0 do Bling com renovação de token e tratamento claro de erros.
- Padronizar a evolução do código por meio de documentação, testes, lint e typecheck.
- Preparar o projeto para múltiplos agentes e ferramentas especializadas no futuro.

## 3. Arquitetura

### 3.1 Stack principal

- **Next.js**: aplicação web, renderização, rotas e API Routes.
- **TypeScript**: tipagem estática e contratos entre módulos.
- **Tailwind CSS**: estilização da interface.
- **OpenAI API**: camada de inteligência conversacional.
- **Bling API v3**: integração operacional via OAuth 2.0.

### 3.2 Camadas

1. **Interface web**
   - Páginas em `app/*`.
   - Componentes client-side apenas quando houver interatividade.
   - Não deve acessar diretamente secrets, tokens ou APIs externas privadas.

2. **API Routes**
   - Rotas server-side em `app/api/*`.
   - Responsáveis por validação de entrada, autenticação/autorização quando aplicável e orquestração de serviços.
   - Devem retornar mensagens claras e estruturadas para o frontend.

3. **Serviços de integração**
   - Serviços em `app/services/*`.
   - Encapsulam detalhes de clientes externos, autenticação, headers, retries e tratamento de erros.
   - Devem expor funções de negócio com nomes em português quando relacionadas ao domínio operacional.

4. **Configuração e infraestrutura local**
   - Variáveis em `.env.example`.
   - Arquivos sensíveis e artefatos gerados devem permanecer no `.gitignore`.
   - Dependências travadas em `package-lock.json`.

### 3.3 Segurança

- Secrets devem existir somente em variáveis de ambiente server-side.
- Tokens OAuth não devem ser enviados ao browser.
- Dados sensíveis não devem ser registrados em logs desnecessários.
- Escritas em APIs externas devem exigir etapa de desenho, validação e aprovação explícita.
- O armazenamento local de tokens é temporário para desenvolvimento; produção deve usar cofre seguro ou banco criptografado.

## 4. Estrutura de pastas

```text
.
├── app/
│   ├── api/
│   │   ├── auth/bling/              # Início e callback OAuth do Bling
│   │   ├── bling/products/          # Consulta de produtos do Bling
│   │   └── chat/                    # Chat server-side com OpenAI
│   ├── services/                    # Serviços server-side de integração
│   │   ├── bling.ts                 # OAuth, tokens e chamadas à API do Bling
│   │   └── openai.ts                # Cliente e chamadas à OpenAI
│   ├── test/bling/                  # Página de validação da integração Bling
│   ├── globals.css                  # Estilos globais
│   ├── layout.tsx                   # Layout raiz
│   └── page.tsx                     # Chat inicial da VITA IA
├── .env.example                     # Variáveis esperadas para desenvolvimento
├── .gitignore                       # Arquivos ignorados e sensíveis
├── MASTER_PLAN.md                   # Documento mestre do produto
├── package.json                     # Scripts e dependências
├── package-lock.json                # Lockfile npm
├── tailwind.config.ts               # Configuração Tailwind
└── tsconfig.json                    # Configuração TypeScript
```

## 5. Módulos

### 5.1 Chat VITA IA

Responsável por fornecer a experiência inicial de conversa com o usuário.

- Página principal com interface simples de chat.
- Rota `POST /api/chat` para comunicação server-side com OpenAI.
- Prompt de sistema configurado para respostas em português do Brasil.
- Sem exposição de `OPENAI_API_KEY` no frontend.

### 5.2 Autenticação Bling

Responsável pelo fluxo OAuth 2.0.

- Rota `GET /api/auth/bling` para iniciar autorização.
- Rota `GET /api/auth/bling/callback` para receber `code` ou erro OAuth.
- Troca do authorization code por `access_token` e `refresh_token`.
- Persistência temporária de tokens para desenvolvimento.
- Renovação automática quando o token estiver expirado ou a API retornar `401`.

### 5.3 Produtos Bling

Responsável por validar comunicação real com a API do Bling em modo somente leitura.

- Rota `GET /api/bling/products`.
- Consulta limitada aos 10 primeiros produtos.
- Página `/test/bling` para validação manual.
- Exibição de Nome, Código, Situação e ID.

### 5.4 Funções operacionais futuras

Funções planejadas, mas ainda não implementadas:

- `consultarEstoque`
- `consultarProdutos`
- `consultarPedidos`
- `criarOrdemProducao`
- `consultarOrdensProducao`

Qualquer função de escrita deve ser precedida por desenho técnico, validações de segurança, logs de auditoria e aprovação explícita do usuário.

## 6. Integrações

### 6.1 OpenAI

- Usada para respostas conversacionais e interpretação de solicitações.
- Deve ser chamada somente por rotas ou serviços server-side.
- O prompt do sistema deve delimitar capacidades atuais e evitar prometer integrações ainda não implementadas.
- Futuramente poderá ser integrada a ferramentas internas com function calling ou rotas específicas.

### 6.2 Bling

- Integração via API v3 e OAuth 2.0.
- Escopo inicial: autenticação e consulta de produtos.
- Escritas estão fora do escopo inicial.
- Produção deve usar armazenamento seguro para tokens e estratégia de rotação/renovação robusta.

### 6.3 Integrações futuras

- Banco de dados para histórico, auditoria e tokens criptografados.
- Sistema de autenticação interna para usuários da empresa.
- Observabilidade com logs estruturados, métricas e tracing.
- Filas para operações demoradas ou integrações assíncronas.

## 7. Roadmap por versões

### v0.1 — Fundação

- Criar projeto Next.js + TypeScript + Tailwind.
- Implementar chat simples com OpenAI.
- Implementar OAuth inicial do Bling.
- Criar documentação base e `.env.example`.

### v0.2 — Validação Bling somente leitura

- Concluir fluxo OAuth com refresh token.
- Implementar `GET /api/bling/products`.
- Criar página `/test/bling`.
- Melhorar mensagens de erro para autenticação e expiração de token.

### v0.3 — Produtos e estoque

- Implementar consulta detalhada de produtos.
- Implementar consulta de estoque em modo somente leitura.
- Adicionar filtros e paginação controlada.
- Criar testes unitários para serviços do Bling.

### v0.4 — Pedidos

- Implementar consulta de pedidos.
- Adicionar filtros por período, situação e cliente.
- Integrar respostas do chat com consultas server-side aprovadas.

### v0.5 — Autenticação interna

- Adicionar autenticação de usuários internos.
- Definir perfis de acesso.
- Proteger páginas e rotas sensíveis.
- Introduzir logs de auditoria por usuário.

### v0.6 — Persistência segura

- Migrar armazenamento de tokens para banco ou cofre seguro.
- Criptografar dados sensíveis em repouso.
- Registrar histórico mínimo de interações e chamadas operacionais.

### v0.7 — Agentes especializados

- Criar agentes por domínio: produtos, estoque, pedidos e produção.
- Definir contratos de ferramentas por agente.
- Implementar roteamento de intenção com guardrails.

### v0.8 — Ordens de produção em modo assistido

- Consultar ordens de produção.
- Preparar criação de OP em modo rascunho ou simulação.
- Exigir confirmação humana antes de qualquer escrita.

### v0.9 — Escritas controladas

- Implementar primeiras operações de escrita com aprovação explícita.
- Adicionar trilha de auditoria completa.
- Criar rollback ou plano de mitigação quando aplicável.

### v1.0 — Operação estável

- Consolidar autenticação, autorização, auditoria e observabilidade.
- Cobrir fluxos principais com testes automatizados.
- Documentar runbooks de operação e incidentes.
- Publicar versão pronta para uso interno controlado.

## 8. Backlog priorizado

### Prioridade alta

1. Configurar ambiente local com validação clara de variáveis obrigatórias.
2. Garantir fluxo OAuth do Bling com refresh token confiável.
3. Criar testes unitários para serviços `bling.ts` e `openai.ts`.
4. Implementar armazenamento seguro de tokens para ambiente não local.
5. Proteger rotas internas com autenticação de usuário.

### Prioridade média

1. Melhorar a UI do chat com estados de carregamento, histórico e feedback.
2. Adicionar página de diagnóstico das integrações.
3. Implementar consulta de estoque e produtos detalhados.
4. Criar logs estruturados para chamadas externas.
5. Padronizar respostas de erro das API Routes.

### Prioridade baixa

1. Criar biblioteca compartilhada de componentes UI.
2. Adicionar tema visual e identidade da VITA IA.
3. Criar documentação para usuários finais.
4. Adicionar mocks para desenvolvimento offline.
5. Criar dashboard de métricas de uso.

## 9. Convenções de código

### 9.1 TypeScript

- Usar tipagem explícita em contratos de entrada e saída de serviços.
- Evitar `any`; quando inevitável, documentar o motivo.
- Preferir tipos de domínio claros, como `BlingProduct` e `VitaChatMessage`.
- Validar payloads recebidos por API Routes antes de chamar serviços.

### 9.2 Next.js

- Usar Server Components por padrão.
- Usar Client Components somente quando houver estado, eventos ou APIs do browser.
- Manter integrações externas e secrets em rotas ou serviços server-side.
- Evitar lógica de negócio complexa dentro de componentes visuais.

### 9.3 Serviços

- Cada serviço externo deve ficar isolado em arquivo próprio.
- Funções devem ter nomes expressivos e representar ações de negócio.
- Erros devem ser claros para diagnóstico, mas sem expor secrets.
- Regras de retry e renovação de token devem ficar próximas ao cliente da integração.

### 9.4 Estilo

- Manter código simples, legível e consistente.
- Preferir retornos explícitos a efeitos colaterais ocultos.
- Não adicionar dependências sem justificativa.
- Não envolver imports em `try/catch`.

## 10. Padrões para Pull Requests

Toda Pull Request deve conter:

- Título claro e orientado a resultado.
- Resumo objetivo das mudanças.
- Lista de arquivos ou áreas impactadas.
- Evidência de testes executados.
- Observações sobre riscos, limitações e próximos passos.

### Checklist mínimo

- [ ] A PR preserva funcionalidades existentes.
- [ ] Não expõe secrets no frontend ou em logs.
- [ ] `npm run lint` foi executado.
- [ ] `npm run typecheck` foi executado.
- [ ] Rotas novas possuem tratamento de erro.
- [ ] Escritas em sistemas externos foram explicitamente aprovadas ou estão fora do escopo.
- [ ] Documentação foi atualizada quando necessário.

## 11. Padrões para novos agentes

Agentes futuros devem seguir os princípios abaixo:

- Ter responsabilidade única e escopo bem definido.
- Declarar quais ferramentas ou integrações podem usar.
- Operar com o menor privilégio possível.
- Confirmar com o usuário antes de executar ações irreversíveis ou escritas externas.
- Registrar decisões importantes para auditoria.
- Retornar respostas em português do Brasil por padrão.

### Exemplos de agentes planejados

- **Agente de Produtos**: consulta produtos, detalhes, preços e situação.
- **Agente de Estoque**: consulta saldos e disponibilidade.
- **Agente de Pedidos**: consulta pedidos e status.
- **Agente de Produção**: consulta e prepara ordens de produção, sem criar OP sem confirmação.
- **Agente de Diagnóstico**: verifica saúde das integrações e configuração do ambiente.

## 12. Critérios de qualidade

### 12.1 Qualidade funcional

- Fluxos principais devem ter mensagens de erro compreensíveis.
- A interface deve indicar estados de carregamento e falha.
- Consultas externas devem ter limites para evitar uso excessivo da API.
- Funcionalidades novas devem ser testáveis localmente.

### 12.2 Qualidade técnica

- `npm run lint` deve passar antes da PR.
- `npm run typecheck` deve passar antes da PR.
- Serviços devem ser pequenos, coesos e fáceis de testar.
- Código duplicado em rotas deve ser extraído quando começar a se repetir.
- Dependências devem ser mantidas atualizadas com cautela.

### 12.3 Segurança e governança

- Secrets nunca devem ser versionados.
- Tokens devem ser armazenados com proteção adequada ao ambiente.
- Ações de escrita devem ter confirmação explícita e auditoria.
- Logs não devem conter tokens, chaves ou dados sensíveis desnecessários.

## 13. Como o Codex deve desenvolver novas funcionalidades

Ao trabalhar no VITA IA, o Codex deve seguir este fluxo:

1. **Entender o escopo**
   - Identificar objetivo, arquivos impactados, integrações envolvidas e riscos.
   - Confirmar se a tarefa envolve leitura ou escrita em sistemas externos.

2. **Preservar comportamento existente**
   - Antes de alterar código, verificar a estrutura atual.
   - Evitar refatorações grandes sem necessidade.
   - Manter compatibilidade com rotas e páginas existentes.

3. **Implementar em camadas**
   - UI chama API Routes.
   - API Routes validam entrada e chamam serviços.
   - Serviços encapsulam integrações externas.
   - Configuração e secrets permanecem fora do frontend.

4. **Tratar erros desde o início**
   - Retornar mensagens úteis para o usuário.
   - Preservar detalhes técnicos suficientes para debug server-side.
   - Nunca expor tokens ou secrets em respostas HTTP.

5. **Validar qualidade**
   - Executar `npm run lint`.
   - Executar `npm run typecheck`.
   - Executar testes automatizados quando existirem.
   - Validar manualmente páginas ou rotas alteradas quando aplicável.

6. **Documentar mudanças**
   - Atualizar `MASTER_PLAN.md` quando houver mudança de arquitetura, roadmap ou padrões.
   - Atualizar `.env.example` quando novas variáveis forem necessárias.
   - Descrever limitações conhecidas na PR.

7. **Evitar ações perigosas**
   - Não criar OP, alterar estoque, cancelar pedidos ou executar escritas externas sem autorização explícita.
   - Para operações sensíveis, implementar primeiro modo simulação ou pré-visualização.
   - Solicitar confirmação humana antes de qualquer ação irreversível.
