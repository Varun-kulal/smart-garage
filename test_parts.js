const axios = require('axios');

async function testShopParts() {
  try {
    // Need a valid token. Or wait, the user is logged in. Let's just bypass auth for the test if possible,
    // or simulate what the frontend receives.
    // Wait, the API for `/api/inventory/shop/parts` might not even require auth if the user says so? No, it requires protect.
    // Let's connect directly to MongoDB instead to verify parts exist.
    
    const mongoose = require('mongoose');
    await mongoose.connect('mongodb://127.0.0.1:27017/ai_car_parts');
    
    const Part = require('./backend/models/Part');
    const Inventory = require('./backend/models/Inventory');
    
    const partsCount = await Part.countDocuments();
    const invCount = await Inventory.countDocuments();
    
    console.log('Parts count:', partsCount);
    console.log('Inventory count:', invCount);
    
    const firstPart = await Part.findOne();
    console.log('First part basePrice:', firstPart ? firstPart.basePrice : 'No parts');
    
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

testShopParts();
