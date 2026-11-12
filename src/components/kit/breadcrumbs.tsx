import { Link } from "@/i18n/navigation";

export type BreadcrumbItem = { label: string; href: string };

export type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="mb-6 max-w-350 mx-auto px-6" aria-label="Breadcrumb">
      <ol className="flex flex-wrap gap-2 font-mono text-[11px] uppercase tracking-wider text-[#161B22]/40 sm:text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-1.5">
              {isLast ? (
                <span className="text-[#161B22]">{item.label}</span>
              ) : (
                <Link href={item.href} className="hover:text-[#0F2444] transition-colors">
                  {item.label}
                </Link>
              )}
              {!isLast && (
                <svg
                  className="h-3 w-3 text-[#161B22]/30"
                  viewBox="0 0 12 12"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m4.5 3 3 3-3 3"
                  />
                </svg>
              )}
            </li>
          );
        })}
      </ol>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: items.map((item, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: item.label,
              item: item.href.startsWith("http") ? item.href : `https://visaexpeditor.com${item.href}`,
            })),
          }),
        }}
      />
    </nav>
  );
}
