import { clampPercent } from "@/lib/format";
import { cn } from "@/lib/utils";

interface AspectBarProps {
  /** Human-readable aspect name, e.g. "Creativity". */
  aspect: string;
  /** Raw 0–100 score from the backend. */
  score: number | bigint;
  /** Localised label for the low (left) end of the scale. */
  lowLabel: string;
  /** Localised label for the high (right) end of the scale. */
  highLabel: string;
  className?: string;
}

/**
 * A single aspect score rendered as a horizontal bar.
 *
 * The track always fills from the LEFT (low) toward the RIGHT (high), and both
 * ends are labelled so the direction is unambiguous. The numeric value is shown
 * next to the aspect name and exposed to assistive technology through
 * `role="meter"` with `aria-valuenow` / `aria-valuemin` / `aria-valuemax`.
 */
export function AspectBar({
  aspect,
  score,
  lowLabel,
  highLabel,
  className,
}: AspectBarProps) {
  const value = clampPercent(typeof score === "bigint" ? Number(score) : score);

  return (
    <div className={cn("min-w-0", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <span className="min-w-0 truncate text-sm font-medium text-foreground">
          {aspect}
        </span>
        <span className="shrink-0 font-mono text-sm font-semibold text-primary tabular-nums">
          {value}
        </span>
      </div>

      <div
        role="meter"
        aria-label={aspect}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuetext={`${value} / 100`}
        className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-muted"
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
          style={{ width: `${value}%` }}
        />
      </div>

      <div className="mt-1 flex items-center justify-between text-[0.6875rem] font-medium tracking-wide text-muted-foreground uppercase">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  );
}
