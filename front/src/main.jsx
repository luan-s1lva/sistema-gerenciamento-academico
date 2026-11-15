import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Outlet, Route, Routes, useNavigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import AvailableQuizzes from "./pages/AvailableQuizzes.jsx";
import QuizzAnsweringPage from "./pages/QuizzAnsweringPage.jsx";
import "./index.css";
import AuthProvider, { useAuth } from "./contexts/AuthContext.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import CreateQuizz from "./pages/CreateQuizz.jsx";
import PrivateRoute from "./middlewares/PrivateRoute.jsx";
import TeacherQuizDetails from "./components/TeacherQuizDetails.jsx";

function PublicRoute() {
  const { estaAutenticado } = useAuth();
  return estaAutenticado ? <Navigate to="/" replace /> : <Outlet />;
}

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Home />}>
            <Route path="provas/" element={<AvailableQuizzes />} />
            <Route path="prova/:quiz_id/" element={<QuizzAnsweringPage />} />
            <Route path="prova/cadastrar/" element={<CreateQuizz />} />
            <Route path="prova/visualizar/:quiz_id/" element={<TeacherQuizDetails />} />
          </Route>
        </Route>

        {/* Qualquer rota desconhecida redireciona para "/" (que passa pelo PrivateRoute) */}
        <Route path="*" element={<Navigate   to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>,
);
