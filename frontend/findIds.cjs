const https = require('https');

const candidates = [
  '1550355291-bbee04aed9c9', '1514316454349-750a4fdece43', '1562259929-b7e181d8d012',
  '1508344928928-7137b29de216', '1600705722908-16e91cf54316', '1615309191060-6c9ab4820dc7',
  '1515569067071-ec3b51335dd0', '1504215680853-026ed2a15def', '1504215680853-026ed2a15def',
  '1542362567-b07e54358753'
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
    });
  });
}

async function main() {
  for (const id of candidates) {
    await checkUrl(id);
  }
}
main();
