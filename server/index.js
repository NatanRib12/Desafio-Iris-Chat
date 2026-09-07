import express from 'express';
import * as dados from './dados.js';

const app = express();
const PORTA = 3001;

app.use(express.json());

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

function esperar(ms) {
  return new Promise((resolver) => setTimeout(resolver, ms));
}

app.get('/api/status', (req, res) => {
  res.json({ ok: true, versao: '0.2.0' });
});

app.get('/api/conversas', async (req, res) => {
  await esperar(600);

  const lista = dados.listarConversas(req.query.busca);

  res.json(lista);
});

app.get('/api/conversas/:id', (req, res) => {
  const conversa = dados.conversaPorId(req.params.id);

  if (!conversa) {
    return res.status(404).json({ erro: 'conversa nao encontrada' });
  }

  res.json(conversa);
});

app.get('/api/conversas/:id/mensagens', async (req, res) => {
  await esperar(400);

  const mensagens = dados.mensagensDaConversa(req.params.id);
  const ultima = mensagens[mensagens.length - 1];

  res.json({
    mensagens,
    total: mensagens.length,
    ultimaEm: ultima?.criadoEm || null,
  });
});

app.post('/api/conversas/:id/mensagens', async (req, res) => {
  const { texto } = req.body;

  const mensagem = dados.adicionarMensagem(req.params.id, 'usuario', texto);

  await esperar(1500);

  const resposta = dados.responderComoAgente(req.params.id, texto);

  res.status(201).json({ mensagem, resposta });
});

app.get('/api/nao-lidas', (req, res) => {
  res.json(dados.contarNaoLidas());
});

app.post('/api/conversas/:id/lida', (req, res) => {
  res.json(dados.marcarComoLida(req.params.id));
});

app.get('/api/ativos', async (req, res) => {
  await esperar(300);
  res.json(dados.listarAtivos());
});

app.get('/api/ativos/:id', async (req, res) => {
  await esperar(900);

  const ativo = dados.ativoPorId(req.params.id);

  res.json({ dados: ativo });
});

app.get('/api/ativos/:id/leituras', async (req, res) => {
  await esperar(700);
  res.json(dados.leiturasDoAtivo(req.params.id));
});

app.listen(PORTA, () => {
  console.log(`API do IRIS Chat em http://localhost:${PORTA}`);
});
