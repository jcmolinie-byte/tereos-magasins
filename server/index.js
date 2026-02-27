require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const http = require('http');

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_DIR = path.join(__dirname, 'data');
const STOCK_FILE = path.join(DATA_DIR, 'stock.json');
const PHOTOS_DIR = path.join(DATA_DIR, 'photos');

app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use('/photos', express.static(PHOTOS_DIR));

const initDataDir = async () => {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(PHOTOS_DIR, { recursive: true });
  try { await fs.access(STOCK_FILE); }
  catch { await fs.writeFile(STOCK_FILE, JSON.stringify({ stock: [] }, null, 2)); }
};

const readData = async () => {
  try { return JSON.parse(await fs.readFile(STOCK_FILE, 'utf-8')); }
  catch { return { stock: [] }; }
};
const writeData = async (data) => {
  try { await fs.writeFile(STOCK_FILE, JSON.stringify(data, null, 2)); return true; }
  catch { return false; }
};

const savePhoto = async (base64photo) => {
  if (!base64photo || !base64photo.startsWith('data:image')) return null;
  const base64Data = base64photo.replace(/^data:image\/[a-z]+;base64,/, '');
  const ext = base64photo.match(/^data:image\/([a-z]+);base64,/)?.[1] || 'jpg';
  const filename = `photo_${Date.now()}.${ext}`;
  await fs.writeFile(path.join(PHOTOS_DIR, filename), base64Data, 'base64');
  const baseUrl = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;
  return `${baseUrl}/photos/${filename}`;
};

// GET stock
app.get('/api/stock', async (req, res) => {
  const data = await readData();
  res.json({ success: true, stock: data.stock });
});

// POST ajouter
app.post('/api/stock', async (req, res) => {
  try {
    const data = await readData();
    const { photo, ...rest } = req.body;
    const photoUrl = await savePhoto(photo);
    const newItem = { id: Date.now(), ...rest, photo: photoUrl, disponible: true, createdAt: new Date().toISOString() };
    data.stock.unshift(newItem);
    await writeData(data);
    res.json({ success: true, item: newItem });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// PUT modifier
app.put('/api/stock/:id', async (req, res) => {
  try {
    const data = await readData();
    const index = data.stock.findIndex(i => i.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ success: false, error: 'Non trouvé' });
    const { photo, ...rest } = req.body;
    let photoUrl = data.stock[index].photo;
    if (photo && photo.startsWith('data:image')) photoUrl = await savePhoto(photo);
    else if (photo && photo.startsWith('http')) photoUrl = photo;
    data.stock[index] = { ...data.stock[index], ...rest, photo: photoUrl, updatedAt: new Date().toISOString() };
    await writeData(data);
    res.json({ success: true, item: data.stock[index] });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// DELETE
app.delete('/api/stock/:id', async (req, res) => {
  try {
    const data = await readData();
    const item = data.stock.find(i => i.id === parseInt(req.params.id));
    if (item?.photo) {
      try { const fn = item.photo.split('/photos/')[1]; if (fn) await fs.unlink(path.join(PHOTOS_DIR, fn)); } catch {}
    }
    data.stock = data.stock.filter(i => i.id !== parseInt(req.params.id));
    await writeData(data);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// PATCH disponibilité
app.patch('/api/stock/:id/toggle-availability', async (req, res) => {
  try {
    const data = await readData();
    const item = data.stock.find(i => i.id === parseInt(req.params.id));
    if (!item) return res.status(404).json({ success: false, error: 'Non trouvé' });
    item.disponible = !item.disponible;
    item.updatedAt = new Date().toISOString();
    await writeData(data);
    res.json({ success: true, item });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// POST CO2
app.post('/api/co2-estimate', async (req, res) => {
  const { piece, categorie } = req.body;
  if (!piece) return res.status(400).json({ success: false, error: 'Nom requis' });
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return res.status(500).json({ success: false, error: 'Clé Groq manquante' });
  try {
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({ model: 'llama-3.3-70b-versatile', max_tokens: 1024, temperature: 0.3,
        messages: [
          { role: 'system', content: 'Tu es expert ACV. Réponds UNIQUEMENT en JSON valide.' },
          { role: 'user', content: `CO2 évité pour réutilisation de "${piece}"${categorie ? ` (${categorie})` : ''}.\nJSON: {"co2_kg":<n>,"confiance":"<faible|moyenne|élevée>","explication":"<2-3 phrases>","materiaux":"<mat>","poids_estime_kg":<n|null>}` }
        ]
      })
    });
    const d = await r.json();
    const result = JSON.parse(d.choices[0].message.content.replace(/```json|```/g,'').trim());
    res.json({ success: true, ...result });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// POST vision
app.post('/api/identify-piece', async (req, res) => {
  const { image } = req.body;
  if (!image) return res.status(400).json({ success: false, error: 'Image requise' });
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return res.status(500).json({ success: false, error: 'Clé Groq manquante' });
  const base64Data = image.replace(/^data:image\/[a-z]+;base64,/, '');
  const mediaType = image.match(/^data:(image\/[a-z]+);base64,/)?.[1] || 'image/jpeg';
  try {
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({ model: 'meta-llama/llama-4-scout-17b-16e-instruct', max_tokens: 200, temperature: 0.2,
        messages: [{ role: 'user', content: [
          { type: 'image_url', image_url: { url: `data:${mediaType};base64,${base64Data}` } },
          { type: 'text', text: 'Identifie cette pièce industrielle. JSON uniquement:\n{"piece":"<nom fr ou null>","confiance":"<faible|moyenne|élevée>"}' }
        ]}]
      })
    });
    const d = await r.json();
    const result = JSON.parse(d.choices[0].message.content.replace(/```json|```/g,'').trim());
    if (!result.piece) return res.json({ success: false, error: 'Non identifiable' });
    res.json({ success: true, piece: result.piece, confiance: result.confiance });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.get('/api/health', (req, res) => res.json({ success: true, timestamp: new Date().toISOString() }));

initDataDir().then(() => http.createServer(app).listen(PORT, () => console.log(`✅ Serveur démarré port ${PORT}`)));
