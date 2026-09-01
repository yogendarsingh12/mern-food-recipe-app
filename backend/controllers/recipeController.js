const Recipe = require('../models/Recipe');

/**
 * @desc    Get all recipes with search and category filtering
 * @route   GET /api/recipes
 * @access  Public
 */
const getAllRecipes = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { ingredients: { $regex: search, $options: 'i' } },
          { authorName: { $regex: search, $options: 'i' } },
        ],
      };
    }

    const recipes = await Recipe.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: recipes.length,
      data: recipes,
    });
  } catch (error) {
    console.error('[Get All Recipes Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching recipes',
      error: error.message,
    });
  }
};

/**
 * @desc    Get current user recipes (Public/Open)
 * @route   GET /api/recipes/my/user
 * @access  Public
 */
const getMyRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: recipes.length,
      data: recipes,
    });
  } catch (error) {
    console.error('[Get My Recipes Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching recipes',
      error: error.message,
    });
  }
};

/**
 * @desc    Get single recipe by ID
 * @route   GET /api/recipes/:id
 * @access  Public
 */
const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate('user', 'name email');

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found',
      });
    }

    res.status(200).json({
      success: true,
      data: recipe,
    });
  } catch (error) {
    console.error('[Get Recipe By ID Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching recipe details',
      error: error.message,
    });
  }
};

/**
 * @desc    Create a new recipe with Cloudinary image upload (Public)
 * @route   POST /api/recipes
 * @access  Public
 */
const createRecipe = async (req, res) => {
  try {
    const { title, description, ingredients, instructions, authorName } = req.body;

    const imageUrl = req.file?.path || req.file?.secure_url || req.file?.url;

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Recipe image is required. Please attach an image file.',
      });
    }

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Recipe title is required.',
      });
    }

    if (!instructions || !instructions.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Recipe cooking instructions are required.',
      });
    }

    let parsedIngredients = [];
    if (typeof ingredients === 'string') {
      try {
        const parsed = JSON.parse(ingredients);
        if (Array.isArray(parsed)) {
          parsedIngredients = parsed.map((item) => String(item).trim()).filter(Boolean);
        } else {
          parsedIngredients = ingredients.split(',').map((item) => item.trim()).filter(Boolean);
        }
      } catch (err) {
        parsedIngredients = ingredients.split(',').map((item) => item.trim()).filter(Boolean);
      }
    } else if (Array.isArray(ingredients)) {
      parsedIngredients = ingredients.map((item) => String(item).trim()).filter(Boolean);
    }

    if (parsedIngredients.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one ingredient.',
      });
    }

    const finalAuthor = authorName && authorName.trim() ? authorName.trim() : 'Community Chef';

    const recipe = await Recipe.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      ingredients: parsedIngredients,
      instructions: instructions.trim(),
      imageUrl: imageUrl,
      user: null,
      authorName: finalAuthor,
    });

    res.status(201).json({
      success: true,
      message: 'Recipe created and uploaded successfully!',
      data: recipe,
    });
  } catch (error) {
    console.error('[Create Recipe Error]:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while creating recipe',
    });
  }
};

/**
 * @desc    Update a recipe (Public)
 * @route   PUT /api/recipes/:id
 * @access  Public
 */
const updateRecipe = async (req, res) => {
  try {
    const { title, description, ingredients, instructions, authorName } = req.body;

    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found',
      });
    }

    let parsedIngredients = recipe.ingredients;
    if (ingredients) {
      if (typeof ingredients === 'string') {
        try {
          const parsed = JSON.parse(ingredients);
          parsedIngredients = Array.isArray(parsed)
            ? parsed.map((s) => String(s).trim()).filter(Boolean)
            : ingredients.split(',').map((s) => s.trim()).filter(Boolean);
        } catch {
          parsedIngredients = ingredients.split(',').map((s) => s.trim()).filter(Boolean);
        }
      } else if (Array.isArray(ingredients)) {
        parsedIngredients = ingredients.map((s) => String(s).trim()).filter(Boolean);
      }
    }

    if (title) recipe.title = title.trim();
    if (description !== undefined) recipe.description = description.trim();
    if (authorName) recipe.authorName = authorName.trim();
    if (parsedIngredients.length > 0) recipe.ingredients = parsedIngredients;
    if (instructions) recipe.instructions = instructions.trim();

    if (req.file) {
      recipe.imageUrl = req.file.path || req.file.secure_url || req.file.url;
    }

    const updatedRecipe = await recipe.save();

    res.status(200).json({
      success: true,
      message: 'Recipe updated successfully!',
      data: updatedRecipe,
    });
  } catch (error) {
    console.error('[Update Recipe Error]:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while updating recipe',
    });
  }
};

/**
 * @desc    Delete a recipe by ID (Public)
 * @route   DELETE /api/recipes/:id
 * @access  Public
 */
const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found',
      });
    }

    await Recipe.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Recipe deleted successfully',
      data: { id: req.params.id },
    });
  } catch (error) {
    console.error('[Delete Recipe Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting recipe',
      error: error.message,
    });
  }
};

module.exports = {
  getAllRecipes,
  getMyRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
};
