import { projects } from "@/content/projects";
import { projectDetails } from "@/content/project-details";
import { ProjectPageTemplate } from "@/components/project/ProjectPageTemplate";

const project = projects.find(function f(p) { return p.slug === "05-revenue-anomalies"; })!;
const detail = projectDetails["05-revenue-anomalies"];

export default function Page() {
  return <ProjectPageTemplate project={project} detail={detail} />;
}
