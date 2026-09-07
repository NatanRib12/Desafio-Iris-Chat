import { useEffect, useState } from 'react';
import * as api from '../api';
import { ListaAtivos } from './ListaAtivos';

type Props = {
  conversaAtiva: string;
  onSelecionarConversa: (conversa: any) => void;
  onSelecionarAtivo: (ativo: any) => void;
};

export function MenuLateral({ conversaAtiva, onSelecionarConversa, onSelecionarAtivo }: Props) {
  const [conversas, setConversas] = useState<any[]>([]);
  const [busca, setBusca] = useState('');
  const [naoLidas, setNaoLidas] = useState<any>({});

  useEffect(() => {
    api.listarConversas(busca).then((lista) => {
      setConversas(lista);
    });
  });

  useEffect(() => {
    setInterval(() => {
      api.contarNaoLidas().then((contagem) => setNaoLidas(contagem));
    }, 3000);
  }, [conversaAtiva]);

  function abrir(conversa: any) {
    onSelecionarConversa(conversa);
    api.marcarComoLida(conversa.id);
  }

  return (
    <aside className="menu">
      <div className="menu-secao">
        <div className="menu-titulo">Conversas</div>

        <input
          className="busca"
          placeholder="buscar conversa"
          value={busca}
          onChange={(evento) => setBusca(evento.target.value)}
        />

        <ul className="lista-conversas">
          {conversas.map((conversa, indice) => (
            <li
              key={indice}
              className={conversa.id === conversaAtiva ? 'conversa ativa' : 'conversa'}
              onClick={() => abrir(conversa)}
            >
              <span className="conversa-titulo">{conversa.titulo}</span>

              {naoLidas[conversa.id] > 0 && (
                <span className="badge">{naoLidas[conversa.id]}</span>
              )}
            </li>
          ))}
        </ul>

        {conversas.length === 0 && <div className="vazio">nenhuma conversa</div>}
      </div>

      <div className="menu-secao">
        <div className="menu-titulo">Ativos monitorados</div>
        <ListaAtivos onSelecionar={onSelecionarAtivo} />
      </div>
    </aside>
  );
}
