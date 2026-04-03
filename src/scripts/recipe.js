import { loadHeaderFooter, qs, getParam, alertMessage } from "./utils.mjs";
import { getRecipeDetail } from "./ApiService.mjs";
import { isFavorite, saveFavorite, removeFavorite, getCurrentUser } from "./StorageService.mjs";

loadHeaderFooter();

let recipe = null;

function getNutrient(nutrients, name) {
  const n = nutrients?.find((item) => item.name === name);
  return n ? Math.round(n.amount) : "—";
}

function getNutrientUnit(nutrients, name) {
  const n = nutrients?.find((item) => item.name === name);
  return n ? n.unit : "";
}

function toggleFavorite() {
  if (!recipe) return;
  if (!getCurrentUser()) {
    alertMessage("Log in to save recipes");
    return;
  }

  if (isFavorite(recipe.id)) {
    removeFavorite(recipe.id);
    alertMessage("Removed from favorites");
  } else {
    saveFavorite(recipe);
    alertMessage("Saved to favorites!");
  }

  // Update button
  const btn = qs("#favBtn");
  if (btn) {
    const saved = isFavorite(recipe.id);
    btn.className = `btn ${saved ? "btn--accent" : "btn--outline"}`;
    btn.innerHTML = saved ? "&#9829; Saved" : "&#9825; Save Recipe";
  }
}

async function init() {
  const id = getParam("id");
  const content = qs("#recipeContent");

  if (!id) {
    content.innerHTML = `<div class="error-message">No recipe ID provided.</div>`;
    return;
  }

  try {
    recipe = await getRecipeDetail(id);
    const nutrients = recipe.nutrition?.nutrients || [];
    const calories = getNutrient(nutrients, "Calories");
    const protein = getNutrient(nutrients, "Protein");
    const carbs = getNutrient(nutrients, "Carbohydrates");
    const fat = getNutrient(nutrients, "Fat");
    const saved = isFavorite(recipe.id);

    // Update page title
    document.title = `Smart Recipe Finder | ${recipe.title}`;

    // Parse instructions
    let steps = [];
    if (recipe.analyzedInstructions?.[0]?.steps) {
      steps = recipe.analyzedInstructions[0].steps;
    }

    content.innerHTML = `
      <img class="recipe-detail__image" src="${recipe.image}" alt="${recipe.title}" />

      <div style="display:flex; flex-wrap:wrap; align-items:start; justify-content:space-between; gap:12px; margin-bottom:8px;">
        <h1 class="recipe-detail__title">${recipe.title}</h1>
        <button class="btn ${saved ? "btn--accent" : "btn--outline"}" id="favBtn">
          ${saved ? "&#9829; Saved" : "&#9825; Save Recipe"}
        </button>
      </div>

      <div class="recipe-detail__meta">
        ${recipe.readyInMinutes ? `<span class="recipe-detail__meta-item">&#9201; ${recipe.readyInMinutes} min</span>` : ""}
        ${recipe.servings ? `<span class="recipe-detail__meta-item">&#127860; ${recipe.servings} servings</span>` : ""}
        ${recipe.healthScore ? `<span class="recipe-detail__meta-item">&#9889; Health score: ${recipe.healthScore}</span>` : ""}
      </div>

      <div class="card__tags mb-24">
        ${recipe.vegetarian ? '<span class="tag tag--success">Vegetarian</span>' : ""}
        ${recipe.vegan ? '<span class="tag tag--success">Vegan</span>' : ""}
        ${recipe.glutenFree ? '<span class="tag">Gluten-Free</span>' : ""}
        ${recipe.dairyFree ? '<span class="tag">Dairy-Free</span>' : ""}
        ${recipe.veryHealthy ? '<span class="tag tag--success">Very Healthy</span>' : ""}
      </div>

      <section class="section">
        <h2 class="section__title">Nutrition</h2>
        <div class="nutrition-grid">
          <div class="nutrition-card">
            <div class="nutrition-card__value">${calories}</div>
            <div class="nutrition-card__label">Calories</div>
          </div>
          <div class="nutrition-card">
            <div class="nutrition-card__value">${protein}${getNutrientUnit(nutrients, "Protein") ? "g" : ""}</div>
            <div class="nutrition-card__label">Protein</div>
          </div>
          <div class="nutrition-card">
            <div class="nutrition-card__value">${carbs}${getNutrientUnit(nutrients, "Carbohydrates") ? "g" : ""}</div>
            <div class="nutrition-card__label">Carbs</div>
          </div>
          <div class="nutrition-card">
            <div class="nutrition-card__value">${fat}${getNutrientUnit(nutrients, "Fat") ? "g" : ""}</div>
            <div class="nutrition-card__label">Fat</div>
          </div>
        </div>
      </section>

      <section class="section">
        <h2 class="section__title">Ingredients</h2>
        <ul class="ingredients-list">
          ${(recipe.extendedIngredients || []).map((ing) => `<li>${ing.original}</li>`).join("")}
        </ul>
      </section>

      ${
        steps.length > 0
          ? `<section class="section">
              <h2 class="section__title">Instructions</h2>
              <ol class="instructions-list">
                ${steps.map((s) => `<li>${s.step}</li>`).join("")}
              </ol>
            </section>`
          : recipe.instructions
            ? `<section class="section">
                <h2 class="section__title">Instructions</h2>
                <div style="line-height:1.8;">${recipe.instructions}</div>
              </section>`
            : ""
      }

      ${
        recipe.sourceUrl
          ? `<a href="${recipe.sourceUrl}" target="_blank" rel="noopener noreferrer" class="btn btn--secondary mt-16">
              View Original Source &rarr;
            </a>`
          : ""
      }
    `;

    // Favorite button
    qs("#favBtn")?.addEventListener("click", toggleFavorite);
  } catch (err) {
    content.innerHTML = `<div class="error-message">Failed to load recipe details. Please try again later.</div>`;
  }
}

init();
