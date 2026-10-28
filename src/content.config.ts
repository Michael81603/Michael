import { defineCollection, reference } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const optionalText = (max: number) => z.string().max(max).default("");

const imageSchema = z.object({
  image: z.string().min(1),
  alt: z.string().min(1).max(160),
  caption: z.string().max(120).optional().default(""),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

const skills = defineCollection({
  loader: glob({ base: "./src/content/skills", pattern: "**/*.json" }),
  schema: z.object({
    name: z.string().min(1).max(80),
    category: z.enum(["frontend", "backend", "mobile", "database", "ai", "tools"]),
    description: optionalText(240),
    icon: z.string().nullable().optional(),
    featured: z.boolean().default(false),
    order: z.number().int().positive(),
  }),
});

const projects = defineCollection({
  loader: glob({ base: "./src/content/projects", pattern: "**/*.json" }),
  schema: z.object({
    title: z.string().min(1).max(100),
    type: z.string().min(1).max(100),
    summary: z.string().min(1).max(160),
    cover: imageSchema.omit({ caption: true }),
    gallery: z.array(imageSchema).max(20),
    technologies: z.array(reference("skills")).min(1),
    context: optionalText(600),
    problem: z.string().min(1).max(400),
    solution: z.array(z.string().min(1).max(240)).min(1).max(3),
    features: z.array(z.string().min(1).max(180)).max(6),
    decisions: z.array(z.string().min(1).max(240)).max(3),
    architecture: optionalText(600),
    result: optionalText(400),
    role: optionalText(120),
    duration: optionalText(80),
    status: optionalText(80),
    githubUrl: z.string().default(""),
    demoUrl: z.string().default(""),
    codeNote: optionalText(240),
    featured: z.boolean().default(false),
    order: z.number().int().positive(),
    draft: z.boolean().default(true),
  }),
});

export const collections = { projects, skills };

