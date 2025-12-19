import { contactApiKey, contactFromEmail, contactProvider, contactToEmail } from "@/lib/config";
import type { ContactProvider } from "@/lib/contact/provider";
import { getMockContactProvider } from "@/lib/contact/mockProvider";
import { createRequestLogger } from "@/lib/logger";

function getResendProvider(): ContactProvider {
  const logger = createRequestLogger();
  return {
    name: "resend",
    async send(payload) {
      logger.warn("Resend provider not implemented; falling back to mock", { payload });
    }
  };
}

function getSendGridProvider(): ContactProvider {
  const logger = createRequestLogger();
  return {
    name: "sendgrid",
    async send(payload) {
      logger.warn("SendGrid provider not implemented; falling back to mock", { payload });
    }
  };
}

export function getContactProvider(): ContactProvider {
  const provider = contactProvider.toLowerCase();
  if (!contactApiKey || !contactFromEmail || !contactToEmail) {
    return getMockContactProvider();
  }
  switch (provider) {
    case "resend":
      return getResendProvider();
    case "sendgrid":
      return getSendGridProvider();
    case "mock":
    default:
      return getMockContactProvider();
  }
}
