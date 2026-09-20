import { useEffect, useState } from "react";

export default function CabecalhoQuizz({
  titulo,
  descricao,
  prazo_inicio,
  prazo_fim,
}) {
  const [tempoTexto, setTempoTexto] = useState("");

  useEffect(() => {
    function tempoRestante() {
      const limite = new Date(prazo_fim).getTime();
      const agora = Date.now();
      const diferenca = limite - agora;

      if (diferenca <= 0) {
        setTempoTexto("Acabou o tempo!");
        return;
      }

      const horas = Math.floor(diferenca / (1000 * 60 * 60));
      const minutos = Math.floor((diferenca % (1000 * 60 * 60)) / (1000 * 60));
      const segundos = Math.floor((diferenca % (1000 * 60)) / 1000);

      const hFormat = String(horas).padStart(2, "0");
      const mFormat = String(minutos).padStart(2, "0");
      const sFormat = String(segundos).padStart(2, "0");

      setTempoTexto(`${hFormat}:${mFormat}:${sFormat}`);
    }

    tempoRestante();
    const timerSeg = setInterval(tempoRestante, 1000);

    return () => clearInterval(timerSeg);
  }, []);

  return (
    <>
      <div>
        <div>
          <h2>{titulo}</h2>
          <h3>{descricao}</h3>
        </div>
        <div>
          <h2>Tempo restante: {tempoTexto}</h2>
        </div>
      </div>
    </>
  );
}
