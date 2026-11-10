const mongoose = require('mongoose');
const dotenv = require('dotenv');
const https = require('https');
const http = require('http');

// Load environment variables
dotenv.config();

// Helper: download image buffer from URL using native Node http/https
const fetchImageBuffer = (url) => new Promise((resolve, reject) => {
  const client = url.startsWith('https') ? https : http;
  client.get(url, (res) => {
    const chunks = [];
    res.on('data', (chunk) => chunks.push(chunk));
    res.on('end', () => resolve(Buffer.concat(chunks)));
    res.on('error', reject);
  }).on('error', reject);
});

// Models
const Admin = require('./models/Admin');
const User = require('./models/User');
const Vehicle = require('./models/Vehicle');
const Service = require('./models/Service');
const ServiceRequest = require('./models/ServiceRequest');
const Part = require('./models/Part');
const Inventory = require('./models/Inventory');
const Notification = require('./models/Notification');
const Garage = require('./models/Garage');

const seedData = async () => {
  try {
    console.log('Connecting to MongoDB for seeding...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected. Clearing database collections...');

    // Clear existing data
    await Admin.deleteMany({});
    await User.deleteMany({});
    await Vehicle.deleteMany({});
    await Service.deleteMany({});
    await ServiceRequest.deleteMany({});
    await Part.deleteMany({});
    await Inventory.deleteMany({});
    await Notification.deleteMany({});
    await Garage.deleteMany({});

    console.log('Database cleared. Seeding Administrators...');

    // 1. Seed Admin
    const admin = await Admin.create({
      name: 'Chief Admin',
      email: 'admin@garage.com',
      password: 'password123' // Will be hashed via pre-save hook
    });
    console.log('Admin seeded: admin@garage.com / password123');

    // 2. Seed Users
    console.log('Seeding Customers...');
    const alex = await User.create({
      name: 'Alex Mercer',
      email: 'user@garage.com',
      password: 'password123', // Will be hashed via pre-save hook
      phone: '9876543210',
      profileImage: ''
    });

    const jane = await User.create({
      name: 'Jane Doe',
      email: 'jane@garage.com',
      password: 'password123',
      phone: '9988776655',
      profileImage: ''
    });
    console.log('Users seeded: user@garage.com, jane@garage.com');

    // 3. Seed Vehicles
    console.log('Seeding Vehicles...');
    const tesla = await Vehicle.create({
      owner: alex._id,
      make: 'Tesla',
      model: 'Model 3',
      year: 2022,
      licensePlate: 'TS-03-EL',
      vin: '5YJ3E1EA5NF123456',
      mileage: 18500,
      lastServiceDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 1 month ago
      status: 'Approved'
    });

    const mustang = await Vehicle.create({
      owner: alex._id,
      make: 'Ford',
      model: 'Mustang GT',
      year: 2020,
      licensePlate: 'GT-50-FD',
      vin: '1FA6P8CF5L5987654',
      mileage: 32000,
      lastServiceDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 3 months ago
      status: 'Approved'
    });

    const camaro = await Vehicle.create({
      owner: jane._id,
      make: 'Chevrolet',
      model: 'Camaro SS',
      year: 2021,
      licensePlate: 'SS-21-CH',
      vin: '1G11Y1Y1Y1Y1Y1Y1Y',
      mileage: 21000,
      lastServiceDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
      status: 'Approved'
    });
    console.log('Vehicles seeded.');

    // 4. Seed Master Services Catalog
    console.log('Seeding Services Catalog...');
    const oilChange = await Service.create({
      name: 'Synthetic Oil & Filter Service',
      description: 'Replace engine oil with high-grade synthetic oil and install a premium oil filter. Enhances cylinder lubrication.',
      basePrice: 65,
      estimatedDuration: '45 mins',
      category: 'Routine Maintenance'
    });

    const brakeJob = await Service.create({
      name: 'Brake Pad Replacement',
      description: 'Replace front or rear brake pads with ceramic high-durability friction pads and check calipers.',
      basePrice: 150,
      estimatedDuration: '1.5 hours',
      category: 'Brakes & Suspension'
    });

    const diagnostics = await Service.create({
      name: 'Full Computer OBD-II Diagnostics',
      description: 'Plug in scanner to decode active dashboard codes and check sensor emission readouts.',
      basePrice: 80,
      estimatedDuration: '1 hour',
      category: 'Diagnostics'
    });

    const engineTune = await Service.create({
      name: 'Engine Tuning & Fuel Flush',
      description: 'Check fuel lines, replace spark plugs, perform carbon cleanup, and tune engine timing.',
      basePrice: 450,
      estimatedDuration: '3.5 hours',
      category: 'Engine Repair'
    });

    const battRepl = await Service.create({
      name: 'Battery Replacement & Charging Test',
      description: 'Replace old car battery with a high-durability lead-acid unit and inspect alternator charge rates.',
      basePrice: 160,
      estimatedDuration: '30 mins',
      category: 'Electrical'
    });

    const tireRotation = await Service.create({
      name: 'Tire Rotation, Alignment & Balancing',
      description: 'Rearrange tires in cross pattern, check steering column alignment, and counter-balance weights.',
      basePrice: 75,
      estimatedDuration: '1.5 hours',
      category: 'Tires & Wheels'
    });
    console.log('Services catalog seeded.');

    // 5. Seed Master Parts catalog & auto-create Inventory
    console.log('Seeding Parts Catalog and Warehousing...');
    const partsData = [
      {
        name: 'V8 Engine Block Assembly',
        code: 'ENG-V8-X',
        category: 'Engine',
        basePrice: 3200,
        description: 'OEM high-performance V8 engine block assembly.',
        compatibility: 'Ford Mustang GT, Chevrolet Camaro SS',
        qty: 2,
        reorder: 1,
        loc: 'Aisle A-1',
        imageUrl: 'https://images.unsplash.com/photo-1616788494707-ec28f08d05a1?auto=format&fit=crop&q=80&w=600'
      },
      {
        name: 'DieHard Platinum Battery 800 CCA',
        code: 'BAT-12V-DH',
        category: 'Battery',
        basePrice: 150,
        description: '12V Lead-acid starter battery with high cold cranking amps.',
        compatibility: 'Universal vehicle fit',
        qty: 15,
        reorder: 5,
        loc: 'Shelf B-2',
        imageUrl: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=600'
      },
      {
        name: 'Brembo Ceramic Brake Pads (Set)',
        code: 'BRK-CC-BM',
        category: 'Brake Pad',
        basePrice: 110,
        description: 'Carbon-ceramic high-performance front brake pads.',
        compatibility: 'Ford Mustang, Sports packages',
        qty: 8,
        reorder: 4,
        loc: 'Shelf B-3',
        imageUrl: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&q=80&w=600'
      },
      {
        name: 'K&N Engine Air Intake Filter',
        code: 'FLT-KN-HF',
        category: 'Air Filter',
        basePrice: 45,
        description: 'Reusable high-performance cabin and engine air flow filter.',
        compatibility: 'Tesla Model 3, Ford Mustang',
        qty: 25,
        reorder: 8,
        loc: 'Bin C-1',
        imageUrl: 'https://images.unsplash.com/photo-1552656967-7a0991a13906?auto=format&fit=crop&q=80&w=600'
      },
      {
        name: 'Michelin Pilot Sport 4S (235/40R19)',
        code: 'TIR-PS4S',
        category: 'Tire',
        basePrice: 220,
        description: 'Premium summer performance radial tire.',
        compatibility: 'Tesla Model 3, Ford Mustang',
        qty: 12,
        reorder: 4,
        loc: 'Tire Rack 1',
        imageUrl: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&q=80&w=600'
      },
      {
        name: 'LED Projection Headlight Assembly',
        code: 'LGT-LED-AS',
        category: 'Headlight',
        basePrice: 380,
        description: 'Bright white replacement LED headlight assembly.',
        compatibility: 'Tesla Model 3',
        qty: 3, // Low stock! Less than reorder level
        reorder: 5,
        loc: 'Shelf D-1',
        imageUrl: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=600'
      },
      {
        name: 'Dual-Core Cooling Radiator',
        code: 'RAD-PERF-1',
        category: 'Radiator',
        basePrice: 290,
        description: 'Premium cooling radiator core prevents engine overheating.',
        compatibility: 'Ford Mustang GT, Chevrolet Camaro SS',
        qty: 6,
        reorder: 2,
        loc: 'Aisle A-2',
        imageUrl: 'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?auto=format&fit=crop&q=80&w=600'
      },
      {
        name: 'NGK Laser Iridium Spark Plug',
        code: 'SPK-NGK-IR',
        category: 'Spark Plug',
        basePrice: 12,
        description: 'Long-lasting precision engine spark plug.',
        compatibility: 'Ford Mustang, Camaro',
        qty: 120,
        reorder: 30,
        loc: 'Box E-3',
        imageUrl: 'https://images.unsplash.com/photo-1620939514049-63a591e37f1e?auto=format&fit=crop&q=80&w=600'
      },
      {
        name: 'Bosch High-Pressure Fuel Injector',
        code: 'INJ-BOS-FI',
        category: 'Fuel Injector',
        basePrice: 130,
        description: 'Precision fuel injection atomizer valve.',
        compatibility: 'Ford Mustang GT, Chevrolet Camaro SS',
        qty: 24,
        reorder: 8,
        loc: 'Box E-4',
        imageUrl: 'https://images.unsplash.com/photo-1538338621409-15a01e0e8549?auto=format&fit=crop&q=80&w=600'
      },
      {
        name: 'Alternator Charging Generator (150A)',
        code: 'ALT-150A',
        category: 'Alternator',
        basePrice: 215,
        description: 'High-current 150 Amp AC generator alternator.',
        compatibility: 'Universal Ford/Chevrolet',
        qty: 4,
        reorder: 2,
        loc: 'Shelf C-3',
        imageUrl: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=600'
      },
      {
        name: 'Exedy Organic Friction Clutch Plate',
        code: 'CLT-EXD-S1',
        category: 'Clutch Plate',
        basePrice: 275,
        description: 'Replacement manual transmission clutch disc plate.',
        compatibility: 'Ford Mustang GT',
        qty: 2,
        reorder: 3, // Low stock!
        loc: 'Shelf C-4',
        imageUrl: 'https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?auto=format&fit=crop&q=80&w=600'
      },
      {
        name: 'Bilstein B8 Heavy Duty Shock Damper',
        code: 'SUS-BIL-B8',
        category: 'Suspension',
        basePrice: 195,
        description: 'Gas pressurized suspension damper strut.',
        compatibility: 'Universal coil springs',
        qty: 10,
        reorder: 4,
        loc: 'Aisle B-1',
        imageUrl: 'https://images.unsplash.com/photo-1615906655593-ad098c44c16c?auto=format&fit=crop&q=80&w=600'
      },
      {
        name: 'Premium Carbon‑Fiber Spoiler',
        code: 'SPRF‑CF‑01',
        category: 'Aerodynamics',
        basePrice: 580,
        description: 'Lightweight carbon‑fiber rear spoiler for improved downforce.',
        compatibility: 'Tesla Model 3, Ford Mustang',
        qty: 4,
        reorder: 2,
        loc: 'Shelf F‑2',
        imageUrl: 'https://images.unsplash.com/photo-1593451707748-97c63c6a4f3a?auto=format&fit=crop&w=600&q=80'
      }
    ];

    for (const p of partsData) {
      // Fetch image binary data for MongoDB storage
      let imageData = null;
      if (p.imageUrl) {
        try {
          imageData = await fetchImageBuffer(p.imageUrl);
        } catch (imgErr) {
          console.error('Failed to fetch image for part', p.name, imgErr.message);
        }
      }
      const part = await Part.create({
        name: p.name,
        code: p.code,
        category: p.category,
        basePrice: p.basePrice,
        description: p.description,
        compatibility: p.compatibility,
        imageUrl: p.imageUrl || '',
        imageData: imageData
      });

      await Inventory.create({
        part: part._id,
        quantityInStock: p.qty,
        reorderLevel: p.reorder,
        location: p.loc
      });
    }
    console.log('Parts and Inventory seeded successfully.');

    // 5.5 Seed Garages
    console.log('Seeding Garages...');
    const garage0 = await Garage.create({ name: 'Speedy Auto Repair', location: '12 Main St, Mangalore' });
    const garage1 = await Garage.create({ name: 'Apex Garage', location: '45 Cross Rd, Kasaragod' });
    const garage2 = await Garage.create({ name: 'Pioneer Auto Care', location: '88 Ring Rd, Udupi' });
    const garage3 = await Garage.create({ name: 'Urban Mechanic Center', location: '102 Tech Park, Manipal' });
    const garage4 = await Garage.create({ name: 'Elite Motors', location: '33 Beach Rd, Mangalore' });
    const garage5 = await Garage.create({ name: 'Titan Auto Works', location: '77 Hill View, Kasaragod' });
    const garage6 = await Garage.create({ name: 'Precision Car Care', location: '90 Center St, Udupi' });
    const garage7 = await Garage.create({ name: 'NextGen Auto Shop', location: '22 North Ave, Manipal' });
    const garage8 = await Garage.create({ name: 'Royal Garage', location: '15 South Blvd, Mangalore' });
    const garage9 = await Garage.create({ name: 'ProFix Auto', location: '66 West Dr, Kasaragod' });
    const garage10 = await Garage.create({ name: 'Metro Service Station', location: '11 East End, Udupi' });
    const garage11 = await Garage.create({ name: 'Dynamic Auto Point', location: '44 Horizon Way, Manipal' });
    const garage12 = await Garage.create({ name: 'Supreme Car Service', location: '89 Bay View, Mangalore' });
    const garage13 = await Garage.create({ name: 'Alpha Motors', location: '23 River Side, Kasaragod' });
    const garage14 = await Garage.create({ name: 'Velocity Garage', location: '55 Valley Rd, Udupi' });
    const garage15 = await Garage.create({ name: 'Prime Auto Repair', location: '78 Pine Ln, Manipal' });
    const garage16 = await Garage.create({ name: 'Eco Shield Auto', location: '40 Green Way, Mangalore' });
    const garage17 = await Garage.create({ name: 'Ultimate Detailing', location: '99 Wash St, Kasaragod' });
    const garage18 = await Garage.create({ name: 'Crystal Clear Cars', location: '101 Shine Ave, Udupi' });
    const garage19 = await Garage.create({ name: 'Showroom Finish', location: '77 Gleam Rd, Manipal' });
    console.log('Garages seeded.');

    // 6. Seed Service Requests
    console.log('Seeding Service Requests...');
    
    // Booking 1: Alex Mustang Brake Job - COMPLETED
    await ServiceRequest.create({
      user: alex._id,
      vehicle: mustang._id,
      service: brakeJob._id,
      garage: garage0._id,
      bookingDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
      preferredTime: '10:00 AM',
      status: 'Completed',
      notes: 'Brake pads swapped and rotors cleaned. Pedal feels firm.',
      totalCost: 150,
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
    });

    // Booking 2: Alex Tesla Diagnostics - APPROVED
    await ServiceRequest.create({
      user: alex._id,
      vehicle: tesla._id,
      service: diagnostics._id,
      garage: garage1._id,
      bookingDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // In 2 days
      preferredTime: '02:00 PM',
      status: 'Accepted',
      notes: 'Check warning indicators and dashboard software.',
      totalCost: 80,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    });

    // Booking 3: Jane Camaro Engine Tune - IN PROGRESS
    await ServiceRequest.create({
      user: jane._id,
      vehicle: camaro._id,
      service: engineTune._id,
      garage: garage2._id,
      bookingDate: new Date(), // Today
      preferredTime: '11:00 AM',
      status: 'In Progress',
      notes: 'Performing performance cylinder tune-up.',
      totalCost: 450,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    });

    // Booking 4: Alex Tesla Oil Change - PENDING
    await ServiceRequest.create({
      user: alex._id,
      vehicle: tesla._id,
      service: oilChange._id,
      garage: garage0._id,
      bookingDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // In 5 days
      preferredTime: '09:00 AM',
      status: 'Pending',
      notes: 'Standard periodic check.',
      totalCost: 65,
      createdAt: new Date()
    });
    console.log('Service requests seeded.');


    // 8. Seed Notifications
    console.log('Seeding Notifications...');
    // General Announcement
    await Notification.create({
      user: null, // Broadcast
      title: 'Smart Garage Hub Launch!',
      message: 'Welcome to the futuristic Smart Garage Hub! Book services and scan parts anytime.',
      type: 'Info'
    });

    // Targeted notification for Alex
    await Notification.create({
      user: alex._id,
      title: 'Tire Service Reminder',
      message: 'Your Ford Mustang GT is due for tire rotation and balancing.',
      type: 'Reminder'
    });

    // Warning notification for Alex
    await Notification.create({
      user: alex._id,
      title: 'Battery Diagnostics Alert',
      message: 'Last AI scan indicated low battery charge. Consider scheduling a check.',
      type: 'Warning'
    });
    console.log('Notifications seeded.');

    console.log('==================================================');
    console.log('DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('==================================================');
    process.exit(0);
  } catch (error) {
    console.error('Seeding process failed with error:');
    console.error(error);
    process.exit(1);
  }
};

seedData();
