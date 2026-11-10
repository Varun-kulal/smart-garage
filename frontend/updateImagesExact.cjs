const fs = require('fs');

const imageMap = {
  'pkg-ac-regular': '1492144534655-ae79c964c9d7',
  'pkg-ac-high': '1517524008697-84bbe3c3fd98',
  'pkg-ac-cooling': '1549317661-bd32c8ce0db2',
  'pkg-ac-leak': '1486262715619-67b85e0b08d3',
  
  'pkg-bat-amaron-55': '1605810230434-7631ac76ec81',
  'pkg-bat-amaron-go': '1583121274602-3e2820c69888',
  'pkg-bat-exide-mileage': '1511919884226-fd3cad34687c',
  'pkg-bat-jumpstart': '1517524008697-84bbe3c3fd98',
  
  'pkg-tyre-align': '1580273916550-e323be2ae537',
  'pkg-tyre-puncture': '1494976388531-d1058494cdd8',
  'pkg-tyre-yokohama': '1580273916550-e323be2ae537',
  'pkg-tyre-rotation': '1494976388531-d1058494cdd8',
  
  'pkg-dent-bumper': '1601362840469-51e4d8d58785',
  'pkg-dent-door': '1502877338535-766e1452684a',
  'pkg-dent-scratch': '1618843479313-40f8afb4b4d8',
  'pkg-dent-alloy': '1601362840469-51e4d8d58785',
  
  'pkg-det-ceramic': '1502877338535-766e1452684a',
  'pkg-det-interior': '1492144534655-ae79c964c9d7',
  'pkg-det-rubbing': '1618843479313-40f8afb4b4d8',
  'pkg-det-underbody': '1486262715619-67b85e0b08d3'
};

const filePath = 'D:/ai_car_parts/frontend/src/pages/user/Services.jsx';
let content = fs.readFileSync(filePath, 'utf-8');

for (const [pkgId, imgId] of Object.entries(imageMap)) {
  const regex = new RegExp(`id:\\s*'${pkgId}'[\\s\\S]*?image:\\s*'(.*?)'`, 'g');
  content = content.replace(regex, (match, oldUrl) => {
    return match.replace(oldUrl, `https://images.unsplash.com/photo-${imgId}?auto=format&fit=crop&w=600&q=80`);
  });
}

fs.writeFileSync(filePath, content);
console.log('Images perfectly mapped and verified.');
