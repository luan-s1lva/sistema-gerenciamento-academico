import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import Slider from "@mui/material/Slider";
import Pagination from "@mui/material/Pagination";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { useEffect, useState } from "react";
import { buscarTurmas, cadastrarProva } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

export default function CreateQuizz() {
  const [numeroQuestoes, setNumeroQuestoes] = useState(1);
  const [numeroAlternativas, setNumeroAlternativas] = useState(2);
  const [questaoAtual, setQuestaoAtual] = useState(1);
  const [questoes, setQuestoes] = useState({});
  const [turma, setTurma] = useState([]);

  const { usuario } = useAuth();

  useEffect(() => {
    async function carregarTurmas() {
      try {
        const dados = await buscarTurmas();
        setTurma(Array.isArray(dados) ? dados : []);
      } catch (e) {
        console.log("Erro " + e);
      }
    }

    carregarTurmas();
  }, []);

  const [provaInfo, setProvaInfo] = useState({
    turma_id: "",
    titulo: "",
    descricao: "",
    prazo_inicio: "",
    prazo_fim: "",
    peso_total: 0,
    criado_em: new Date().toISOString()
  });

  const LETRAS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

  const questaoAtiva = questoes[questaoAtual] || {
    id: questaoAtual,
    enunciado: "",
    alternativas: {},
    gabarito: "",
    valor_questao: 0.0,
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const listaQuestoes = [];
    for (let i = 1; i <= numeroQuestoes; i++) {
      const q = questoes[i] || {
        id: i,
        enunciado: "",
        alternativas: {},
        gabarito: "",
        valor_questao: 0,
      };

      const alternativasFiltradas = {};
      for (let j = 0; j < numeroAlternativas; j++) {
        const letra = LETRAS[j];
        alternativasFiltradas[letra] = q.alternativas?.[letra] || "";
      }

      listaQuestoes.push({
        id: i,
        enunciado: q.enunciado || "",
        alternativas: alternativasFiltradas,
        gabarito: q.gabarito || "",
        valor_questao: (provaInfo.peso_total / numeroQuestoes) || 0,
      });
    }
    
    const payload = {
      ...provaInfo,
      docente_id: usuario?.id || usuario?.matricula || "",
      questoes: listaQuestoes,
    };

    async function entregarProva() {
      try {
        const response = await cadastrarProva(payload)
        console.log(response)
      } catch (e) {
        console.log("Erro " + e);
      }
    }

    entregarProva();
  };

  const handleSetNumeroAlternativas = (v) => {
    setNumeroAlternativas(v.target.value);
  };

  const handleSetNumeroQuestoes = (v) => {
    setNumeroQuestoes(v.target.value);
  };

  const handleSetAlternativas = (index, valor) => {
    setQuestoes((anteriores) => ({
      ...anteriores,
      [questaoAtual]: {
        ...questaoAtiva,
        alternativas: { ...questaoAtiva.alternativas, [index]: valor },
      },
    }));
  };

  const handleSetEnunciado = (e) => {
    setQuestoes((anteriores) => ({
      ...anteriores,
      [questaoAtual]: { ...questaoAtiva, enunciado: e.target.value },
    }));
  };

  const handleSetGabarito = (e) => {
    setQuestoes((prev) => ({
      ...prev,
      [questaoAtual]: {
        ...questaoAtiva,
        gabarito: e.target.value,
      },
    }));
  };

  return (
    <Box sx={{ maxWidth: 860, mx: "auto", p: { xs: 2, md: 4 } }}>
      <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Configurações da Avaliação
        </Typography>

        <Stack spacing={3} sx={{ mt: 2 }}>
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Título da prova
            </Typography>
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              value={provaInfo.titulo}
              onChange={(e) =>
                setProvaInfo((anteriores) => ({
                  ...anteriores,
                  titulo: e.target.value,
                }))
              }
            />
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Peso total da prova
            </Typography>
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              value={provaInfo.peso_total}
              onChange={(e) =>
                setProvaInfo((anteriores) => ({
                  ...anteriores,
                  peso_total: parseInt(e.target.value, 10) || 0,
                }))
              }
            />
          </Box>
          
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Descrição da prova
            </Typography>
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              value={provaInfo.descricao}
              onChange={(e) =>
                setProvaInfo((anteriores) => ({
                  ...anteriores,
                  descricao: e.target.value,
                }))
              }
            />
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Selecionar turma de aplicação da prova
            </Typography>
            <Select
              fullWidth
              size="small"
              displayEmpty
              value={provaInfo.turma_id}
              onChange={(e) =>
                setProvaInfo((prev) => ({ ...prev, turma_id: e.target.value }))
              }
            >
              <MenuItem value="" disabled>
                <em>Selecione uma turma</em>
              </MenuItem>
              {turma.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.nome}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Selecionar data de início da prova
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  label="Início da Avaliação"
                  onChange={(value) =>
                    setProvaInfo((anteriores) => ({
                      ...anteriores,
                      prazo_inicio: value ? value.toISOString() : "",
                    }))
                  }
                />
              </DemoContainer>
            </LocalizationProvider>

            <Typography variant="subtitle2" sx={{ mt: 2 }} gutterBottom>
              Selecionar data de término da prova
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  label="Término da Avaliação"
                  onChange={(value) =>
                    setProvaInfo((anteriores) => ({
                      ...anteriores,
                      prazo_fim: value ? value.toISOString() : "",
                    }))
                  }
                />
              </DemoContainer>
            </LocalizationProvider>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Número de Questões: <strong>{numeroQuestoes}</strong>
            </Typography>
            <Slider
              aria-label="Número Questões"
              value={numeroQuestoes}
              valueLabelDisplay="auto"
              step={1}
              marks
              min={1}
              max={10}
              onChange={handleSetNumeroQuestoes}
            />
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Número de Alternativas por Questão:{" "}
              <strong>{numeroAlternativas}</strong>
            </Typography>
            <Slider
              aria-label="Número Alternativas"
              value={numeroAlternativas}
              valueLabelDisplay="auto"
              step={2}
              marks
              min={2}
              max={10}
              onChange={handleSetNumeroAlternativas}
            />
          </Box>
        </Stack>
      </Paper>

      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <Pagination
          count={numeroQuestoes}
          page={questaoAtual}
          color="primary"
          size="large"
          onChange={(event, value) => setQuestaoAtual(value)}
        />
      </Box>

      <form onSubmit={handleSubmit}>
        <Card elevation={2} sx={{ borderRadius: 2, mb: 3 }}>
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography
              variant="h6"
              fontWeight="bold"
              color="primary"
              gutterBottom
            >
              Questão {questaoAtual}
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <FormControl fullWidth component="fieldset" variant="standard">
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Enunciado:
                </Typography>
                <TextareaAutosize
                  aria-label="minimum height"
                  minRows={4}
                  id="enunciado"
                  value={questaoAtiva.enunciado}
                  placeholder="Digite o enunciado da questão..."
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "12px",
                    borderRadius: "6px",
                    borderColor: "#ccc",
                    fontFamily: "inherit",
                    fontSize: "0.95rem",
                  }}
                  onChange={handleSetEnunciado}
                />
              </Box>

              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ mb: 1 }}
              >
                Alternativas (Marque a opção correspondente ao gabarito correto):
              </Typography>

              <RadioGroup
                name="query"
                value={questaoAtiva.gabarito || ""}
                onChange={handleSetGabarito}
              >
                <Stack spacing={2} sx={{ mt: 1 }}>
                  {Array.from({ length: numeroAlternativas }).map((_, i) => (
                    <Paper
                      key={LETRAS[i]}
                      variant="outlined"
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        borderColor:
                          questaoAtiva.gabarito === LETRAS[i]
                            ? "primary.main"
                            : "divider",
                        backgroundColor:
                          questaoAtiva.gabarito === LETRAS[i]
                            ? "action.hover"
                            : "transparent",
                      }}
                    >
                      <FormControlLabel
                        value={LETRAS[i]}
                        control={<Radio />}
                        label=""
                        sx={{ m: 0, mr: 1 }}
                      />
                      <TextField
                        fullWidth
                        size="small"
                        label={`Alternativa ${LETRAS[i]}`}
                        placeholder={`Texto da alternativa ${LETRAS[i]}`}
                        variant="outlined"
                        value={questaoAtiva.alternativas?.[LETRAS[i]] || ""}
                        onChange={(e) =>
                          handleSetAlternativas(LETRAS[i], e.target.value)
                        }
                      />
                    </Paper>
                  ))}
                </Stack>
              </RadioGroup>
            </FormControl>
          </CardContent>
        </Card>

        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          sx={{
            py: 1.5,
            fontWeight: "bold",
            borderRadius: 2,
            textTransform: "none",
            fontSize: "1rem",
          }}
        >
          SALVAR PROVA
        </Button>
      </form>
    </Box>
  );
}