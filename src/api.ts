const BASE = '/api';

export async function status() {
  const resposta = await fetch(`${BASE}/status`);
  return resposta.json();
}

export async function listarConversas(busca: string) {
  const resposta = await fetch(`${BASE}/conversas?busca=${busca}`);
  return resposta.json();
}

export async function listarMensagens(conversaId: string) {
  const resposta = await fetch(`${BASE}/conversas/${conversaId}/mensagens`);
  return resposta.json();
}

export async function enviarMensagem(conversaId: string, texto: string) {
  const resposta = await fetch(`${BASE}/conversas/${conversaId}/mensagens`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ texto }),
  });
  return resposta.json();
}

export async function contarNaoLidas() {
  const resposta = await fetch(`${BASE}/nao-lidas`);
  return resposta.json();
}

export async function marcarComoLida(conversaId: string) {
  const resposta = await fetch(`${BASE}/conversas/${conversaId}/lida`, { method: 'POST' });
  return resposta.json();
}

export async function listarAtivos() {
  const resposta = await fetch(`${BASE}/ativos`);
  return resposta.json();
}

export async function detalheAtivo(ativoId: string) {
  const resposta = await fetch(`${BASE}/ativos/${ativoId}`);
  return resposta.json();
}

export async function leiturasDoAtivo(ativoId: string) {
  const resposta = await fetch(`${BASE}/ativos/${ativoId}/leituras`);
  return resposta.json();
}
