const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const Cabinet = require('./models/Cabinet');

const simpleSeed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected');

    const email = 'doctor@test.com';
    await User.deleteMany({ email });
    
    const user = new User({
        email,
        password: 'password123',
        nom: 'Test',
        prenom: 'Doctor',
        role: 'medecin',
        isApproved: true,
        isActive: true
    });
    const savedUser = await user.save();
    console.log('User saved', savedUser._id);

    const cabinet = new Cabinet({
        nom: 'Cabinet Test',
        adresse: 'Address Test',
        telephone: '12345678',
        userId: savedUser._id
    });
    const savedCabinet = await cabinet.save();
    console.log('Cabinet saved', savedCabinet._id);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

simpleSeed();
