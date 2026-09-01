const mongoose = require('mongoose');
const dotenv = require('dotenv');
const seedDefaultAdmin = require('./config/seedAdmin');
const { seedRecipes } = require('./config/seedRecipes');

dotenv.config();

const runSeeder = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('[MongoDB Connected]');

    await seedDefaultAdmin();
    await seedRecipes(true); // force reload 20 recipes

    console.log('Database seeded with 20 recipes and admin user successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

runSeeder();

