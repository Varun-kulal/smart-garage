const fs = require('fs');

const images = [
  'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1621252179027-94459d278660?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1520340356584-f9917d1e5104?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1503376713356-dd187e1f4095?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1503376713356-dd187e1f4095?auto=format&fit=crop&q=80&w=600'
];

const mechanicNames = [
  'Vikram Singh', 'Arjun Patel', 'Deepak Kumar', 'Rohan Sharma', 'Amit Verma',
  'Sandeep Nair', 'Ravi Teja', 'Karan Johar', 'Manish Pandey', 'Vinay Kumar',
  'Aditya Rao', 'Surya Pratap', 'Nikhil Jain', 'Rahul Dravid', 'Gaurav Chopra',
  'Prakash Raj', 'Dinesh Karthik', 'Varun Dhawan', 'Mohit Suri', 'Sachin Pilot'
];

const filePaths = [
  'D:/ai_car_parts/frontend/src/pages/user/Services.jsx',
  'D:/ai_car_parts/frontend/src/pages/user/ServiceBooking.jsx'
];

for (const filePath of filePaths) {
  if (!fs.existsSync(filePath)) continue;
  let content = fs.readFileSync(filePath, 'utf-8');
  
  let i = 0;
  content = content.replace(/image:\s*MOCK_IMAGE_URL/g, (match) => {
    const replacement = `image: '${images[i % images.length]}',\n      mechanicName: '${mechanicNames[i % mechanicNames.length]}',\n      mechanicPhone: '98765${Math.floor(10000 + Math.random() * 90000)}'`;
    i++;
    return replacement;
  });

  // Now fix the render overlay logic in Services.jsx
  if (filePath.includes('Services.jsx')) {
    content = content.replace(/\{currentGarage\?\.technicianName \|\| 'Rajesh Kumar'\}/g, '{pkg.mechanicName}');
    content = content.replace(/\{currentGarage\?\.technicianPhone \|\| '98765 43210'\}/g, '{pkg.mechanicPhone}');
  }
  
  // same for ServiceBooking.jsx if it renders it
  if (filePath.includes('ServiceBooking.jsx')) {
    content = content.replace(/\{s\.mechanicName \|\| 'Rajesh Kumar'\}/g, '{s.mechanicName}');
    content = content.replace(/\{s\.mechanicPhone \|\| '98765 43210'\}/g, '{s.mechanicPhone}');
  }

  fs.writeFileSync(filePath, content);
  console.log('Updated ' + filePath);
}
