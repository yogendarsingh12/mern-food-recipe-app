const Recipe = require('../models/Recipe');

/**
 * @desc    Get all recipes
 * @route   GET /api/recipes
 * @access  Public
 */
const getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find()
      .populate('user', 'name avatar email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: recipes.length,
      data: recipes,
    });
  } catch (error) {
    console.error('[Get Recipes Error]:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching recipes',
      error: error.message,
    });
  }
};

/**
 * @desc    Get all recipes created by current logged in user
 * @route   GET /api/recipes/my/user
 * @access  Private
 */
const getMyRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: recipes.length,
      data: recipes,
    });
  } catch (error) {
    console.error('[Get My Recipes Error]:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching your recipes',
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
    const recipe = await Recipe.findById(req.params.id).populate('user', 'name avatar email');
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
    console.error('[Get Recipe By ID Error]:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching recipe details',
      error: error.message,
    });
  }
};

/**
 * @desc    Create a new recipe with Cloudinary image upload (Protected)
 * @route   POST /api/recipes
 * @access  Private (Authenticated Users)
 */
const createRecipe = async (req, res) => {
  try {
    const { title, description, ingredients, instructions } = req.body;

    // 1. Verify that image was uploaded via multer-storage-cloudinary
    const imageUrl = req.file?.path || req.file?.secure_url || req.file?.url;

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Recipe image is required. Please attach an image file.',
      });
    }

    // 2. Validate required text fields
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

    // 3. Robustly parse ingredients (supports JSON string, comma-separated string, or array)
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

    // 4. Determine user & author details
    const userId = req.user ? req.user._id : null;
    const authorName = req.user ? req.user.name : (req.body.authorName || 'Community Chef');

    // 5. Save recipe to MongoDB
    const recipe = await Recipe.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      ingredients: parsedIngredients,
      instructions: instructions.trim(),
      imageUrl: imageUrl,
      user: userId,
      authorName: authorName,
    });

    res.status(201).json({
      success: true,
      message: 'Recipe created and uploaded to Cloudinary successfully!',
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
 * @desc    Update a recipe (Protected: Owner or Admin)
 * @route   PUT /api/recipes/:id
 * @access  Private (Owner only)
 */
const updateRecipe = async (req, res) => {
  try {
    const { title, description, ingredients, instructions } = req.body;

    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found',
      });
    }

    // Check ownership
    if (
      recipe.user &&
      req.user &&
      recipe.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You can only edit recipes you have created.',
      });
    }

    // Parse ingredients if provided
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
    if (parsedIngredients.length > 0) recipe.ingredients = parsedIngredients;
    if (instructions) recipe.instructions = instructions.trim();

    // If new image was uploaded via Multer
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
 * @desc    Delete a recipe by ID (Protected: Owner or Admin)
 * @route   DELETE /api/recipes/:id
 * @access  Private (Owner only)
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

    // Check ownership
    if (
      recipe.user &&
      req.user &&
      recipe.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You can only delete recipes that you have created.',
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
