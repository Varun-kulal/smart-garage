const mongoose = require('mongoose');
require('dotenv').config({path: './.env'});

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ai_car_parts').then(async () => {
  const result = await mongoose.connection.collection('garages').deleteMany({
    location: { $regex: /Bengaluru|Whitefield|Indiranagar/i }
  });
  console.log('Garages deleted:', result.deletedCount);
  process.exit();
}).catch(err => {
  console.error(err);
  process.exit(1);
});
