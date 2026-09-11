export default function CabecalhoQuizz({
  titulo,
  descricao,
  prazo_inicio,
  prazo_limite,
}) {
  return (
    <>
      <div>
        <div>
          <h2>{titulo}</h2>
          <h3>{descricao}</h3>
        </div>
        <div>
          <h2>Tempo restante: {prazo_limite} - {prazo_inicio}</h2>
        </div>
      </div>
    </>
  );
}
