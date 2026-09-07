# IRIS Chat, parte 1 do desafio

Versão pequena do chat do IRIS: um menu lateral com as conversas e os ativos da fábrica, um
chat com o agente no meio e um painel do ativo à direita. É um app React falando com uma API
Express.

**O app funciona e está cheio de problema.** Ele trava, faz requisição demais, uma parte
nunca carrega e a API cai sozinha. Seu trabalho é descobrir por quê e consertar.

---

## Como rodar

```bash
npm install
npm run dev
```

Isso sobe as duas coisas de uma vez: a API em `http://localhost:3001` e o front em
`http://localhost:5173`. Abra o front no navegador.

Se a API cair (você vai ver), é só `Ctrl+C` e `npm run dev` de novo.

## O que tem em cada pasta

```
server/
  index.js      rotas da API
  dados.js      leitura e escrita dos dados
  seed.json     dados iniciais (conversas, mensagens, ativos)
src/
  App.tsx              estrutura da tela
  api.ts               todas as chamadas para a API
  componentes/
    Cabecalho.tsx      barra de cima
    MenuLateral.tsx    lista de conversas + busca
    ListaAtivos.tsx    lista de ativos do menu
    Chat.tsx           conversa e envio de mensagem
    Mensagem.tsx       uma mensagem
    DetalheAtivo.tsx   painel da direita
```

Não precisa de banco de dados. Os dados ficam num arquivo JSON que a API cria sozinha na
primeira execução (`server/dados.json`). Para voltar do zero, apague esse arquivo.

---

## O que já foi relatado

Isto é o que as pessoas que usaram reclamaram. Nenhum item foi investigado:

1. "Depois de uns segundos com a página aberta o notebook começa a ventilar e a tela trava."
2. "Quanto mais eu clico nas conversas, mais lento fica. Se eu recarrego, melhora um pouco."
3. "O painel da direita fica escrito **carregando...** para sempre."
4. "Cliquei na conversa *Nova conversa* e o chat parou de funcionar. Tive que reiniciar tudo."
5. "Mando uma mensagem e ela aparece duas vezes."
6. "O IRIS responde, eu recarrego a página e a resposta dele sumiu."
7. "Procurei por `prensa` na busca e não achou nada. Com `Prensa` achou."
8. "O número na bolinha azul da conversa nunca zera, e o número está errado."
9. "Enquanto eu leio uma mensagem antiga, a tela pula sozinha para o final."
10. "Depois de enviar, o texto continua escrito no campo e eu mando repetido sem querer."

A lista não está completa. Tem problema que ninguém percebeu ainda.

---

## O que fazer

### 1. Investigue

Abra o **DevTools** do navegador (F12) e deixe aberto enquanto usa o app:

- Aba **Network**: quantas requisições o app faz? Para onde? Com que frequência?
- Aba **Console**: tem erro em vermelho? O que ele diz?
- Terminal onde a API está rodando: ela imprime cada requisição que recebe.

Use o app como um usuário usaria: clique nas conversas, digite na busca, mande mensagem,
troque de ativo. Repare no que acontece.

### 2. Escreva um `RELATORIO.md`

Para cada problema que achar:

- **onde está** (arquivo e linha)
- **o que acontece** e **por que acontece**, ou seja o mecanismo e não o sintoma
- **como você descobriu** (o que viu no Network, no Console, no código)
- **como consertar**

Não precisa achar tudo. Prefiro 8 problemas bem explicados do que 25 listados sem explicação.

### 3. Conserte

Corrija os problemas que você achou, um commit por problema, com a mensagem dizendo qual era
a causa. Se não conseguir consertar algum, escreva no relatório o que você tentou e onde
travou. Isso é informação útil, não confissão de fracasso.

---

## Combinados

- Pode pesquisar, ler documentação e usar IA à vontade. Só não traga resposta que você não
  consegue explicar, porque ela não te serve para nada no dia seguinte.
- Não reescreva o projeto. Não troque React por outra coisa, não adicione biblioteca de
  requisição, não instale nada além do que já está no `package.json`, a não ser que você
  explique no relatório por que precisou. Consertar código dos outros é a parte difícil, e é
  ela que estamos treinando aqui.
- Se achar que alguma coisa é problema mas não tem certeza, escreva assim mesmo e marque como
  dúvida.
- Uns 4 a 6 horas de trabalho. Não vire a noite. Se der tempo só para metade, faça a metade
  bem-feita e diga o que ficou de fora.
- Travou por mais de meia hora no mesmo ponto? Me chama.

## Duas dicas para começar

- Quase todos os problemas de "está lento" ou "trava" aparecem na aba Network como requisição
  repetida. Comece por lá: **conte** as requisições.
- No React, um `useEffect` roda de novo dependendo do que está no array de dependências dele.
  Se esse array está errado, faltando ou tem algo que muda a cada renderização, o efeito roda
  muito mais vezes do que deveria. Vale reler a documentação do `useEffect` antes de começar.
