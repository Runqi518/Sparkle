import { z } from "zod";

export const ProjectIndustrySchema = z.enum([
  "教育培训",
  "3c及电器",
  "美妆",
  "母婴",
  "宠物",
  "互联网",
]);

export const CreateProjectSchema = z.object({
  name: z.string().min(1, "项目名称不能为空").max(50, "项目名称过长"),
  industry: ProjectIndustrySchema,
});

export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;

export const ProjectResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  industry: ProjectIndustrySchema,
  nodesCount: z.number().int().nonnegative(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type ProjectResponse = z.infer<typeof ProjectResponseSchema>;
