const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const users = await User.find({});
        console.log(`TOTAL_USERS:${users.length}`);
        users.forEach(u => {
            console.log(`USER:${u._id}:${u.email}:${u.role}:${u.isApproved}:${u.isActive}`);
        });
        process.exit(0);
    } catch(err) {
        console.error(err);
        process.exit(1);
    }
}
check();
