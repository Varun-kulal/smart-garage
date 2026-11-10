const https = require('https');

https.get('https://unsplash.com/napi/search/photos?query=car+tyre&per_page=5', {
  headers: {
    'User-Agent': 'Mozilla/5.0'
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const json = JSON.parse(data);
    json.results.forEach(r => {
      console.log(`ID: ${r.id} - ${r.alt_description}`);
    });
  });
}).on('error', console.error);
