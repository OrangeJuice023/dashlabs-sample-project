import { Hero } from "@/components/home/Hero";
import { WhyShowcase } from "@/components/home/WhyShowcase";
import { DatasetArchitecture } from "@/components/home/DatasetArchitecture";
import { ProjectGrid } from "@/components/home/ProjectGrid";

export default function HomePage() {
  return (
    <>
      <Hero />
      <WhyShowcase />
      <DatasetArchitecture />
      <ProjectGrid />
    </>
  );
}
