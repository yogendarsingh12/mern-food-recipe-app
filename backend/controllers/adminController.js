const Recipe = require('../models/Recipe');
const User = require('../models/User');

/**
 * @desc    Get Admin Dashboard Analytics & Summary Statistics
 * @route   GET /api/admin/stats
 * @access  Private/Admin
 */
const getAdminStats = async (req, res) => {
  try {
    const totalRecipes = await Recipe.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: 'admin' });

    // Recent 5 recipes
    const recentRecipes = await Recipe.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent 5 registered users
    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    // Calculate total ingredients count
    const allRecipes = await Recipe.find({}, 'ingredients');
    const totalIngredients = allRecipes.reduce(
      (sum, r) => sum + (r.ingredients?.length || 0),
      0
    );

    res.status(200).json({
      success: true,
      data: {
        totalRecipes,
        totalUsers,
        totalAdmins,
        totalIngredients,
        recentRecipes,
        recentUsers,
      },
    });
  } catch (error) {
    console.error('[Admin Stats Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin statistics',
      error: error.message,
    });
  }
};

/**
 * @desc    Get all recipes for Admin management (with search)
 * @route   GET /api/admin/recipes
 * @access  Private/Admin
 */
const getAdminRecipes = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { authorName: { $regex: search, $options: 'i' } },
        ],
      };
    }

    const recipes = await Recipe.find(query)
      .populate('user', 'name email role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: recipes.length,
      data: recipes,
    });
  } catch (error) {
    console.error('[Admin Get Recipes Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recipes for admin',
      error: error.message,
    });
  }
};

/**
 * @desc    Create recipe directly from Admin Studio
 * @route   POST /api/admin/recipes
 * @access  Private/Admin
 */
const createAdminRecipe = async (req, res) => {
  try {
    const { title, description, ingredients, instructions, authorName } = req.body;
    const imageUrl = req.file?.path || req.file?.secure_url || req.file?.url;

    if (!imageUrl) {
      return res.status(400).json({ success: false, message: 'Cover image is required.' });
    }

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Recipe title is required.' });
    }

    if (!instructions || !instructions.trim()) {
      return res.status(400).json({ success: false, message: 'Instructions are required.' });
    }

    let parsedIngredients = [];
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

    const recipe = await Recipe.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      ingredients: parsedIngredients,
      instructions: instructions.trim(),
      imageUrl: imageUrl,
      user: req.user._id,
      authorName: authorName ? authorName.trim() : `Admin ${req.user.name}`,
    });

    res.status(201).json({
      success: true,
      message: 'Recipe published successfully by Admin!',
      data: recipe,
    });
  } catch (error) {
    console.error('[Admin Create Recipe Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update any recipe as Admin
 * @route   PUT /api/admin/recipes/:id
 * @access  Private/Admin
 */
const updateAdminRecipe = async (req, res) => {
  try {
    const { title, description, ingredients, instructions } = req.body;

    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found',
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

    recipe.title = title !== undefined ? title.trim() : recipe.title;
    recipe.description = description !== undefined ? description.trim() : recipe.description;
    recipe.ingredients = parsedIngredients;
    recipe.instructions = instructions !== undefined ? instructions.trim() : recipe.instructions;

    // If new image was uploaded via multer
    if (req.file) {
      recipe.imageUrl = req.file.path || req.file.secure_url || req.file.url;
    }

    const updatedRecipe = await recipe.save();

    res.status(200).json({
      success: true,
      message: 'Recipe updated successfully by Admin',
      data: updatedRecipe,
    });
  } catch (error) {
    console.error('[Admin Update Recipe Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update recipe',
      error: error.message,
    });
  }
};

/**
 * @desc    Delete any recipe as Admin
 * @route   DELETE /api/admin/recipes/:id
 * @access  Private/Admin
 */
const deleteAdminRecipe = async (req, res) => {
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
      message: `Recipe "${recipe.title}" deleted by Admin`,
      data: { id: req.params.id },
    });
  } catch (error) {
    console.error('[Admin Delete Recipe Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete recipe',
      error: error.message,
    });
  }
};

/* ================= CHEF / USER MANAGEMENT ================= */

/**
 * @desc    Get all users for Admin management
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
const getAdminUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const recipeCount = await Recipe.countDocuments({ user: user._id });
        return {
          ...user.toObject(),
          recipeCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: usersWithStats.length,
      data: usersWithStats,
    });
  } catch (error) {
    console.error('[Admin Get Users Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message,
    });
  }
};

/**
 * @desc    Create a new User account directly from Admin Studio
 * @route   POST /api/admin/users
 * @access  Private/Admin
 */
const createAdminUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters.',
      });
    }

    const emailNormalized = email.toLowerCase().trim();
    const existing = await User.findOne({ email: emailNormalized });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A user account with this email already exists.',
      });
    }

    const newUser = await User.create({
      name: name.trim(),
      email: emailNormalized,
      password,
      role: role === 'admin' ? 'admin' : 'user',
    });

    res.status(201).json({
      success: true,
      message: `User account "${newUser.name}" created successfully!`,
      data: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        recipeCount: 0,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    console.error('[Admin Create User Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update any user account details as Admin (Name, Email, Role, Password)
 * @route   PUT /api/admin/users/:id
 * @access  Private/Admin
 */
const updateAdminUser = async (req, res) => {
  try {
    const { name, email, role, password } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User account not found.',
      });
    }

    if (name) user.name = name.trim();
    if (email) user.email = email.toLowerCase().trim();
    if (role && ['user', 'admin'].includes(role)) {
      if (req.user._id.toString() === req.params.id && role === 'user') {
        return res.status(400).json({
          success: false,
          message: 'You cannot demote your own active admin account.',
        });
      }
      user.role = role;
    }
    if (password && password.trim().length >= 6) {
      user.password = password; // Pre-save hook will hash password automatically
    }

    await user.save();

    const recipeCount = await Recipe.countDocuments({ user: user._id });

    res.status(200).json({
      success: true,
      message: `User "${user.name}" updated successfully!`,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        recipeCount,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('[Admin Update User Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update a user's role (Promote to Admin / Demote to User)
 * @route   PUT /api/admin/users/:id/role
 * @access  Private/Admin
 */
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Role must be either "user" or "admin"',
      });
    }

    if (req.user._id.toString() === req.params.id && role === 'user') {
      return res.status(400).json({
        success: false,
        message: 'You cannot demote yourself from Admin role.',
      });
    }

    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User "${user.name}" role changed to ${role}`,
      data: user,
    });
  } catch (error) {
    console.error('[Admin Update User Role Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user role',
      error: error.message,
    });
  }
};

/**
 * @desc    Delete a user and cascade delete their recipes
 * @route   DELETE /api/admin/users/:id
 * @access  Private/Admin
 */
const deleteAdminUser = async (req, res) => {
  try {
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own admin account.',
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    await Recipe.deleteMany({ user: req.params.id });
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: `User "${user.name}" and their associated recipes were deleted.`,
    });
  } catch (error) {
    console.error('[Admin Delete User Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message,
    });
  }
};

/**
 * @desc    Get all recipes created by a specific user
 * @route   GET /api/admin/users/:id/recipes
 * @access  Private/Admin
 */
const getUserRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ user: req.params.id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: recipes.length,
      data: recipes,
    });
  } catch (error) {
    console.error('[Admin Get User Recipes Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= ADMIN TEAM MANAGEMENT (SETTINGS) ================= */

/**
 * @desc    Get all Administrator accounts
 * @route   GET /api/admin/admins
 * @access  Private/Admin
 */
const getAllAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' }).select('-password').sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: admins.length, data: admins });
  } catch (error) {
    console.error('[Get Admins Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Create a new Administrator account from settings
 * @route   POST /api/admin/admins
 * @access  Private/Admin
 */
const createAdminAccount = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }

    const userExists = await User.findOne({ email: email.toLowerCase().trim() });
    if (userExists) {
      if (userExists.role === 'admin') {
        return res.status(400).json({ success: false, message: 'An admin account with this email already exists.' });
      }
      userExists.role = 'admin';
      await userExists.save();
      return res.status(200).json({ success: true, message: `Promoted existing user "${userExists.name}" to Admin.`, data: userExists });
    }

    const newAdmin = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: 'admin',
    });

    res.status(201).json({
      success: true,
      message: `Administrator "${newAdmin.name}" created successfully!`,
      data: {
        _id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
        createdAt: newAdmin.createdAt,
      },
    });
  } catch (error) {
    console.error('[Create Admin Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update an administrator account (name, password)
 * @route   PUT /api/admin/admins/:id
 * @access  Private/Admin
 */
const updateAdminAccount = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const adminUser = await User.findById(req.params.id);

    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(404).json({ success: false, message: 'Admin account not found.' });
    }

    if (name) adminUser.name = name.trim();
    if (email) adminUser.email = email.toLowerCase().trim();
    if (password && password.trim().length >= 6) {
      adminUser.password = password; // pre-save hook hashes password
    }

    await adminUser.save();

    res.status(200).json({
      success: true,
      message: `Admin account "${adminUser.name}" updated successfully.`,
      data: {
        _id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
      },
    });
  } catch (error) {
    console.error('[Update Admin Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete an administrator account
 * @route   DELETE /api/admin/admins/:id
 * @access  Private/Admin
 */
const deleteAdminAccount = async (req, res) => {
  try {
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own logged-in admin account.' });
    }

    const adminCount = await User.countDocuments({ role: 'admin' });
    if (adminCount <= 1) {
      return res.status(400).json({ success: false, message: 'Cannot delete the only remaining Administrator.' });
    }

    const adminUser = await User.findById(req.params.id);
    if (!adminUser) {
      return res.status(404).json({ success: false, message: 'Admin account not found.' });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: `Admin account "${adminUser.name}" deleted successfully.`,
    });
  } catch (error) {
    console.error('[Delete Admin Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Self promote current authenticated user to admin
 * @route   POST /api/admin/claim-admin
 * @access  Private
 */
const claimAdminSelf = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.role = 'admin';
    await user.save();

    res.status(200).json({
      success: true,
      message: `🎉 Congratulations ${user.name}! You are now an Administrator.`,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('[Claim Admin Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
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
};
