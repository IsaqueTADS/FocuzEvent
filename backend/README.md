# FocuzEvent - Backend

## 📋 Sobre o Projeto

O **FocuzEvent** é uma plataforma de gerenciamento de eventos que permite aos usuários criar, gerenciar e impulsionar eventos. O sistema oferece funcionalidades completas para organização de eventos, incluindo sistema de pagamentos integrado com Stripe, geolocalização, categorização e sistema de impulsão para maior visibilidade dos eventos.

## 🚀 Funcionalidades Principais

### 👤 Gestão de Usuários

- Cadastro e autenticação de usuários
- Sistema de roles (USUARIO/ADMIN)
- Perfil de usuário com foto
- Middleware de autenticação JWT

### 🎉 Gestão de Eventos

- Criação, edição e exclusão de eventos
- Upload de banners para eventos
- Sistema de categorização de eventos
- Geolocalização (latitude/longitude)
- Controle de eventos pagos/gratuitos
- Sistema de contato (telefone, email, Instagram)
- Contador de acessos
- Filtros por cidade, categoria e usuário
- Paginação de resultados

### 🌍 Localização

- Gestão de estados e cidades
- Relacionamento entre estados e cidades
- Filtros de eventos por localização

### 💰 Sistema de Impulsão

- Planos de impulsão com valores configuráveis
- Integração com Stripe para pagamentos
- Controle de conflitos de período
- Banner personalizado para eventos impulsionados
- Status de pagamento (AGUARDANDO, PAGO, RECUSADO)

#### Fluxo de Pagamento

1. **Criação do Impulso**: Usuário seleciona plano e período
2. **Checkout Stripe**: Sistema redireciona para página de pagamento do Stripe
3. **Processamento**: Stripe processa o pagamento
4. **Webhook**: Stripe envia confirmação via webhook
5. **Atualização**: Sistema atualiza status do impulso e evento

### 🔐 Administração

- Painel administrativo
- Gestão de categorias de eventos
- Controle de usuários e eventos

## 🛠️ Tecnologias Utilizadas

### Backend

- **Node.js** - Runtime JavaScript
- **TypeScript** - Linguagem de programação
- **Express.js** - Framework web
- **Prisma** - ORM para banco de dados
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **Stripe** - Processamento de pagamentos
- **Multer** - Upload de arquivos
- **Zod** - Validação de dados
- **bcrypt** - Criptografia de senhas

### Ferramentas de Desenvolvimento

- **ESLint** - Linting de código
- **tsx** - Execução de TypeScript
- **tsup** - Build e bundling
- **Docker Compose** - Containerização

## 📁 Estrutura do Projeto

```
backend/
├── src/
│   ├── controllers/          # Controladores das rotas
│   │   ├── adminControllers.ts
│   │   ├── authControllers.ts
│   │   ├── categoriasController.ts
│   │   ├── cidadesControllers.ts
│   │   ├── estadosControllers.ts
│   │   ├── eventosControllers.ts
│   │   ├── impulsosEventosControllers.ts
│   │   ├── planoImpulsoControllers.ts
│   │   ├── usuariosController.ts
│   │   └── webhookController.ts
│   ├── middlewares/         # Middlewares personalizados
│   │   ├── adminMiddleware.ts
│   │   ├── authMiddleware.ts
│   │   ├── impulsoMiddleware.ts
│   │   ├── rateLimit.ts
│   │   ├── uploadAvatar.ts
│   │   ├── uploadBannerEvento.ts
│   │   └── uploadBannerImpulso.ts
│   ├── routes/              # Definição das rotas
│   │   ├── adminRoutes.ts
│   │   ├── authRoutes.ts
│   │   ├── categoriasRoutes.ts
│   │   ├── cidadesRoutes.ts
│   │   ├── estadosRoutes.ts
│   │   ├── eventosRoutes.ts
│   │   ├── impulsosEventosRoutes.ts
│   │   ├── planoImpulsoRoutes.ts
│   │   ├── usuariosRoutes.ts
│   │   └── webhookRoute.ts
│   ├── utils/               # Utilitários
│   │   ├── apagarArquivos.ts
│   │   ├── prisma.ts
│   │   └── type.ts
│   ├── config/              # Configurações
│   │   └── stripe.ts
│   ├── env/                 # Variáveis de ambiente
│   │   └── index.ts
│   ├── uploads/             # Arquivos enviados
│   ├── app.ts               # Configuração da aplicação
│   └── server.ts            # Servidor principal
├── prisma/                  # Schema e migrações do banco
│   ├── migrations/
│   ├── seeds/               # Dados iniciais
│   └── schema.prisma
├── arquivos-jsons/          # Dados de estados e cidades
├── docker-compose.yml       # Configuração do Docker
├── package.json
└── tsconfig.json
```

