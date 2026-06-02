import { projects } from "@/content/projects";
import { projectDetails } from "@/content/project-details";
import { ProjectPageTemplate } from "@/components/project/ProjectPageTemplate";

const project = projects.find(function f(p) { return p.slug === "01-abnormal-results"; })!;
const detail = projectDetails["01-abnormal-results"];

export default function Page() {
  return <ProjectPageTemplate project={project} detail={detail} />;
}
