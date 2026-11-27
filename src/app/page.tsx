import type { Metadata } from "next";
import { cookies } from "next/headers";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "@/lib/server/session-cookies";
import styles from "@/modules/landing/landing.module.css";
import { AssistantDemo } from "@/modules/landing/components/AssistantDemo";
import { ClosingSection } from "@/modules/landing/components/ClosingSection";
import { FeatureLedger } from "@/modules/landing/components/FeatureLedger";
import { FounderSection } from "@/modules/landing/components/FounderSection";
import { HeroSection } from "@/modules/landing/components/HeroSection";
import { LandingFooter } from "@/modules/landing/components/LandingFooter";
import { LandingNav } from "@/modules/landing/components/LandingNav";
import { MonthStory } from "@/modules/landing/components/MonthStory";
import { TrustSection } from "@/modules/landing/components/TrustSection";

export const metadata: Metadata = {
  title: { absolute: "Asistente de Vida Digital · Tu mes, pagado a tiempo" },
  description:
    "Servicios, facturas, vencimientos y tarjetas en un solo lugar. La IA lee las facturas que te llegan por mail y vos confirmás.",
  openGraph: {
    title: "Asistente de Vida Digital",
    description: "Tu mes, pagado a tiempo: servicios, facturas, vencimientos y tarjetas en un solo lugar.",
    locale: "es_AR",
    type: "website",
  },
};

/** Presentación pública de la app. Con sesión iniciada, las acciones llevan a la cuenta. */
export default async function LandingPage() {
  const jar = await cookies();
  const signedIn = jar.has(ACCESS_COOKIE) || jar.has(REFRESH_COOKIE);
  return (
    <div className={styles.page}>
      <LandingNav signedIn={signedIn} />
      <main>
        <HeroSection signedIn={signedIn} />
        <MonthStory />
        <FeatureLedger />
        <AssistantDemo />
        <TrustSection />
        <FounderSection />
        <ClosingSection signedIn={signedIn} />
      </main>
      <LandingFooter />
    </div>
  );
}
