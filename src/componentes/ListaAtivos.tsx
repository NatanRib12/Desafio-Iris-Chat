import { useEffect, useState } from 'react';
import * as api from '../api';

type Props = {
  onSelecionar: (ativo: any) => void;
};

export function ListaAtivos({ onSelecionar }: Props) {
  const [ativos, setAtivos] = useState<any[]>([]);

  useEffect(() => {
    api.listarAtivos().then((lista) => setAtivos(lista));
  }, []);

  return (
    <ul className="lista-ativos">
      {ativos.map((ativo) => (
        <LinhaAtivo key={ativo.id} ativo={ativo} onSelecionar={onSelecionar} />
      ))}
    </ul>
  );
}

function LinhaAtivo({ ativo, onSelecionar }: { ativo: any; onSelecionar: (a: any) => void }) {
  const [leituras, setLeituras] = useState<any[]>([]);

  useEffect(() => {
    api.leiturasDoAtivo(ativo.id).then((serie) => setLeituras(serie));
  }, [ativo]);

  const ultima = leituras[leituras.length - 1];

  return (
    <li className="ativo" onClick={() => onSelecionar(ativo)}>
      <span className={`bolinha ${ativo.estado}`} />

      <div className="ativo-info">
        <span className="ativo-nome">{ativo.nome}</span>
        <span className="ativo-codigo">{ativo.codigo}</span>
      </div>

      <span className="ativo-valor">{ultima ? `${ultima.temperatura} C` : '...'}</span>

      {ativo.alertas > 0 && <span className="badge alerta">{ativo.alertas}</span>}
    </li>
  );
}
