# Teste ACFS - Objetivo
Desenvolver uma aplicação web que permita o upload de um arquivo Excel e gere um dashboard de vendas semelhante ao modelo apresentado, considerando não apenas a visualização dos dados, mas também a forma como eles são analisados, organizados e apresentados ao usuário.

## Arquitetura

### Frontend
- **React 19.2.0** - Biblioteca principal
- **Tailwind CSS 4.1.18** - Estilização
- **Recharts 3.7.0** - Gráficos e visualizações
- **React Router DOM 7.13.0** - Roteamento
- **Zod 4.3.6** - Validação de schemas
- **Axios 1.13.5** - Client HTTP
- **Supabase JS 2.95.3** - Client banco de dados

### Backend
- **Python** com **FastAPI**
- **Pandas** & **NumPy**

### Infra
- **Supabase** - Banco
- **Vercel** - Deploy
- **Docker** - Containerização da API

## Etapas de Desenvolvimento

### 1. Planejamento Tecnológico
Definição do stack:
- React + Tailwind para interface
- Recharts para visualizações
- Python + FastAPI + Pandas para API e ETL

### 2. Estruturação do Projeto
Configuração de ferramentas

- **ESLint** - Qualidade de código
- **Jest** - Testes com cobertura de +80%
- **Docker** - Ambiente de desenvolvimento da API
- **GitHub Workflows CI** - Integração contínua
- **Husky** - Git hooks (pre-commit, commit-msg, pre-push)
- **Variáveis de ambiente** - Configuração segura
- **Supabase** - Setup do banco de dados

### 3. Desenvolvimento da API

#### Endpoint Principal: `/api/process`
- **Método:** POST
- **Input:** Arquivo XLSX via form-data
- **Processo:**
  1. Recebe o arquivo XLSX
  2. Executa script Python para análise e limpeza
  3. Remove linhas/colunas com dados nulos ou invertidos
  4. Valida integridade dos dados
  5. Salva no Supabase
  6. Retorna JSON com dados tratados

#### Exemplo de Resposta
```json
{
  "status": "success",
  "db_id": "40db1553-a65d-4cea-9e37-fe3be0b30907",
  "data": [
    {
      "Data": "2025-01-13",
      "Categoria": "ASSINATURAS",
      "Codigo_Produto": "AS-1002",
      "Produto": "Plano Basic",
      "Quantidade": 71.0,
      "Receita": 1117294.0,
      "Mes": "Jan"
    }
  ],
  "metadata": {
    "Data": "temporal",
    "Categoria": "categorical",
    "Codigo_Produto": "categorical",
    "Produto": "categorical",
    "Quantidade": "numeric",
    "Receita": "numeric",
    "Mes": "categorical"
  },
  "message": "Data processed and saved successfully"
}
```

#### Características
- API dinâmica que aceita diferentes estruturas de XLSX de vendas
- Deploy na Vercel

### 4. Desenvolvimento do Frontend

#### Funcionalidades
- **Upload de Arquivos:** Input para envio de XLSX
- **Histórico:** Contexto Supabase para listar arquivos salvos
- **Dashboards Dinâmicos:** Rotas geradas automaticamente por arquivo
- **Visualizações:** 2 tipos de gráficos (Pie Chart e Bar Chart)
- **Filtros:** Por Categoria e Mês

#### Arquitetura
- SPA (Single Page Application) escalável
- Context API para gerenciamento de estado
- Rotas dinâmicas com React Router DOM
- Interface responsiva com Tailwind CSS

## Como Executar

### Pré-requisitos
- Node.js v24.13.0
- Docker Desktop (para API local)

### Configuração

#### 1. **Clone o repositório**
```bash
git clone https://github.com/Matheus7p/acfs-teste.git
cd acfs-teste/
```

### 2. Instale as dependências
```bash
npm install
```

#### 3. Configure as variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# SUPABASE (use as credenciais do seu supabase local)
VITE_SUPABASE_URL="http://127.0.0.1:54321"
VITE_SUPABASE_KEY="sua-anon-key-aqui"

SUPABASE_URL="http://127.0.0.1:54321"
SUPABASE_KEY="sua-anon-key-aqui"

# API
VITE_API_URL="http://localhost:8000"
```

> **Nota:** As credenciais do Supabase local serão exibidas no terminal quando você executar `npx supabase start`.

#### 4. Configure o Supabase Local

Este repositório contém uma pasta `/supabase` que gerencia toda a infraestrutura de dados localmente.

**Passos:**

1. **Certifique-se de ter o Docker instalado e rodando**

2. **Inicie o Supabase local:**
```bash
npx supabase start
```
> **Nota:** isso pode levar alguns minutos


3. **Se as tabelas não aparecerem, force o reset para aplicar as migrations:**
```bash
npx supabase db reset
```

4. **Copie as credenciais exibidas no terminal** e atualize seu arquivo `.env.local`

> **Dica:** O comando `npx supabase start` exibirá a `API URL` e a `anon key` que você deve usar nas variáveis de ambiente.
> `anon key` é a `sb_publishable...`

### Executar a Aplicação

#### API (com Docker)
```bash
cd docker
docker compose up --build
```

#### Frontend
```bash
npm run dev
```

### Executar Testes
```bash
npm run test
```
