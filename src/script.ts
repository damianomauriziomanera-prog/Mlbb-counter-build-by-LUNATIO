import https from 'https';

https.get('https://mobile-legends.fandom.com/wiki/List_of_heroes', { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
  let body = '';
  res.on('data', c => body += c);
  res.on('end', () => {
    ['Lukas', 'Kalea', 'Zetian', 'Obsidia', 'Sora', 'Marcel'].forEach(hero => {
       console.log('Searching ' + hero + '...');
       let found = body.includes(hero);
       console.log('Includes? ' + found);
       const regex2 = new RegExp(`href="/wiki/File:([^"]+?)"`, 'ig');
        let m;
        while ((m = regex2.exec(body)) !== null) {
          if (m[1].toLowerCase().includes(hero.toLowerCase())) console.log('File link ' + hero + ': ' + m[1]);
        }
    });
  });
});
