import { Link } from "@/i18n/navigation";

export type CtaBandProps = {
  title: string;
  body?: string;
  buttonLabel: string;
  buttonHref: string;
};

export function CtaBand({ title, body, buttonLabel, buttonHref }: CtaBandProps) {
  return (
    <section className="rounded-3xl border border-[#0F2444] bg-[#0F2444] p-8 sm:p-12 text-[#F5F6F4]">
      <div className="mx-auto max-w-350 px-6">
        <h2 className="font-display text-2xl font-semibold sm:text-3xl">{title}</h2>
        {body && <p className="mt-3 font-body text-sm text-[#F5F6F4]/80 sm:text-base">{body}</p>}
        <div className="mt-8">
          <Link
            href={buttonHref}
            className="inline-flex items-center justify-center rounded-xl px-6 py-3.5 font-body text-sm font-semibold bg-[#F5F6F4] text-[#0F2444] transition-colors hover:bg-[#F5F6F4]/90"
          >
            {buttonLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
