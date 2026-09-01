const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const { protect } = require('../middlewares/authMiddleware');
const {
  getAllRecipes,
  getMyRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} = require('../controllers/recipeController');

// Route: /api/recipes/my/user (Fetch current user's recipes)
router.get('/my/user', protect, getMyRecipes);

// Route: /api/recipes
router
  .route('/')
  .get(getAllRecipes)
  .post(protect, upload.single('image'), createRecipe);

// Route: /api/recipes/:id
router
  .route('/:id')
  .get(getRecipeById)
  .put(protect, upload.single('image'), updateRecipe)
  .delete(protect, deleteRecipe);

module.exports = router;
