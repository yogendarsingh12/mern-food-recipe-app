import { RECIPE_TRANSLATIONS } from '../locales/recipeTranslations';

/**
 * Normalizes title string for robust dictionary matching.
 */
function normalizeKey(str) {
  if (!str) return '';
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Common culinary vocabulary dictionary for automatic translation of user-created recipes
 */
const CULINARY_DICTIONARY = {
  hi: {
    // Ingredients & Foods
    'chicken': 'चिकन',
    'paneer': 'पनीर',
    'pizza': 'पिज्जा',
    'burger': 'बर्गर',
    'pasta': 'पास्ता',
    'salad': 'सलाद',
    'soup': 'सूप',
    'rice': 'चावल',
    'biryani': 'बिरयानी',
    'noodles': 'नूडल्स',
    'sandwich': 'सैंडविच',
    'garlic': 'लहसुन',
    'onion': 'प्याज',
    'tomato': 'टमाटर',
    'potatoes': 'आलू',
    'potato': 'आलू',
    'ginger': 'अदरक',
    'butter': 'मक्खन',
    'cheese': 'चीज़ / पनीर',
    'milk': 'दूध',
    'cream': 'मलाई / क्रीम',
    'oil': 'तेल',
    'olive oil': 'जैतून का तेल',
    'salt': 'नमक',
    'sugar': 'चीनी',
    'pepper': 'काली मिर्च',
    'egg': 'अंडा',
    'eggs': 'अंडे',
    'flour': 'मैदा / आटा',
    'water': 'पानी',
    'lemon': 'नींबू',
    'coriander': 'हरा धनिया',
    'chili': 'मिर्च',
    'spices': 'मसाले',
    // Adjectives & Terms
    'creamy': 'मलाईदार',
    'spicy': 'तीखा / मसालेदार',
    'crispy': 'कुरकुरा',
    'sweet': 'मीठा',
    'hot': 'गरम',
    'fresh': 'ताजा',
    'homemade': 'घर का बना',
    'roasted': 'भुना हुआ',
    'fried': 'तला हुआ',
    'grilled': 'ग्रिल्ड',
    'baked': 'बेक्ड',
    // Steps & Verbs
    'step 1:': 'चरण 1:',
    'step 2:': 'चरण 2:',
    'step 3:': 'चरण 3:',
    'step 4:': 'चरण 4:',
    'step 5:': 'चरण 5:',
    'step 6:': 'चरण 6:',
    'heat': 'गरम करें',
    'cook for': 'पकाएं',
    'minutes': 'मिनट',
    'serve hot': 'गरमा-गरम परोसें',
    'mix well': 'अच्छी तरह मिलाएं',
    'add': 'डालें',
  },
  es: {
    'chicken': 'pollo',
    'paneer': 'queso fresco',
    'pizza': 'pizza',
    'burger': 'hamburguesa',
    'pasta': 'pasta',
    'salad': 'ensalada',
    'soup': 'sopa',
    'rice': 'arroz',
    'noodles': 'fideos',
    'sandwich': 'sándwich',
    'garlic': 'ajo',
    'onion': 'cebolla',
    'tomato': 'tomate',
    'potato': 'patata',
    'potatoes': 'patatas',
    'ginger': 'jengibre',
    'butter': 'mantequilla',
    'cheese': 'queso',
    'milk': 'leche',
    'cream': 'crema / nata',
    'oil': 'aceite',
    'olive oil': 'aceite de oliva',
    'salt': 'sal',
    'sugar': 'azúcar',
    'pepper': 'pimienta',
    'egg': 'huevo',
    'eggs': 'huevos',
    'flour': 'harina',
    'water': 'agua',
    'lemon': 'limón',
    'coriander': 'cilantro',
    'chili': 'chile',
    'creamy': 'cremoso',
    'spicy': 'picante',
    'crispy': 'crujiente',
    'sweet': 'dulce',
    'hot': 'caliente',
    'fresh': 'fresco',
    'step 1:': 'Paso 1:',
    'step 2:': 'Paso 2:',
    'step 3:': 'Paso 3:',
    'step 4:': 'Paso 4:',
    'step 5:': 'Paso 5:',
    'minutes': 'minutos',
    'serve hot': 'servir caliente',
  },
  fr: {
    'chicken': 'poulet',
    'pizza': 'pizza',
    'burger': 'burger',
    'pasta': 'pâtes',
    'salad': 'salade',
    'soup': 'soupe',
    'rice': 'riz',
    'garlic': 'ail',
    'onion': 'oignon',
    'tomato': 'tomate',
    'butter': 'beurre',
    'cheese': 'fromage',
    'milk': 'lait',
    'cream': 'crème',
    'oil': 'huile',
    'salt': 'sel',
    'sugar': 'sucre',
    'egg': 'œuf',
    'eggs': 'œufs',
    'step 1:': 'Étape 1:',
    'step 2:': 'Étape 2:',
    'step 3:': 'Étape 3:',
    'step 4:': 'Étape 4:',
    'minutes': 'minutes',
  },
  mr: {
    'chicken': 'चिकन',
    'paneer': 'पनीर',
    'pizza': 'पिझ्झा',
    'burger': 'बर्गर',
    'pasta': 'पास्ता',
    'salad': 'सलाड',
    'rice': 'भात / तांदूळ',
    'garlic': 'लसूण',
    'onion': 'कांदा',
    'tomato': 'टोमॅटो',
    'butter': 'लोणी / बटर',
    'milk': 'दूध',
    'salt': 'मीठ',
    'sugar': 'साखर',
    'step 1:': 'पायरी १:',
    'step 2:': 'पायरी २:',
    'step 3:': 'पायरी ३:',
  },
  bn: {
    'chicken': 'চিকেন',
    'paneer': 'পনির',
    'pizza': 'পিৎজা',
    'burger': 'বার্গার',
    'rice': 'ভাত',
    'garlic': 'রসুন',
    'onion': 'পেঁয়াজ',
    'tomato': 'টমেটো',
    'butter': 'মাখন',
    'milk': 'দুধ',
    'salt': 'লবণ',
    'sugar': 'চিনি',
    'step 1:': 'ধাপ ১:',
    'step 2:': 'ধাপ ২:',
    'step 3:': 'ধাপ ৩:',
  }
};

/**
 * Replaces common culinary terms in text for custom user-created recipes
 */
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

/**
 * Translates a recipe's title, description, ingredients, and instructions based on active language code.
 * Works seamlessly on both pre-seeded recipes AND newly published user recipes!
 * @param {Object} recipe - Raw recipe object from database
 * @param {string} lang - Active language code (e.g. 'hi', 'es', 'fr', 'ja', 'zh', etc.)
 * @returns {Object} Translated recipe object
 */
export function getTranslatedRecipe(recipe, lang = 'en') {
  if (!recipe) return recipe;
  if (!lang || lang === 'en') return recipe;

  // 1. Direct match by exact title in curated dictionary
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

  // 2. Normalized alphanumeric match for curated recipes
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

  // 3. Dynamic culinary translation for custom user-created recipes
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
