import { detailByPath } from "@/content/services";
import { generateLocaleParams, makeServiceDetailRoute } from "@/lib/page-factories";

const route = makeServiceDetailRoute(detailByPath("/immigration/citizenship"));

export const generateStaticParams = generateLocaleParams;
export const generateMetadata = route.generateMetadata;
export default route.Page;
