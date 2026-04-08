import { loadHeaderFooter, qs, getParam, alertMessage, escapeHTML } from "./utils.mjs";
import { searchByIngredients, searchRecipes } from "./ApiService.mjs";
import { isFavorite, saveFavorite, removeFavorite, getCurrentUser, getPreferences } from "./StorageService.mjs";

loadHeaderFooter();

let results = [];
let activeFilters = { cuisine: "", diet: "", type: "" };

function getMatchPercent(recipe) {
  const used = recipe.usedIngredientCount || 0;
  const missed = recipe.missedIngredientCount || 0;
  const total = used + missed;
  if (total === 0) return 0;
  return Math.round((used / total) * 100);
}

function hasActiveFilters() {
  return activeFilters.cuisine || activeFilters.diet || activeFilters.type;
}

function getSortedResults() {
  const sortValue = qs("#sortSelect")?.value || "relevance";
  let sorted = [...results];

  if (sortValue === "matchDesc") {
    sorted.sort((a, b) => (b.usedIngredientCount || 0) - (a.usedIngredientCount || 0));
  } else if (sortValue === "matchAsc") {
    sorted.sort((a, b) => (a.usedIngredientCount || 0) - (b.usedIngredientCount || 0));
  } else if (sortValue === "alpha") {
    sorted.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortValue === "timeAsc") {
    sorted.sort((a, b) => (a.readyInMinutes || 999) - (b.readyInMinutes || 999));
  } else if (sortValue === "caloriesAsc") {
    sorted.sort((a, b) => getCalories(a) - getCalories(b));
  }

  return sorted;
}

function getCalories(recipe) {
  const nutrients = recipe.nutrition?.nutrients || [];
  const cal = nutrients.find((n) => n.name === "Calories");
  return cal ? cal.amount : 9999;
}

