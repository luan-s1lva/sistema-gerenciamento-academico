import { useEffect, useState } from "react";
import CabecalhoQuizz from "../components/CabecalhoQuizz";
import { buscarProva, submeterProva } from "../services/api";
import FormularioProva from "../components/FormularioProva";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

export default function QuizzAnsweringPage({ quiz_id }) {
  const [provaDados, setProvaDados] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [pageNumber, setPageNumber] = useState(0);
  const [respostas, setRespostas] = useState({});

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

  const questaoAtual = provaDados.questoes[pageNumber];

  const handleSelecionarResposta = (e) => {
    setRespostas((anteriores) => ({
      ...anteriores,
      [String(questaoAtual.id)]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const res = await submeterProva(quiz_id, "2354234", respostas);
      console.log(res);
    } catch (err) {
      console.error("Erro na submissão:", err);
    }
  };

  return (
    <>
      <CabecalhoQuizz
        titulo={provaDados.titulo}
        descricao={provaDados.descricao}
        prazo_inicio={provaDados.prazo_inicio}
        prazo_limite={provaDados.prazo_limite}
      />
      {questaoAtual && (
        <FormularioProva
          dadosProva={questaoAtual}
          onSelecionarResposta={handleSelecionarResposta}
          respostas={respostas[String(questaoAtual.id)]}
        />
      )}
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
      <button type="button" onClick={handleSubmit}>
        TESTAR
      </button>
    </>
  );
}
