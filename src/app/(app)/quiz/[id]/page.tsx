"use client";

import { notFound, useParams } from "next/navigation";
import { MatchQuiz } from "@/components/play/match-quiz";
import { QuizRunner } from "@/components/play/quiz-runner";
import { BackButton, PageTitle } from "@/components/ui";
import { getQuiz } from "@/lib/mock/fandom";

export default function QuizPage() {
  const { id } = useParams<{ id: string }>();

  if (id === "which-character") {
    return (
      <>
        <BackButton href="/quiz" />
        <PageTitle>Which character are you?</PageTitle>
        <MatchQuiz />
      </>
    );
  }

  const quiz = getQuiz(id);
  if (!quiz) notFound();

  return (
    <>
      <BackButton href="/quiz" />
      <PageTitle>{quiz.title}</PageTitle>
      <QuizRunner key={quiz.id} quiz={quiz} />
    </>
  );
}
