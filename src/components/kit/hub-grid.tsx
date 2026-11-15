import { Link } from "@/i18n/navigation";
import { ComingSoonBadge } from "@/components/coming-soon-badge";

export type HubItem = {
  href: string;
  label: string;
  description?: string;
  soon?: boolean;
};

export type HubGridProps = {
  heading?: string;
  subhead?: string;
  items: HubItem[];
};

export function HubGrid({ heading, subhead, items }: HubGridProps) {
  return (
    <section className="py-14 sm:py-20 max-w-350 mx-auto px-6">
      <div className="mb-12">
        {heading && <h2 className="font-display text-3xl font-semibold text-[#161B22] sm:text-4xl">{heading}</h2>}
        {subhead && <p className="mt-3 font-body text-sm text-[#161B22]/60 sm:text-base">{subhead}</p>}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group relative flex flex-col rounded-3xl border border-[#0F2444]/10 p-6 sm:p-8 transition-colors hover:bg-[#0F2444]/5"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <h3 className="font-display text-xl font-semibold text-[#161B22] group-hover:text-[#0F2444]">{item.label}</h3>
              {item.soon && <ComingSoonBadge />}
            </div>
            {item.description && (
              <p className="mt-3 font-body text-sm text-[#161B22]/60 line-clamp-2">{item.description}</p>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
