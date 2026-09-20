import AvailableQuizzList from "../components/AvailableQuizzList";
import { useAuth } from "../contexts/AuthContext";

export default function AvailableQuizzes() {
  const { usuario } = useAuth()
  return (
    <>
      <AvailableQuizzList class_id={"6a9700493c9e42efab2db380"} />
    </>
  );
}
