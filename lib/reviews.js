import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const reviewsDirectory = path.join(process.cwd(), "content/reviews");

function listReviewFiles() {
  if (!fs.existsSync(reviewsDirectory)) return [];
  return fs
    .readdirSync(reviewsDirectory)
    .filter((fileName) => fileName.endsWith(".md") && !fileName.startsWith("_"));
}

export async function getAllReviews() {
  const files = listReviewFiles();

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

      return { slug, name, stars, photos, contentHtml, date: data.date || null };
    })
  );

  return reviews.reverse();
}