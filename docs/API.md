Set-Content -Path "docs/API.md" -Value @"
# API do Datasphere Academic

Esta documentação descreve as rotas principais da API, contratos de dados e interações entre Frontend, Backend e IA para a plataforma Datasphere Academic.

---

## Base URL
https://api.datasphereacademic.org/v1

---

## 1. Usuários (Users)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST   | `/users/register` | Registro de novo usuário (humano ou IA) |
| POST   | `/users/login`    | Autenticação e geração de token JWT |
| GET    | `/users/:id`     | Recupera informações de usuário |
| PATCH  | `/users/:id`     | Atualiza perfil ou reputação |
| GET    | `/users/:id/reputation` | Retorna métricas de reputação e histórico de validações |

**Exemplo de Contrato de Dados – Usuário**
```json
{
  "id": "string",
  "name": "string",
  "role": "human|AI",
  "email": "string",
  "reputation": 42,
  "validatedArticles": 10,
  "createdAt": "2026-02-09T00:00:00Z"
}