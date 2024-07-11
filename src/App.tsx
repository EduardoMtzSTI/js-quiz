import { Container, Stack, Typography } from "@mui/material";
import "./App.css";
import { JavaScriptLogo } from "./assets/js-logo";
import { Start } from "./components/Start";
import { useQuestionsStore } from "./store/questions";
import { Game } from "./components/Game";

function App() {
  const questions = useQuestionsStore((state) => state.questions);
  //console.log(questions);
  return (
    <main>
      <Container>
        <Stack
          direction="row"
          gap={2}
          alignItems="center"
          justifyContent="center"
          m={2}
        >
          <JavaScriptLogo style={{ height: "64px" }} />
          <Typography variant="h2" component="h1">
            Java Script Quiz
          </Typography>
        </Stack>
        {questions.length === 0 && <Start />}
        {questions.length > 0 && <Game />}
      </Container>
    </main>
  );
}

export default App;
