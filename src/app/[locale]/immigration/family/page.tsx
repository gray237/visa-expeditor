import { detailByPath } from "@/content/services";
import { generateLocaleParams, makeServiceDetailRoute } from "@/lib/page-factories";

const route = makeServiceDetailRoute(detailByPath("/immigration/family"));

export const generateStaticParams = generateLocaleParams;
export const generateMetadata = route.generateMetadata;
export default route.Page;
