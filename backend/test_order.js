require('dotenv').config();
const mongoose = require('mongoose');
const Order = require('./models/Order');

async function test() {
  await mongoose.connect(process.env.MONGO_URI);
  
  try {
    const newOrder = await Order.create({
      orderId: 'TEST-123',
      user: new mongoose.Types.ObjectId(), // Fake user ID
      items: [
        {
          _id: new mongoose.Types.ObjectId(),
          name: 'Brake Pad',
          qty: 1,
          basePrice: 45
        }
      ],
      totalAmount: 45
    });
    console.log("SUCCESS:", newOrder);
  } catch (err) {
    console.log("ERROR:", err.message);
  }
  process.exit(0);
}
test();
