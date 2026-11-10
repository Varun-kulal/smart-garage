const mongoose = require('mongoose');
const User = require('./models/User');

require('dotenv').config({ path: './.env' });

async function fixRaj() {
  await mongoose.connect(process.env.MONGO_URI);
  
  const raj = await User.findOne({ email: 'raj1122@gmail.com' });
  if (raj) {
    // Assign to Future Auto Care Center
    raj.assignedGarage = new mongoose.Types.ObjectId('6a549f730799a09d83dd37b9');
    await raj.save();
    console.log('Raj has been assigned to Future Auto Care Center!');
  } else {
    console.log('Raj not found');
  }

  mongoose.connection.close();
}

fixRaj();
