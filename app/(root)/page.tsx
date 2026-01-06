import { CtaSection } from "../_components/cat-section";
import { FeaturesGrid } from "../_components/features-grid";
import { HeroSection } from "../_components/hero-section";
import { StatsSection } from "../_components/stats-section";

const SetUpPage = () => {
  return (
    <main>
      <HeroSection />
      <StatsSection />
      <FeaturesGrid />
      <CtaSection />
    </main>
  );
};

export default SetUpPage;
