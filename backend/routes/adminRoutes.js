const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const { protect, adminOnly } = require('../middlewares/authMiddleware');
const {
  getAdminStats,
  getAdminRecipes,
  createAdminRecipe,
  updateAdminRecipe,
  deleteAdminRecipe,
  getAdminUsers,
  createAdminUser,
  updateAdminUser,
  updateUserRole,
  deleteAdminUser,
  getUserRecipes,
  getAllAdmins,
  createAdminAccount,
  updateAdminAccount,
  deleteAdminAccount,
  claimAdminSelf,
} = require('../controllers/adminController');

// All routes require authentication & admin privileges
router.use(protect);

// Claim admin self endpoint
router.post('/claim-admin', claimAdminSelf);

// Require full admin role for remaining endpoints
router.use(adminOnly);

// Stats & Metrics
router.get('/stats', getAdminStats);

// Recipe Moderation & Creation
router.get('/recipes', getAdminRecipes);
router.post('/recipes/create', upload.single('image'), createAdminRecipe);
router.put('/recipes/:id', upload.single('image'), updateAdminRecipe);
router.delete('/recipes/:id', deleteAdminRecipe);

// Chef / User Management (Full CRUD)
router.route('/users')
  .get(getAdminUsers)
  .post(createAdminUser);

router.route('/users/:id')
  .put(updateAdminUser)
  .delete(deleteAdminUser);

router.put('/users/:id/role', updateUserRole);
router.get('/users/:id/recipes', getUserRecipes);

// Admin Team & Settings Management
router.route('/admins')
  .get(getAllAdmins)
  .post(createAdminAccount);

router.route('/admins/:id')
  .put(updateAdminAccount)
  .delete(deleteAdminAccount);

module.exports = router;
