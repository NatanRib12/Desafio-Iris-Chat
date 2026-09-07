import { useEffect, useRef, useState } from 'react';
import * as api from '../api';
import { Mensagem } from './Mensagem';

type Props = {
  conversa: { id: string; titulo: string };
};

export function Chat({ conversa }: Props) {
  const [mensagens, setMensagens] = useState<any[]>([]);
  const [texto, setTexto] = useState('');
  const [enviando, setEnviando] = useState(false);
  const fimDaLista = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.listarMensagens(conversa.id).then((resposta) => {
      setMensagens(resposta.mensagens);
    });
  }, [conversa.id]);

  useEffect(() => {
    if (fimDaLista.current) {
      fimDaLista.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [mensagens]);

  async function enviar() {
    if (texto.trim() === '') return;

    const otimista = {
      id: 'local-' + Date.now(),
      conversaId: conversa.id,
      autor: 'usuario',
      texto: texto,
      criadoEm: new Date().toISOString(),
    };

    setMensagens([...mensagens, otimista]);
    setEnviando(true);

    const resultado = await api.enviarMensagem(conversa.id, texto);

    setMensagens((atuais) => [...atuais, resultado.mensagem, resultado.resposta]);
    setEnviando(false);
  }

  function aoTeclar(evento: any) {
    if (evento.key === 'Enter') {
      enviar();
    }
  }

  return (
    <section className="chat">
      <div className="chat-topo">
        <h2>{conversa.titulo}</h2>
        <span className="chat-contador">{mensagens.length} mensagens</span>
      </div>

      <div className="chat-mensagens">
        {mensagens.map((mensagem, indice) => (
          <Mensagem key={indice} mensagem={mensagem} />
        ))}
        <div ref={fimDaLista} />
      </div>

      <div className="chat-envio">
        <input
          className="chat-input"
          placeholder="pergunte sobre o ativo desta conversa"
          value={texto}
          onChange={(evento) => setTexto(evento.target.value)}
          onKeyDown={aoTeclar}
        />
        <button className="chat-botao" onClick={enviar}>
          enviar
        </button>
      </div>
    </section>
  );
}
