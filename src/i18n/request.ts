import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

import enNav from "../../messages/en/nav.json";
import enAuth from "../../messages/en/auth.json";
import enHero from "../../messages/en/hero.json";
import enDestinations from "../../messages/en/destinations.json";
import enVisaChecker from "../../messages/en/visaChecker.json";
import enEntryTypeInfo from "../../messages/en/entryTypeInfo.json";
import enPassportOverview from "../../messages/en/passportOverview.json";
import enDestinationGuides from "../../messages/en/destinationGuides.json";
import enServices from "../../messages/en/services.json";
import enImmigrationShowcase from "../../messages/en/immigrationShowcase.json";
import enHowItWorks from "../../messages/en/howItWorks.json";
import enComparison from "../../messages/en/comparison.json";
import enCta from "../../messages/en/cta.json";
import enFooter from "../../messages/en/footer.json";
import enCommon from "../../messages/en/common.json";
import enMeta from "../../messages/en/meta.json";

import esNav from "../../messages/es/nav.json";
import esAuth from "../../messages/es/auth.json";
import esHero from "../../messages/es/hero.json";
import esDestinations from "../../messages/es/destinations.json";
import esVisaChecker from "../../messages/es/visaChecker.json";
import esEntryTypeInfo from "../../messages/es/entryTypeInfo.json";
import esPassportOverview from "../../messages/es/passportOverview.json";
import esDestinationGuides from "../../messages/es/destinationGuides.json";
import esServices from "../../messages/es/services.json";
import esImmigrationShowcase from "../../messages/es/immigrationShowcase.json";
import esHowItWorks from "../../messages/es/howItWorks.json";
import esComparison from "../../messages/es/comparison.json";
import esCta from "../../messages/es/cta.json";
import esFooter from "../../messages/es/footer.json";
import esCommon from "../../messages/es/common.json";
import esMeta from "../../messages/es/meta.json";

import frNav from "../../messages/fr/nav.json";
import frAuth from "../../messages/fr/auth.json";
import frHero from "../../messages/fr/hero.json";
import frDestinations from "../../messages/fr/destinations.json";
import frVisaChecker from "../../messages/fr/visaChecker.json";
import frEntryTypeInfo from "../../messages/fr/entryTypeInfo.json";
import frPassportOverview from "../../messages/fr/passportOverview.json";
import frDestinationGuides from "../../messages/fr/destinationGuides.json";
import frServices from "../../messages/fr/services.json";
import frImmigrationShowcase from "../../messages/fr/immigrationShowcase.json";
import frHowItWorks from "../../messages/fr/howItWorks.json";
import frComparison from "../../messages/fr/comparison.json";
import frCta from "../../messages/fr/cta.json";
import frFooter from "../../messages/fr/footer.json";
import frCommon from "../../messages/fr/common.json";
import frMeta from "../../messages/fr/meta.json";

const messagesByLocale = {
  en: {
    nav: enNav,
    auth: enAuth,
    hero: enHero,
    destinations: enDestinations,
    visaChecker: enVisaChecker,
    entryTypeInfo: enEntryTypeInfo,
    passportOverview: enPassportOverview,
    destinationGuides: enDestinationGuides,
    services: enServices,
    immigrationShowcase: enImmigrationShowcase,
    howItWorks: enHowItWorks,
    comparison: enComparison,
    cta: enCta,
    footer: enFooter,
    common: enCommon,
    meta: enMeta,
  },
  es: {
    nav: esNav,
    auth: esAuth,
    hero: esHero,
    destinations: esDestinations,
    visaChecker: esVisaChecker,
    entryTypeInfo: esEntryTypeInfo,
    passportOverview: esPassportOverview,
    destinationGuides: esDestinationGuides,
    services: esServices,
    immigrationShowcase: esImmigrationShowcase,
    howItWorks: esHowItWorks,
    comparison: esComparison,
    cta: esCta,
    footer: esFooter,
    common: esCommon,
    meta: esMeta,
  },
  fr: {
    nav: frNav,
    auth: frAuth,
    hero: frHero,
    destinations: frDestinations,
    visaChecker: frVisaChecker,
    entryTypeInfo: frEntryTypeInfo,
    passportOverview: frPassportOverview,
    destinationGuides: frDestinationGuides,
    services: frServices,
    immigrationShowcase: frImmigrationShowcase,
    howItWorks: frHowItWorks,
    comparison: frComparison,
    cta: frCta,
    footer: frFooter,
    common: frCommon,
    meta: frMeta,
  },
} as const;

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  return {
    locale,
    messages: messagesByLocale[locale],
  };
});
