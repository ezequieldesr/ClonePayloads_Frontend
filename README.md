# ClonePayload

## Sobre 📖

ClonePayload permite que você insira um payload JSON contendo um timestamp e gere múltiplas cópias com timestamps incrementados automaticamente. Ideal para testes de APIs, simulações de dados e geração de payloads em lote.

---

## ⚠️ Uso Local (Importante!)

Para rodar localmente:

### ✔ Frontend deve rodar na porta **8080**  
### ✔ Backend deve rodar na porta **8081**

Sem isso o frontend não vai conseguir acessar a API do backend local.
---

## Funcionalidades 📚

- **Geração em lote**: Gere de 2 a 100 cópias de um payload JSON
- **Incremento automático de timestamps**: Cada payload gerado tem seu timestamp incrementado
- **Validação em tempo real**: Validação instantânea de JSON e regras de negócio
- **Interface moderna**: Design inspirado em JWT.io com tema escuro
- **Copiar com um clique**: Copie toda a resposta JSON para a área de transferência
---
## Regras de Validação 🚨

| Campo | Regra | Mensagem de Erro |
|-------|-------|------------------|
| Quantidade | Mínimo: 2 | "A quantidade tem que ser maior ou igual a 2" |
| Quantidade | Máximo: 100 | "A quantidade máxima permitida é 100" |
| Payload | Obrigatório | "O payload não pode ser nulo/vazio" |
| Payload | Máximo: 100 campos | "A quantidade máxima de campos no payload é 100" |
| Timestamp | Obrigatório | "O timestamp tem que estar presente no payload" |
| Timestamp | Formato ISO-8601 | "O timestamp deve estar no formato ISO-8601" |
---
## Tecnologias ⚙️

### Frontend
- **React + TypeScript**
- **Tailwind CSS**
- **Shadcn/ui**
- **React Hook Form + Zod**

---

## Desenvolvimento Local 📂

```bash
# Clonar o projeto do github
git clone https://github.com/ezequieldesr/ClonePayloads_Frontend.git

# Abrir o projeto
cd ClonePayloads_Frontend

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```
