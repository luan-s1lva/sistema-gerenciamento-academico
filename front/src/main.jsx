import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import AvailableQuizzes from "./pages/AvailableQuizzes.jsx";
import QuizzAnsweringPage from "./pages/QuizzAnsweringPage.jsx";
import "./index.css";
import AuthProvider from "./contexts/AuthContext.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import CreateQuizz from "./pages/CreateQuizz.jsx";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        <Route path="/" element={<Home />}>
          <Route path="provas/" element={<AvailableQuizzes />} />
          <Route path="prova/cadastrar/" element={<CreateQuizz />} />
          <Route path="prova/:quiz_id/" element={<QuizzAnsweringPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </AuthProvider>,
);
