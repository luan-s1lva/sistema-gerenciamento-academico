import { Navigate, Outlet } from "react-router-dom";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { useAuth } from "../contexts/AuthContext";

export default function PrivateRoute() {
  const { estaAutenticado, carregando } = useAuth();

  if (carregando) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return estaAutenticado ? <Outlet /> : <Navigate to="/login" replace />;
}
