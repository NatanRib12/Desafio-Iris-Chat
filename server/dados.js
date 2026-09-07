import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const aqui = path.dirname(fileURLToPath(import.meta.url));
const arquivo = path.join(aqui, 'dados.json');
const semente = path.join(aqui, 'seed.json');

let cache = null;

export function carregar() {
  if (cache) return cache;

  if (!fs.existsSync(arquivo)) {
    fs.copyFileSync(semente, arquivo);
  }

  cache = JSON.parse(fs.readFileSync(arquivo, 'utf8'));
  return cache;
}

function salvar() {
  fs.writeFile(arquivo, JSON.stringify(cache, null, 2), () => {});
}

export function listarConversas(busca) {
  const dados = carregar();

  const ordenadas = dados.conversas.sort((a, b) => (a.atualizadoEm < b.atualizadoEm ? 1 : -1));

  if (!busca) return ordenadas;

  return ordenadas.filter((conversa) => conversa.titulo.includes(busca));
}

export function conversaPorId(id) {
  const dados = carregar();
  return dados.conversas.find((conversa) => conversa.id === id);
}

export function mensagensDaConversa(id) {
  const dados = carregar();
  return dados.mensagens.filter((mensagem) => mensagem.conversaId === id);
}

export function adicionarMensagem(conversaId, autor, texto) {
  const dados = carregar();

  const mensagem = {
    id: 'm' + Date.now(),
    conversaId,
    autor,
    texto,
    criadoEm: new Date().toISOString(),
  };

  dados.mensagens.push(mensagem);

  const conversa = dados.conversas.find((item) => item.id === conversaId);
  conversa.atualizadoEm = mensagem.criadoEm;

  salvar();
  return mensagem;
}

export function responderComoAgente(conversaId, pergunta) {
  const dados = carregar();

  const resposta = {
    id: 'm' + Date.now(),
    conversaId,
    autor: 'agente',
    texto: montarResposta(dados, conversaId, pergunta),
    criadoEm: new Date().toISOString(),
  };

  const atualizado = { ...dados, mensagens: dados.mensagens.concat(resposta) };
  fs.writeFile(arquivo, JSON.stringify(atualizado, null, 2), () => {});

  return resposta;
}

function montarResposta(dados, conversaId, pergunta) {
  const conversa = dados.conversas.find((item) => item.id === conversaId);
  const ativo = dados.ativos.find((item) => item.id === conversa.ativoId);
  const texto = pergunta.toLowerCase();

  if (texto.includes('temperatura')) {
    return `${ativo.nome} (${ativo.codigo}) esta com ${ativo.temperatura} C agora. A media das ultimas 24 horas ficou proxima disso, sem degrau brusco.`;
  }

  if (texto.includes('vibra')) {
    return `A vibracao de ${ativo.nome} esta em ${ativo.vibracao} mm/s. Acima de 7.1 mm/s a ISO 10816 ja considera zona de dano para essa classe.`;
  }

  if (texto.includes('corrente') || texto.includes('consumo')) {
    return `${ativo.nome} esta puxando ${ativo.corrente} A. Comparado com a media da linha ${ativo.linha}, isso e um desvio pequeno.`;
  }

  if (texto.includes('alerta')) {
    return `${ativo.nome} tem ${ativo.alertas} alerta(s) aberto(s) e esta com estado ${ativo.estado}.`;
  }

  return `Sobre ${ativo.nome}: estado ${ativo.estado}, ${ativo.temperatura} C, ${ativo.vibracao} mm/s, ${ativo.corrente} A. Pergunte por temperatura, vibracao, corrente ou alertas para eu detalhar.`;
}

export function listarAtivos() {
  return carregar().ativos;
}

export function ativoPorId(id) {
  return carregar().ativos.find((ativo) => ativo.id === id);
}

export function leiturasDoAtivo(id) {
  const ativo = ativoPorId(id);
  const serie = [];

  for (let i = 23; i >= 0; i--) {
    serie.push({
      hora: `${String(23 - i).padStart(2, '0')}:00`,
      temperatura: Number((ativo.temperatura - Math.sin(i / 3) * 6).toFixed(1)),
      vibracao: Number((ativo.vibracao - Math.sin(i / 5) * 1.2).toFixed(2)),
    });
  }

  return serie;
}

export function contarNaoLidas() {
  const dados = carregar();
  const contagem = {};

  for (const conversa of dados.conversas) {
    contagem[conversa.id] = dados.mensagens.filter(
      (mensagem) => mensagem.conversaId === conversa.id,
    ).length;
  }

  return contagem;
}

export function marcarComoLida(conversaId) {
  const dados = carregar();
  const conversa = dados.conversas.find((item) => item.id === conversaId);
  conversa.lidaEm = new Date().toISOString();
  salvar();
  return conversa;
}
