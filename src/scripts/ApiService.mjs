const SPOONACULAR_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;
const EDAMAM_APP_ID = import.meta.env.VITE_EDAMAM_APP_ID;
const EDAMAM_APP_KEY = import.meta.env.VITE_EDAMAM_APP_KEY;
const BASE_URL = "https://api.spoonacular.com";

// Search recipes by ingredients
export async function searchByIngredients(ingredients, number = 12) {
  const params = new URLSearchParams({
    ingredients: ingredients.join(","),
    number: number.toString(),
    ranking: "1",
    ignorePantry: "true",
    apiKey: SPOONACULAR_KEY,
  });

  const res = await fetch(`${BASE_URL}/recipes/findByIngredients?${params}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// Get full recipe details including nutrition
export async function getRecipeDetail(id) {
  const params = new URLSearchParams({
    includeNutrition: "true",
    apiKey: SPOONACULAR_KEY,
  });

  const res = await fetch(`${BASE_URL}/recipes/${id}/information?${params}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// Search recipes with complex query (supports filters)
export async function searchRecipes(options = {}) {
  const params = new URLSearchParams({
    apiKey: SPOONACULAR_KEY,
    number: (options.number || 12).toString(),
    addRecipeInformation: "true",
    fillIngredients: "true",
  });

  if (options.query) params.set("query", options.query);
  if (options.cuisine) params.set("cuisine", options.cuisine);
  if (options.diet) params.set("diet", options.diet);
  if (options.type) params.set("type", options.type);
  if (options.sort) params.set("sort", options.sort);
  if (options.offset) params.set("offset", options.offset.toString());

  const res = await fetch(`${BASE_URL}/recipes/complexSearch?${params}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// Get random/popular recipes for the home page
export async function getRandomRecipes(number = 6) {
  const params = new URLSearchParams({
    number: number.toString(),
    apiKey: SPOONACULAR_KEY,
  });

  const res = await fetch(`${BASE_URL}/recipes/random?${params}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
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
