Desenvolvi uma aplicação web que permita o upload de um arquivo Excel e gere um dashboard, considerando não apenas a visualização dos dados, mas também a forma como eles são analisados, organizados e apresentados ao usuário.

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

