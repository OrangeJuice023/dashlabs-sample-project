import { projects } from "@/content/projects";
import { projectDetails } from "@/content/project-details";
import { ProjectPageTemplate } from "@/components/project/ProjectPageTemplate";

const project = projects.find(function f(p) { return p.slug === "04-test-bundles"; })!;
const detail = projectDetails["04-test-bundles"];

export default function Page() {
  return <ProjectPageTemplate project={project} detail={detail} />;
}
