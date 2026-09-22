/**
 * Whole-site language context.
 *
 * The chosen language is persisted to localStorage and defaults to English.
 * `t()` looks the key up in the active dictionary and falls back to the English
 * string, then to the key itself, so a missing translation never renders blank.
 */
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  LANGUAGES,
  LANGUAGE_LABELS,
  LANGUAGE_NAMES,
  type Language,
  type TranslationKey,
  translations,
} from "@/lib/translations";

const STORAGE_KEY = "career-trial.language";
const DEFAULT_LANGUAGE: Language = "en";

export type { Language, TranslationKey };
export { LANGUAGES, LANGUAGE_LABELS, LANGUAGE_NAMES };

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  /** Translate a key into the active language. */
  t: (key: TranslationKey | string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function isLanguage(value: unknown): value is Language {
  return (
    typeof value === "string" &&
    (LANGUAGES as readonly string[]).includes(value)
  );
}

function readStoredLanguage(): Language {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return isLanguage(stored) ? stored : DEFAULT_LANGUAGE;
  } catch {
    return DEFAULT_LANGUAGE;
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(readStoredLanguage);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, language);
    } catch {
      /* Storage can be unavailable in private mode — the site still works. */
    }
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState((current) => (current === "en" ? "vi" : "en"));
  }, []);

  const t = useCallback(
    (key: TranslationKey | string) => {
      const active = translations[language] as Record<string, string>;
      const fallback = translations[DEFAULT_LANGUAGE] as Record<string, string>;
      return active[key] ?? fallback[key] ?? key;
    },
    [language],
  );

  const value = useMemo<LanguageContextValue>(
    () => ({ language, setLanguage, toggleLanguage, t }),
    [language, setLanguage, toggleLanguage, t],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside a LanguageProvider");
  }
  return context;
}
