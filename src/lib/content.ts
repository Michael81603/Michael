import { getCollection } from "astro:content";

export function hasContent(value: string | null | undefined): value is string {
  return Boolean(value?.trim());
}

export async function getAllProjects() {
  const projects = await getCollection("projects");
  return projects.sort((a, b) => a.data.order - b.data.order);
}

export async function getPublishedProjects() {
  const projects = await getAllProjects();
  return projects.filter(({ data }) => !data.draft);
}

export async function getOrderedSkills() {
  const skills = await getCollection("skills");
  return skills.sort((a, b) => a.data.order - b.data.order);
}
