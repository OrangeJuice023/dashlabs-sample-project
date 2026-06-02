import { projects } from "@/content/projects";
import { projectDetails } from "@/content/project-details";
import { ProjectPageTemplate } from "@/components/project/ProjectPageTemplate";

const project = projects.find(function f(p) { return p.slug === "03-patient-segmentation"; })!;
const detail = projectDetails["03-patient-segmentation"];

export default function Page() {
  return <ProjectPageTemplate project={project} detail={detail} />;
}
