import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";

export default function FormularioProva({
  dadosProva,
  onSelecionarResposta,
  respostas,
}) {
  return (
    <>
      <h2 key={dadosProva.id}>{dadosProva.enunciado}</h2>
      <h2>Valor da Questão: {dadosProva.valor_questao} pontos</h2>

      <form>
        <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
          <RadioGroup
            name="query"
            onChange={onSelecionarResposta}
            value={respostas || ""}
          >
            {Object.entries(dadosProva.alternativas || {}).map(
              ([index, texto]) => (
                <FormControlLabel
                  key={index}
                  value={index}
                  control={<Radio />}
                  label={index + " - " + texto}
                />
              ),
            )}
          </RadioGroup>
        </FormControl>
      </form>
    </>
  );
}
