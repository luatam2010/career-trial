import { Check, X } from "lucide-react";

import { useLanguage } from "@/lib/i18n";
import type { TestQuestionView } from "@/types";

interface TestQuestionCardProps {
  question: TestQuestionView;
  /** 1-based position of this question in the sequence. */
  index: number;
  /** The option the student picked, or null while unanswered. */
  selectedOptionId: bigint | null;
  onSelect: (optionId: bigint) => void;
  /** When true the options are read-only (used by the result review). */
  readOnly?: boolean;
  /** The option the backend marked correct, when reviewing a result. */
  correctOptionId?: bigint | null;
}

const LETTERS = ["A", "B", "C", "D", "E", "F"];

/**
 * One multiple-choice question with its selectable answer options.
 *
 * Options use the shared `.answer-option` / `.answer-marker` utilities so the
 * default, hover, selected, correct and incorrect states share one geometry.
 * Selection is expressed with `aria-pressed` (a toggle button), which the
 * utility styles directly.
 */
export function TestQuestionCard({
  question,
  index,
  selectedOptionId,
  onSelect,
  readOnly = false,
  correctOptionId = null,
}: TestQuestionCardProps) {
  const { t } = useLanguage();

  const optionState = (
    optionId: bigint,
  ): "correct" | "incorrect" | undefined => {
    if (correctOptionId === null) return undefined;
    if (optionId === correctOptionId) return "correct";
    if (selectedOptionId !== null && optionId === selectedOptionId) {
      return "incorrect";
    }
    return undefined;
  };

  return (
    <div data-ocid={`test.question.${index}`} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <p className="eyebrow">
          {t("test.questionLabel")} {index} {t("test.ofLabel")} 5
        </p>
        <h3 className="font-display text-xl font-semibold leading-snug text-heading-brand sm:text-2xl">
          {question.prompt}
        </h3>
        <span className="inline-flex w-fit items-center rounded-full border border-primary/25 bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
          {t("test.aspectLabel")}: {question.aspect}
        </span>
      </div>

      <fieldset
        data-ocid={`test.options.${index}`}
        className="flex flex-col gap-3 border-0 p-0"
      >
        <legend className="sr-only">{question.prompt}</legend>
        {question.options.map((option, optionIndex) => {
          const isSelected = selectedOptionId === option.id;
          const state = optionState(option.id);
          return (
            <button
              key={option.id.toString()}
              type="button"
              aria-pressed={isSelected}
              data-state={state}
              disabled={readOnly}
              onClick={() => onSelect(option.id)}
              data-ocid={`test.option.${index}.${optionIndex + 1}`}
              className="answer-option disabled:cursor-default"
            >
              <span className="answer-marker" aria-hidden="true">
                {LETTERS[optionIndex] ?? optionIndex + 1}
              </span>
              <span className="min-w-0 flex-1 text-sm leading-relaxed">
                {option.text}
              </span>
              {state === "correct" && (
                <Check className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              )}
              {state === "incorrect" && (
                <X className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              )}
            </button>
          );
        })}
      </fieldset>
    </div>
  );
}
