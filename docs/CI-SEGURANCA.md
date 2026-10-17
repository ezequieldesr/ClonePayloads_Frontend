# CI e segurança

Os dois repositórios possuem CI de testes/build, Dependency Review, CodeQL e Dependabot.
Actions fixadas por SHA, token com leitura por padrão, checkout sem credenciais persistidas,
limites de tempo e cancelamento de execuções antigas. Não há deploy automático nem segredos de produção.

## Checks obrigatórios sugeridos

Backend: `Backend tests and Docker`, `Dependency review`, `CodeQL analysis`.
Frontend: `Frontend tests and build`, `Dependency audit`, `Playwright with API`, `Dependency review`, `CodeQL analysis`.

Após enviar os arquivos e executar os workflows, configure Settings > Rules > Rulesets para main:
exigir PR, checks aprovados, resolução das conversas; bloquear exclusão e force push.
Trabalhando sozinho, deixe aprovações obrigatórias em zero para não bloquear seus próprios PRs.
CodeQL publica alertas; sucesso do job não implica ausência de vulnerabilidades. Configure as regras de code scanning se quiser bloquear por alertas.
Dependency Review exige dependency graph. Repositórios privados podem exigir licença/configuração para os scanners.

## Integração

O frontend do PR é testado contra a main pública de ClonePayloads_Backend, com Java 21 e a API local em 8081.
Não é necessário banco de dados. Envie as alterações de backend primeiro: /api/health e validações novas
precisam estar nessa main antes do CI E2E do frontend. PR de backend ainda não integrado não é testado por esse job.
A integração roda em ambiente descartável, sem atingir os serviços públicos existentes.

Traces, payloads e relatórios de navegador não são enviados como artefatos públicos por padrão.
Dependabot faz propostas semanais; atualizações principais de TypeScript e Spring Boot exigem migração planejada.
Use npm e package-lock.json no frontend; o lock Bun antigo foi removido para evitar resoluções divergentes.

## Revisão executada

- API limita 2–100 clones, até 100 campos/regras e até 64 KiB de corpo.
- Regras e listas são validadas, inclusive elementos nulos e tipos incompatíveis.
- NUMERIC_INCREMENT preserva a parte decimal.
- UUID exige campo String existente.
- fieldRoles omitido mantém o comportamento legado de incrementar timestamp; lista vazia preserva todos os campos.
- Erros inesperados não expõem a mensagem interna da exceção.
- Headers nosniff, frame DENY e referrer no-referrer na API.
- CORS suporta origens explícitas separadas por vírgula; CORS não é autenticação.
- Docker executa os testes e usa usuário sem privilégios.
- Os valores privados do .env não foram inspecionados, modificados ou publicados; exemplos não contêm credenciais.
- Vite, Tailwind e dependências foram atualizados; auditoria npm sem alertas conhecidos na validação local.

## Limites conhecidos

A API é pública, sem autenticação nem rate limiting distribuído. Limites por requisição não impedem
requisições repetidas ou ataques de volume. Antes de disponibilizar a terceiros em escala, adicione
limites na borda, monitoramento, quotas e controles de acesso conforme o caso.
O resultado não é salvo em banco; permanece na resposta e na aba do navegador. Não cole tokens,
segredos ou dados pessoais reais no playground. Não há integração com Kafka nem execução de testes de carga:
a ferramenta gera os dados que podem ser usados por outros sistemas.
A validação do backend aqui é funcional e de limites, não uma auditoria exaustiva de vulnerabilidades transitivas Maven.
CodeQL e Dependency Review precisam executar no GitHub após o push; a sintaxe foi validada localmente com actionlint.
