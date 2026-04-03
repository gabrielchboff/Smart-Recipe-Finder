import { loadHeaderFooter, qs, alertMessage } from "./utils.mjs";
import { getFavorites, removeFavorite, getCurrentUser } from "./StorageService.mjs";

loadHeaderFooter();

function renderFavoriteCards() {
  const grid = qs("#favoritesGrid");
  if (!grid) return;

  const user = getCurrentUser();
  if (!user) {
    grid.innerHTML = `
      <div class="auth-page text-center" style="grid-column:1/-1;">
        <h2 class="auth-page__title">Sign in to view saved recipes</h2>
        <p class="auth-page__subtitle">Your favorite recipes will appear here.</p>
        <a href="/login/" class="btn btn--primary btn--lg">Sign In</a>
      </div>`;
    return;
  }

  const favs = getFavorites();

  if (favs.length === 0) {
    grid.innerHTML = `
      <div class="favorites-empty" style="grid-column:1/-1;">
        <div class="favorites-empty__icon">&#9825;</div>
        <h2 class="favorites-empty__title">No saved recipes yet</h2>
        <p class="favorites-empty__text">Start exploring and save your favorite recipes here.</p>
        <a href="/" class="btn btn--primary">Explore Recipes</a>
      </div>`;
    return;
  }

  grid.innerHTML = favs
    .map(
      (r) => `
    <div class="card card--recipe" data-id="${r.id}">
      <button class="card__favorite-btn saved" data-remove-id="${r.id}" aria-label="Remove from favorites">
        &#9829;
      </button>
      <img class="card__image" src="${r.image}" alt="${r.title}" loading="lazy" />
      <div class="card__body">
        <h3 class="card__title">${r.title}</h3>
        <div class="card__meta">
          ${r.readyInMinutes ? `<span>${r.readyInMinutes} min</span>` : ""}
        </div>
      </div>
    </div>`,
    )
    .join("");
}

// Init
renderFavoriteCards();

qs("#favoritesGrid")?.addEventListener("click", (e) => {
  const removeBtn = e.target.closest("[data-remove-id]");
  if (removeBtn) {
    e.stopPropagation();
    const id = parseInt(removeBtn.dataset.removeId);
    removeFavorite(id);
    alertMessage("Removed from favorites");
    renderFavoriteCards();
    return;
  }

  const card = e.target.closest(".card--recipe");
  if (card) {
    window.location.href = `/recipe/?id=${card.dataset.id}`;
  }
});
