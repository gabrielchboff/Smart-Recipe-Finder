const SPOONACULAR_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;
const EDAMAM_APP_ID = import.meta.env.VITE_EDAMAM_APP_ID;
const EDAMAM_APP_KEY = import.meta.env.VITE_EDAMAM_APP_KEY;
const BASE_URL = "https://api.spoonacular.com";

// ===== Simple in-memory cache =====
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCached(key) {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.time < CACHE_TTL) {
    return entry.data;
  }
  cache.delete(key);
  return null;
}

function setCache(key, data) {
  cache.set(key, { data, time: Date.now() });
}

// Search recipes by ingredients
export async function searchByIngredients(ingredients, number = 12) {
  const params = new URLSearchParams({
    ingredients: ingredients.join(","),
    number: number.toString(),
    ranking: "1",
    ignorePantry: "true",
    apiKey: SPOONACULAR_KEY,
  });

  const cacheKey = `byIngredients:${params}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const res = await fetch(`${BASE_URL}/recipes/findByIngredients?${params}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json();
  setCache(cacheKey, data);
  return data;
}

// Get full recipe details including nutrition
export async function getRecipeDetail(id) {
  const params = new URLSearchParams({
    includeNutrition: "true",
    apiKey: SPOONACULAR_KEY,
  });

  const cacheKey = `detail:${id}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const res = await fetch(`${BASE_URL}/recipes/${id}/information?${params}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json();
  setCache(cacheKey, data);
  return data;
}

// Search recipes with complex query (supports filters)
export async function searchRecipes(options = {}) {
  const params = new URLSearchParams({
    apiKey: SPOONACULAR_KEY,
    number: (options.number || 12).toString(),
    addRecipeInformation: "true",
    addRecipeNutrition: "true",
    fillIngredients: "true",
  });

  if (options.query) params.set("query", options.query);
  if (options.includeIngredients) params.set("includeIngredients", options.includeIngredients);
  if (options.cuisine) params.set("cuisine", options.cuisine);
  if (options.diet) params.set("diet", options.diet);
  if (options.type) params.set("type", options.type);
  if (options.sort) params.set("sort", options.sort);
  if (options.offset) params.set("offset", options.offset.toString());

  const cacheKey = `complex:${params}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const res = await fetch(`${BASE_URL}/recipes/complexSearch?${params}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json();
  setCache(cacheKey, data);
  return data;
}

// Get random/popular recipes for the home page
export async function getRandomRecipes(number = 6) {
  const params = new URLSearchParams({
    number: number.toString(),
    apiKey: SPOONACULAR_KEY,
  });

  const cacheKey = `random:${number}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const res = await fetch(`${BASE_URL}/recipes/random?${params}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json();
  setCache(cacheKey, data);
  return data;
}

// Get nutrition from Edamam (if credentials are set)
export async function getEdamamNutrition(ingredientsList) {
  if (!EDAMAM_APP_ID || !EDAMAM_APP_KEY || EDAMAM_APP_ID === "your_edamam_app_id_here") {
    return null;
  }

  const params = new URLSearchParams({
    app_id: EDAMAM_APP_ID,
    app_key: EDAMAM_APP_KEY,
  });

  const res = await fetch(
    `https://api.edamam.com/api/nutrition-details?${params}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ingr: ingredientsList,
      }),
    },
  );

  if (!res.ok) return null;
  return res.json();
}
