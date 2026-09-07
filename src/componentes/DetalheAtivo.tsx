import { useEffect, useState } from 'react';
import * as api from '../api';

type Props = {
  ativoId: string;
};

export function DetalheAtivo({ ativoId }: Props) {
  const [ativo, setAtivo] = useState<any>(null);
  const [leituras, setLeituras] = useState<any[]>([]);

  useEffect(() => {
    api.detalheAtivo(ativoId).then((resposta) => {
      setAtivo(resposta);
    });

    api.leiturasDoAtivo(ativoId).then((serie) => {
      setLeituras(serie);
    });
  }, [ativoId]);

  if (!ativo) {
    return (
      <aside className="detalhe">
        <div className="menu-titulo">Ativo</div>
        <div className="vazio">carregando...</div>
      </aside>
    );
  }

  const maximo = Math.max(...leituras.map((l) => l.temperatura), 1);

  return (
    <aside className="detalhe">
      <div className="menu-titulo">Ativo</div>

      <h3 className="detalhe-nome">{ativo.nome}</h3>
      <span className="detalhe-codigo">{ativo.codigo}</span>

      <div className="detalhe-grade">
        <div>
          <span className="rotulo">temperatura</span>
          <strong>{ativo.temperatura} C</strong>
        </div>
        <div>
          <span className="rotulo">vibracao</span>
          <strong>{ativo.vibracao} mm/s</strong>
        </div>
        <div>
          <span className="rotulo">corrente</span>
          <strong>{ativo.corrente} A</strong>
        </div>
        <div>
          <span className="rotulo">estado</span>
          <strong>{ativo.estado}</strong>
        </div>
      </div>

      <div className="menu-titulo">Temperatura 24h</div>

      <div className="grafico">
        {leituras.map((leitura, indice) => (
          <div
            key={indice}
            className="barra"
            style={{ height: `${(leitura.temperatura / maximo) * 100}%` }}
            title={`${leitura.hora} - ${leitura.temperatura} C`}
          />
        ))}
      </div>
    </aside>
  );
}
