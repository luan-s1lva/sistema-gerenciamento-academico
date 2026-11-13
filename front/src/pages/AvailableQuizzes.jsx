import AvailableQuizzList from "../components/AvailableQuizzList";
import { useAuth } from "../contexts/AuthContext";

export default function AvailableQuizzes() {
  const { usuario } = useAuth()
  return (
    <>
      <AvailableQuizzList />
    </>
  );
}
