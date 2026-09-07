# 1 Falha na requisição HTTP e CORS

## Erro 
-   Access to fetch at 'http://localhost:3001/api/ativos/a1' from origin 'http://localhost:5173' has been blocked by CORS policy
-   GET http://localhost:3001/api/ativos/a1 net::ERR_FAILED
-   Uncaught (in promise) TypeError: Failed to fetch

## Causa
-   Requisições para rotas diferentes. O frontend roda na porta 5173 e o backend na porta 3001. Isso significa que o navegador bloqueia requisições vindas de origens diferentes. O CORS(Cross-Origin Resource Sharing) é um sistema de segurança que flexibiliza essa comunicação entre diferentes rotas, permitindo que elas possam se comunicar entre si ao passar formatos de cabeçalhos especiais.

## Solução
Antes o código continha o seguinte trecho:
export async function detalheAtivo(ativoId: string) {
  const resposta = await fetch(`http://localhost:3001/api/ativos/${ativoId}`);
  return resposta.json();
}

O problema estava na URL, pois enviava uma requisição para a porta 3001.

Depois:
export async function detalheAtivo(ativoId: string) {
  const resposta = await fetch(`${BASE}/ativos/${ativoId}`);
  return resposta.json();
}

# 2 Diversas requisições HTTP (/api/conversas e api/nao-lidas) e Memory Leak

## Causa
-   A ausência da array de dependências fazia com que o "useEffect" fica em loop infinito, assim: (Renderizar > Buscar Dados > Atualizar Estado > Renderizar novamente) se repetia constantemente.

-   (Memory Leak) no setInterval o temporizador de pooling não possuía uma função de limpeza (cleanup), acumulando múltiplos setInterval em execução em background a cada mudança de estado.

## Solução
Para resolver o problema, adicionei a array de dependência "[busca]". Assim, toda vez que uma nova busca for realizada, a função de useEffect será executada novamente.
useEffect(() => {
    api.listarConversas(busca).then((lista) => {
      setConversas(lista);
    });
  }, [busca]);

Descarta o temporizador antigo antes de iniciar um novo.
  useEffect(() => {
    const timer = setInterval(() => {
      api.contarNaoLidas().then((contagem) => setNaoLidas(contagem));
    }, 3000);

    return () => clearInterval(timer);
  }, [conversaAtiva]);

# 3 Multiplas re-requisições para a rota /api/conversas/:id/mensagens

## Causa
- passagem de objetos literais instáveis via props (conversa={{ id, titulo }}). Como o componente pai atualizava seu estado a cada segundo por conta do relógio, o React recriava a referência do objeto na memória. O useEffect do Chat, dependendo da referência do objeto conversa, entendia que o valor havia mudado e disparava uma nova chamada à API. Em outras palavras, o conteúdo do objeto se mantinha o mesmo, mas o endereço na memória não.

## Solução
Alteração na dependência do useEffect, assim monitorando se o endereço de memória é o mesmo ou não, evitando que novos objetos sejam criados sem necessidade.