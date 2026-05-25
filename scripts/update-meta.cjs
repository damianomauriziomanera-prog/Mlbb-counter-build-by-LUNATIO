/**
 * MLBB Meta Scraper v2 — Intercetta le API interne di Moonton
 * 
 * Uso: npm run update-meta
 */
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const OUTPUT_PATH = path.join(__dirname, '..', 'src', 'data', 'liveMeta.json');

const NAME_ALIASES = {
  'yi sun-shin': 'yisunshin',
  'x.borg': 'xborg',
  'chang\'e': 'change',
  'luo yi': 'luoyi',
  'popol and kupa': 'popol',
  'yu zhong': 'yuzhong',
};

function normalizeHeroName(name) {
  let n = name.trim().toLowerCase();
  if (NAME_ALIASES[n]) return NAME_ALIASES[n];
  return n.replace(/[^a-z0-9]/g, '');
}

async function scrape() {
  console.log('🚀 MLBB Meta Scraper v2');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36');
  await page.setViewport({ width: 1280, height: 900 });

  // Intercetta tutte le risposte di rete per catturare le API di ranking
  const capturedApiData = [];
  page.on('response', async (response) => {
    const url = response.url();
    if (url.includes('rank') || url.includes('hero') || url.includes('statistic')) {
      try {
        const contentType = response.headers()['content-type'] || '';
        if (contentType.includes('json')) {
          const json = await response.json();
          capturedApiData.push({ url, data: json });
          console.log(`📡 API intercettata: ${url.substring(0, 100)}`);
        }
      } catch (e) { /* ignora risposte non-json */ }
    }
  });

  try {
    console.log('🌐 Navigazione a m.mobilelegends.com/en/rank ...');
    await page.goto('https://m.mobilelegends.com/en/rank', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // Chiudi popup cookie e privacy
    console.log('🍪 Chiusura popup cookie/privacy...');
    await page.evaluate(() => {
      // Cerca bottoni per accettare cookie / chiudere popup
      const buttons = Array.from(document.querySelectorAll('button, a, div[class*="close"], span[class*="close"]'));
      buttons.forEach(btn => {
        const text = (btn.textContent || '').toLowerCase();
        if (text.includes('accept') || text.includes('agree') || text.includes('ok') || text.includes('got it')) {
          btn.click();
        }
      });
      // Chiudi eventuali X
      document.querySelectorAll('[class*="close"], [class*="Close"]').forEach(el => el.click());
    });
    
    await new Promise(r => setTimeout(r, 2000));

    // Clicca sulla X del popup privacy
    await page.evaluate(() => {
      document.querySelectorAll('svg, [class*="close"], [class*="modal"] button').forEach(el => el.click());
    });
    await new Promise(r => setTimeout(r, 1000));

    // Prova a cliccare su "Hero Ranking" o navigare alla sezione giusta
    console.log('📊 Cerco sezione Hero Ranking...');
    await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a, button, div'));
      links.forEach(link => {
        const text = (link.textContent || '').toLowerCase();
        if (text.includes('hero ranking') || text.includes('hero strength')) {
          link.click();
        }
      });
    });

    await new Promise(r => setTimeout(r, 5000));

    // Screenshot dopo aver cliccato
    await page.screenshot({ path: path.join(__dirname, 'debug_screenshot2.png'), fullPage: true });
    console.log('📸 Screenshot 2 salvato');

    // Controlla i dati API intercettati
    if (capturedApiData.length > 0) {
      console.log(`\n✅ Intercettate ${capturedApiData.length} risposte API!`);
      capturedApiData.forEach((entry, i) => {
        console.log(`  [${i}] ${entry.url.substring(0, 120)}`);
        const sample = JSON.stringify(entry.data).substring(0, 200);
        console.log(`      Dati: ${sample}...`);
      });
    }

    // Se non abbiamo catturato API, proviamo lo scraping diretto del DOM
    console.log('\n🔍 Scraping diretto del DOM...');
    const domData = await page.evaluate(() => {
      const body = document.body.innerText;
      // Cerca blocchi con pattern "NomeEroe XX.X%"
      const heroBlocks = [];
      const allEls = document.querySelectorAll('*');
      
      for (const el of allEls) {
        if (el.children.length > 0) continue; // solo foglie
        const text = el.textContent?.trim() || '';
        if (text.match(/^\d{1,2}\.\d%$/)) {
          // Trovato un elemento con percentuale, cerca il contesto
          const parent = el.closest('tr, li, [class*="item"], [class*="row"], div');
          if (parent) {
            const allText = parent.textContent || '';
            heroBlocks.push(allText.trim().substring(0, 200));
          }
        }
      }
      
      return {
        heroBlocks: heroBlocks.slice(0, 30),
        bodyPreview: body.substring(0, 3000)
      };
    });

    if (domData.heroBlocks.length > 0) {
      console.log(`\n📊 Trovati ${domData.heroBlocks.length} blocchi con percentuali:`);
      domData.heroBlocks.forEach((b, i) => console.log(`  [${i}] ${b}`));
    }

    // Estratto tutti i dati possibili, proviamo a costruire il risultato
    let heroResults = {};

    // Da API intercettate
    for (const entry of capturedApiData) {
      const data = entry.data;
      // Cerca strutture comuni: array di eroi, oggetti con hero/win/pick
      if (Array.isArray(data)) {
        data.forEach(item => {
          if (item.name && (item.win_rate || item.winRate || item.win)) {
            const id = normalizeHeroName(item.name);
            heroResults[id] = {
              winRate: parseFloat(item.win_rate || item.winRate || item.win) || 50,
              pickRate: parseFloat(item.pick_rate || item.pickRate || item.use || item.pick) || 1,
              banRate: parseFloat(item.ban_rate || item.banRate || item.ban) || 0
            };
          }
        });
      } else if (data.data && Array.isArray(data.data)) {
        data.data.forEach(item => {
          if (item.name && (item.win_rate || item.winRate || item.win)) {
            const id = normalizeHeroName(item.name);
            heroResults[id] = {
              winRate: parseFloat(item.win_rate || item.winRate || item.win) || 50,
              pickRate: parseFloat(item.pick_rate || item.pickRate || item.use || item.pick) || 1,
              banRate: parseFloat(item.ban_rate || item.banRate || item.ban) || 0
            };
          }
        });
      }
    }

    const heroCount = Object.keys(heroResults).length;
    console.log(`\n📊 Eroi estratti dalle API: ${heroCount}`);

    if (heroCount < 10) {
      console.log('\n⚠️ API interne insufficienti. Tentativo diretto con API Moonton...');
      // Prova endpoint API diretti scoperti nel primo test
      const directApis = [
        'https://api.mobilelegends.com/m/hero/ranking',
        'https://api.mobilelegends.com/m/hero/list',
        'https://api.gms.moontontech.com/hero/ranking',
      ];
      
      for (const apiUrl of directApis) {
        try {
          console.log(`  Provo ${apiUrl}...`);
          const resp = await page.evaluate(async (url) => {
            try {
              const r = await fetch(url);
              if (!r.ok) return { status: r.status, data: null };
              return { status: r.status, data: await r.json() };
            } catch(e) { return { error: e.message }; }
          }, apiUrl);
          
          if (resp.data) {
            console.log(`  ✅ Risposta da ${apiUrl}: ${JSON.stringify(resp.data).substring(0, 200)}`);
          } else {
            console.log(`  ❌ ${apiUrl}: ${resp.status || resp.error}`);
          }
        } catch(e) {
          console.log(`  ❌ ${apiUrl}: ${e.message}`);
        }
      }
    }

    // Salva risultato
    if (heroCount >= 10) {
      const output = {
        lastUpdated: new Date().toISOString(),
        source: 'm.mobilelegends.com (API intercettata)',
        heroCount,
        heroes: heroResults
      };
      fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2), 'utf-8');
      console.log(`\n✅ Salvati dati per ${heroCount} eroi in liveMeta.json`);
    } else {
      console.log('\n⚠️ Dati insufficienti. Uso fonti alternative...');
      await tryAlternative(browser);
    }

  } catch (err) {
    console.error('❌ Errore:', err.message);
    await tryAlternative(browser);
  } finally {
    await browser.close();
    console.log('\n🏁 Completato.');
  }
}

