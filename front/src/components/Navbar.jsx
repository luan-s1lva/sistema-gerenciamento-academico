import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  let navigate = useNavigate();
  const { logout, usuario } = useAuth();

  return (
    <AppBar
      position="static"
      elevation={1}
      sx={{
        backgroundColor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, sm: 4 } }}>
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontWeight: 700,
            color: "primary.main",
            letterSpacing: 0.5,
          }}
        >
          Sistema de Gerenciamento acadêmico
        </Typography>

        <Stack direction="row" spacing={1}>
          <Button
            variant="text"
            sx={{
              color: "text.primary",
              fontWeight: 500,
              textTransform: "none",
              borderRadius: 2,
              px: 2,
              "&:hover": {
                backgroundColor: "action.hover",
              },
            }}
            onClick={() => navigate("/provas/")}
          >
            Provas disponíveis
          </Button>

          <Button
            variant="text"
            sx={{
              color: "text.primary",
              fontWeight: 500,
              textTransform: "none",
              borderRadius: 2,
              px: 2,
              "&:hover": {
                backgroundColor: "action.hover",
              },
            }}
            onClick={() => navigate("/prova/cadastrar/")}
          >
            Cadastrar Prova
          </Button>

          <Button
            variant="text"
            sx={{
              color: "text.secondary",
              fontWeight: 500,
              textTransform: "none",
              borderRadius: 2,
              px: 2,
              "&:hover": {
                backgroundColor: "action.hover",
              },
            }}
            onClick={() => logout()}
          >
            Deslogar
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
