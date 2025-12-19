import type { ContactMessage, ContactProvider } from "@/lib/contact/provider";
import { createRequestLogger } from "@/lib/logger";

export function getMockContactProvider(): ContactProvider {
  const logger = createRequestLogger();
  return {
    name: "mock",
    async send(payload: ContactMessage) {
      logger.info("MockContactProvider send", { payload });
      return;
    }
  };
}
