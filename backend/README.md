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

### Autenticação

- `POST /auth/criar` - Criar usuário
- `POST /auth/logar` - Fazer login
- `GET /auth/verificar` - Verificar token

### Eventos

- `POST /eventos/criar` - Criar evento
- `GET /eventos` - Listar todos os eventos
- `GET /eventos/usuario` - Eventos do usuário
- `GET /eventos/cidade/:cidade_id` - Eventos por cidade
- `GET /eventos/:eventoId` - Buscar evento específico
- `PUT /eventos/:eventoId` - Atualizar evento
- `DELETE /eventos/:eventoId` - Deletar evento

### Impulsão

- `POST /impulsos/criar` - Criar impulso
- `GET /impulsos/usuario` - Impulsos do usuário
- `PUT /impulsos/banner/:impulsoId` - Atualizar banner

### Localização

- `GET /estados` - Listar estados
- `GET /cidades` - Listar cidades
- `GET /cidades/estado/:estadoId` - Cidades por estado

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
