const puppeteer = require('puppeteer');

(async () => {
  console.log("Avvio browser invisibile...");
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Setta user agent per evitare blocchi base
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36');
  
  console.log("Navigazione verso MLBB Rank...");
  await page.goto('https://www.mobilelegends.com/rank', { waitUntil: 'networkidle2' });
  
  console.log("Estrazione dati...");
  
  // Aspetta che la tabella sia caricata (di solito la classe hero-name è presente)
  await page.waitForSelector('.hero-name', { timeout: 10000 }).catch(() => console.log("Timeout attesa hero-name"));
  
  // Esegui codice nel contesto della pagina
  const data = await page.evaluate(() => {
    // La pagina potrebbe avere la tabella dentro un tbody
    const rows = Array.from(document.querySelectorAll('tbody tr'));
    let result = {};
    
    rows.forEach(row => {
      const nameEl = row.querySelector('.hero-name');
      if (!nameEl) return;
      
      const name = nameEl.innerText.trim().toLowerCase().replace(/[^a-z]/g, '');
      const tds = row.querySelectorAll('td');
      
      // Di solito la struttura è: 0: Icona/Nome, 1: Win Rate, 2: Pick Rate, 3: Ban Rate
      if (tds.length >= 4) {
        const winRate = parseFloat(tds[1].innerText);
        const pickRate = parseFloat(tds[2].innerText);
        const banRate = parseFloat(tds[3].innerText);
        
        result[name] = { winRate, pickRate, banRate };
      }
    });
    
    return result;
  });
  
  console.log(JSON.stringify(data, null, 2));
  
  await browser.close();
})();
