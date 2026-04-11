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

const Index = () => {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <SpaceBackground />
      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        <EcoFactsMarquee />
        <QuickActionsSection />
        <SectionDivider />
        <DashboardSection />
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