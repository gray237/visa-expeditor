import { VISA_PASSPORT_CODES, visaRecordsForPassport } from "@/data/visa";

export const dynamicParams = false;

export function generateStaticParams() {
  return VISA_PASSPORT_CODES.map((passport) => ({ passport }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ passport: string }> },
) {
  const { passport } = await params;
  const code = passport.toUpperCase();
  if (!/^[A-Z]{2}$/.test(code)) {
    return Response.json({ error: "invalid passport" }, { status: 400 });
  }
  return Response.json(
    { passport: code, records: visaRecordsForPassport(code) },
    { headers: { "Cache-Control": "public, max-age=31536000, immutable" } },
  );
}