function renderResults() {
  const grid = qs("#resultsGrid");
  const countEl = qs("#resultsCount");
  if (!grid) return;

  const sorted = getSortedResults();

  if (countEl) {
    countEl.textContent = `${sorted.length} recipe${sorted.length !== 1 ? "s" : ""} found`;
  }

  if (sorted.length === 0) {
    grid.innerHTML = `
      <div class="error-message" style="grid-column: 1/-1;">
        No recipes found. Try different ingredients or fewer filters.
      </div>`;
    return;
  }

  grid.innerHTML = sorted
    .map((r) => {
      const match = getMatchPercent(r);
      const missed = r.missedIngredients?.map((i) => i.name).slice(0, 3) || [];
      const hasMatchData = r.usedIngredientCount !== undefined;
      const calories = getCalories(r);
      const hasCalories = calories < 9999;
      const safeTitle = escapeHTML(r.title);
      const safeImage = escapeHTML(r.image);
      const safeId = Number(r.id) || 0;

      return `
      <div class="card card--recipe" data-id="${safeId}">
        <button class="card__favorite-btn ${isFavorite(r.id) ? "saved" : ""}" data-fav-id="${safeId}" aria-label="Save recipe">
          ${isFavorite(r.id) ? "&#9829;" : "&#9825;"}
        </button>
        <img class="card__image" src="${safeImage}" alt="${safeTitle}" loading="lazy" />
        <div class="card__body">
          <div style="display:flex; justify-content:space-between; align-items:start; gap:8px;">
            <h3 class="card__title">${safeTitle}</h3>
            ${hasMatchData ? `<span class="match-badge">${match}%</span>` : ""}
          </div>
          <div class="card__meta">
            ${hasMatchData ? `<span>${Number(r.usedIngredientCount) || 0} used</span><span>${Number(r.missedIngredientCount) || 0} missing</span>` : ""}
            ${r.readyInMinutes ? `<span>&#9201; ${Number(r.readyInMinutes)} min</span>` : ""}
            ${hasCalories ? `<span>&#128293; ${Math.round(calories)} cal</span>` : ""}
          </div>
          ${
            missed.length > 0
              ? `<div class="card__tags" style="margin-top:8px;">
                  ${missed.map((m) => `<span class="tag">${escapeHTML(m)}</span>`).join("")}
                </div>`
              : ""
          }
        </div>
      </div>`;
    })
    .join("");
}

function showSkeleton() {
  const grid = qs("#resultsGrid");
  grid.innerHTML = Array(6)
    .fill(
      `<div class="card">
        <div class="skeleton skeleton--image"></div>
        <div class="card__body">
          <div class="skeleton skeleton--title"></div>
          <div class="skeleton skeleton--text" style="width:50%"></div>
        </div>
      </div>`,
    )
    .join("");
}

async function fetchResults(ingredientsList) {
  showSkeleton();

  const countEl = qs("#resultsCount");
  if (countEl) countEl.textContent = "Searching...";

  try {
    if (hasActiveFilters()) {
      const data = await searchRecipes({
        includeIngredients: ingredientsList.join(","),
        cuisine: activeFilters.cuisine,
        diet: activeFilters.diet,
        type: activeFilters.type,
        number: 18,
      });
      results = data.results || [];
    } else {
      results = await searchByIngredients(ingredientsList, 18);
    }
    renderResults();
  } catch (err) {
    const grid = qs("#resultsGrid");
    grid.innerHTML = `<div class="error-message" style="grid-column:1/-1;">Failed to load recipes. Please try again later.</div>`;
  }
}

function applyUserPreferences() {
  const prefs = getPreferences();
  const dietSelect = qs("#dietFilter");
  if (!dietSelect) return;

  if (!dietSelect.value) {
    if (prefs.vegan) dietSelect.value = "vegan";
    else if (prefs.keto) dietSelect.value = "ketogenic";
    else if (prefs.glutenFree) dietSelect.value = "gluten free";
    else if (prefs.paleo) dietSelect.value = "paleo";
  }

  activeFilters.diet = dietSelect.value;
}

// ===== Init =====
async function init() {
  const ingredientsParam = getParam("ingredients") || "";
  const ingredientsList = ingredientsParam
    .split(",")
    .filter(Boolean)
    .map((i) => i.replace(/[<>"'&]/g, "").trim())
    .filter(Boolean);

  // Show ingredient tags (escaped)
  const tagsEl = qs("#ingredientTags");
  if (tagsEl) {
    tagsEl.innerHTML = ingredientsList
      .map((i) => `<span class="tag tag--primary">${escapeHTML(i)}</span>`)
      .join("");
  }

  if (ingredientsList.length === 0) {
    const grid = qs("#resultsGrid");
    grid.innerHTML = `<div class="error-message" style="grid-column:1/-1;">No ingredients provided.</div>`;
    return;
  }

  if (getCurrentUser()) {
    applyUserPreferences();
  }

  await fetchResults(ingredientsList);

  qs("#sortSelect")?.addEventListener("change", () => {
    renderResults();
  });

  const filterHandler = () => {
    activeFilters.cuisine = qs("#cuisineFilter")?.value || "";
    activeFilters.diet = qs("#dietFilter")?.value || "";
    activeFilters.type = qs("#mealTypeFilter")?.value || "";
    fetchResults(ingredientsList);
  };

  qs("#cuisineFilter")?.addEventListener("change", filterHandler);
  qs("#dietFilter")?.addEventListener("change", filterHandler);
  qs("#mealTypeFilter")?.addEventListener("change", filterHandler);

  const grid = qs("#resultsGrid");
  grid.addEventListener("click", (e) => {
    const favBtn = e.target.closest(".card__favorite-btn");
    if (favBtn) {
      e.stopPropagation();
      if (!getCurrentUser()) {
        alertMessage("Log in to save recipes");
        return;
      }
      const id = parseInt(favBtn.dataset.favId);
      const recipe = results.find((r) => r.id === id);
      if (recipe) {
        if (isFavorite(recipe.id)) {
          removeFavorite(recipe.id);
          alertMessage("Removed from favorites");
        } else {
          saveFavorite(recipe);
          alertMessage("Saved to favorites!");
        }
        renderResults();
      }
      return;
    }

    const card = e.target.closest(".card--recipe");
    if (card) {
      const id = Number(card.dataset.id);
      if (id > 0) window.location.href = `/recipe/?id=${id}`;
    }
  });
}

init();
