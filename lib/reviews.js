import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import { getAllRecipes } from "./recipes";

const reviewsDirectory = path.join(process.cwd(), "content/reviews");

function listReviewFiles() {
  if (!fs.existsSync(reviewsDirectory)) return [];
  return fs
    .readdirSync(reviewsDirectory)
    .filter((fileName) => fileName.endsWith(".md") && !fileName.startsWith("_"));
}

export async function getAllReviews() {
  const files = listReviewFiles();
  const recipeTitleBySlug = Object.fromEntries(
    getAllRecipes().map((recipe) => [recipe.slug, recipe.title])
  );

  const reviews = await Promise.all(
    files.map(async (fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const fullPath = path.join(reviewsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);

      const processed = await remark().use(html).process(content);
      const contentHtml = processed.toString();

      const stars = Math.min(5, Math.max(1, Number(data.stars) || 5));
      const name = data.name && data.name.trim() ? data.name.trim() : "Anonymous";
      const photos = Array.isArray(data.photos) ? data.photos : [];

      const recipeSlug = data.recipe && data.recipe.trim() ? data.recipe.trim() : null;
      const recipeTitle = recipeSlug ? recipeTitleBySlug[recipeSlug] || recipeSlug : null;

      return {
        slug,
        name,
        stars,
        photos,
        contentHtml,
        date: data.date || null,
        recipeSlug,
        recipeTitle,
      };
    })
  );

  return reviews.reverse();
}

// Used on an individual recipe page to show only reviews for that recipe.
export async function getReviewsForRecipe(recipeSlug) {
  const all = await getAllReviews();
  return all.filter((review) => review.recipeSlug === recipeSlug);
}