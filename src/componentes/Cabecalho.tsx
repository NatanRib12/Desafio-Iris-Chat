import { useEffect, useState } from 'react';
import * as api from '../api';

type Props = {
  agora: number;
};

export function Cabecalho({ agora }: Props) {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const verificacao = setInterval(() => {
      api
        .status()
        .then(() => setOnline(true))
        .catch(() => setOnline(false));
    }, 10000);

    return () => clearInterval(verificacao);
  }, []);

  const hora = new Date(agora).toLocaleTimeString('pt-BR');

  return (
    <header className="cabecalho">
      <div className="marca">
        <span className="ponto" />
        <h1>IRIS Chat</h1>
        <span className="unidade">Montes Claros</span>
      </div>

      <div className="cabecalho-direita">
        <span className={online ? 'status ok' : 'status ruim'}>
          {online ? 'api online' : 'api fora'}
        </span>
        <span className="relogio">{hora}</span>
      </div>
    </header>
  );
}
