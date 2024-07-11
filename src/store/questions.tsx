import { create } from "zustand";
import { type Questions } from "./types";
import { persist, devtools } from "zustand/middleware";

interface State {
  questions: Questions[];
  currentQuestion: number;
  fetchQuestions: (limit: number) => Promise<void>;
  selectAnswer: (questionId: number, answerIndex: number) => void;
  goNextQuestion: () => void;
  goPreviousQuestion: () => void;
  restar: () => void;
}

const logger = (config) => (get, set, api) => {
  return config(
    (...args) => {
      console.log("appaying:", args);
      set(...args);
      console.log("new state:", get());
    },
    get,
    api
  );
};

export const useQuestionsStore = create<State>()(
  devtools(
    persist(
      (set, get) => {
        return {
          questions: [],
          currentQuestion: 0,
          fetchQuestions: async (limit: number) => {
            const res = await fetch("http://localhost:5173/questions.json");
            const json = await res.json();
            const questions = json
              .sort(() => Math.random() - 0.5)
              .slice(0, limit);
            set(
              {
                questions,
              },
              false,
              "FETCH_QUESTIION"
            );
            //console.log(get());
          },
          selectAnswer: (questionId: number, answerIndex: number) => {
            const { questions } = get();
            //Clonar questions
            const newQuestions = structuredClone(questions);
            //Obtener index de la pregunta
            const questionIndex = newQuestions.findIndex(
              (question) => question.id === questionId
            );
            const questionInfo = newQuestions[questionIndex];
            //Guardar si la respuesta es correcta o incorrecta
            const isCorrectUserAnswer =
              questionInfo.correctAnswer === answerIndex;
            //Actualizar la informacion de la copia de la pregunta
            newQuestions[questionIndex] = {
              ...questionInfo,
              isCorrectUserAnswer,
              userSelectedAnswer: answerIndex,
            };
            console.log(newQuestions[questionIndex]);
            //Actualizar estado
            set({ questions: newQuestions }, false, "SELECT_ANSWER");
          },
          goNextQuestion: () => {
            const { currentQuestion, questions } = get();
            const nextQuestion = currentQuestion + 1;
            if (nextQuestion < questions.length) {
              set({ currentQuestion: nextQuestion }, false, "GO_NEXT_QUESTON");
            }
          },
          goPreviousQuestion: () => {
            const { currentQuestion } = get();
            const nextQuestion = currentQuestion - 1;
            if (nextQuestion >= 0) {
              set(
                { currentQuestion: nextQuestion },
                false,
                "GO_PREVIOUS_QUESTION"
              );
            }
          },
          restar: () => {
            set({ questions: [], currentQuestion: 0 }, false, "RESTAR");
          },
        };
      },
      {
        name: "question",
      }
    )
  )
);
