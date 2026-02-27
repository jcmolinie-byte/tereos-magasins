import { CO2Category, StockItem } from './types';

export const SITES = [
  "Artenay", "Attin", "Bois‑Rouge", "Boiry‑Sainte‑Rictrude", "Bucy",
  "Chevrières", "Connantre", "Escaudœuvres", "Haussimont", "Le Gol",
  "Lillebonne", "Lillers", "Marckolsheim", "Nesle",
  "Origny‑Sainte‑Benoite", "Thumeries", "Aalst"
];

export const CATEGORIES: CO2Category[] = [
  { name: "Hydraulique", value: 120 },
  { name: "Pneumatique", value: 80 },
  { name: "Mécanique", value: 150 },
  { name: "Électrique", value: 200 },
  { name: "Électronique", value: 90 },
  { name: "Autre", value: null }
];

export const DEFAULT_STOCK: StockItem[] = [
  {
    id: 1707834567890,
    piece: "Pompe hydraulique Bosch Rexroth A10VSO",
    refSAP: "SAP-HYD-001",
    categorie: "Hydraulique",
    site: "Artenay",
    prixAchat: 2850.00,
    co2: 120,
    disponible: true,
    ownerEmail: "magasin.artenay@tereos.com",
    photo: null
  },
  {
    id: 1707834567891,
    piece: "Vérin pneumatique SMC CDQ2B32-75",
    refSAP: "SAP-PNE-045",
    categorie: "Pneumatique",
    site: "Connantre",
    prixAchat: 485.50,
    co2: 80,
    disponible: true,
    ownerEmail: "magasin.connantre@tereos.com",
    photo: null
  },
  {
    id: 1707834567892,
    piece: "Moteur électrique 15kW ABB",
    refSAP: "SAP-ELE-128",
    categorie: "Électrique",
    site: "Origny‑Sainte‑Benoite",
    prixAchat: 3200.00,
    co2: 200,
    disponible: false,
    ownerEmail: "magasin.origny@tereos.com",
    photo: null
  },
  {
    id: 1707834567893,
    piece: "Réducteur de vitesse SEW Eurodrive",
    refSAP: "SAP-MEC-067",
    categorie: "Mécanique",
    site: "Artenay",
    prixAchat: 1750.00,
    co2: 150,
    disponible: true,
    ownerEmail: "magasin.artenay@tereos.com",
    photo: null
  },
  {
    id: 1707834567894,
    piece: "Automate Siemens S7-1200",
    refSAP: "SAP-ELC-201",
    categorie: "Électronique",
    site: "Connantre",
    prixAchat: 890.00,
    co2: 90,
    disponible: true,
    ownerEmail: "magasin.connantre@tereos.com",
    photo: null
  },
  {
    id: 1707834567895,
    piece: "Distributeur hydraulique Parker D1VW",
    refSAP: "SAP-HYD-089",
    categorie: "Hydraulique",
    site: "Origny‑Sainte‑Benoite",
    prixAchat: 1250.00,
    co2: 120,
    disponible: true,
    ownerEmail: "magasin.origny@tereos.com",
    photo: null
  },
  {
    id: 1707834567896,
    piece: "Compresseur d'air Atlas Copco GA5",
    refSAP: "SAP-PNE-156",
    categorie: "Pneumatique",
    site: "Artenay",
    prixAchat: 4500.00,
    co2: 80,
    disponible: false,
    ownerEmail: "magasin.artenay@tereos.com",
    photo: null
  },
  {
    id: 1707834567897,
    piece: "Variateur de fréquence Schneider ATV320",
    refSAP: "SAP-ELE-234",
    categorie: "Électrique",
    site: "Connantre",
    prixAchat: 680.00,
    co2: 200,
    disponible: true,
    ownerEmail: "magasin.connantre@tereos.com",
    photo: null
  },
  {
    id: 1707834567898,
    piece: "Roulement SKF 6308-2RS1",
    refSAP: "SAP-MEC-312",
    categorie: "Mécanique",
    site: "Origny‑Sainte‑Benoite",
    prixAchat: 125.00,
    co2: 150,
    disponible: true,
    ownerEmail: "magasin.origny@tereos.com",
    photo: null
  },
  {
    id: 1707834567899,
    piece: "Capteur de température Pt100 Endress+Hauser",
    refSAP: "SAP-ELC-445",
    categorie: "Électronique",
    site: "Artenay",
    prixAchat: 320.00,
    co2: 90,
    disponible: true,
    ownerEmail: "magasin.artenay@tereos.com",
    photo: null
  }
];

export const STORAGE_KEYS = {
  STOCK: 'tereos_stock',
  USER: 'tereos_user',
  THEME: 'tereos_theme'
};