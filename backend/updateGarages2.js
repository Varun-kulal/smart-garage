const mongoose = require('mongoose');
require('dotenv').config({path: './.env'});

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ai_car_parts').then(async () => {
  await mongoose.connection.collection('garages').updateOne(
    { location: /Mangalore/i },
    { $set: { name: 'AutoPro Mangalore Center', technicianName: 'Vikram Singh', technicianPhone: '9876543210' } }
  );
  await mongoose.connection.collection('garages').updateOne(
    { location: /Kasaragod/i },
    { $set: { name: 'Elite Garage Kasaragod', technicianName: 'Rahul Sharma', technicianPhone: '9988776655' } }
  );
  console.log('Garages updated in DB');
  process.exit();
}).catch(err => {
  console.error(err);
  process.exit(1);
});
