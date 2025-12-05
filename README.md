# ClonePayload

Uma aplicação web moderna para gerar payloads JSON clonados com timestamps incrementados.

## Sobre

ClonePayload permite que você insira um payload JSON contendo um timestamp e gere múltiplas cópias com timestamps incrementados automaticamente. Ideal para testes de APIs, simulações de dados e geração de payloads em lote.

## Funcionalidades

- **Geração em lote**: Gere de 2 a 100 cópias de um payload JSON
- **Incremento automático de timestamps**: Cada payload gerado tem seu timestamp incrementado
- **Validação em tempo real**: Validação instantânea de JSON e regras de negócio
- **Interface moderna**: Design inspirado em JWT.io com tema escuro
- **Copiar com um clique**: Copie toda a resposta JSON para a área de transferência

## Regras de Validação

| Campo | Regra | Mensagem de Erro |
|-------|-------|------------------|
| Quantidade | Mínimo: 2 | "A quantidade tem que ser maior ou igual a 2" |
| Quantidade | Máximo: 100 | "A quantidade máxima permitida é 100" |
| Payload | Obrigatório | "O payload não pode ser nulo/vazio" |
| Payload | Máximo: 100 campos | "A quantidade máxima de campos no payload é 100" |
| Timestamp | Obrigatório | "O timestamp tem que estar presente no payload" |
| Timestamp | Formato ISO-8601 | "O timestamp deve estar no formato ISO-8601" |

## Exemplo de Uso

### Payload de Entrada
```json
{
  "id": 1,
  "nome": "Exemplo",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Resposta (quantidade: 3)
```json
{
  "payloads": [
    { "id": 1, "nome": "Exemplo", "timestamp": "2024-01-15T10:30:00Z" },
    { "id": 1, "nome": "Exemplo", "timestamp": "2024-01-15T10:30:01Z" },
    { "id": 1, "nome": "Exemplo", "timestamp": "2024-01-15T10:30:02Z" }
  ]
}
```

## Tecnologias

### Frontend
- React + TypeScript
- Tailwind CSS
- Shadcn/ui
- React Hook Form + Zod

### Backend
- Spring Boot
- Java

## API

**Endpoint:** `POST https://clonepayloads.onrender.com/api/generate`

**Request Body:**
```json
{
  "quantidade": 5,
  "payload": {
    "timestamp": "2024-01-15T10:30:00Z",
    "dados": "exemplo"
  }
}
```

## Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

## Licença

MIT
