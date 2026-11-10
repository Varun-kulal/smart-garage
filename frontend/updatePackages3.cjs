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
// Add garageName and garageLocation to each package
content = content.replace(/mechanicPhone:\s*'98765\d{5}'/g, (match) => {
  const replacement = `${match},\n      garageName: '${garageNames[i % garageNames.length]}',\n      garageLocation: '${garageLocations[i % garageLocations.length]}'`;
  i++;
  return replacement;
});

// Update the photo overlay to use pkg.garageName
content = content.replace(/\{currentGarage\?\.name \|\| 'Assigned Garage'\}/g, '{pkg.garageName}');

// Update the "AVAILABLE AT LOCATIONS" section
const searchSection = `{displayedGarages && displayedGarages.length > 0 && (
                        <div className="mt-4 border-t border-gray-100 pt-4 space-y-2">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Available At Locations:</span>
                          <div className="space-y-1.5">
                            {displayedGarages.map(g => (
                              <div key={g._id} className="text-xs text-gray-600 flex flex-col gap-1 leading-relaxed font-medium bg-gray-50 p-2 rounded-lg">
                                <div>
                                  <span className="font-bold text-[#111827]">{g.name}: </span>
                                  <span>{g.location}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}`;

const replaceSection = `<div className="mt-4 border-t border-gray-100 pt-4 space-y-2">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Available At Locations:</span>
                          <div className="space-y-1.5">
                            <div className="text-xs text-gray-600 flex flex-col gap-1 leading-relaxed font-medium bg-gray-50 p-2 rounded-lg">
                              <div>
                                <span className="font-bold text-[#111827]">{pkg.garageName}: </span>
                                <span>{pkg.garageLocation}</span>
                              </div>
                            </div>
                          </div>
                        </div>`;

content = content.replace(searchSection, replaceSection);

fs.writeFileSync(filePath, content);
console.log('Updated Services.jsx');
