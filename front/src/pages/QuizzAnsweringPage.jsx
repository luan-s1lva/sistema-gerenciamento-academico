import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CabecalhoQuizz from "../components/CabecalhoQuizz";
import { buscarProva, submeterProva } from "../services/api";
import FormularioProva from "../components/FormularioProva";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";

export default function QuizzAnsweringPage() {
  let params = useParams();

  const [provaDados, setProvaDados] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [pageNumber, setPageNumber] = useState(0);
  const [respostas, setRespostas] = useState({});

  useEffect(() => {
    async function carregarDados() {
      try {
        const dados = await buscarProva(params.quiz_id);
        setProvaDados(dados);
      } catch (e) {
        console.log("Erro:" + e);
      } finally {
        setCarregando(false);
      }
    }

    if (params.quiz_id) {
      carregarDados();
    }
  }, [params.quiz_id]);

  if (carregando) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
          gap: 2,
        }}
      >
        <CircularProgress color="secondary" />
        <Typography variant="body1" color="text.secondary">
          Carregando avaliação...
        </Typography>
      </Box>
    );
  }

  const questaoAtual = provaDados?.questoes?.[pageNumber];

  const handleSelecionarResposta = (e) => {
    setRespostas((anteriores) => ({
      ...anteriores,
      [String(questaoAtual.id)]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const res = await submeterProva(params.quiz_id, "2354234", respostas);
      console.log(res);
    } catch (err) {
      console.error("Erro na submissão:", err);
    }
  };

  return (
    <Box sx={{ maxWidth: 860, mx: "auto", p: { xs: 2, sm: 3, md: 4 } }}>
      <Stack spacing={3}>
        {/* Cabeçalho do Quiz com moldura e sombra suave */}
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
          <CabecalhoQuizz
            titulo={provaDados.titulo}
            descricao={provaDados.descricao}
            prazo_inicio={provaDados.prazo_inicio}
            prazo_fim={provaDados.prazo_fim}
          />
        </Paper>

        {/* Card da Questão Atual */}
        {questaoAtual && (
          <Card elevation={2} sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography
                variant="subtitle2"
                color="secondary"
                fontWeight="bold"
                gutterBottom
              >
                Questão {pageNumber + 1} de {provaDados.questoes?.length || 1}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <FormularioProva
                dadosProva={questaoAtual}
                onSelecionarResposta={handleSelecionarResposta}
                respostas={respostas[String(questaoAtual.id)]}
              />
            </CardContent>
          </Card>
        )}

        {/* Barra Inferior com Paginação e Ação de Envio */}
        <Paper
          elevation={1}
          sx={{
            p: 2.5,
            borderRadius: 2,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Stack spacing={2} sx={{ width: { xs: "100%", sm: "auto" }, alignItems: "center" }}>
            <Pagination
              count={provaDados.questoes.length || 1}
              page={pageNumber + 1}
              onChange={(event, value) => setPageNumber(value - 1)}
              color="secondary"
              showFirstButton
              showLastButton
              size="medium"
            />
          </Stack>

          <Button
            type="button"
            variant="contained"
            color="secondary"
            size="large"
            onClick={handleSubmit}
            sx={{
              px: 4,
              py: 1,
              fontWeight: "bold",
              borderRadius: 2,
              textTransform: "none",
              width: { xs: "100%", sm: "auto" },
            }}
          >
            TESTAR
          </Button>
        </Paper>
      </Stack>
    </Box>
  );
}