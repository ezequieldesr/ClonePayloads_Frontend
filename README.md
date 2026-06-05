# ClonePayload

## Sobre 📖

ClonePayload é uma ferramenta web para geração automática de payloads JSON.

A partir de um único payload, é possível gerar até 100 clones aplicando estratégias específicas por campo.

Ideal para testes de APIs, simulação de eventos, geração de massa de dados e cenários de carga.

---

## ⚠️ Uso Local (Importante!)

Para rodar localmente:

### ✔ Frontend deve rodar na porta 8080
### ✔ Backend deve rodar na porta 8081

Sem isso o frontend não conseguirá acessar a API local.

---

## Funcionalidades 📚

- Geração de até 100 payloads por requisição
- Configuração de estratégias por campo
- Detecção automática de campos do JSON
- Playground em tempo real
- Validação instantânea
- Copiar resultado com um clique
- Interface responsiva

---

## Estratégias Disponíveis 🚀

### TIMESTAMP_INCREMENT

Incrementa timestamps ISO-8601.

### NUMERIC_INCREMENT

Incrementa valores numéricos.

### UUID

Gera UUIDs únicos.

### FIXED_VALUES

Rotaciona valores definidos pelo usuário.

---

## Regras de Validação 🚨

| Campo | Regra |
|---------|---------|
| Quantidade | Mínimo: 2 |
| Quantidade | Máximo: 100 |
| Payload | Obrigatório |
| Payload | Máximo: 100 campos |
| TIMESTAMP_INCREMENT | ISO-8601 obrigatório |
| NUMERIC_INCREMENT | Campo numérico |
| UUID | Campo String |
| FIXED_VALUES | Lista não vazia |

---

## Tecnologias ⚙️

### Frontend

- React
- TypeScript
- Tailwind CSS
- Shadcn/ui
- React Hook Form
- Zod
- Vite

---

## Desenvolvimento Local 📂

```bash
git clone https://github.com/ezequieldesr/ClonePayloads_Frontend.git

cd ClonePayloads_Frontend

npm install

npm run dev
```

Aplicação disponível em:

```bash
http://localhost:8080
```

Backend esperado:

```bash
http://localhost:8081/api/generate
```

---

## Como utilizar

### 1. Cole um payload JSON

```json
{
  "userId": "abc",
  "score": 10,
  "timestamp": "2025-12-04T15:40:12.487Z"
}
```

### 2. Detecte os campos

Clique em:

```text
Detectar Campos e Configurar Regras
```

### 3. Escolha as estratégias

Exemplo:

```text
userId → UUID

score → NUMERIC_INCREMENT

timestamp → TIMESTAMP_INCREMENT
```

### 4. Defina a quantidade

```text
2 até 100 clones
```

### 5. Gere os payloads

A resposta será exibida em tempo real.

---

## 🌐 Projeto Online

Frontend:

https://clone-payloads.vercel.app

Backend:

https://clonepayloads.onrender.com/api/generate
