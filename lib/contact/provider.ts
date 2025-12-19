export type ContactMessage = {
  name: string;
  email: string;
  message: string;
  locale: string;
};

export interface ContactProvider {
  name: string;
  send(payload: ContactMessage): Promise<void>;
}
