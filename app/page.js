import Link from "next/link";
import { getAllRecipes } from "../lib/recipes";
import { getAllReviews } from "../lib/reviews";
import { siteConfig } from "../lib/config";

export default async function HomePage() {
  const recipes = getAllRecipes();
  const reviews = await getAllReviews();

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

      {reviews.length > 0 && (
        <section className="reviews-section">
          <h2 className="reviews-heading">What people are saying</h2>
          <div className="reviews-grid">
            {reviews.map((review) => (
              <div className="review-card" key={review.slug}>
                <div className="review-stars" aria-label={`${review.stars} out of 5 stars`}>
                  {"★".repeat(review.stars)}
                  <span className="review-stars-empty">{"★".repeat(5 - review.stars)}</span>
                </div>
                <div
                  className="review-text"
                  dangerouslySetInnerHTML={{ __html: review.contentHtml }}
                />
                {review.photos.length > 0 && (
                  <div className="review-photos">
                    {review.photos.map((photo, i) => (
                      <img src={photo} alt={`Photo from ${review.name}'s review`} key={i} />
                    ))}
                  </div>
                )}
                <div className="review-name">— {review.name}</div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}