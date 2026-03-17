const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');
    
    const adminEmail = 'admin@mediconnect.com';
    const existing = await User.findOne({ email: adminEmail });
    
    if (existing) {
      console.log('Admin already exists');
      process.exit(0);
    }

    const admin = new User({
      email: adminEmail,
      password: 'adminpassword123',
      nom: 'Admin',
      prenom: 'System',
      role: 'admin',
      isApproved: true,
      isActive: true
    });

    await admin.save();
    console.log('Admin created successfully');
    console.log('Email: ' + adminEmail);
    console.log('Password: adminpassword123');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

createAdmin();
