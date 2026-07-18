import { Hero } from "@/components/sections/Hero";
import { FootprintEstimator } from "@/components/sections/FootprintEstimator";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Categories } from "@/components/sections/Categories";
import { ComparisonChart } from "@/components/sections/ComparisonChart";
import { FeaturedChallenges } from "@/components/sections/FeaturedChallenges";
import { ImpactStats } from "@/components/sections/ImpactStats";
import { Testimonials } from "@/components/sections/Testimonials";
import { FAQ } from "@/components/sections/FAQ";
import { NewsletterCTA } from "@/components/sections/NewsletterCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <FootprintEstimator />
      <HowItWorks />
      <Categories />
      <ComparisonChart />
      <FeaturedChallenges />
      <ImpactStats />
      <Testimonials />
      <FAQ />
      <NewsletterCTA />
    </>
  );
}
