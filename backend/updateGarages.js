const mongoose = require('mongoose');
require('dotenv').config({path: './.env'});

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ai_car_parts').then(async () => {
  await mongoose.connection.collection('garages').updateOne(
    { location: /Mangalore/i },
    { $set: { name: 'Mangalore Premier Garage', technicianName: 'Rahul', technicianPhone: '9876543210' } }
  );
  await mongoose.connection.collection('garages').updateOne(
    { location: /Kasaragod/i },
    { $set: { name: 'Kasaragod Auto Experts', technicianName: 'Suresh', technicianPhone: '9988776655' } }
  );
  console.log('Garages updated');
  process.exit();
}).catch(err => {
  console.error(err);
  process.exit(1);
});
