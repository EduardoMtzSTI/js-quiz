import {
  Card,
  CardContent,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { useQuestionsStore } from "../store/questions";
import { type Questions as QuestionType } from "../store/types";
import SyntaxHighlighter from "react-syntax-highlighter";
import { nightOwl } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material";
import { Footer } from "./Footer";

const getBackgroundColor = (info: QuestionType, index: number) => {
  const { userSelectedAnswer, correctAnswer } = info;
  //usuario no ha seleccionado nada
  if (userSelectedAnswer == null) return "transparent";
  //si ya selecciono pero la respuesta es incorrecta
  if (index !== correctAnswer && index !== userSelectedAnswer)
    return "transparent";
  //si selecciono la respuesta correcta
  if (index === correctAnswer) return "green";
  //si selecciono la respuesta incorrecta
  if (index === userSelectedAnswer) return "red";
  //si no es ninguna de las anteriores
  return "transparent";
};

const Question = ({ info }: { info: QuestionType }) => {
  const selectAnswer = useQuestionsStore((store) => store.selectAnswer);

  const createHandleClick = (answerIndex: number) => () => {
    selectAnswer(info.id, answerIndex);
  };

  return (
    <Card variant="outlined" sx={{ textAlign: "left", bgcolor: "#222" }}>
      <CardContent>
        <Typography variant="h5">{info.question}</Typography>

        <SyntaxHighlighter lengguage="javascript" style={nightOwl}>
          {info.code}
        </SyntaxHighlighter>

        <List sx={{ bgcolor: "#333", width: "100%", p: "0" }}>
          {info.answers.map((answer, index) => (
            <ListItem key={index} divider sx={{ p: "0" }}>
              <ListItemButton
                disabled={info.userSelectedAnswer != null}
                onClick={createHandleClick(index)}
                sx={{ backgroundColor: getBackgroundColor(info, index) }}
              >
                <ListItemText primary={answer} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export function Game() {
  /*
  const questions = useQuestionsStore((state) => state.questions);
  const currentQuestion = useQuestionsStore((state) => state.currentQuestion);
  const goNextQuestion = useQuestionsStore((state) => state.goNextQuestion);
  const goPreviousQuestion = useQuestionsStore(
    (state) => state.goPreviousQuestion
  );
*/
  const { questions, currentQuestion, goNextQuestion, goPreviousQuestion } =
    useQuestionsStore((state) => {
      return {
        questions: state.questions,
        currentQuestion: state.currentQuestion,
        goNextQuestion: state.goNextQuestion,
        goPreviousQuestion: state.goPreviousQuestion,
      };
    });
  const questionInfo = questions[currentQuestion];
  return (
    <>
      <Stack
        direction="row"
        gap={2}
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 1 }}
      >
        <IconButton
          onClick={goPreviousQuestion}
          disabled={currentQuestion === 0}
        >
          <ArrowBackIosNew />
        </IconButton>
        {currentQuestion + 1}/{questions.length}
        <IconButton
          onClick={goNextQuestion}
          disabled={currentQuestion >= questions.length - 1}
        >
          <ArrowForwardIos />
        </IconButton>
      </Stack>
      <Question info={questionInfo} />
      <Footer />
    </>
  );
}
