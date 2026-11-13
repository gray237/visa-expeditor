import type { ReactNode } from "react";

export function AuthCard({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-[#0F2444]/10 bg-white p-7 shadow-[0_20px_60px_-30px_rgba(15,36,68,0.35)] sm:p-9">
      <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#B8925A]">
        {eyebrow}
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold leading-tight text-[#161B22]">
        {title}
      </h1>
      <p className="mt-3 font-body text-sm leading-relaxed text-[#161B22]/65">{subtitle}</p>

      <div className="mt-7">{children}</div>

      {footer && (
        <div className="mt-6 border-t border-[#0F2444]/10 pt-5 font-body text-sm text-[#161B22]/70">
          {footer}
        </div>
      )}
    </div>
  );
}

export function AuthNotice({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-xl border border-[#B8925A]/30 bg-[#B8925A]/8 px-4 py-3 font-body text-sm leading-relaxed text-[#161B22]/75">
      {children}
    </p>
  );
}

export function AuthError({ children }: { children: ReactNode }) {
  return (
    <p
      role="alert"
      className="rounded-xl border border-[#B42318]/25 bg-[#B42318]/6 px-4 py-3 font-body text-sm leading-relaxed text-[#B42318]"
    >
      {children}
    </p>
  );
}
