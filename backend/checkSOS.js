const mongoose = require('mongoose');
const SOSAlert = require('./models/SOSAlert');

require('dotenv').config({ path: './.env' });

async function checkSOS() {
  await mongoose.connect(process.env.MONGO_URI);
  const alerts = await SOSAlert.find({});
  console.log('--- ALL SOS ALERTS ---');
  console.log(alerts);
  mongoose.connection.close();
}

checkSOS();
