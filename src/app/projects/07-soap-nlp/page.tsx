import { projects } from "@/content/projects";
import { projectDetails } from "@/content/project-details";
import { ProjectPageTemplate } from "@/components/project/ProjectPageTemplate";

const project = projects.find(function f(p) { return p.slug === "07-soap-nlp"; })!;
const detail = projectDetails["07-soap-nlp"];

export default function Page() {
  return <ProjectPageTemplate project={project} detail={detail} />;
}
