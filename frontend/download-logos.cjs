const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public', 'logos');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const files = {
  'aadhaar.svg': 'File:Aadhaar_Logo.svg',
  'pan.svg': 'File:Income_Tax_Department_Logo.svg',
  'voter-id.svg': 'File:Election_Commission_of_India_logo.svg',
  'driving-license.png': 'File:Ministry_of_Road_Transport_and_Highways.svg',
  'passport.png': 'File:Passport_Seva_logo.png',
  'health-card.png': 'File:Ayushman_Bharat_logo.png',
  'emblem.svg': 'File:Emblem_of_India.svg'
};

async function download() {
  for (const [filename, title] of Object.entries(files)) {
    try {
      const apiRes = await fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${title}&prop=imageinfo&iiprop=url&format=json`);
      const apiJson = await apiRes.json();
      const pages = apiJson.query.pages;
      const pageId = Object.keys(pages)[0];
      let url = pages[pageId]?.imageinfo?.[0]?.url;
      
      if (!url) {
        // Fallback to commons.wikimedia.org
        const commonsRes = await fetch(`https://commons.wikimedia.org/w/api.php?action=query&titles=${title}&prop=imageinfo&iiprop=url&format=json`);
        const commonsJson = await commonsRes.json();
        const commonsPages = commonsJson.query.pages;
        const commonsPageId = Object.keys(commonsPages)[0];
        url = commonsPages[commonsPageId]?.imageinfo?.[0]?.url;
      }
      
      if (!url) {
        console.log(`Could not find URL for ${title}`);
        continue;
      }
      
      console.log(`Downloading ${url} to ${filename}`);
      const imageRes = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (!imageRes.ok) throw new Error(`HTTP ${imageRes.status}`);
      const buffer = await imageRes.arrayBuffer();
      fs.writeFileSync(path.join(dir, filename), Buffer.from(buffer));
      console.log(`Saved ${filename}`);
    } catch (e) {
      console.error(`Failed ${filename}: `, e.message);
    }
  }
}
download();
