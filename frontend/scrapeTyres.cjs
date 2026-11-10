const https = require('https');

https.get('https://html.duckduckgo.com/html/?q=site:unsplash.com+car+tire', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const matches = data.match(/unsplash\.com\/photos\/[a-zA-Z0-9\-]+-([a-zA-Z0-9]{11})/g);
    if (matches) {
      console.log([...new Set(matches)]);
    } else {
      console.log('No matches found');
    }
  });
}).on('error', console.error);
