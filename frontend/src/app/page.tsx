import Hero from "@/components/sections/Hero";
import FeaturesSection from "@/components/sections/FeaturesSection";
import AboutSection from "@/components/sections/AboutSection";
import ArticlesSlider from "@/components/sections/ArticlesSlider";
import ActivitiesSection from "@/components/sections/ActivitiesSection";
import AchievementsSection from "@/components/sections/AchievementsSection";
import TeamSection from "@/components/sections/TeamSection";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturesSection />
      <AboutSection />
      <ArticlesSlider />
      <ActivitiesSection />
      <AchievementsSection />
      <TeamSection />
    </>
  );
}
