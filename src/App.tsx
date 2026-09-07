import { useEffect, useState } from 'react';
import { Cabecalho } from './componentes/Cabecalho';
import { MenuLateral } from './componentes/MenuLateral';
import { Chat } from './componentes/Chat';
import { DetalheAtivo } from './componentes/DetalheAtivo';

export default function App() {
  const [conversaId, setConversaId] = useState('c1');
  const [titulo, setTitulo] = useState('Prensa 01 com vibracao alta');
  const [ativoId, setAtivoId] = useState('a1');
  const [agora, setAgora] = useState(Date.now());

  useEffect(() => {
    const relogio = setInterval(() => setAgora(Date.now()), 1000);
    return () => clearInterval(relogio);
  }, []);

  function selecionarConversa(conversa: any) {
    setConversaId(conversa.id);
    setTitulo(conversa.titulo);
    setAtivoId(conversa.ativoId);
  }

  function selecionarAtivo(ativo: any) {
    setAtivoId(ativo.id);
  }

  return (
    <div className="app">
      <Cabecalho agora={agora} />

      <div className="corpo">
        <MenuLateral
          conversaAtiva={conversaId}
          onSelecionarConversa={selecionarConversa}
          onSelecionarAtivo={selecionarAtivo}
        />

        <Chat conversa={{ id: conversaId, titulo: titulo }} />

        <DetalheAtivo ativoId={ativoId} />
      </div>
    </div>
  );
}
