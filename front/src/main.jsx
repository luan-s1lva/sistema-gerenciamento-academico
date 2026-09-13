import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./pages/Home.jsx";
import AvailableQuizzes from "./pages/AvailableQuizzes.jsx";
import QuizzAnsweringPage from "./pages/QuizzAnsweringPage.jsx";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>

      <Route path="/" element={<Home />}>
        <Route path="provas/" element={<AvailableQuizzes />} />
        <Route path="prova/:quiz_id/" element={<QuizzAnsweringPage />} />
      </Route>
    </Routes>
  </BrowserRouter>,
);
