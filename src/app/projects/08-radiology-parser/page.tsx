import { projects } from "@/content/projects";
import { projectDetails } from "@/content/project-details";
import { ProjectPageTemplate } from "@/components/project/ProjectPageTemplate";

const project = projects.find(function f(p) { return p.slug === "08-radiology-parser"; })!;
const detail = projectDetails["08-radiology-parser"];

export default function Page() {
  return <ProjectPageTemplate project={project} detail={detail} />;
}
