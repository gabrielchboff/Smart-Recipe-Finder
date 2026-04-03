import { loadHeaderFooter, qs, getParam, alertMessage } from "./utils.mjs";
import { searchByIngredients } from "./ApiService.mjs";
import { isFavorite, saveFavorite, removeFavorite, getCurrentUser } from "./StorageService.mjs";

loadHeaderFooter();

let results = [];

function getMatchPercent(recipe) {
  const total = recipe.usedIngredientCount + recipe.missedIngredientCount;
  if (total === 0) return 0;
  return Math.round((recipe.usedIngredientCount / total) * 100);
}

function getFilteredResults() {
  const sortValue = qs("#sortSelect")?.value || "relevance";
  let filtered = [...results];

  if (sortValue === "matchDesc") {
    filtered.sort((a, b) => b.usedIngredientCount - a.usedIngredientCount);
  } else if (sortValue === "matchAsc") {
    filtered.sort((a, b) => a.usedIngredientCount - b.usedIngredientCount);
  } else if (sortValue === "alpha") {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  }

  return filtered;
}

function renderResults() {
  const grid = qs("#resultsGrid");
  const countEl = qs("#resultsCount");
  if (!grid) return;

  const filtered = getFilteredResults();

  if (countEl) {
    countEl.textContent = `${filtered.length} recipe${filtered.length !== 1 ? "s" : ""} found`;
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="error-message" style="grid-column: 1/-1;">
        No recipes found. Try different ingredients or fewer filters.
      </div>`;
    return;
  }

  grid.innerHTML = filtered
    .map((r) => {
      const match = getMatchPercent(r);
      const missed = r.missedIngredients?.map((i) => i.name).slice(0, 3) || [];

      return `
      <div class="card card--recipe" data-id="${r.id}">
        <button class="card__favorite-btn ${isFavorite(r.id) ? "saved" : ""}" data-fav-id="${r.id}" aria-label="Save recipe">
          ${isFavorite(r.id) ? "&#9829;" : "&#9825;"}
        </button>
        <img class="card__image" src="${r.image}" alt="${r.title}" loading="lazy" />
        <div class="card__body">
          <div style="display:flex; justify-content:space-between; align-items:start; gap:8px;">
            <h3 class="card__title">${r.title}</h3>
            <span class="match-badge">${match}%</span>
          </div>
          <div class="card__meta">
            <span>${r.usedIngredientCount} used</span>
            <span>${r.missedIngredientCount} missing</span>
          </div>
          ${
            missed.length > 0
              ? `<div class="card__tags" style="margin-top:8px;">
                  ${missed.map((m) => `<span class="tag">${m}</span>`).join("")}
                </div>`
              : ""
          }
        </div>
      </div>`;
    })
    .join("");
}

// ===== Init =====
async function init() {
  const ingredientsParam = getParam("ingredients") || "";
  const ingredientsList = ingredientsParam.split(",").filter(Boolean);

  // Show ingredient tags
  const tagsEl = qs("#ingredientTags");
  if (tagsEl) {
    tagsEl.innerHTML = ingredientsList
      .map((i) => `<span class="tag tag--primary">${i}</span>`)
      .join("");
  }

  // Skeleton loading
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

  if (ingredientsList.length === 0) {
    grid.innerHTML = `<div class="error-message" style="grid-column:1/-1;">No ingredients provided.</div>`;
    return;
  }

  try {
    results = await searchByIngredients(ingredientsList, 18);
    renderResults();
  } catch (err) {
    grid.innerHTML = `<div class="error-message" style="grid-column:1/-1;">Failed to load recipes. Please try again later.</div>`;
  }

  // Sort change
  qs("#sortSelect")?.addEventListener("change", () => {
    renderResults();
  });

  // Card clicks (event delegation)
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
      window.location.href = `/recipe/?id=${card.dataset.id}`;
    }
  });
}

init();
