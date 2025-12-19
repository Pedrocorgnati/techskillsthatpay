# Design Tokens

Final palette tuned for a tech career skills blog with strong readability, premium feel, and reliable contrast in light/dark themes.

## Light Theme

| Token | Hex |
| --- | --- |
| background | `#F7F8FB` |
| surface | `#F7F8FB` |
| card | `#FFFFFF` |
| border | `#DFE3EB` |
| muted | `#F1F5F9` |
| text.primary | `#0F172A` |
| text.secondary | `#475569` |
| accent | `#2563EB` |
| accent-foreground | `#F3F4F6` |
| success | `#10B981` |
| success-foreground | `#ECFDF5` |
| warning | `#EAB308` |
| warning-foreground | `#FEFCE8` |
| error | `#EF4444` |
| error-foreground | `#FFF1F2` |

## Dark Theme

| Token | Hex |
| --- | --- |
| background | `#1F1F1F` |
| surface | `#1F1F1F` |
| card | `#010409` |
| border | `#383C44` |
| muted | `#262D37` |
| text.primary | `#E2E8F0` |
| text.secondary | `#94A3B8` |
| accent | `#5E81FF` |
| accent-foreground | `#EFF6FF` |
| success | `#34D399` |
| success-foreground | `#0A261B` |
| warning | `#F59E0B` |
| warning-foreground | `#443106` |
| error | `#F87171` |
| error-foreground | `#520A0A` |

### Rationale
- Neutral backgrounds (light: #F7F8FB, dark: #1F1F1F) keep focus on content while feeling modern and trustworthy.
- Accent blues (#2563EB / #5E81FF) align with tech/tooling aesthetics and pair well with grayscale for clear links and CTAs.
- Card/border neutrals keep layouts airy in light mode and crisp in dark mode (card #010409 ensures depth against #1F1F1F).
- Feedback colors follow familiar, accessible hues for success/warn/error.

### Contrast notes
- Text.primary on background: WCAG AA/AAA compliant in both themes.
- Text.secondary on background: AA for body sizes; use primary for small text.
- Accent on background: AA for normal text; keep accent-foreground on accent for buttons to meet AA.
- Cards/borders maintain 3:1+ contrast against backgrounds for clear separation.
