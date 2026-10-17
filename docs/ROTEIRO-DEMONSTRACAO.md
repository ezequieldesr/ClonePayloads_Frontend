# Roteiro executável — ClonePayloads

Vídeo em PT-BR, sem narração, com API real. Use exclusivamente payloads fictícios.

| Cena | Ação na interface | Confirmação |
| --- | --- | --- |
| 1 | Home e Como funciona | API disponível via GET /api/health |
| 2 | Playground e JSON de exemplo | Campos detectados; sugestões de regras |
| 3 | UUID, incremento decimal, timestamp e rotação de valores | Configuração por campo |
| 4 | Gerar três variações | POST /api/generate 200; 3 UUIDs diferentes; 11.25/12.25/13.25; timestamp +1ms; valores circulares |
| 5 | Copiar | JSON real da área de transferência é igual ao resultado |
| 6 | Editar o JSON e gerar sem regras | Configuração anterior é invalidada; campos preservados |

Cenários complementares: JSON inválido, valores fixos vazios, tipo numérico incompatível,
quantidade fora da faixa, 101 campos, corpo excessivo, regra nula, limite de 100 cópias e celular 390×844.
Os quatro cenários estão em e2e/. Eles não usam respostas simuladas da API.

## Reproduzir

1. Inicie o backend Java 21 em http://127.0.0.1:8081.
2. No frontend, configure VITE_API_URL=/ e API_PROXY_TARGET=http://127.0.0.1:8081.
3. Execute npm ci, npm run build e npm run preview (ou npm run dev).
4. Em outro terminal: npx playwright install chromium; npm run test:e2e.
5. Para gravar com pausas e legendas: npm run demo:record.
6. Para converter com FFmpeg instalado: npm run demo:export. FFMPEG_PATH pode indicar o executável.

E2E_BASE_URL altera a URL de navegação local. O guard impede hosts externos no navegador, mas não
substitui a conferência de VITE_API_URL: nunca aponte uma execução de teste para backend de produção.
Os vídeos e PNGs públicos ficam em docs/demo; relatórios técnicos em playwright-report e test-results ficam fora do Git.

A cópia é comparada como JSON para respeitar diferenças de quebra de linha entre Windows e Linux.
A gravação é uma demonstração de produto para o portfólio. Não substitui um vídeo pessoal de introdução
na Fiverr, no qual você precisa aparecer e seguir os requisitos próprios da plataforma.
