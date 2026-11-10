const fs = require('fs');

const garageNames = [
  'Speedy Auto Repair', 'Apex Garage', 'Pioneer Auto Care', 'Urban Mechanic Center', 'Elite Motors',
  'Titan Auto Works', 'Precision Car Care', 'NextGen Auto Shop', 'Royal Garage', 'ProFix Auto',
  'Metro Service Station', 'Dynamic Auto Point', 'Supreme Car Service', 'Alpha Motors', 'Velocity Garage',
  'Prime Auto Repair', 'Optimum Service Center', 'Core Auto Mechanics', 'Summit Car Care', 'Horizon Auto Works'
];

const garageLocations = [
  '12 Main St, Mangalore', '45 Cross Rd, Kasaragod', '88 Ring Rd, Udupi', '102 Tech Park, Manipal', '33 Beach Rd, Mangalore',
  '77 Hill View, Kasaragod', '90 Center St, Udupi', '22 North Ave, Manipal', '15 South Blvd, Mangalore', '66 West Dr, Kasaragod',
  '11 East End, Udupi', '44 Horizon Way, Manipal', '89 Bay View, Mangalore', '23 River Side, Kasaragod', '55 Valley Rd, Udupi',
  '78 Pine Ln, Manipal', '34 Oak St, Mangalore', '91 Maple Ave, Kasaragod', '19 Cedar Ct, Udupi', '67 Elm Blvd, Manipal'
];

const filePath = 'D:/ai_car_parts/frontend/src/pages/user/Services.jsx';
let content = fs.readFileSync(filePath, 'utf-8');

let i = 0;
// Find each occurrence of mechanicPhone and inject garageName and garageLocation
content = content.replace(/mechanicPhone: '98765\d{5}'/g, (match) => {
  const replacement = `${match},\n      garageName: '${garageNames[i % garageNames.length]}',\n      garageLocation: '${garageLocations[i % garageLocations.length]}'`;
  i++;
  return replacement;
});

// Update the render logic in Services.jsx for the photo overlay
content = content.replace(/\{currentGarage\?\.name \|\| 'Assigned Garage'\}/g, '{pkg.garageName}');

// Update the render logic for "Available at locations"
// Wait, the "Available at locations" currently renders displayedGarages.
// Let's replace the whole displayedGarages block to just render the pkg.garageName and pkg.garageLocation.
// Wait, the displayedGarages block is OUTSIDE the package map? No, it's inside the package map!
// Let's check lines 1195 to 1210.
fs.writeFileSync('updatePackages3.js_temp', content);
