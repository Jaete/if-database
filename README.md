# IF Database — Bestiário de Terralém

Base de dados e editor de conteúdo do **Isekai Fantasy**, um sistema de RPG
caseiro. É uma aplicação Next.js que guarda criaturas, cidadãos, personagens de
jogador, classes e magias em MongoDB — e também publica a ficha de personagem
dentro do fórum da comunidade, via iframe.

A interface é toda em **pt-BR**.

## 📖 Sobre o projeto

O projeto começou como um bestiário de monstros e cresceu até virar o
back-office do sistema inteiro. Hoje ele tem duas frentes:

- **Editor** — rotas `/monsters`, `/citizens`, `/classes`, `/spells` e
  `/players`. Uso interno, com login e papéis (`admin`, `editor`, `viewer`).
- **Visualização embutida** — rotas `/embed/...`, pensadas para rodar dentro do
  fórum: a ficha de personagem (com edição opcional) e a árvore de evolução.

Além do CRUD manual, boa parte do conteúdo entra por **importação**: tópicos do
fórum (fichas, classes, magias) e Markdown/`.docx` de criaturas são parseados
para o formato do banco.

## ✨ Módulos

| Módulo                  | Rota                           | Conteúdo                                                                   |
| ----------------------- | ------------------------------ | -------------------------------------------------------------------------- |
| **Bestiário**           | `/monsters`                    | Criaturas com stats, perícias, sentidos, defesas, drops, CR/XP e perks     |
| **Cidadãos**            | `/citizens`                    | Fichas de NPC/cidadão: stats com breakdown (base + raça + classe), Chi, XP |
| **Jogadores**           | `/players`                     | Cidadãos com dono (conta do fórum) e tópico de origem                      |
| **Classes**             | `/classes`                     | Progressão de 20 níveis, concessões por nível e slots de magia             |
| **Grimório**            | `/spells`                      | Magias como entidade própria, ligadas a classes                            |
| **Árvores de evolução** | modal e `/embed/arvore/[slug]` | Árvore de evoluções de uma criatura                                        |

Cada entidade tem listagem em grid, drawer/modal de detalhe, formulário de
edição e busca. A ficha de jogador (`/embed/jogador/[id]`) é um subsistema à
parte, com UI em estilo de menu de RPG.

## 🚀 Tecnologias

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Banco:** MongoDB com Mongoose 9
- **Estilização:** Sass/SCSS (sem CSS Modules, sem CSS-in-JS, sem Tailwind)
- **Parsing de importação:** `mammoth` para `.docx` (as rotas de Markdown)
- **Qualidade:** ESLint, Prettier, Commitlint, Husky + lint-staged

## 📋 Pré-requisitos

- Node.js 20.9 ou superior (exigência do Next.js 16)
- MongoDB local ou uma instância remota (ex.: Atlas)
- npm (há `yarn.lock` no repo, mas os scripts assumem npm)

## 🔧 Instalação

1. **Clone o repositório**

   ```bash
   git clone git@github.com:Jaete/if-database.git
   cd if-database
   ```

2. **Instale as dependências**

   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**

   Copie o exemplo e preencha:

   ```bash
   cp .env.example .env.local
   ```

   A connection string **não** é uma variável só: `lib/db.ts` monta a URI a
   partir das partes. `MONGODB_CONNECTION` é só o esquema, já terminando em
   `//` (ex.: `mongodb+srv:`).

   ```env
   MONGODB_CONNECTION=mongodb+srv:
   MONGODB_USER=usuario
   MONGODB_PASSWORD=senha
   MONGODB_HOST=cluster.exemplo.mongodb.net
   MONGODB_DATABASE=if-database
   MONGODB_APPNAME=if-database

   JWT_SECRET=uma-string-longa-e-aleatoria
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=senha-do-admin

   FORUM_ORIGIN=https://isekaifantasy.forumbrasil.net
   NEXT_PUBLIC_FORUM_SSO_URL=https://isekaifantasy.forumbrasil.net/?ifdb_sso=1
   ```

   Os scripts carregam tanto `.env` quanto `.env.local` — ambos são ignorados
   pelo git.

4. **Popule o banco (opcional)**

   ```bash
   npm run seed:monsters   # ⚠️ apaga e recria as criaturas a partir da fonte
   npm run seed:admin      # cria o usuário admin com ADMIN_USERNAME/ADMIN_PASSWORD
   ```

## 🎯 Uso

### Desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

### Comandos disponíveis

| Comando                     | Descrição                                                              |
| --------------------------- | ---------------------------------------------------------------------- |
| `npm run dev`               | Servidor de desenvolvimento                                            |
| `npm run dev:https`         | Servidor em HTTPS (exigido para testar o SSO do fórum)                 |
| `npm run build`             | Build de produção                                                      |
| `npm run start`             | Servidor em modo de produção                                           |
| `npm run lint`              | ESLint                                                                 |
| `npm run format`            | Formata com Prettier                                                   |
| `npm run type-check`        | Verifica tipos sem emitir                                              |
| `npm run seed:monsters`     | **Apaga** as criaturas e recria a partir de `scripts/creature-data.ts` |
| `npm run seed:admin`        | Cria/atualiza o usuário admin                                          |
| `npm run check-db`          | Testa a conexão com o MongoDB                                          |
| `npm run backfill:provider` | Preenche `provider` em usuários antigos                                |
| `npm run link:classes`      | Liga fichas existentes às classes (por padrão só relata)               |

Há também scripts sem alias npm, rodados direto com `npx tsx`:

