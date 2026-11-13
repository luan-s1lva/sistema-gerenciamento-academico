import { useEffect, useState } from "react";
import { buscarTodasProvas } from "../services/api";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import { useAuth } from "../contexts/AuthContext";

export default function AvailableQuizzList() {
  let navigate = useNavigate();
  const { usuario } = useAuth()
  const [quizzesDisponiveis, setQuizzesDisponiveis] = useState({});

  const fetchQuizzes = async () => {
    try {
      const dados = await buscarTodasProvas();
      setQuizzesDisponiveis(dados);
    } catch (e) {
      console.log("Erro: " + e);
    }
  };

  const handleRole = (id) => {
    if (usuario.role.toLowerCase() == "docente" || usuario.role.toLowerCase() == "gestor" || usuario.role.toLowerCase() == "admin") {
      navigate(`/prova/visualizar/${id}/`)
    } else {
      navigate(`/prova/${id}/`)
    }
  }

  useEffect(() => {
    fetchQuizzes();
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, p: 2 }}>
      {Object.entries(quizzesDisponiveis || {}).map(([item, texto]) => (
        <Card
          key={item}
          elevation={2}
          sx={{
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            transition: "0.2s",
            "&:hover": { boxShadow: 4 },
          }}
        >
          <CardContent>
            {/* Cabeçalho do Card */}
            <Stack direction="row" sx={{ mb: 1 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight="bold"
              >
                Class_id: {texto.class_id}
              </Typography>
              <Chip
                label={`${texto.total_questoes} questões`}
                size="small"
                color="primary"
                variant="outlined"
              />
            </Stack>

            {/* Título e Descrição */}
            <Typography
              variant="h6"
              component="h2"
              fontWeight="bold"
              gutterBottom
            >
              {texto.titulo}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {texto.descricao}
            </Typography>

            <Divider sx={{ my: 1.5 }} />

            {/* Informações detalhadas */}
            <Stack spacing={0.8}>
              <Typography variant="body2">
                <strong>Docente:</strong> {texto.docente_id}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Prazo início:</strong> {texto.prazo_inicio}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Prazo fim:</strong> {texto.prazo_fim}
              </Typography>
            </Stack>
          </CardContent>

          <CardActions sx={{ px: 2, pb: 2 }}>
            <Button
              id="roleAction"
              variant="contained"
              fullWidth
              sx={{ textTransform: "none" }}
              onClick={() => handleRole(texto.id)}
            >
              Acessar Prova
            </Button>
          </CardActions>
        </Card>
      ))}
    </Box>
  );
}
