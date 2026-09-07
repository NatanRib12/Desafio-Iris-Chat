type Props = {
  mensagem: {
    id: string;
    autor: string;
    texto: string;
    criadoEm: string;
  };
};

export function Mensagem({ mensagem }: Props) {
  const hora = new Date(mensagem.criadoEm).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={mensagem.autor === 'agente' ? 'mensagem agente' : 'mensagem usuario'}>
      <div className="mensagem-cabecalho">
        <span className="mensagem-autor">
          {mensagem.autor === 'agente' ? 'IRIS' : 'voce'}
        </span>
        <span className="mensagem-hora">{hora}</span>
      </div>
      <p className="mensagem-texto">{mensagem.texto}</p>
    </div>
  );
}
