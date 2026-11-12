export type StepItem = { number: number | string; title: string; description?: string };

export type StepListProps = {
  heading?: string;
  steps: StepItem[];
};

export function StepList({ heading, steps }: StepListProps) {
  return (
    <section className="py-14 sm:py-20 max-w-350 mx-auto px-6">
      {heading && <h2 className="mb-10 font-display text-3xl font-semibold text-[#161B22] sm:text-4xl">{heading}</h2>}
      <ol className="space-y-6">
        {steps.map((step) => (
          <li key={String(step.number)} className="flex gap-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#0F2444] font-mono text-[11px] font-semibold text-[#0F2444]">
              {step.number}
            </span>
            <div>
              <h3 className="font-body text-base font-semibold text-[#161B22]">{step.title}</h3>
              {step.description && <p className="mt-1 font-body text-sm text-[#161B22]/70 leading-relaxed">{step.description}</p>}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
