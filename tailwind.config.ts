import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const withOpacity = (variable: string) => `rgb(var(${variable}) / <alpha-value>)`;

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{md,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "Plus Jakarta Sans", "system-ui", "sans-serif"]
      },
      colors: {
        background: withOpacity("--color-background"),
        surface: withOpacity("--color-surface"),
        card: withOpacity("--color-card"),
        border: withOpacity("--color-border"),
        muted: withOpacity("--color-muted"),
        accent: withOpacity("--color-accent"),
        "accent-foreground": withOpacity("--color-accent-foreground"),
        text: {
          primary: withOpacity("--color-text-primary"),
          secondary: withOpacity("--color-text-secondary")
        },
        success: withOpacity("--color-success"),
        "success-foreground": withOpacity("--color-success-foreground"),
        warning: withOpacity("--color-warning"),
        "warning-foreground": withOpacity("--color-warning-foreground"),
        error: withOpacity("--color-error"),
        "error-foreground": withOpacity("--color-error-foreground"),
        brand: {
          primary: "#0F172A",
          accent: "#2563EB",
          soft: "#E2E8F0",
          dark: "#0B1220"
        }
      },
      typography: {
        DEFAULT: {
          css: {
            a: {
              color: "rgb(var(--color-accent))",
              "&:hover": {
                color: "rgb(var(--color-accent) / 0.8)"
              }
            },
            code: {
              backgroundColor: "rgb(var(--color-muted))",
              padding: "0.2rem 0.4rem",
              borderRadius: "0.25rem"
            }
          }
        },
        invert: {
          css: {
            a: {
              color: "rgb(var(--color-accent))",
              "&:hover": {
                color: "rgb(var(--color-accent) / 0.8)"
              }
            },
            code: {
              backgroundColor: "rgb(var(--color-card))",
              color: "rgb(var(--color-text-primary))"
            }
          }
        }
      }
    }
  },
  plugins: [typography]
};

export default config;
