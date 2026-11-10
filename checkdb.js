const mongoose = require('mongoose');
const User = require('./backend/models/User');
const ServiceRequest = require('./backend/models/ServiceRequest');
const Garage = require('./backend/models/Garage');

require('dotenv').config({ path: './backend/.env' });

async function checkDB() {
  await mongoose.connect(process.env.MONGO_URI);
  
  const raj = await User.findOne({ name: 'RAJ' });
  console.log('--- RAJ USER ---');
  console.log(raj);
  
  const requests = await ServiceRequest.find({});
  console.log('--- ALL SERVICE REQUESTS ---');
  console.log(requests);

  const garages = await Garage.find({});
  console.log('--- ALL GARAGES ---');
  console.log(garages);

  mongoose.connection.close();
}

checkDB();
