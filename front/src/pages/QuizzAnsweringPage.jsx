import { useEffect, useState } from "react";
import CabecalhoQuizz from "../components/CabecalhoQuizz";
import { buscarProva } from "../services/api";

export default function QuizzAnsweringPage({ quiz_id }) {
  const [provaDados, setProvaDados] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      try {
        const dados = await buscarProva(quiz_id);
        setProvaDados(dados);
      } catch (e) {
        console.log("Erro:" + e);
      } finally {
        setCarregando(false);
      }
    }

    if (quiz_id) {
      carregarDados();
    }
  }, [quiz_id]);

  if (carregando) {
    return <p>Carregando avaliação...</p>;
  }

  return (
    <>
      <CabecalhoQuizz
        titulo={provaDados.titulo}
        descricao={provaDados.descricao}
        prazo_inicio={provaDados.prazo_inicio}
        prazo_limite={provaDados.prazo_limite}
      />
      <h1>OI</h1>
    </>
  );
}
