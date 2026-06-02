import { projects } from "@/content/projects";
import { projectDetails } from "@/content/project-details";
import { ProjectPageTemplate } from "@/components/project/ProjectPageTemplate";

const project = projects.find(function f(p) { return p.slug === "09-cross-client-benchmark"; })!;
const detail = projectDetails["09-cross-client-benchmark"];

export default function Page() {
  return <ProjectPageTemplate project={project} detail={detail} />;
}
