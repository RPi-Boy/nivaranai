import React from "react";
import { AuthSection } from "./sections/AuthSection/AuthSection";
import { ComplaintTrackingSection } from "./sections/ComplaintTrackingSection/ComplaintTrackingSection";
import { HeroSection } from "./sections/HeroSection/HeroSection";
import { HowItWorksSection } from "./sections/HowItWorksSection/HowItWorksSection";

export const Frame = (): JSX.Element => {
  return (
    <main className="bg-white w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 w-full">
        <section className="lg:row-span-2 w-full">
          <HeroSection />
        </section>
        <section className="w-full">
          <AuthSection />
        </section>
        <section className="w-full">
          <ComplaintTrackingSection />
        </section>
        <section className="lg:col-span-2 w-full">
          <HowItWorksSection />
        </section>
      </div>
    </main>
  );
};
