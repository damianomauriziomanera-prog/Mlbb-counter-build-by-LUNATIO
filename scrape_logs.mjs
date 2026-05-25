import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto('https://github.com/damianomauriziomanera-prog/Mlbb-counter-build-by-LUNATIO/actions/runs/26388124515/job/77671158654', { waitUntil: 'networkidle2' });
  
  // Wait for the log lines to appear
  try {
    await page.waitForSelector('.react-log-line-text', { timeout: 15000 });
  } catch (e) {
    console.log("Could not find log lines.");
  }
  
  // Extract text
  const logs = await page.evaluate(() => {
    const lines = Array.from(document.querySelectorAll('.react-log-line-text'));
    return lines.map(l => l.innerText).join('\n');
  });
  
  console.log("--- LOGS START ---");
  // Print last 100 lines
  const linesArray = logs.split('\n');
  console.log(linesArray.slice(-100).join('\n'));
  console.log("--- LOGS END ---");
  
  await browser.close();
})();
