# 1 Falha na requisição HTTP e CORS

## Erro 
-   Access to fetch at 'http://localhost:3001/api/ativos/a1' from origin 'http://localhost:5173' has been blocked by CORS policy
-   GET http://localhost:3001/api/ativos/a1 net::ERR_FAILED
-   Uncaught (in promise) TypeError: Failed to fetch

## Causa
Requisições para rotas diferentes. O frontend roda na porta 5173 e o backend na porta 3001. Isso significa que o navegador bloqueia requisições vindas de origens diferentes. O CORS(Cross-Origin Resource Sharing) é um sistema de segurança que flexibiliza essa comunicação entre diferentes rotas, permitindo que elas possam se comunicar entre si ao passar formatos de cabeçalhos especiais.

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

