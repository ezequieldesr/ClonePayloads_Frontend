# Publicar ClonePayloads na Fiverr — PT-BR

Material preparado localmente. Nenhuma publicação ou alteração de perfil foi feita pela sessão.

## Campos

Nome do projeto: **ClonePayloads — Gerador de JSON para testes** (43/50 caracteres).
Setor: escolha os equivalentes disponíveis para Tecnologia, Software e Serviços de TI. Não é necessário preencher seis setores.
Início: **junho de 2026**. Período informado: junho a julho de 2026; duração aproximada: **2 meses**.
Custo: **a confirmar**. Não foi informado valor recebido ou confirmado se houve contratação.
Se foi totalmente pessoal e o formulário aceitar, use US$0; não apresente estimativa como receita real.

## Descrição para copiar (1116/1400 caracteres)

ClonePayloads é uma ferramenta web para gerar variações de dados JSON usados em testes de APIs e simulação de eventos.

O objetivo foi reduzir o trabalho repetitivo de editar exemplos manualmente. O usuário informa um JSON, detecta os campos e escolhe regras: incrementar timestamps, somar valores numéricos, gerar UUIDs ou alternar valores de uma lista. O resultado pode ser copiado e reutilizado em outros testes.

O principal desafio foi manter as regras consistentes entre interface e API, preservar valores decimais e apresentar mensagens úteis para entradas inválidas. Integrei React e TypeScript a uma API Java 21 com Spring Boot, incluindo validação e limites por requisição.

A demonstração mostra a geração real de dados, configuração por campo e cópia do resultado. Testes automatizados verificam estratégias, limites, erros e navegação em celular. Pipelines no GitHub apoiam a revisão de futuras alterações.

Projeto de portfólio desenvolvido entre junho e julho de 2026. A ferramenta não precisa de banco de dados e não executa testes de carga: ela prepara os dados para serem usados em outros sistemas.

## Ordem dos anexos

1. 01-capa-clonepayloads.png — 1024×768, PT-BR, telas reais.
2. 02-demonstracao.mp4 — vídeo do projeto em PT-BR, sem narração.
3. 03-regras.png — estratégias por campo.
4. 04-resultado.png — dados gerados pela API.
5. 05-validacao.png — mensagem para entrada incompatível.

Cada arquivo está abaixo de 50 MB. Envie a capa primeiro, confira a miniatura e finalize a publicação
no seu perfil Fiverr. Não envie o HTML fonte da capa como anexo.
O vídeo é demonstração de produto; não substitui o vídeo pessoal de introdução exigindo sua presença.

## Sugestão de serviço associado

“Vou desenvolver sua API Java para processamento de dados JSON”.
Defina número de endpoints, regras, validações, documentação e revisões em cada proposta.
Não prometa integrações com Kafka ou testes de carga como funcionalidades já existentes do ClonePayloads.

## About dos repositórios

Backend: API REST em Java 21 e Spring Boot para gerar variações de JSON com regras por campo, validação de entradas e testes automatizados. Sem banco de dados.
Frontend: Ferramenta React e TypeScript para gerar dados JSON de teste, configurar estratégias por campo e copiar resultados de uma API Java, com testes Playwright e CI.

Topics backend: java, spring-boot, rest-api, json, test-data, junit, docker, github-actions.
Topics frontend: react, typescript, vite, tailwindcss, json, playwright, portfolio, github-actions.

## Reprodução

Consulte README.md, docs/ROTEIRO-DEMONSTRACAO.md e docs/CI-SEGURANCA.md.
Os serviços locais são frontend 8080 e backend 8081; não é necessário banco.
