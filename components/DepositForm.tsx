import React, { useState, useEffect, useRef } from 'react';
import { StockItem } from '../types';
import { SITES, CATEGORIES } from '../constants';
import { Button } from './Button';
import { Upload, X, Save, Sparkles, CheckCircle, AlertCircle, Loader2, ChevronRight, Camera } from 'lucide-react';

interface DepositFormProps {
  initialData?: StockItem;
  onSubmit: (data: Omit<StockItem, 'id' | 'disponible' | 'ownerEmail'>) => void;
  onCancel: () => void;
}

interface CO2Suggestion {
  co2_kg: number;
  confiance: 'faible' | 'moyenne' | 'élevée';
  explication: string;
  materiaux: string;
  poids_estime_kg: number | null;
}

const SERVER_URL = import.meta.env.VITE_API_URL || `https://${window.location.hostname}:3001`;

const confianceColor = {
  faible: 'text-orange-400 border-orange-400/30 bg-orange-400/10',
  moyenne: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
  élevée: 'text-green-400 border-green-400/30 bg-green-400/10',
};

const confianceLabel = {
  faible: '⚠️ Estimation approximative',
  moyenne: '🔎 Estimation correcte',
  élevée: '✅ Estimation fiable',
};

export const DepositForm: React.FC<DepositFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    site: '',
    categorie: '',
    piece: '',
    prixAchat: undefined as number | undefined,
    refSAP: '',
    commentaires: '',
    co2: 0,
    photo: null as string | null,
    longueur: undefined as number | undefined,
    largeur: undefined as number | undefined,
    hauteur: undefined as number | undefined,
  });

  const [customCO2, setCustomCO2] = useState<string>('');

  // États IA
  const [aiStatus, setAiStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [aiSuggestion, setAiSuggestion] = useState<CO2Suggestion | null>(null);
  const [aiError, setAiError] = useState<string>('');
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // États caméra
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // États analyse visuelle IA
  const [visionStatus, setVisionStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [visionSuggestion, setVisionSuggestion] = useState<string>('');
  const [visionError, setVisionError] = useState<string>('');

  const startCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch {
      alert("Impossible d'accéder à la caméra. Vérifiez les permissions.");
      setShowCamera(false);
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    setShowCamera(false);
  };

  const analyzePhoto = async (dataUrl: string) => {
    setVisionStatus('loading');
    setVisionSuggestion('');
    setVisionError('');
    try {
      const response = await fetch(`${SERVER_URL}/api/identify-piece`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: dataUrl }),
      });
      const data = await response.json();
      if (data.success && data.piece) {
        setVisionSuggestion(data.piece);
        setVisionStatus('done');
      } else {
        setVisionError(data.error || "Impossible d\'identifier la pièce");
        setVisionStatus('error');
      }
    } catch {
      setVisionError('Impossible de contacter le serveur.');
      setVisionStatus('error');
    }
  };

  const takePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setFormData(prev => ({ ...prev, photo: dataUrl }));
    stopCamera();
    analyzePhoto(dataUrl);
  };

  const acceptVisionSuggestion = () => {
    setFormData(prev => ({ ...prev, piece: visionSuggestion }));
    setVisionStatus('idle');
    setVisionSuggestion('');
    if (visionSuggestion.trim().length >= 4) {
      fetchCO2Estimate(visionSuggestion, formData.categorie, formData.refSAP);
    }
  };

  useEffect(() => {
    if (initialData) {
      setFormData({
        site: initialData.site,
        categorie: initialData.categorie,
        piece: initialData.piece,
        prixAchat: initialData.prixAchat,
        refSAP: initialData.refSAP,
        commentaires: initialData.commentaires ?? '',
        co2: initialData.co2,
        photo: initialData.photo,
        longueur: initialData.longueur,
        largeur: initialData.largeur,
        hauteur: initialData.hauteur,
      });
      const cat = CATEGORIES.find(c => c.name === initialData.categorie);
      if (cat && cat.value === null) {
        setCustomCO2(initialData.co2.toString());
      }
    }
  }, [initialData]);

  // Déclenchement IA automatique avec debounce sur le nom de la pièce
  const handlePieceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, piece: value }));

    // Réinitialiser la suggestion si le champ est vidé
    if (!value.trim() || value.trim().length < 4) {
      setAiStatus('idle');
      setAiSuggestion(null);
      setAiError('');
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      return;
    }

    // Debounce : attendre 1 seconde après la dernière frappe
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      fetchCO2Estimate(value, formData.categorie, formData.refSAP);
    }, 1000);
  };

  const fetchCO2Estimate = async (piece: string, categorie: string, refSAP: string) => {
    setAiStatus('loading');
    setAiSuggestion(null);
    setAiError('');
    try {
      const response = await fetch(`${SERVER_URL}/api/co2-estimate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ piece, categorie, refSAP }),
      });
      const data = await response.json();
      if (data.success) {
        setAiSuggestion(data);
        setAiStatus('done');
      } else {
        setAiError(data.error || 'Erreur inconnue');
        setAiStatus('error');
      }
    } catch {
      setAiError('Impossible de contacter le serveur. Vérifiez que le serveur est démarré.');
      setAiStatus('error');
    }
  };

  // Accepter la suggestion IA
  const acceptSuggestion = () => {
    if (!aiSuggestion) return;
    setFormData(prev => ({ ...prev, co2: aiSuggestion.co2_kg, categorie: prev.categorie || 'Autre' }));
    if (formData.categorie === 'Autre' || !formData.categorie) {
      setCustomCO2(aiSuggestion.co2_kg.toString());
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const catName = e.target.value;
    const cat = CATEGORIES.find(c => c.name === catName);
    setFormData(prev => ({
      ...prev,
      categorie: catName,
      co2: cat?.value ?? 0
    }));
    if (cat && cat.value !== null) {
      setCustomCO2('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setFormData(prev => ({ ...prev, photo: ev.target?.result as string }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCO2 = formData.categorie === 'Autre' ? Number(customCO2) : formData.co2;
    onSubmit({ ...formData, co2: finalCO2 });
  };

  const inputClassName = "w-full bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary text-gray-900 dark:text-white";
  const optionClassName = "bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white";

  return (
    <div className="bg-white dark:bg-dark-surface rounded-2xl p-8 border border-gray-200 dark:border-white/10 shadow-2xl max-w-2xl mx-auto animate-fadeIn">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
        <Save className="text-primary" />
        {initialData ? 'Modifier la pièce' : 'Ajouter une Nouvelle Pièce'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-primary">Site</label>
            <select
              required
              className={inputClassName}
              value={formData.site}
              onChange={e => setFormData(prev => ({ ...prev, site: e.target.value }))}
            >
              <option value="" className={optionClassName}>Sélectionner...</option>
              {SITES.map(s => <option key={s} value={s} className={optionClassName}>{s}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-primary">Catégorie</label>
            <select
              required
              className={inputClassName}
              value={formData.categorie}
              onChange={handleCategoryChange}
            >
              <option value="" className={optionClassName}>Sélectionner...</option>
              {CATEGORIES.map(c => <option key={c.name} value={c.name} className={optionClassName}>{c.name}</option>)}
            </select>
          </div>
        </div>

        {formData.categorie === 'Autre' && (
          <div className="space-y-2 animate-fadeIn">
            <label className="text-sm font-semibold text-gray-700 dark:text-primary">Impact CO₂ (kg) *</label>
            <input
              type="number"
              required
              min="0"
              className={inputClassName}
              value={customCO2}
              onChange={e => setCustomCO2(e.target.value)}
            />
          </div>
        )}

        {/* Nom de la pièce — déclencheur IA */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-primary flex items-center gap-2">
            Nom de la Pièce
            {aiStatus === 'loading' && (
              <span className="flex items-center gap-1 text-xs text-primary font-normal animate-pulse">
                <Loader2 size={12} className="animate-spin" /> Analyse IA en cours...
              </span>
            )}
          </label>
          <input
            type="text"
            required
            className={inputClassName}
            placeholder="Ex: Pompe hydraulique KL2000"
            value={formData.piece}
            onChange={handlePieceChange}
          />
        </div>

        {/* Carte suggestion IA */}
        {aiStatus === 'done' && aiSuggestion && (
          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5 space-y-3 animate-fadeIn">
            {/* En-tête */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                <Sparkles size={16} />
                Suggestion IA — Impact CO₂ évité
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full border ${confianceColor[aiSuggestion.confiance]}`}>
                {confianceLabel[aiSuggestion.confiance]}
              </span>
            </div>

            {/* Valeur principale */}
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-primary">{aiSuggestion.co2_kg}</span>
              <span className="text-lg text-gray-500 dark:text-gray-400">kg CO₂ eq</span>
            </div>

            {/* Détails */}
            <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <p>{aiSuggestion.explication}</p>
              {aiSuggestion.materiaux && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  🔩 Matériaux : {aiSuggestion.materiaux}
                  {aiSuggestion.poids_estime_kg && ` · Poids estimé : ~${aiSuggestion.poids_estime_kg} kg`}
                </p>
              )}
            </div>

            {/* Bouton accepter */}
            <button
              type="button"
              onClick={acceptSuggestion}
              className="w-full flex items-center justify-center gap-2 bg-primary text-white rounded-xl py-2.5 px-4 font-semibold text-sm hover:bg-primary/90 transition-colors"
            >
              <CheckCircle size={16} />
              Utiliser cette valeur ({aiSuggestion.co2_kg} kg CO₂)
              <ChevronRight size={14} />
            </button>
          </div>
        )}

        {/* Erreur IA */}
        {aiStatus === 'error' && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 flex items-start gap-3 animate-fadeIn">
            <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-400">Estimation IA indisponible</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{aiError}</p>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-primary">Prix d'achat (€)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            className={inputClassName}
            placeholder="Ex: 1250.00"
            value={formData.prixAchat ?? ''}
            onChange={e => setFormData(prev => ({
              ...prev,
              prixAchat: e.target.value ? Number(e.target.value) : undefined
            }))}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-primary">Référence SAP</label>
          <input
            type="text"
            required
            className={inputClassName}
            placeholder="Ex: 123456789"
            value={formData.refSAP}
            onChange={e => setFormData(prev => ({ ...prev, refSAP: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-primary">Commentaires, état, équipements...</label>
          <textarea
            className={`${inputClassName} resize-none`}
            placeholder="Ex: Bon état général, livré avec son support de fixation, compatible équipement X..."
            rows={3}
            value={formData.commentaires}
            onChange={e => setFormData(prev => ({ ...prev, commentaires: e.target.value }))}
          />
        </div>

        {/* Dimensions */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-primary">
            Dimensions (mm) <span className="font-normal text-gray-400">— optionnel</span>
          </label>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-gray-500 dark:text-gray-400 pl-1">Longueur</label>
              <input
                type="number"
                min="0"
                step="1"
                className={inputClassName}
                placeholder="ex: 300"
                value={formData.longueur ?? ''}
                onChange={e => setFormData(prev => ({ ...prev, longueur: e.target.value ? Number(e.target.value) : undefined }))}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500 dark:text-gray-400 pl-1">Largeur</label>
              <input
                type="number"
                min="0"
                step="1"
                className={inputClassName}
                placeholder="ex: 150"
                value={formData.largeur ?? ''}
                onChange={e => setFormData(prev => ({ ...prev, largeur: e.target.value ? Number(e.target.value) : undefined }))}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500 dark:text-gray-400 pl-1">Hauteur</label>
              <input
                type="number"
                min="0"
                step="1"
                className={inputClassName}
                placeholder="ex: 200"
                value={formData.hauteur ?? ''}
                onChange={e => setFormData(prev => ({ ...prev, hauteur: e.target.value ? Number(e.target.value) : undefined }))}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-primary">Photo (optionnelle)</label>
          <div className="flex items-center gap-4">
            <input
              type="file"
              id="photo-upload"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button type="button" variant="secondary" onClick={() => document.getElementById('photo-upload')?.click()} icon={<Upload size={18} />}>
              Choisir une image
            </Button>
            <Button type="button" variant="secondary" onClick={startCamera} icon={<Camera size={18} />}>
              Prendre une photo
            </Button>
            {formData.photo && (
              <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-600 group">
                <img src={formData.photo} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, photo: null }))}
                  className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="text-white" size={20} />
                </button>
              </div>
            )}
          </div>

          {/* Suggestion IA vision */}
          {visionStatus === 'loading' && (
            <div className="flex items-center gap-2 text-sm text-primary animate-pulse mt-2">
              <Loader2 size={14} className="animate-spin" />
              Analyse de la photo en cours...
            </div>
          )}
          {visionStatus === 'done' && visionSuggestion && (
            <div className="mt-3 rounded-xl border border-primary/30 bg-primary/5 p-4 flex items-center justify-between gap-4 animate-fadeIn">
              <div className="flex items-center gap-2 text-sm">
                <Sparkles size={16} className="text-primary shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">
                  Pièce détectée : <span className="font-bold text-primary">{visionSuggestion}</span>
                </span>
              </div>
              <button
                type="button"
                onClick={acceptVisionSuggestion}
                className="flex items-center gap-1.5 bg-primary text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors shrink-0"
              >
                <CheckCircle size={14} />
                Accepter
              </button>
            </div>
          )}
          {visionStatus === 'error' && (
            <div className="mt-2 flex items-center gap-2 text-xs text-orange-400">
              <AlertCircle size={13} />
              {visionError}
            </div>
          )}
        </div>

        {/* Modale caméra */}
        {showCamera && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white dark:bg-dark-surface rounded-2xl overflow-hidden shadow-2xl w-full max-w-3xl mx-4">
              {/* En-tête */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-white/10">
                <div className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                  <Camera size={18} className="text-primary" />
                  Prendre une photo
                </div>
                <button onClick={stopCamera} className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                  <X size={18} />
                </button>
              </div>

              {/* Vidéo */}
              <div className="relative bg-black">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full max-h-screen-60 object-cover" style={{maxHeight: '60vh'}}
                />
              </div>

              {/* Bouton capture */}
              <div className="flex justify-center gap-4 p-5">
                <Button type="button" variant="ghost" onClick={stopCamera}>
                  Annuler
                </Button>
                <Button type="button" onClick={takePhoto} icon={<Camera size={18} />}>
                  Capturer
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-white/10">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit">
            {initialData ? 'Enregistrer les modifications' : 'Créer la pièce'}
          </Button>
        </div>
      </form>
    </div>
  );
};
