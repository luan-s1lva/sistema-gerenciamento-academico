import FormGroup from "@mui/material/FormGroup";
import FormControl from '@mui/material/FormControl';
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { useState } from "react";

export default function FormularioProva({ dadosProva }) {
    const [isChecked, setIsChecked] = useState(false)
    const handleChange = (event) => {

    }
  return (
    <>
      <h2 key={dadosProva.id}>{dadosProva.enunciado}</h2>
      <h2>Valor da Questão: {dadosProva.valor_questao} pontos</h2>

      <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
        <FormGroup>
          <FormControlLabel
            control={<Checkbox value={dadosProva.alternativas.A} onChange={handleChange} onClick={!isChecked ? setIsChecked(true) : ''}/>}
            label={dadosProva.alternativas.A}
          />
          <FormControlLabel
            control={<Checkbox value={dadosProva.alternativas.B} />}
            label={dadosProva.alternativas.B}
          />
          <FormControlLabel
            control={<Checkbox value={dadosProva.alternativas.C} />}
            label={dadosProva.alternativas.C}
          />
          <FormControlLabel
            control={<Checkbox value={dadosProva.alternativas.D} />}
            label={dadosProva.alternativas.D}
          />
        </FormGroup>
      </FormControl>
    </>
  );
}
