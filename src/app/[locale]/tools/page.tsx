import { hubBySlug } from "@/content/services";
import { generateLocaleParams, makeHubRoute } from "@/lib/page-factories";

const route = makeHubRoute(hubBySlug("tools"));

export const generateStaticParams = generateLocaleParams;
export const generateMetadata = route.generateMetadata;
export default route.Page;
