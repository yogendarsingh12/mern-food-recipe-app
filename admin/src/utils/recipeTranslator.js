import { RECIPE_TRANSLATIONS } from '../locales/recipeTranslations';

function normalizeKey(str) {
  if (!str) return '';
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

const CULINARY_DICTIONARY = {
  hi: {
    'chicken': 'चिकन',
    'paneer': 'पनीर',
    'pizza': 'पिज्जा',
    'burger': 'बर्गर',
    'pasta': 'पास्ता',
    'salad': 'सलाद',
    'soup': 'सूप',
    'rice': 'चावल',
    'noodles': 'नूडल्स',
    'garlic': 'लहसुन',
    'onion': 'प्याज',
    'tomato': 'टमाटर',
    'butter': 'मक्खन',
    'cheese': 'चीज़ / पनीर',
    'milk': 'दूध',
    'cream': 'मलाई',
    'oil': 'तेल',
    'salt': 'नमक',
    'sugar': 'चीनी',
    'egg': 'अंडा',
    'eggs': 'अंडे',
    'water': 'पानी',
    'step 1:': 'चरण 1:',
    'step 2:': 'चरण 2:',
    'step 3:': 'चरण 3:',
  },
  es: {
    'chicken': 'pollo',
    'pizza': 'pizza',
    'burger': 'hamburguesa',
    'pasta': 'pasta',
    'salad': 'ensalada',
    'soup': 'sopa',
    'rice': 'arroz',
    'garlic': 'ajo',
    'onion': 'cebolla',
    'tomato': 'tomate',
    'butter': 'mantequilla',
    'cheese': 'queso',
    'milk': 'leche',
    'step 1:': 'Paso 1:',
    'step 2:': 'Paso 2:',
    'step 3:': 'Paso 3:',
  }
};

function translateText(text, lang) {
  if (!text || typeof text !== 'string') return text;
  const dict = CULINARY_DICTIONARY[lang];
  if (!dict) return text;

  let translated = text;
  for (const [key, replacement] of Object.entries(dict)) {
    const regex = new RegExp(`\\b${key}\\b`, 'gi');
    translated = translated.replace(regex, replacement);
  }
  return translated;
}

export function getTranslatedRecipe(recipe, lang = 'en') {
  if (!recipe) return recipe;
  if (!lang || lang === 'en') return recipe;

  const recipeData = RECIPE_TRANSLATIONS[recipe.title];
  if (recipeData && recipeData[lang]) {
    const translated = recipeData[lang];
    return {
      ...recipe,
      title: translated.title || recipe.title,
      description: translated.description !== undefined ? translated.description : recipe.description,
      ingredients: translated.ingredients || recipe.ingredients,
      instructions: translated.instructions || recipe.instructions,
    };
  }

  const normTitle = normalizeKey(recipe.title);
  for (const [key, langMap] of Object.entries(RECIPE_TRANSLATIONS)) {
    const normKey = normalizeKey(key);
    if (normTitle === normKey || normTitle.includes(normKey) || normKey.includes(normTitle)) {
      if (langMap[lang]) {
        const translated = langMap[lang];
        return {
          ...recipe,
          title: translated.title || recipe.title,
          description: translated.description !== undefined ? translated.description : recipe.description,
          ingredients: translated.ingredients || recipe.ingredients,
          instructions: translated.instructions || recipe.instructions,
        };
      }
    }
  }

  const translatedTitle = translateText(recipe.title, lang);
  const translatedDesc = translateText(recipe.description, lang);
  const translatedIngredients = Array.isArray(recipe.ingredients)
    ? recipe.ingredients.map((ing) => translateText(ing, lang))
    : recipe.ingredients;
  const translatedInstructions = translateText(recipe.instructions, lang);

  return {
    ...recipe,
    title: translatedTitle,
    description: translatedDesc,
    ingredients: translatedIngredients,
    instructions: translatedInstructions,
  };
}
