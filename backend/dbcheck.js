const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const dbCheck = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');
    const allUsers = await User.find({});
    console.log('All users in DB:', allUsers.length);
    allUsers.forEach(u => {
      console.log(`- ${u.nom} ${u.prenom} (Role: ${u.role}, Approved: ${u.isApproved}, Active: ${u.isActive})`);
    });
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

dbCheck();
