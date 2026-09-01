const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const {
  getAllRecipes,
  getMyRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} = require('../controllers/recipeController');

// Route: /api/recipes (Public creation and fetching without mandatory user login)
router
  .route('/')
  .get(getAllRecipes)
  .post(upload.single('image'), createRecipe);

// Route: /api/recipes/:id
router
  .route('/:id')
  .get(getRecipeById)
  .put(upload.single('image'), updateRecipe)
  .delete(deleteRecipe);

module.exports = router;