async function tryAlternative(browser) {
  // Fonte alternativa robusta: scraping diretto da mlbb.fyi 
  const altSources = [
    { url: 'https://mlbb.fyi/heroes', name: 'mlbb.fyi' },
    { url: 'https://www.mobadraft.com/heroes', name: 'mobadraft' },
  ];

  for (const source of altSources) {
    console.log(`\n📡 Tentativo con ${source.name}...`);
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    
    try {
      await page.goto(source.url, { waitUntil: 'networkidle2', timeout: 20000 });
      await new Promise(r => setTimeout(r, 5000));

      const data = await page.evaluate(() => {
        const results = [];
        // Cerca tabelle con dati eroi
        document.querySelectorAll('table tr, [class*="hero"]').forEach(row => {
          const cells = row.querySelectorAll('td, [class*="cell"], [class*="col"]');
          if (cells.length >= 3) {
            const texts = Array.from(cells).map(c => c.textContent?.trim() || '');
            // Cerca pattern con percentuali
            const percents = texts.filter(t => t.match(/[\d.]+%/)).map(t => parseFloat(t));
            const nameCell = texts.find(t => t.length > 2 && !t.match(/[\d.]+%/) && t.length < 30);
            if (nameCell && percents.length >= 1) {
              results.push({
                name: nameCell,
                winRate: percents[0] || 50,
                pickRate: percents[1] || 1,
                banRate: percents[2] || 0
              });
            }
          }
        });
        return results;
      });

      console.log(`📊 ${source.name}: Trovati ${data.length} eroi`);

      if (data.length >= 10) {
        const heroResults = {};
        data.forEach(h => {
          heroResults[normalizeHeroName(h.name)] = {
            winRate: h.winRate,
            pickRate: h.pickRate,
            banRate: h.banRate
          };
        });

        const output = {
          lastUpdated: new Date().toISOString(),
          source: source.name,
          heroCount: Object.keys(heroResults).length,
          heroes: heroResults
        };
        fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2), 'utf-8');
        console.log(`✅ Salvati ${output.heroCount} eroi da ${source.name}`);
        await page.close();
        return;
      }
    } catch(e) {
      console.log(`❌ ${source.name} fallito: ${e.message}`);
    }
    await page.close();
  }

  console.log('\n💡 Nessuna fonte automatica ha funzionato.');
  console.log('   Puoi aggiornare manualmente src/data/liveMeta.json');
  console.log('   oppure utilizza: npm run update-meta:manual');
}

scrape();
