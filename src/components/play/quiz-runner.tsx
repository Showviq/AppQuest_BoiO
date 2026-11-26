"use client";

import { Check, RotateCcw, Timer, Trophy, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BookCover } from "@/components/book-cover";
import { Button, Progress, Switch, field } from "@/components/ui";
import { getBook } from "@/lib/mock-data";
import type { Question, Quiz } from "@/lib/mock/fandom";

type Phase = "intro" | "play" | "done";

function isCorrect(q: Question, a: number | boolean | string): boolean {
  switch (q.kind) {
    case "tf":
      return a === q.answer;
    case "fill":
      return typeof a === "string" && q.answer.includes(a.trim().toLowerCase());
    default:
      return a === q.answer;
  }
}

function correctText(q: Question) {
  switch (q.kind) {
    case "tf":
      return q.answer ? "True" : "False";
    case "fill":
      return q.answer[0];
    case "quote":
      return getBook(q.options[q.answer])?.title ?? "";
    default:
      return q.options[q.answer];
  }
}

const kindLabel: Record<Question["kind"], string> = {
  mcq: "Multiple choice",
  tf: "True or false",
  fill: "Fill in the blank",
  quote: "Match the quote",
  image: "Picture",
};

export function QuizRunner({ quiz }: { quiz: Quiz }) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [timed, setTimed] = useState(true);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | boolean | string | null>(null);
  const [text, setText] = useState("");
  const [score, setScore] = useState(0);
  const [left, setLeft] = useState(quiz.seconds);

  const q = quiz.questions[i];
  const answered = picked !== null;

  // Per-question countdown; time-out counts as a wrong answer.
  useEffect(() => {
    if (phase !== "play" || !timed || answered) return;
    if (left <= 0) {
      setPicked("__timeout__");
      return;
    }
    const t = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, timed, answered, left]);

  const answer = (a: number | boolean | string) => {
    if (answered) return;
    setPicked(a);
    if (isCorrect(q, a)) setScore((s) => s + 1);
  };

  const next = () => {
    if (i === quiz.questions.length - 1) return setPhase("done");
    setI(i + 1);
    setPicked(null);
    setText("");
    setLeft(quiz.seconds);
  };

  const restart = () => {
    setI(0);
    setPicked(null);
    setText("");
    setScore(0);
    setLeft(quiz.seconds);
    setPhase("play");
  };

  if (phase === "intro") {
    return (
      <div className="mt-4 rounded-2xl border border-line bg-surface p-5">
        <p className="text-ink-soft">
          {quiz.questions.length} questions · +{quiz.xp} XP
        </p>
        <Switch checked={timed} onChange={setTimed} label={<span className="flex items-center gap-2"><Timer size={16} /> Timed · {quiz.seconds}s each</span>} />
        <Button className="mt-3 w-full" onClick={restart}>
          Start
        </Button>
      </div>
    );
  }

  if (phase === "done") {
    const pct = score / quiz.questions.length;
    const xp = Math.round(quiz.xp * pct);
    return (
      <div className="mt-6 flex flex-col items-center text-center">
        <div className="grid size-24 place-items-center rounded-full bg-forest-soft text-forest">
          <Trophy size={40} />
        </div>
        <p className="mt-4 text-4xl font-semibold">
          {score}/{quiz.questions.length}
        </p>
        <p className="mt-1 text-lg font-semibold text-gold">+{xp} XP</p>
        <div className="mt-6 grid w-full grid-cols-2 gap-3">
          <Button variant="outline" onClick={restart}>
            <RotateCcw size={18} /> Retry
          </Button>
          <Link href="/quiz" className="inline-flex min-h-11 items-center justify-center rounded-full bg-forest font-semibold text-on-forest">
            More quizzes
          </Link>
        </div>
      </div>
    );
  }

  const optionClass = (correct: boolean, chosen: boolean) =>
    `flex min-h-12 w-full items-center justify-between rounded-xl border px-4 text-left ${
      !answered
        ? "border-line bg-surface hover:bg-surface-2"
        : correct
          ? "border-forest bg-forest-soft text-forest"
          : chosen
            ? "border-danger text-danger"
            : "border-line opacity-60"
    }`;

  const options = (labels: string[]) => (
    <ul className="mt-4 flex flex-col gap-2">
      {labels.map((label, n) => {
        const correct = "answer" in q && q.answer === n;
        return (
          <li key={label}>
            <button className={optionClass(correct, picked === n)} onClick={() => answer(n)} disabled={answered}>
              {label}
              {answered && correct && <Check size={18} />}
              {answered && picked === n && !correct && <X size={18} />}
            </button>
          </li>
        );
      })}
    </ul>
  );

  const good = answered && picked !== "__timeout__" && isCorrect(q, picked);

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between text-sm text-ink-soft">
        <span>
          {i + 1}/{quiz.questions.length} · {kindLabel[q.kind]}
        </span>
        {timed && (
          <span className={`flex items-center gap-1 ${left <= 5 ? "text-danger" : ""}`}>
            <Timer size={14} /> {left}s
          </span>
        )}
      </div>
      <Progress value={timed ? (left / quiz.seconds) * 100 : ((i + 1) / quiz.questions.length) * 100} className="mt-2" />

      <div className="mt-6">
        {q.kind === "quote" ? (
          <>
            <p className="text-sm text-ink-soft">Which book is this from?</p>
            <blockquote className="mt-2 border-l-2 border-gold pl-3 font-serif text-xl">“{q.quote}”</blockquote>
            {options(q.options.map((id) => getBook(id)?.title ?? id))}
          </>
        ) : q.kind === "image" ? (
          <>
            {getBook(q.bookId) && (
              <div className="flex justify-center">
                <BookCover book={getBook(q.bookId)!} />
              </div>
            )}
            <p className="mt-4 text-xl font-medium">{q.q}</p>
            {options(q.options)}
          </>
        ) : (
          <>
            <p className="text-xl font-medium">{q.q}</p>
            {q.kind === "mcq" && options(q.options)}
            {q.kind === "tf" && (
              <div className="mt-4 grid grid-cols-2 gap-3">
                {[true, false].map((v) => (
                  <button key={String(v)} className={optionClass(q.answer === v, picked === v)} onClick={() => answer(v)} disabled={answered}>
                    {v ? "True" : "False"}
                  </button>
                ))}
              </div>
            )}
            {q.kind === "fill" && (
              <form
                className="mt-4 flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (text.trim()) answer(text);
                }}
              >
                <input className={field} value={text} onChange={(e) => setText(e.target.value)} disabled={answered} aria-label="Answer" autoFocus />
                <Button type="submit" disabled={answered || !text.trim()}>
                  OK
                </Button>
              </form>
            )}
          </>
        )}
      </div>

      {answered && (
        <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl bg-surface-2 p-4" role="status">
          <span className={`flex items-center gap-2 font-semibold ${good ? "text-forest" : "text-danger"}`}>
            {good ? <Check size={18} /> : <X size={18} />}
            {good ? "Correct" : picked === "__timeout__" ? `Time's up · ${correctText(q)}` : correctText(q)}
          </span>
          <Button onClick={next}>{i === quiz.questions.length - 1 ? "Finish" : "Next"}</Button>
        </div>
      )}
    </div>
  );
}
