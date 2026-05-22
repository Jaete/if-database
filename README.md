# IF Database - Monster Bestiary

Um banco de dados de monstros para RPG, construído com Next.js e MongoDB.

## 📖 Sobre o Projeto

Este projeto é um bestiário digital que permite visualizar, criar, editar e gerenciar informações de monstros para jogos de RPG. Cada monstro inclui detalhes completos como estatísticas, habilidades, sentidos e drops.

## ✨ Funcionalidades

- **Listagem de Monstros**: Visualize todos os monstros cadastrados em formato de grid
- **Detalhes do Monstro**: Veja informações completas de cada monstro em um drawer lateral
- **CRUD Completo**: Crie, edite e exclua monstros
- **Dados Estruturados**: 
  - Estatísticas (FOR, DES, CON, INT, SAB, CAR)
  - Habilidades e ações especiais
  - Sentidos e percepções
  - Drops e recompensas

## 🚀 Tecnologias

- **Frontend**: Next.js 16, React 19, TypeScript
- **Banco de Dados**: MongoDB com Mongoose
- **Estilização**: Sass/SCSS
- **Ferramentas de Qualidade**:
  - ESLint para linting
  - Prettier para formatação
  - Commitlint para padronização de commits
  - Husky + lint-staged para hooks de pré-commit

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- MongoDB instalado localmente ou acesso a uma instância remota
- npm ou yarn

## 🔧 Instalação

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd if-database
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   
   Copie o arquivo `.env.example` para `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   
   Edite o `.env.local` e adicione sua string de conexão com o MongoDB:
   ```env
   MONGODB_CONNECTION=mongodb://localhost:27017/monster-database
   ```

4. **Popule o banco de dados (opcional)**
   
   Para adicionar dados iniciais de exemplo:
   ```bash
   npm run seed
   ```

## 🎯 Uso

### Desenvolvimento

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

### Comandos Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Compila o projeto para produção |
| `npm run start` | Inicia o servidor em modo de produção |
| `npm run lint` | Executa o linter no projeto |
| `npm run format` | Formata o código com Prettier |
| `npm run type-check` | Verifica tipos TypeScript sem compilar |
| `npm run seed` | Popula o banco de dados com monstros de exemplo |

## 📁 Estrutura do Projeto

```
if-database/
├── app/                    # Rotas e páginas Next.js (App Router)
│   ├── monsters/          # Páginas relacionadas a monstros
│   │   └── edit/[slug]/   # Página de edição de monstro
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página inicial
├── components/            # Componentes React
│   ├── AbilitiesBlock/    # Bloco de habilidades
│   ├── CombatInfo/        # Informações de combate
│   ├── CreatureDrawer/    # Drawer lateral de criaturas
│   ├── DropsBlock/        # Bloco de drops
│   ├── MonsterCard/       # Card individual de monstro
│   ├── MonsterData/       # Dados completos do monstro
│   ├── MonsterGrid/       # Grid de cards de monstros
│   ├── MonsterInfo/       # Informações básicas do monstro
│   ├── SensesBlock/       # Bloco de sentidos
│   └── StatsBlock/        # Bloco de estatísticas
├── db/                    # Modelos e configurações do banco
│   └── monsters/          # Modelo e schemas de monstros
├── lib/                   # Utilitários e configurações
│   └── db.ts              # Conexão com MongoDB
├── scripts/               # Scripts utilitários
│   ├── initializeDb.ts    # Script de inicialização do DB
│   └── monster-data.ts    # Dados iniciais de monstros
├── services/              # Camada de serviço/regras de negócio
│   └── monster.service.ts # Operações CRUD de monstros
├── styles/                # Arquivos de estilo SCSS
├── .env.example           # Exemplo de variáveis de ambiente
└── package.json           # Dependências e scripts
```

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Faça commit das suas mudanças (`git commit -m 'feat: add some AmazingFeature'`)
4. Faça push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Padrões de Commit

Este projeto utiliza [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Mudanças na documentação
- `style:` - Formatação, ponto e vírgula, etc.
- `refactor:` - Refatoração de código
- `test:` - Adição ou correção de testes
- `chore:` - Tarefas de manutenção

## 📄 Licença

Este projeto está sob a licença MIT.

## 🙏 Agradecimentos

- Next.js Team
- MongoDB Team
- Comunidade React/TypeScript
