import Link from "next/link";
import { getAllRecipes } from "../lib/recipes";
import { siteConfig } from "../lib/config";

export default function HomePage() {
  const recipes = getAllRecipes();

  return (
    <div>
      <header className="hero">
        <p className="eyebrow">
          {recipes.length} {recipes.length === 1 ? "recipe" : "recipes"} · honest prices
        </p>
        <h1>{siteConfig.name}</h1>
        <p className="tagline">{siteConfig.tagline}</p>
      </header>

      {recipes.length === 0 ? (
        <p className="empty-state">
          No recipes yet — add a markdown file to <code>content/recipes</code> to get started.
        </p>
      ) : (
        <main className="grid">
          {recipes.map((recipe) => (
            <Link href={`/recipe/${recipe.slug}`} key={recipe.slug} className="card">
              <div
                className="card-image"
                style={recipe.image ? { backgroundImage: `url(${recipe.image})` } : undefined}
              />
              <div className="card-body">
                <div>
                  <h2>{recipe.title}</h2>
                  {recipe.description && (
                    <p className="card-description">{recipe.description}</p>
                  )}
                </div>
                <span className="price-tag">${recipe.total.toFixed(2)}</span>
              </div>
            </Link>
          ))}
        </main>
      )}
    </div>
  );
}
