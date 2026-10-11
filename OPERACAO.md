# Operação do site GEMEDE

## Infraestrutura
O projeto usa React, Vite e Hono, com oRPC, Drizzle/Turso, Better Auth e armazenamento Tigris. Não usa Supabase e não simula essa integração. As credenciais ficam no `.env` da raiz e não são enviadas ao navegador.

## Primeiro acesso da gestão
1. A integrante cria uma conta em `/admin` ou entra com Google.
2. Essa conta continua sem permissão administrativa até liberação explícita.
3. O responsável técnico, com acesso ao projeto e ao banco, executa na raiz:

```bash
bun --env-file=.env scripts/manage-admin.ts grant email-da-integrante
```

Para revogar:

```bash
bun --env-file=.env scripts/manage-admin.ts revoke email-da-integrante
```

O servidor verifica a sessão e a tabela `administrators` em todas as operações de gravação, exclusão e autorização de upload. Não há promoção automática da primeira conta. O banco não é exposto diretamente ao navegador; as credenciais de acesso são exclusivas do servidor. A gestão pode editar todos os tipos de conteúdo pelo painel após a liberação.

## Conteúdo inicial e pendências
- Cinco eventos cadastrados exatamente com nomes, palestrantes e dia/mês fornecidos. Ano, hora e local não foram presumidos.
- Cinco integrantes cadastradas, sem retratos ou biografias inventados.
- SEMEQ com referência de 05 a 09 de outubro, sem ano e sem palestras inventadas. A programação é editável por edição em texto organizado por dia.
- Sete questões educativas com gabarito, explicação e links reais de estudo. Algumas categorias não têm questões e exibem estado vazio. Recomenda-se revisão docente e expansão do banco antes de ampla divulgação.
- Galeria, patrocinadores e notícias aguardam conteúdo oficial.
- Fotografias de campo são ilustrativas, provenientes de resultados do Unsplash; não são registros do GEMEDE.

## Datas
Uma atividade entra no calendário somente com data completa `AAAA-MM-DD` e situação Próximo, Em andamento ou Realizado. A página inicial exclui eventos realizados e datas passadas. “O que tem hoje” usa a data local do dispositivo do visitante. A gestão deve manter a situação dos eventos atualizada; o sistema não presume que as cinco atividades iniciais já aconteceram.

## Fotografias e cartazes
O painel autoriza URLs temporárias para enviar JPEG, PNG ou WebP de até 10 MB diretamente ao bucket Tigris. Depois do envio, salve o registro para publicar. A leitura usa URLs assinadas. Não use SVG ou material sem autorização. Se houver erro CORS no envio, configure o bucket para aceitar PUT e GET da origem publicada do site, com o cabeçalho Content-Type. As credenciais de armazenamento já são fornecidas pela infraestrutura gerenciada.

## Publicação e autenticação
A publicação e o domínio são configurados no painel Runable. Confirme que WEBSITE_URL corresponde à origem final e mantenha BETTER_AUTH_SECRET estável. Google usa o broker gerenciado Runable, sem exigir credenciais próprias do Google. O fluxo Google e uploads ainda precisam de teste com uma conta autorizada na origem final. Recuperação de senha e convites por e-mail não foram implementados.

## Testes realizados
- Build de produção e lint: aprovados.
- Dez telas em desktop (1440 px) e celular (390 px): sem overflow horizontal.
- Busca de evento e modal de detalhes: aprovados.
- Calendário mensal/lista e navegação: aprovados; nenhum evento sem ano foi incluído.
- Quiz: sete questões respondidas, feedback, resultado, revisão e reinício aprovados.
- Navegação móvel: aprovada.
- API sem sessão: acesso e gravação retornam 401.
- Console das páginas visitadas: sem erros JavaScript.

CRUD autenticado, upload real e Google não foram testados ponta a ponta porque nenhuma conta da gestão foi autorizada durante a construção.

## Manutenção
```bash
bun run dev
bun run lint
bun run build
python scripts/verify.py
```
O conteúdo usa registros JSON tipados por categoria na tabela `content`; autenticação possui tabelas próprias e as permissões ficam em `administrators`. O seed é idempotente e não sobrescreve alterações feitas pela gestão.