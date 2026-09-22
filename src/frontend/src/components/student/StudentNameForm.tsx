import { CheckCircle2, TriangleAlert, UserRound } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGetMyProfile, useSetMyDisplayName } from "@/lib/backend-client";
import { useLanguage } from "@/lib/i18n";

/** Backend rejects names longer than this; mirror it for instant feedback. */
const MAX_NAME_LENGTH = 60;

/**
 * Lets the signed-in student set the display name that appears as
 * `testerName` on every evidence card they publish.
 */
export function StudentNameForm() {
  const { t } = useLanguage();
  const profile = useGetMyProfile();
  const saveName = useSetMyDisplayName();

  const [draft, setDraft] = useState("");
  const [initialised, setInitialised] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const storedName = profile.data?.displayName ?? "";

  // One-time initialisation from the backend value. After that the draft is
  // owned by the user, so a refetch never overwrites what they are typing.
  if (!initialised && !profile.isLoading && profile.data !== undefined) {
    setInitialised(true);
    setDraft(storedName);
  }

  const trimmed = draft.trim();
  const tooLong = trimmed.length > MAX_NAME_LENGTH;
  const isEmpty = trimmed.length === 0;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaved(false);
    setError(null);

    if (isEmpty) {
      setError(t("studentArea.nameRequired"));
      return;
    }
    if (tooLong) {
      setError(t("studentArea.nameTooLong"));
      return;
    }

    saveName.mutate(trimmed, {
      onSuccess: (result) => {
        if (result === "invalidName") {
          setError(t("studentArea.nameInvalid"));
          return;
        }
        if (result === "notSignedIn") {
          setError(t("studentArea.nameNotSignedIn"));
          return;
        }
        setSaved(true);
      },
      onError: () => setError(t("studentArea.nameError")),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm sm:p-8"
      data-ocid="student.name_form"
    >
      <div className="flex items-start gap-4">
        <span
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary"
          aria-hidden="true"
        >
          <UserRound className="size-5" />
        </span>
        <div className="min-w-0">
          <h2 className="text-xl font-semibold sm:text-2xl">
            {t("studentArea.nameHeading")}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("studentArea.nameHint")}
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1">
          <Label htmlFor="student-display-name">
            {t("studentArea.nameLabel")}
          </Label>
          <Input
            id="student-display-name"
            name="displayName"
            value={draft}
            maxLength={MAX_NAME_LENGTH + 20}
            autoComplete="name"
            placeholder={t("studentArea.namePlaceholder")}
            onChange={(event) => {
              setSaved(false);
              setError(null);
              setDraft(event.target.value);
            }}
            aria-invalid={error !== null}
            aria-describedby="student-display-name-help"
            className="mt-2"
            data-ocid="student.name_input"
          />
          <p
            id="student-display-name-help"
            className="mt-2 text-xs text-muted-foreground"
          >
            {t("studentArea.nameHelp")}
          </p>
        </div>

        <Button
          type="submit"
          className="shrink-0 rounded-full sm:mb-7"
          disabled={saveName.isPending || isEmpty || tooLong}
          data-ocid="student.name_save_button"
        >
          {saveName.isPending
            ? t("studentArea.nameSaving")
            : t("studentArea.nameSave")}
        </Button>
      </div>

      <div className="mt-4 min-h-6">
        {saved && (
          <p
            className="flex items-center gap-2 text-sm font-medium text-primary"
            aria-live="polite"
            data-ocid="student.name_success_state"
          >
            <CheckCircle2 className="size-4" aria-hidden="true" />
            {t("studentArea.nameSaved")}
          </p>
        )}

        {error && (
          <p
            className="flex items-center gap-2 text-sm font-medium text-destructive"
            role="alert"
            data-ocid="student.name_error_state"
          >
            <TriangleAlert className="size-4" aria-hidden="true" />
            {error}
          </p>
        )}
      </div>
    </form>
  );
}