- `scripts/repairDefenses.ts` — corrige defesas gravadas por um bug antigo do
  seed, recalculando a partir da fonte original.

### Testando o SSO do fórum em localhost

O fórum não precisa alcançar a sua máquina: em todo o fluxo quem faz a viagem
de volta é o navegador, então o handshake funciona contra o localhost sem
túnel. O que aponta para produção é o `APP_BASE` cravado no script global do
fórum (`.forum-frontend/sso.js`), e ele aceita um override de dev restrito a
localhost.

> `.forum-frontend/` são os scripts colados no fórum (SSO, collector, renderer
> da árvore). A pasta está no `.gitignore` e não faz parte do build deste app —
> um clone novo não a traz.

1. Suba o app em HTTPS — o fórum é HTTPS, e servir o app em HTTP arrisca
   bloqueio de mixed content no `fetch` do handshake:

   ```bash
   npm run dev:https
   ```

   O Next gera um certificado localmente confiável via `mkcert` (na pasta
   `certificates/`) e sobe em `https://localhost:3000`.

2. No navegador, **no origin do fórum** e já logado, abra o console e aponte o
   handshake para a sua máquina:

   ```js
   localStorage.setItem('ifdb_dev_api_base', 'https://localhost:3000');
   ```

   Recarregue a página: o console deve mostrar `[FORUM-SSO] Dev override
active, ...`.

3. Em `https://localhost:3000`, use **"Entrar com o fórum"**. O fluxo vai ao
   fórum, escreve o nonce no perfil e volta para o `verify-callback` local, com
   a sessão criada.

Para desligar:

```js
localStorage.removeItem('ifdb_dev_api_base');
```

Detalhes que valem lembrar:

- Só valores `localhost`/`127.0.0.1` são aceitos; qualquer outra coisa é
  ignorada e o fluxo segue para produção.
- O override vale apenas para o handshake (modo 1). A interceptação de cliques
  em links do app dentro do fórum (modo 2), o `collect.js` e o
  `tree-renderer.js` continuam indo para produção.
- O teste escreve no MongoDB apontado pelo seu `.env` e grava o nonce no perfil
  real do fórum — o mesmo que acontece em produção.
- `FORUM_ORIGIN` precisa ser exatamente o `Origin` do fórum, **sem barra
  final**: a comparação é por igualdade exata e uma divergência derruba o CORS
  em silêncio, sem mensagem de erro.

### Ficha embutida no fórum

`/embed/jogador/[id]` renderiza a ficha em dark mode fixo (o fórum é escuro) e
descobre quem está visualizando por um handshake em `postMessage` com a página
do fórum — nunca por parâmetro na URL, que seria forjável. Sem origem
autorizada, a ficha abre em modo somente leitura.

A sessão do embed é um cookie separado da sessão normal do app
(`SameSite=None; Secure; Partitioned`), porque `SameSite` é avaliado contra o
site de topo, e não contra a origem imediata do iframe. Isso é o motivo pelo
qual o teste local exige HTTPS.

## 📁 Estrutura do projeto

```
app/
├── (app)/                # Rotas do editor — layout com AuthProvider + AuthGate
│   ├── monsters/         # Bestiário (page.tsx server + *PageClient.tsx)
│   ├── citizens/         # Cidadãos
│   ├── classes/          # Classes (lista + /[slug])
│   ├── spells/           # Grimório
│   ├── players/          # Jogadores
│   └── page.tsx          # Menu principal
├── (embed)/embed/        # Rotas para iframe no fórum (jogador, arvore)
├── api/                  # Route handlers (auth, entidades, importação)
│   └── _entity/          # Handlers REST compartilhados entre entidades
└── context/              # Context providers (Auth, Tab e um por entidade)

components/               # Componentes (atomic design, pastas flat)
db/                       # Modelos Mongoose + tipos, uma pasta por entidade
services/                 # Regras de negócio e parsers de importação
lib/                      # Conexão com o banco, CORS, stats, sanitização
hooks/                    # useCssHandles
scripts/                  # Seeds, backfills e reparos (via tsx)
styles/                   # SCSS: config (tokens/mixins) + components
```

## 🧱 Convenções

O guia completo está em [CLAUDE.md](./CLAUDE.md) — ele é a documentação
canônica do projeto. Em resumo:

- **Componentes** seguem atomic design (atom / molecule / organism), mas as
  pastas são flat e o nível é comportamental: organismo é quem possui estado,
  efeitos ou orquestração assíncrona. Cada pasta tem `index.tsx`, `handles.ts` e,
  quando há lógica real, um `use<Componente>.ts`.
- **CSS Handles** (`hooks/useCssHandles.ts`) definem os nomes de classe. É um
  mapeamento identidade — sem escopo nem hash — então evitar colisão de nomes é
  disciplina manual.
- **Estilo** nunca usa hex ou px cru: sempre tokens semânticos e mixins de
  `styles/config/`. Dark mode é o padrão; o claro vai dentro de
  `@include light`.
- **Páginas** (`app/*/page.tsx`) são sempre server components: conectam no banco,
  buscam os dados, serializam com `JSON.parse(JSON.stringify(...))` e passam
  para um componente organizador. O layout real mora no componente.
- **Serviços** são funções `async` exportadas (nunca classes), no formato CRUD
  padrão, e a escrita via API exige sessão com papel diferente de `viewer`.

## 🤝 Contribuindo

Este projeto usa [Conventional Commits](https://www.conventionalcommits.org/),
verificado por commitlint no hook de pre-commit (Husky + lint-staged rodam
ESLint e Prettier nos arquivos alterados).

## 📄 Licença

Este projeto está sob a licença MIT.
