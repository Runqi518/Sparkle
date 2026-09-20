import { CreateProjectInput, ProjectResponse } from "../../schemas/project";

// Mock database
const projects: ProjectResponse[] = [
  {
    id: "1",
    name: "Sparkle Demo",
    industry: "互联网",
    nodesCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function createProject(data: CreateProjectInput): Promise<ProjectResponse> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const newProject: ProjectResponse = {
    id: `project_${Date.now()}`,
    name: data.name,
    industry: data.industry,
    nodesCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  projects.push(newProject);
  return newProject;
}

export async function getProjects(): Promise<ProjectResponse[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return projects;
}

export async function getProjectById(id: string): Promise<ProjectResponse | null> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return projects.find((p) => p.id === id) || null;
}
