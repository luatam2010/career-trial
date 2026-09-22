import { BusinessModelSection } from "@/components/main/BusinessModelSection";
import { EcosystemSection } from "@/components/main/EcosystemSection";
import { EvidencePreviewSection } from "@/components/main/EvidencePreviewSection";
import { HeroSection } from "@/components/main/HeroSection";
import { HowItWorksSection } from "@/components/main/HowItWorksSection";
import { PathToProfitabilitySection } from "@/components/main/PathToProfitabilitySection";
import { PilotPricingSection } from "@/components/main/PilotPricingSection";
import { TeamSection } from "@/components/main/TeamSection";

/**
 * Main Page — the full Career Trial landing experience:
 * hero, how it works, evidence preview, business model, pilot pricing,
 * our team, path to profitability and the ecosystem invitation.
 */
export default function MainPage() {
  return (
    <div data-ocid="main.page" className="relative">
      <HeroSection />
      <HowItWorksSection />
      <EvidencePreviewSection />
      <BusinessModelSection />
      <PilotPricingSection />
      <TeamSection />
      <PathToProfitabilitySection />
      <EcosystemSection />
    </div>
  );
}
