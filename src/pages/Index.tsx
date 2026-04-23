import { useAuth } from "@/context/AuthContext";
import { useUserData } from "@/hooks/useUserData";
import { useUserStats } from "@/hooks/useUserStats";
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
  const { user } = useAuth();
  const { selections, setSelections } = useUserData(user?.uid ?? null);
  const { stats, refetch: refetchStats } = useUserStats();

  // Use database stats for dashboard (real-time data from Neon)
  const totalScore = stats.totalPoints;
  const goodActions = stats.goodActionsCount;
  const badActions = stats.badActionsCount;

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <SpaceBackground />
      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        <EcoFactsMarquee />
        <QuickActionsSection selections={selections} onSelect={setSelections} goodActions={goodActions} onActionSaved={refetchStats} />
        <SectionDivider />
        <DashboardSection score={totalScore} goodActions={goodActions} badActions={badActions} />
        <SectionDivider />
        <HowItWorksSection />
        <SectionDivider />
        <CameraScanSection />
        <ImpactCounterStrip />
        <FutureSimulatorSection stats={stats} />
        <SectionDivider />
        <ImproveMyDaySection selections={selections ?? {}} />
        <TestimonialsSection />
        <SectionDivider />
        <SmartSuggestionsSection stats={stats} selections={selections} />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
