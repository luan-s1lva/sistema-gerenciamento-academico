import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { buscarProva } from "../services/api";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

export default function TeacherQuizDetails() {
  const { quiz_id } = useParams();
  const navigate = useNavigate();

  const [prova, setProva] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const fetchProva = async () => {
      try {
        setLoading(true);
        const dados = await buscarProva(quiz_id);
        setProva(dados);
      } catch (e) {
        setErro(
          e.response?.data?.erro ||
            "Não foi possível carregar os detalhes da prova.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (quiz_id) {
      fetchProva();
    }
  }, [quiz_id]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (erro || !prova) {
    return (
      <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
        <Alert severity="error">{erro || "Prova não encontrada."}</Alert>
        <Button
          variant="outlined"
          sx={{ alignSelf: "flex-start", textTransform: "none" }}
          onClick={() => navigate(-1)}
        >
          Voltar
        </Button>
      </Box>
    );
  }

  const questoes = prova.questoes || [];
  const pontuacaoTotal = questoes.reduce(
    (acc, q) => acc + Number(q.valor_questao || 0),
    0,
  );

  const renderAlternativas = (alternativas, gabarito) => {
    if (!alternativas) return null;

    const lista = Array.isArray(alternativas)
      ? alternativas.map((alt, idx) =>
          typeof alt === "object" && alt !== null
            ? [
                alt.letra || String.fromCharCode(65 + idx),
                alt.texto || JSON.stringify(alt),
              ]
            : [String.fromCharCode(65 + idx), String(alt)],
        )
      : Object.entries(alternativas);

    return (
      <Stack spacing={1} sx={{ mt: 1.5 }}>
        {lista.map(([letra, texto]) => {
          const ehCorreta =
            gabarito &&
            String(letra).trim().toUpperCase() ===
              String(gabarito).trim().toUpperCase();

          return (
            <Box
              key={letra}
              sx={{
                p: 1.2,
                borderRadius: 1.5,
                border: "1px solid",
                borderColor: ehCorreta ? "success.main" : "divider",
                bgcolor: ehCorreta
                  ? "rgba(46, 125, 50, 0.08)"
                  : "background.paper",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Typography variant="body2">
                <strong>{letra})</strong> {texto}
              </Typography>
              {ehCorreta && (
                <Chip label="Gabarito" size="small" color="success" />
              )}
            </Box>
          );
        })}
      </Stack>
    );
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, p: 2 }}>
      <Button
        variant="outlined"
        sx={{ alignSelf: "flex-start", textTransform: "none" }}
        onClick={() => navigate(-1)}
      >
        Voltar para lista
      </Button>

      {/* Card principal com metadados da avaliação */}
      <Card
        elevation={2}
        sx={{
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <CardContent>
          <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
            <Chip
              label={`${questoes.length} questões`}
              size="small"
              color="primary"
              variant="outlined"
            />
            <Chip
              label={`Total: ${pontuacaoTotal} pts`}
              size="small"
              color="secondary"
              variant="outlined"
            />
            {prova.class_id && (
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight="bold"
              >
                Turma: {prova.class_id}
              </Typography>
            )}
          </Stack>

          <Typography
            variant="h5"
            component="h1"
            fontWeight="bold"
            gutterBottom
          >
            {prova.titulo}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {prova.descricao}
          </Typography>

          <Divider sx={{ my: 1.5 }} />

          <Stack spacing={0.8}>
            <Typography variant="body2">
              <strong>Docente:</strong> {prova.docente_id}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Prazo início:</strong> {prova.prazo_inicio}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Prazo fim:</strong> {prova.prazo_fim}
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      {/* Lista de questões cadastradas */}
      <Typography variant="h6" fontWeight="bold">
        Questões Cadastradas
      </Typography>

      {questoes.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          Nenhuma questão cadastrada nesta avaliação.
        </Typography>
      ) : (
        questoes.map((questao, index) => (
          <Card
            key={questao.id || index}
            elevation={1}
            sx={{
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <CardContent>
              <Stack direction="row" sx={{ mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Questão {index + 1}
                </Typography>
                <Chip
                  label={`${questao.valor_questao} pts`}
                  size="small"
                  variant="outlined"
                />
              </Stack>

              <Typography variant="body1" fontWeight="medium">
                {questao.enunciado}
              </Typography>

              {renderAlternativas(questao.alternativas, questao.gabarito)}
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
}
