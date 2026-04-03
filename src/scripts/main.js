import { loadHeaderFooter, qs, alertMessage } from "./utils.mjs";
import { getRandomRecipes } from "./ApiService.mjs";
import { isFavorite, saveFavorite, removeFavorite, getCurrentUser } from "./StorageService.mjs";

loadHeaderFooter();

// ===== Ingredient Chips =====
const ingredients = [];

function renderChips() {
  const container = qs("#chipsContainer");
  if (!container) return;

  container.innerHTML = ingredients
    .map(
      (ing, i) => `
    <span class="chip">
      ${ing}
      <button class="chip__remove" data-index="${i}" aria-label="Remove ${ing}">&times;</button>
    </span>`,
    )
    .join("");

  const countEl = qs("#ingredientCount");
  if (countEl) {
    countEl.textContent =
      ingredients.length > 0
        ? `${ingredients.length} ingredient${ingredients.length > 1 ? "s" : ""} added`
        : "";
  }
}

function addIngredient(value) {
  const trimmed = value.trim().toLowerCase();
  if (trimmed && !ingredients.includes(trimmed)) {
    ingredients.push(trimmed);
    renderChips();
  }
}

// ===== Ingredient Input Events =====
const input = qs("#ingredientInput");
const chipsInput = qs("#chipsInput");
const findBtn = qs("#findRecipesBtn");

chipsInput?.addEventListener("click", () => input?.focus());

input?.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === ",") {
    e.preventDefault();
    addIngredient(input.value);
    input.value = "";
  }

  if (e.key === "Backspace" && input.value === "" && ingredients.length > 0) {
    ingredients.pop();
    renderChips();
  }
});

qs("#chipsContainer")?.addEventListener("click", (e) => {
  const removeBtn = e.target.closest(".chip__remove");
  if (removeBtn) {
    const idx = parseInt(removeBtn.dataset.index);
    ingredients.splice(idx, 1);
    renderChips();
  }
});

findBtn?.addEventListener("click", () => {
  if (ingredients.length === 0) {
    alertMessage("Add at least one ingredient");
    return;
  }
  window.location.href = `/search/?ingredients=${encodeURIComponent(ingredients.join(","))}`;
});

// ===== Trending Recipes =====
async function loadTrending() {
  const grid = qs("#trendingGrid");
  if (!grid) return;

  // Skeleton loading
  grid.innerHTML = Array(6)
    .fill(
      `<div class="card">
        <div class="skeleton skeleton--image"></div>
        <div class="card__body">
          <div class="skeleton skeleton--title"></div>
          <div class="skeleton skeleton--text" style="width:40%"></div>
        </div>
      </div>`,
    )
    .join("");

  try {
    const data = await getRandomRecipes(6);
    const recipes = data.recipes || [];
    renderTrendingCards(grid, recipes);
  } catch (err) {
    grid.innerHTML = `<div class="error-message">Could not load trending recipes. Please try again later.</div>`;
  }
}

function renderTrendingCards(grid, recipes) {
  grid.innerHTML = recipes
    .map(
      (r) => `
    <div class="card card--recipe" data-id="${r.id}">
      <button class="card__favorite-btn ${isFavorite(r.id) ? "saved" : ""}" data-fav-id="${r.id}" aria-label="Save recipe">
        ${isFavorite(r.id) ? "&#9829;" : "&#9825;"}
      </button>
      <img class="card__image" src="${r.image}" alt="${r.title}" loading="lazy" />
      <div class="card__body">
        <h3 class="card__title">${r.title}</h3>
        <div class="card__meta">
          ${r.readyInMinutes ? `<span>${r.readyInMinutes} min</span>` : ""}
          ${r.servings ? `<span>${r.servings} servings</span>` : ""}
        </div>
        <div class="card__tags">
          ${r.vegetarian ? '<span class="tag tag--success">Vegetarian</span>' : ""}
          ${r.vegan ? '<span class="tag tag--success">Vegan</span>' : ""}
          ${r.glutenFree ? '<span class="tag">Gluten-Free</span>' : ""}
        </div>
      </div>
    </div>`,
    )
    .join("");

  // Event delegation for cards
  grid.addEventListener("click", (e) => {
    const favBtn = e.target.closest(".card__favorite-btn");
    if (favBtn) {
      e.stopPropagation();
      if (!getCurrentUser()) {
        alertMessage("Log in to save recipes");
        return;
      }
      const id = parseInt(favBtn.dataset.favId);
      const recipe = recipes.find((r) => r.id === id);
      if (recipe) {
        if (isFavorite(recipe.id)) {
          removeFavorite(recipe.id);
          alertMessage("Removed from favorites");
        } else {
          saveFavorite(recipe);
          alertMessage("Saved to favorites!");
        }
        renderTrendingCards(grid, recipes);
      }
      return;
    }

    const card = e.target.closest(".card--recipe");
    if (card) {
      window.location.href = `/recipe/?id=${card.dataset.id}`;
    }
  });
}

loadTrending();
