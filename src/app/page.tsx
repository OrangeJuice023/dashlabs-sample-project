import { SyntheticBadge } from "@/components/SyntheticBadge";
import { Hero } from "@/components/home/Hero";
import { WhyShowcase } from "@/components/home/WhyShowcase";
import { DatasetArchitecture } from "@/components/home/DatasetArchitecture";
import { ProjectGrid } from "@/components/home/ProjectGrid";

export default function HomePage() {
  return (
    <>
      <SyntheticBadge variant="banner" />
      <Hero />
      <WhyShowcase />
      <DatasetArchitecture />
      <ProjectGrid />
    </>
  );
}
