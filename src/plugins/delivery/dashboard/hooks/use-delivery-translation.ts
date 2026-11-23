import { useAdminTranslation } from "../../../../common/dashboard/use-admin-translation";
import en from "../translations/en.json";
import ru from "../translations/ru.json";
import tk from "../translations/tk.json";

/**
 * Thin alias kept for backwards compatibility with the delivery plugin
 * pages that already call `useDeliveryTranslation()`. New plugins should
 * import `useAdminTranslation` directly from
 * `@/common/dashboard/use-admin-translation` and pass their own
 * translation bundle.
 */
export function useDeliveryTranslation() {
  return useAdminTranslation({ en, ru, tk });
}
