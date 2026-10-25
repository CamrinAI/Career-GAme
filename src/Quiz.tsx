import { useMemo } from "react";
import { Check, Crosshair } from "lucide-react";
import type { Question } from "./content";
import { shuffled } from "./engine";
export function Quiz({
  question,
  onAnswer,
  answered,
}: {
  question: Question;
  onAnswer: (answer: number) => void;
  answered: number | null;
}) {
  const order = useMemo(
    () => shuffled(question.options.map((_, index) => index)),
    [question.id],
  );
  return (
    <div className="quiz">
      <div className="eyebrow">
        <Crosshair size={14} /> KNOWLEDGE CHECK
      </div>
      <h3>{question.prompt}</h3>
      <div className="answers">
        {order.map((index, position) => (
          <button
            key={index}
            disabled={answered !== null}
            className={
              "answer " +
              (answered !== null
                ? index === question.answer
                  ? "correct"
                  : index === answered
                    ? "incorrect"
                    : ""
                : "")
            }
            onClick={() => onAnswer(index)}
          >
            <span>{String.fromCharCode(65 + position)}</span>
            {question.options[index]}
            {answered !== null && index === question.answer && (
              <Check size={17} />
            )}
          </button>
        ))}
      </div>
      {answered !== null && (
        <div
          className={
            "feedback " + (answered === question.answer ? "success" : "")
          }
          role="status"
        >
          <strong>
            {answered === question.answer
              ? "Well done, Hunter."
              : "A chance to grow."}
          </strong>
          <p>{question.explanation}</p>
        </div>
      )}
    </div>
  );
}
