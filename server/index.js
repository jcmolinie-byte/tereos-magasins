require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '20mb' }));

// Connexion MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connecté'))
  .catch(err => { console.error('❌ Erreur MongoDB:', err.message); process.exit(1); });

// Modèle Stock
const StockSchema = new mongoose.Schema({
  id:          { type: Number, unique: true },
  piece:       String,
  categorie:   String,
  magasin:     String,
  description: String,
  photo:       String,
  disponible:  { type: Boolean, default: true },
  co2_kg:      Number,
  createdAt:   { type: Date, default: Date.now },
  updatedAt:   Date,
}, { strict: false });

const Stock = mongoose.model('Stock', StockSchema);

// GET stock
app.get('/api/stock', async (req, res) => {
  try {
    const items = await Stock.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, stock: items });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// POST ajouter
app.post('/api/stock', async (req, res) => {
  try {
    const { photo, ...rest } = req.body;
    const newItem = new Stock({
      id: Date.now(),
      ...rest,
      photo: photo || null,
      disponible: true,
      createdAt: new Date(),
    });
    await newItem.save();
    res.json({ success: true, item: newItem.toObject() });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// PUT modifier
app.put('/api/stock/:id', async (req, res) => {
  try {
    const { photo, ...rest } = req.body;
    const item = await Stock.findOne({ id: parseInt(req.params.id) });
    if (!item) return res.status(404).json({ success: false, error: 'Non trouvé' });

    const photoFinal = (photo && photo.startsWith('data:image')) ? photo
                     : (photo && photo.startsWith('http'))       ? photo
                     : item.photo;

    const updated = await Stock.findOneAndUpdate(
      { id: parseInt(req.params.id) },
      { ...rest, photo: photoFinal, updatedAt: new Date() },
      { new: true }
    ).lean();
    res.json({ success: true, item: updated });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// DELETE
app.delete('/api/stock/:id', async (req, res) => {
  try {
    await Stock.findOneAndDelete({ id: parseInt(req.params.id) });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// PATCH disponibilité
app.patch('/api/stock/:id/toggle-availability', async (req, res) => {
  try {
    const item = await Stock.findOne({ id: parseInt(req.params.id) });
    if (!item) return res.status(404).json({ success: false, error: 'Non trouvé' });
    item.disponible = !item.disponible;
    item.updatedAt = new Date();
    await item.save();
    res.json({ success: true, item: item.toObject() });
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

// Health check
app.get('/api/health', (req, res) => res.json({ success: true, timestamp: new Date().toISOString() }));

http.createServer(app).listen(PORT, () => console.log(`✅ Serveur démarré port ${PORT}`));
