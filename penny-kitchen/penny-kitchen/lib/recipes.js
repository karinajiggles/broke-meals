import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const recipesDirectory = path.join(process.cwd(), "content/recipes");

function listRecipeFiles() {
  return fs
    .readdirSync(recipesDirectory)
    .filter((fileName) => fileName.endsWith(".md") && !fileName.startsWith("_"));
}

function calculateCosts(data) {
  const ingredients = data.ingredients || [];
  const total = ingredients.reduce((sum, ing) => sum + Number(ing.price || 0), 0);
  const servings = Number(data.servings) || 1;
  const perServing = total / servings;
  return { total, perServing };
}

// Used on the homepage — fast, no markdown-to-HTML conversion needed.
export function getAllRecipes() {
  const recipes = listRecipeFiles().map((fileName) => {
    const slug = fileName.replace(/\.md$/, "");
    const fullPath = path.join(recipesDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(fileContents);
    const { total, perServing } = calculateCosts(data);
    return { slug, ...data, total, perServing };
  });

  return recipes.sort((a, b) => a.title.localeCompare(b.title));
}

// Used on an individual recipe page — includes the full instructions as HTML.
export async function getRecipeBySlug(slug) {
  const fullPath = path.join(recipesDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const processed = await remark().use(html).process(content);
  const contentHtml = processed.toString();

  const { total, perServing } = calculateCosts(data);

  return { slug, ...data, total, perServing, contentHtml };
}

export function getAllSlugs() {
  return listRecipeFiles().map((fileName) => fileName.replace(/\.md$/, ""));
}
