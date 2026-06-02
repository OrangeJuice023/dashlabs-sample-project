import { projects } from "@/content/projects";
import { projectDetails } from "@/content/project-details";
import { ProjectPageTemplate } from "@/components/project/ProjectPageTemplate";

const project = projects.find(function f(p) { return p.slug === "02-turnaround-time"; })!;
const detail = projectDetails["02-turnaround-time"];

export default function Page() {
  return <ProjectPageTemplate project={project} detail={detail} />;
}
