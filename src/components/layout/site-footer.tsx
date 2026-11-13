import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function SiteFooter() {
  const t = useTranslations("footer");

  const footerLinks = {
    [t("services")]: [
      { label: t("passports"), href: "/passports" },
      { label: t("visas"), href: "/visas" },
      { label: t("immigration"), href: "/immigration" },
    ],
    [t("company")]: [
      { label: t("about"), href: "/about" },
      { label: t("support"), href: "/contact" },
    ],
    [t("legal")]: [
      { label: t("terms"), href: "/terms" },
      { label: t("privacy"), href: "/privacy" },
      { label: t("disclaimer"), href: "/disclaimer" },
    ],
  };

  return (
    <footer className="border-t border-[#0F2444]/10 bg-[#F5F6F4]">
      <div className="mx-auto max-w-350 px-6 py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2">
            <span className="font-display text-xl font-semibold text-[#0F2444]">
              Visa Expeditor
            </span>
            <p className="mt-3 max-w-xs font-body text-sm text-[#161B22]/70">
              {t("tagline")}
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-body text-sm font-semibold text-[#0F2444]">
                {category}
              </h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-body text-sm text-[#161B22]/70 transition-colors hover:text-[#0F2444]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-[#0F2444]/10 pt-8 font-mono text-xs text-[#161B22]/60 md:flex-row">
          <p>{t("copyright", { year: new Date().getFullYear() })}</p>
          <div className="flex gap-6">
            <Link href="/terms" className="hover:text-[#0F2444]">
              {t("terms")}
            </Link>
            <Link href="/privacy" className="hover:text-[#0F2444]">
              {t("privacy")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}