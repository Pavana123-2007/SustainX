import { useState } from "react";
import Navbar from "@/components/home/Navbar";
import SpaceBackground from "@/components/home/SpaceBackground";
import HeroSection from "@/components/home/HeroSection";
import EcoFactsMarquee from "@/components/home/EcoFactsMarquee";
import QuickActionsSection from "@/components/home/QuickActionsSection";
import SectionDivider from "@/components/home/SectionDivider";
import DashboardSection from "@/components/home/DashboardSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import CameraScanSection from "@/components/home/CameraScanSection";
import ImpactCounterStrip from "@/components/home/ImpactCounterStrip";
import FutureSimulatorSection from "@/components/home/FutureSimulatorSection";
import ImproveMyDaySection from "@/components/home/ImproveMyDaySection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import SmartSuggestionsSection from "@/components/home/SmartSuggestionsSection";
import Footer from "@/components/home/Footer";

type Tier = "best" | "better" | "least";
type SelectionMap = Record<string, { points: number; tier: Tier }>;

const Index = () => {
  const [selections, setSelections] = useState<SelectionMap>({});

  const totalScore = Object.values(selections).reduce((a, b) => a + b.points, 0);
  const goodActions = Object.values(selections).filter((s) => s.points > 0).length;
  const badActions  = Object.values(selections).filter((s) => s.points < 0).length;

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <SpaceBackground />
      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        <EcoFactsMarquee />
        <QuickActionsSection selections={selections} onSelect={setSelections} goodActions={goodActions} />
        <SectionDivider />
        <DashboardSection score={totalScore} goodActions={goodActions} badActions={badActions} />
        <SectionDivider />
        <HowItWorksSection />
        <SectionDivider />
        <CameraScanSection />
        <ImpactCounterStrip />
        <FutureSimulatorSection />
        <SectionDivider />
        <ImproveMyDaySection />
        <TestimonialsSection />
        <SectionDivider />
        <SmartSuggestionsSection />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
