# 1 Bloqueio de CORS

## Onde está: 
- src/api.ts (linha 43)

## O que acontece e por quê (Mecanismo): 
- A função detalheAtivo utilizava uma URL absoluta (http://localhost:3001/api/...) em vez do caminho relativo (/api/...). Isso fazia a requisição disparar diretamente do navegador (origem http://localhost:5173) para o backend (origem http://localhost:3001). O navegador bloqueou a resposta por política de CORS (Cross-Origin Resource Sharing), pois a porta de origem e a de destino eram diferentes.

## Como foi identificado:
- Log de erro no console do navegador exibindo Access to fetch... has been blocked by CORS policy acompanhado por falha de rede (net::ERR_FAILED).

## Como consertar:
- export async function detalheAtivo(ativoId: string) {
  const resposta = await fetch(`${BASE}/ativos/${ativoId}`);
  return resposta.json();
}

---

# 2 Loop infinito de requisições buscando conversas

## Onde está: 
- src/componentes/MenuLateral.tsx (linha 20)

## O que acontece e por quê (Mecanismo): 
- O useEffect responsável por chamar api.listarConversas(busca) foi declarado sem o array de dependências. Em React, um useEffect sem dependências é executado a cada renderização. A busca atualiza o estado conversas via setConversas(), provocando um novo render, que aciona o useEffect novamente, entrando em um ciclo infinito de chamadas HTTP.

## Como foi identificado:
- Diversas requisições GET /api/conversas?busca= no terminal do backend.

## Como consertar:
- useEffect(() => {
  api.listarConversas(busca).then((lista) => {
    setConversas(lista);
  });
}, [busca]);

---

# 3 Vazamento de memória (Memory Leak) por acúmulo de

## Onde está: 
- src/componentes/MenuLateral.tsx (linhas 22-28)

## O que acontece e por quê (Mecanismo): 
- O useEffect responsável pela contagem de não lidas registrava um setInterval a cada alteração da prop conversaAtiva. Como não havia retorno com função de limpeza (cleanup), os temporizadores antigos continuavam rodando em paralelo no navegador. A cada troca de conversa, um novo timer se somava aos existentes, multiplicando as chamadas para a API.

## Como foi identificado:
- Diversas chamadas GET /api/nao-lidas no terminal do backend.

## Como consertar:
- useEffect(() => {
  const timer = setInterval(() => {
    api.contarNaoLidas().then((contagem) => setNaoLidas(contagem));
  }, 3000);

  return () => clearInterval(timer);
}, [conversaAtiva]);

---

# 4 Re-requisições contínuas de mensagens por instabilidade de objeto em prop

## Onde está: 
- src/componentes/Chat.tsx (linha 19)

## O que acontece e por quê (Mecanismo): 
- O App.tsx atualizava o estado agora a cada segundo e passava a prop de objeto literal. A cada segundo, a referência de memória do objeto conversa mudava. O Chat.tsx escutava [conversa] no seu useEffect, e como a comparação do React por padrão é rasa (=== por endereço de memória), ele interpretava que os dados haviam mudado, refazendo a requisição GET /api/conversas/:id/mensagens continuamente.

## Como foi identificado:
- Requisições contínuas no terminal do backend.

## Como consertar:
- useEffect(() => {
  api.listarMensagens(conversa.id).then((resposta) => {
    setMensagens(resposta.mensagens);
  });
}, [conversa.id]);

---

# 5 Crash fatal no servidor Node.js ao consultar mensagens de conversa vazia

## Onde está: 
- server/index.js (linha 49)

## O que acontece e por quê (Mecanismo): 
- Quando uma conversa não possui mensagens, a lista é vazia ([]), resultando na variável ultima como undefined. Em seguida, o backend tenta acessar ultima.criadoEm (equivalente a undefined.criadoEm), lançando uma exceção não tratada TypeError que derruba o processo Node.js.

## Como foi identificado:
- Queda da API juntamente com o erro no terminal do backend: TypeError: Cannot read properties of undefined (reading 'criadoEm') na linha 49.

## Como consertar:
- res.json({
    mensagens,
    total: mensagens.length,
    ultimaEm: ultima?.criadoEm || null,
  });