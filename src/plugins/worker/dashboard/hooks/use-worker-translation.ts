import { useUserSettings } from "@vendure/dashboard";
import en from "../translations/en.json";
import tk from "../translations/tk.json";

const translations: Record<string, any> = {
  en,
  tk,
};

export function useWorkerTranslation() {
  const {
    settings: { contentLanguage },
  } = useUserSettings();

  const t = (key: string) => {
    const keys = key.split(".");
    let result = translations[contentLanguage] || translations["en"];

    for (const k of keys) {
      if (result && result[k]) {
        result = result[k];
      } else {
        let fallback = translations["en"];
        for (const fk of keys) {
          if (fallback && fallback[fk]) {
            fallback = fallback[fk];
          } else {
            return key;
          }
        }
        return fallback;
      }
    }
    return result;
  };

  return { t };
}