## ⚙️ Configuração e Instalação

### Pré-requisitos

- Node.js (versão 18 ou superior)
- PostgreSQL
- Docker e Docker Compose (opcional)

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd backend
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Banco de dados
DATABASE_URL="postgresql://root:root@localhost:5432/focuzevent"

# JWT
JWT_SECRET="sua-chave-secreta-jwt-aqui"

# Stripe
STRIPE_SECRET_KEY="sk_test_sua-chave-secreta-stripe"
STRIPE_WEBHOOK_SECRET="whsec_sua-chave-webhook-stripe"

# Servidor
PORT=3000
```

## 💳 Configuração do Stripe

O projeto utiliza o Stripe para processamento de pagamentos do sistema de impulsão de eventos. Siga os passos abaixo para configurar corretamente:

### 1. Criar conta no Stripe

1. Acesse [https://stripe.com](https://stripe.com)
2. Clique em "Sign up" para criar uma conta
3. Complete o processo de registro
4. Acesse o Dashboard do Stripe

### 2. Obter as chaves da API

1. No Dashboard do Stripe, vá em **Developers** > **API keys**
2. Copie a **Secret key** (começa com `sk_test_` para modo de teste)
3. Adicione esta chave no arquivo `.env` como `STRIPE_SECRET_KEY`

### 3. Instalar o Stripe CLI

#### Windows (usando winget)

```bash
winget install Stripe.StripeCLI
```

#### macOS (usando Homebrew)

```bash
brew install stripe/stripe-cli/stripe
```

#### Linux

```bash
# Baixe o binário diretamente do GitHub
curl -s https://packages.stripe.dev/api/security/keypair/stripe-cli-gpg/public | gpg --dearmor | sudo tee /usr/share/keyrings/stripe.gpg
echo "deb [signed-by=/usr/share/keyrings/stripe.gpg] https://packages.stripe.dev/stripe-cli-debian-local stable main" | sudo tee -a /etc/apt/sources.list.d/stripe.list
sudo apt update
sudo apt install stripe
```

### 4. Configurar o Stripe CLI

1. Faça login no Stripe CLI:

```bash
stripe login
```

2. Inicie o listener de webhooks (em um terminal separado):

```bash
stripe listen --forward-to localhost:3000/webhook/stripe
```

3. **IMPORTANTE**: Copie o webhook signing secret que aparece no terminal (começa com `whsec_`)
4. Adicione este secret no arquivo `.env` como `STRIPE_WEBHOOK_SECRET`

### 5. Testar a configuração

1. Inicie o servidor:

```bash
npm run dev
```

2. Em outro terminal, mantenha o listener do Stripe rodando:

```bash
stripe listen --forward-to localhost:3000/webhook/stripe
```

3. Teste um pagamento usando os cartões de teste do Stripe:
   - **Sucesso**: `4242 4242 4242 4242`
   - **Falha**: `4000 0000 0000 0002`
   - **Requer autenticação**: `4000 0025 0000 3155`

### 6. Cartões de teste do Stripe

Para testar diferentes cenários de pagamento:

| Número do Cartão      | Descrição                   |
| --------------------- | --------------------------- |
| `4242 4242 4242 4242` | Visa - Sucesso              |
| `4000 0000 0000 0002` | Visa - Cartão recusado      |
| `4000 0000 0000 9995` | Visa - Fundos insuficientes |
| `4000 0025 0000 3155` | Visa - Requer autenticação  |
| `5555 5555 5555 4444` | Mastercard - Sucesso        |

**Dados para todos os cartões de teste:**

- **CVV**: Qualquer 3 dígitos (ex: 123)
- **Data de expiração**: Qualquer data futura (ex: 12/25)
- **CEP**: Qualquer CEP válido (ex: 12345-678)

### 7. Monitoramento de webhooks

O Stripe CLI fornece logs detalhados dos webhooks recebidos. Você pode:

- Ver todos os eventos em tempo real
- Reenviar eventos específicos
- Verificar se os webhooks estão sendo processados corretamente

### 8. Produção

Para usar em produção:

1. Ative sua conta Stripe para receber pagamentos reais
2. Substitua as chaves de teste pelas chaves de produção
3. Configure webhooks reais no Dashboard do Stripe apontando para sua URL de produção
4. Use cartões reais para testes finais

### 9. Troubleshooting

**Problemas comuns:**

- **Webhook não recebido**: Verifique se o listener está rodando e se a URL está correta
- **Erro de assinatura**: Confirme se o `STRIPE_WEBHOOK_SECRET` está correto
- **Pagamento não processado**: Verifique os logs do servidor e do Stripe CLI

### 4. Configure o banco de dados

#### Opção 1: Usando Docker Compose

```bash
docker-compose up -d
```

#### Opção 2: PostgreSQL local

- Instale o PostgreSQL
- Crie um banco de dados chamado `focuzevent`
- Configure a `DATABASE_URL` no arquivo `.env`

### 5. Execute as migrações

```bash
npx prisma migrate dev
```

### 6. Popule o banco com dados iniciais

```bash
npm run seed
```

### 7. Inicie o servidor

#### Desenvolvimento

```bash
npm run dev
```

#### Produção

```bash
npm run build
npm start
```

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia o servidor em modo de desenvolvimento
- `npm run build` - Compila o TypeScript para JavaScript
- `npm start` - Inicia o servidor em modo de produção
- `npm run seed` - Popula o banco com dados iniciais
- `npm run lint` - Executa o linter ESLint

## 📊 Modelos de Dados

### Usuario

- `id` - Identificador único
- `nome` - Nome do usuário
- `email` - Email único
- `senha` - Senha criptografada
- `foto_url` - URL da foto de perfil
- `role` - Tipo de usuário (USUARIO/ADMIN)
- `ativo` - Status ativo/inativo

### Evento

- `id` - Identificador único
- `titulo` - Título do evento
- `banner_evento_url` - URL do banner
- `descricao` - Descrição do evento
- `acessos` - Contador de visualizações
- `is_evento_pago` - Se o evento é pago
- `is_impulsonado` - Se está impulsionado
- `latitude/longitude` - Coordenadas geográficas
- `data_hora_inicio/fim` - Datas do evento
- `telefone_contato` - Telefone de contato
- `instagram` - Instagram de contato
- `email_contato` - Email de contato

### ImpulsoEvento

- `id` - Identificador único
- `banner_url` - Banner personalizado
- `valor_total` - Valor total do impulso
- `data_hora_inicio/fim` - Período do impulso
- `metodo_pagamento` - Método de pagamento
- `status_pagamento` - Status do pagamento
- `acessos` - Contador de visualizações

## 🔌 Principais Endpoints

Abaixo está a lista das rotas disponíveis na API com o método HTTP, path, se requer autenticação, e os parâmetros esperados (path params, query params, request body e campos de upload quando aplicável).

Observação: o prefixo base das rotas segue a configuração em `src/app.ts` (ex.: `/auth`, `/eventos`, `/usuarios`, `/impulsos`, `/webhook`, `/admin`, `/estados`, `/cidades`, `/categorias`, `/impulso`).

Autenticação

- POST /auth/register

  - Aut: não
  - Body (JSON): { nome: string, email: string, senha: string }
  - Descrição: cria um novo usuário.

- POST /auth/login

  - Aut: não
  - Body (JSON): { email: string, senha: string }
  - Resposta: { token: string }
  - Descrição: autentica usuário e retorna JWT.

- GET /auth/token/validar
  - Aut: sim (header Authorization: Bearer <token>)
  - Descrição: valida o token e retorna { ok: true }.

Usuários

- GET /usuarios

  - Aut: não
  - Descrição: lista perfis públicos de usuários.

- GET /usuarios/me

  - Aut: sim
  - Descrição: retorna dados do usuário autenticado.

- PATCH /usuarios/me/avatar

  - Aut: sim
  - Tipo: multipart/form-data
  - Field de arquivo: avatar
  - Descrição: atualiza avatar do usuário.

- PATCH /usuarios/me/nome

  - Aut: sim
  - Body (JSON): { nome: string }
  - Descrição: atualiza nome do usuário.

- PATCH /usuarios/me/senha

  - Aut: sim
  - Body (JSON): { senhaAtual: string, novaSenha: string }
  - Descrição: altera senha do usuário.

- DELETE /usuarios/me/delete
  - Aut: sim
  - Descrição: desativa (soft delete) o usuário autenticado.

Eventos (base /eventos)

- POST /eventos/criar

  - Aut: sim
  - Tipo: multipart/form-data
  - Field de arquivo: banner_evento
  - Body (form fields):
    - titulo: string
    - descricao: string
    - dataHoraInicio: ISO datetime string
    - dataHoraFim: ISO datetime string
    - latitude: string (parseFloat)
    - longitude: string (parseFloat)
    - cidadeId: string
    - categoriaEventoId: string
    - isEventoPago: "true" | "false" (será convertido para boolean)
    - telefoneContato?: string
    - instagram?: string (começa com @)
    - emailContato?: string
  - Descrição: cria um evento para o usuário autenticado.

- GET /eventos/todos

  - Aut: não
  - Descrição: lista todos eventos ativos (filtrados por usuário role = USUARIO).

- GET /eventos/cidade

  - Aut: não
  - Query params: ?cidade_id=<cidadeId>
  - Descrição: busca eventos pela cidade informada.

- GET /eventos/me

  - Aut: sim
  - Descrição: retorna eventos do usuário autenticado.

- GET /eventos

  - Aut: não
  - Query params (todos opcionais):
    - cidadeId: string
    - categoriaEventoId: string
    - usuarioId: string
    - pagina: number (página, começa em 1)
    - total: number (itens por página)
    - pesquisaTitulo: string (busca parcial no título)
  - Descrição: busca eventos com filtros e paginação.

- GET /eventos/:eventoId

  - Aut: não
  - Path params: eventoId
  - Descrição: busca evento específico por id (incrementa contador de acessos).

- GET /eventos/todos/impulsionados

  - Aut: não
  - Query params (mesmos que /eventos): cidadeId, categoriaEventoId, usuarioId, pagina, total, pesquisaTitulo
  - Descrição: lista eventos impulsionados válidos (status PAGO e período vigente).

- GET /eventos/unico/impulsionado/:impulsoEventoId

  - Aut: não
  - Path params: impulsoEventoId
  - Descrição: retorna um impulso específico (evento impulsionado) e incrementa acessos.

- PUT /eventos/atualizar/:eventoId

  - Aut: sim
  - Path params: eventoId
  - Tipo: multipart/form-data (opcional file)
  - Field de arquivo (opcional): atualizar_banner_evento
  - Body (JSON or form fields) — TODOS opcionais (patch):
    - titulo?: string
    - descricao?: string
    - dataHoraInicio?: ISO datetime
    - dataHoraFim?: ISO datetime
    - latitude?: string
    - longitude?: string
    - cidadeId?: string
    - categoriaEventoId?: string
    - isEventoPago?: "true" | "false"
    - telefoneContato?: string
    - instagram?: string
    - emailContato?: string
  - Descrição: atualiza campos do evento do usuário autenticado (soft validations aplicadas).

- DELETE /eventos/deletar/:eventoId
  - Aut: sim
  - Path params: eventoId
  - Descrição: faz soft delete (ativo = false) do evento do usuário autenticado.

Impulsos de Evento (base /impulsos)

- POST /impulsos/criar

  - Aut: sim
  - Body (JSON): { eventoId: string, impulsoId: string, dataHoraInicio: ISO datetime, dataHoraFim: ISO datetime }
  - Descrição: cria um registro de impulso e inicia sessão do Stripe Checkout. Retorna { url } para checkout.

- PATCH /impulsos/atualizar/banner/:impulsoId

  - Aut: sim (e middleware que verifica pagamento/permissão)
  - Path params: impulsoId
  - Tipo: multipart/form-data
  - Field de arquivo: banner_evento_impulso
  - Descrição: atualiza o banner do impulso.

- GET /impulsos/me
  - Aut: sim
  - Descrição: retorna impulsos relativos a eventos do usuário autenticado.

Planos de Impulso (base /impulso)

- GET /impulso/plano
  - Aut: não
  - Descrição: retorna os planos de impulso disponíveis.

Admin (base /admin) — todas as rotas exigem autenticação e role ADMIN

- GET /admin/me

  - Aut: sim (Admin)
  - Descrição: retorna informações do admin autenticado.

- PUT /admin/impulso/:impulsoId
  - Aut: sim (Admin)
  - Path params: impulsoId
  - Body: conforme necessidade do endpoint de atualização de impulso (ver controller)
  - Descrição: endpoint administrativo para atualizar impulso.

Webhook

- POST /webhook/stripe
  - Aut: não
  - Tipo: raw body (content-type usado em route: express.raw({ type: "application/json" }))
  - Cabeçalho esperado: stripe-signature (utilizado para validar evento)
  - Descrição: endpoint para receber eventos do Stripe.

Uploads e arquivos

- Arquivos enviados ficam acessíveis em /uploads (ex.: http://localhost:3000/uploads/...)

Notas finais

- Para rotas autenticadas inclua o header: Authorization: Bearer <token>
- Datas devem estar no formato ISO esperado pelos controllers (ex.: 2025-07-30T14:00:00.000Z)
- Se precisar, posso gerar uma tabela mais detalhada com exemplos de requests (curl / JSON) para cada rota.

## 🔒 Segurança

- Autenticação JWT com expiração de 3 horas
- Senhas criptografadas com bcrypt
- Rate limiting para prevenir ataques
- Validação rigorosa de dados com Zod
- Middleware de autenticação em rotas protegidas
- Validação de permissões por role

## 📱 Integração com Frontend

O backend está configurado para trabalhar com um frontend em `http://localhost:5173` (provavelmente Vite/React). As configurações de CORS estão ajustadas para permitir requisições deste domínio.

## 🐳 Docker

O projeto inclui um `docker-compose.yml` para facilitar o desenvolvimento com PostgreSQL:

```bash
docker-compose up -d
```

## 📝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença ISC. Veja o arquivo `package.json` para mais detalhes.

## 👥 Desenvolvedores

- Desenvolvido com ❤️ para facilitar a organização de eventos

## 🆘 Suporte

Para suporte, entre em contato através dos canais oficiais do projeto ou abra uma issue no repositório.
