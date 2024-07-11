import { Button } from "@mui/material";
import { useQuestionData } from "../hooks/useQuestionData";
import { useQuestionsStore } from "../store/questions";

export function Footer() {
  const { correct, incorrect, unanswer } = useQuestionData();
  const restar = useQuestionsStore((state) => state.restar);

  return (
    <footer>
      <strong>
        ❌ Incorrectas : {incorrect} | ✅ Correctas : {correct} | ❓ Sin
        responder :{unanswer}
      </strong>
      <div style={{ marginTop: "8px" }}>
        <Button onClick={() => restar()}>Reiniciar</Button>
      </div>
    </footer>
  );
}
