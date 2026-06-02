import { projects } from "@/content/projects";
import { projectDetails } from "@/content/project-details";
import { ProjectPageTemplate } from "@/components/project/ProjectPageTemplate";

const project = projects.find(function f(p) { return p.slug === "06-ticket-intelligence"; })!;
const detail = projectDetails["06-ticket-intelligence"];

export default function Page() {
  return <ProjectPageTemplate project={project} detail={detail} />;
}
