const User = require('../models/User');

/**
 * Automatically seeds the default administrator account into MongoDB if it does not exist
 * Note: Does not log sensitive credentials to the console
 */
const seedDefaultAdmin = async () => {
  try {
    const adminEmail = 'iamadmin123@gmail.com';
    const adminPassword = 'admin234';

    let adminUser = await User.findOne({ email: adminEmail });

    if (!adminUser) {
      adminUser = await User.create({
        name: 'Super Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
      });
      console.log(`👑 [Admin Initialized]: Administrator account verified.`);
    } else {
      let isMatch = false;
      try {
        isMatch = await adminUser.matchPassword(adminPassword);
      } catch (e) {
        isMatch = false;
      }

      if (!isMatch || adminUser.role !== 'admin') {
        adminUser.role = 'admin';
        adminUser.password = adminPassword; // Pre-save hook will hash it
        await adminUser.save();
        console.log(`👑 [Admin Verified]: Administrator privileges synced.`);
      } else {
        console.log(`👑 [Admin Ready]: Administrator service active.`);
      }
    }
  } catch (error) {
    console.error('[Seed Admin Error]:', error.message);
  }
};

module.exports = seedDefaultAdmin;
