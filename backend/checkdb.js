const mongoose = require('mongoose');
const User = require('./models/User');

require('dotenv').config({ path: './.env' });

async function checkDB() {
  await mongoose.connect(process.env.MONGO_URI);
  
  const mechanics = await User.find({ role: 'mechanic' });
  console.log('--- MECHANICS ---');
  console.log(mechanics);

  const staff = await User.find({ role: 'staff' });
  console.log('--- STAFF ---');
  console.log(staff);

  mongoose.connection.close();
}

checkDB();
