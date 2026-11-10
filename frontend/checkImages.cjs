const https = require('https');

const ids = [
  '1492144534655-ae79c964c9d7',
  '1517524008697-84bbe3c3fd98',
  '1549317661-bd32c8ce0db2',
  '1486262715619-67b85e0b08d3',
  '1605810230434-7631ac76ec81',
  '1583121274602-3e2820c69888',
  '1503376713356-dd187e1f4095',
  '1511919884226-fd3cad34687c',
  '1580273916550-e323be2ae537',
  '1494976388531-d1058494cdd8',
  '1520340356584-f9917d1e5104',
  '1610647320140-5e364ebcceea',
  '1601362840469-51e4d8d58785',
  '1502877338535-766e1452684a',
  '1618843479313-40f8afb4b4d8',
  '1587300003388-59208cc962cb',
  '1621252179027-94459d278660',
  '1533473359331-0135ef1b58bf',
  '1552519507-da3b142c6e3d',
  '1619642751034-765dfdf7c58e'
];

async function checkUrl(id) {
  const url = `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=600&q=80`;
  return new Promise((resolve) => {
    https.get(url, (res) => {
      if (res.statusCode >= 200 && res.statusCode < 400) {
        console.log(`[OK] ${id}`);
        resolve(true);
      } else {
        console.log(`[FAIL] ${id} - ${res.statusCode}`);
        resolve(false);
      }
    }).on('error', (err) => {
      console.log(`[ERROR] ${id} - ${err.message}`);
      resolve(false);
    });
  });
}

async function main() {
  for (const id of ids) {
    await checkUrl(id);
  }
}
main();
