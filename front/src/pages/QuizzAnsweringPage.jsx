import { useEffect, useState } from "react";
import CabecalhoQuizz from "../components/CabecalhoQuizz";
import { buscarProva } from "../services/api";
import FormularioProva from "../components/FormularioProva";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

export default function QuizzAnsweringPage({ quiz_id }) {
  const [provaDados, setProvaDados] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [pageNumber, setPageNumber] = useState(0);

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
      <FormularioProva dadosProva={provaDados.questoes[pageNumber]} />
      <Stack spacing={2}>
        <Pagination
          count={provaDados.questoes.length || 1}
          page={pageNumber + 1}
          onChange={(event, value) => setPageNumber(value - 1)}
          color="secondary"
          showFirstButton
          showLastButton
        />
      </Stack>
    </>
  );
}
