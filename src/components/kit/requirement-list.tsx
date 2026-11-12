export type RequirementItem = { label: string; value?: string };

export type RequirementListProps = {
  heading?: string;
  items: RequirementItem[];
};

export function RequirementList({ heading, items }: RequirementListProps) {
  return (
    <section className="py-14 sm:py-20 max-w-350 mx-auto px-6">
      {heading && <h2 className="mb-8 font-display text-3xl font-semibold text-[#161B22] sm:text-4xl">{heading}</h2>}
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex items-start gap-3 rounded-xl border border-[#0F2444]/10 p-4">
            <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-[#B8925A]">
              {item.label}
            </span>
            <span className="font-body text-sm text-[#161B22]/70 leading-relaxed">{item.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
