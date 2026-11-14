import { ImageResponse } from "next/og";
import { routing } from "@/i18n/routing";

const COPY = {
  en: {
    title: "Travel requirements, made clearer.",
    subtitle: "Passport and visa information for your next trip.",
  },
  es: {
    title: "Requisitos de viaje más claros.",
    subtitle: "Información de pasaportes y visas para tu próximo viaje.",
  },
  fr: {
    title: "Des formalités de voyage plus claires.",
    subtitle: "Informations sur les passeports et visas pour votre prochain voyage.",
  },
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale: requestedLocale } = await params;
  const locale = routing.locales.find((item) => item === requestedLocale);
  if (!locale) return new Response("Not found", { status: 404 });

  const copy = COPY[locale];
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0F2444",
          color: "#F5F6F4",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ color: "#D7B77F", fontSize: 24, letterSpacing: 4 }}>
          VISA EXPEDITOR
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.1 }}>
            {copy.title}
          </div>
          <div style={{ color: "#D7DDE5", fontSize: 30 }}>{copy.subtitle}</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
