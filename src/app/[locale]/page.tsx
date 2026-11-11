"use client";

import { useState } from "react";
import { Hero } from "@/components/hero";
import { DestinationGrid } from "@/components/destination-grid";
import { Services } from "@/components/services";
import { ImmigrationShowcase } from "@/components/immigration-showcase";
import { HowItWorks } from "@/components/how-it-works";
import { Comparison } from "@/components/comparison";
import { CtaCarousel } from "@/components/cta-carousel";

export default function HomePage() {
  const [passportCode, setPassportCode] = useState("US");

  return (
    <>
      <Hero passportCode={passportCode} onPassportChange={setPassportCode} />
      <DestinationGrid passportCode={passportCode} />
      <Services />
      <ImmigrationShowcase />
      <HowItWorks />
      <Comparison />
      <CtaCarousel />
    </>
  );
}