import type { ReactNode } from "react";

type Props = {
  type?: "info" | "warning" | "success";
  title?: string;
  children: ReactNode;
};

const styles = {
  info: {
    wrapper: "border-accent/30 bg-accent/10 text-text-primary",
    dot: "bg-blue-500"
  },
  warning: {
    wrapper:
      "border-warning/40 bg-warning/10 text-text-primary",
    dot: "bg-amber-500"
  },
  success: {
    wrapper:
      "border-success/40 bg-success/10 text-text-primary",
    dot: "bg-emerald-500"
  }
};

export default function Callout({ type = "info", title, children }: Props) {
  const style = styles[type];
  return (
    <div className={`relative overflow-hidden rounded-2xl border p-4 shadow-sm ${style.wrapper}`}>
      <div className="flex items-start gap-3">
        <span className={`mt-1 h-2 w-2 rounded-full ${style.dot}`} aria-hidden />
        <div className="space-y-1">
          {title ? <p className="text-sm font-semibold">{title}</p> : null}
          <div className="text-sm leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  );
}
