const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const seedStaff = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    // Check if staff already exists
    const existingStaff = await User.findOne({ email: 'staff@garage.com' });
    if (!existingStaff) {
      await User.create({
        name: 'John Mechanic',
        email: 'staff@garage.com',
        phone: '1112223334',
        password: 'password123',
        role: 'staff'
      });
      console.log('Staff member seeded successfully!');
    } else {
      // Just update the password for safety
      existingStaff.password = 'password123';
      await existingStaff.save();
      console.log('Staff member already existed, password reset to password123');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding staff:', error);
    process.exit(1);
  }
};

seedStaff();
