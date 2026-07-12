import Link from "next/link";
import { getAllSlugs, getRecipeBySlug } from "../../../lib/recipes";

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const recipe = await getRecipeBySlug(params.slug);
  return { title: recipe.title };
}

export default async function RecipePage({ params }) {
  const recipe = await getRecipeBySlug(params.slug);
  const hasGroups = Array.isArray(recipe.ingredient_groups);
  const flatIngredients = recipe.ingredients || [];

  return (
    <article className="recipe">
      <Link href="/" className="back-link">
        ← All recipes
      </Link>

      {recipe.image && (
        <img src={recipe.image} alt={recipe.title} className="recipe-photo" />
      )}

      <h1>{recipe.title}</h1>

      {recipe.description && <p className="recipe-description">{recipe.description}</p>}

      <div className="receipt">
        <div className="receipt-title">TOTAL COST</div>

        {hasGroups ? (
          recipe.ingredient_groups.map((group, gi) => (
            <div className="receipt-group" key={gi}>
              <div className="receipt-group-label">{group.group}</div>
              <ul>
                {(group.items || []).map((ingredient, i) => (
                  <li key={i}>
                    <span>{ingredient.name}</span>
                    <span>${Number(ingredient.price).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <ul>
            {flatIngredients.map((ingredient, i) => (
              <li key={i}>
                <span>{ingredient.name}</span>
                <span>${Number(ingredient.price).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="receipt-total">
          <span>Total</span>
          <span>${recipe.total.toFixed(2)}</span>
        </div>
        {recipe.servings && (
          <div className="receipt-per-serving">
            ${recipe.perServing.toFixed(2)} per serving · serves {recipe.servings}
          </div>
        )}
      </div>

      <div
        className="instructions"
        dangerouslySetInnerHTML={{ __html: recipe.contentHtml }}
      />
    </article>
  );
}