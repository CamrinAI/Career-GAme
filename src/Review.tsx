import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { ArrowRight, BookOpen, Check, RotateCcw, Target } from "lucide-react";
import { questions, type Question } from "./content";
import { shuffled, type Save } from "./engine";
import { recordAnswer, reviewQuestions, studySummary } from "./learning";
import { Quiz } from "./Quiz";
export function Review({
  save,
  setSave,
  tone,
}: {
  save: Save;
  setSave: Dispatch<SetStateAction<Save>>;
  tone: () => void;
}) {
  const [deck, setDeck] = useState<Question[]>([]),
    [index, setIndex] = useState(0),
    [answer, setAnswer] = useState<number | null>(null),
    [finished, setFinished] = useState(false);
  const summary = studySummary(save);
  const missed = reviewQuestions(save);
  function start(targeted: boolean) {
    setDeck(shuffled(targeted ? missed : questions));
    setIndex(0);
    setAnswer(null);
    setFinished(false);
  }
  function respond(choice: number) {
    if (answer !== null) return;
    setAnswer(choice);
    setSave((s) => recordAnswer(s, deck[index].id, choice));
    tone();
  }
  function next() {
    if (index + 1 === deck.length) {
      setFinished(true);
      setDeck([]);
    } else {
      setIndex(index + 1);
      setAnswer(null);
    }
  }
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">
            <span /> YOUR PRACTICE JOURNAL
          </div>
          <h1>Make every mistake useful.</h1>
          <p>Review what needs another look. Your pace, your progress.</p>
        </div>
      </div>
      <div className="review-stats">
        <div className="panel">
          <BookOpen />
          <strong>
            {summary.seen}/{questions.length}
          </strong>
          <span>Concepts practiced</span>
        </div>
        <div className="panel">
          <Check />
          <strong>
            {summary.correct}/{summary.attempts}
          </strong>
          <span>Correct attempts</span>
        </div>
        <div className="panel">
          <Target />
          <strong>{summary.review}</strong>
          <span>Need another look</span>
        </div>
      </div>
      <p className="muted">
        This is your practice history, not an exam-readiness score. Older saves
        keep their earned progress; answer history starts with this release.
      </p>
      {deck.length > 0 ? (
        <section className="panel review-practice">
          <div className="reader-meta">
            <span className="tag teal-tag">FOCUSED PRACTICE</span>
            <span>
              {index + 1} OF {deck.length} · NO TIME LIMIT
            </span>
          </div>
          <Quiz question={deck[index]} onAnswer={respond} answered={answer} />
          {answer !== null && (
            <button className="primary" onClick={next}>
              {index + 1 === deck.length ? "Finish review" : "Next concept"}
              <ArrowRight size={15} />
            </button>
          )}
          <button className="text-button" onClick={() => setDeck([])}>
            Return to journal
          </button>
        </section>
      ) : (
        <>
          <section className="panel review-start">
            <div>
              <h2>
                {finished
                  ? "Review complete. Keep growing."
                  : summary.attempts
                    ? "A little practice goes a long way."
                    : "Your next answer starts the story."}
              </h2>
              <p>
                {missed.length
                  ? `${missed.length} ${missed.length === 1 ? "concept is" : "concepts are"} ready for another look. Correct answers move them out of your review queue.`
                  : "Your review queue is clear. Try mixed practice or revisit the Academy anytime."}
              </p>
            </div>
            <div className="button-row">
              <button
                className="primary"
                disabled={!missed.length}
                onClick={() => start(true)}
              >
                <RotateCcw size={15} /> Practice missed questions
              </button>
              <button className="secondary" onClick={() => start(false)}>
                Mixed practice <ArrowRight size={15} />
              </button>
            </div>
          </section>
          <div className="review-history">
            {questions
              .filter((question) => save.practice[question.id])
              .map((question) => {
                const entry = save.practice[question.id];
                const correct = entry.lastAnswer === question.answer;
                return (
                  <article className="panel review-entry" key={question.id}>
                    <div className="reader-meta">
                      <span
                        className={"tag " + (correct ? "teal-tag" : "gold-tag")}
                      >
                        {correct ? "REVIEWED" : "ANOTHER LOOK"}
                      </span>
                      <span>
                        {entry.correct}/{entry.attempts} CORRECT ATTEMPTS
                      </span>
                    </div>
                    <h3>{question.prompt}</h3>
                    <p>
                      Last answer:{" "}
                      <strong>{question.options[entry.lastAnswer]}</strong>
                    </p>
                    <p>
                      Correct answer:{" "}
                      <strong>{question.options[question.answer]}</strong>
                    </p>
                    <div className="review-explanation">
                      {question.explanation}
                    </div>
                  </article>
                );
              })}
          </div>
        </>
      )}
    </>
  );
}
