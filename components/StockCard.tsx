import React, { useState } from 'react';
import { StockItem } from '../types';
import { Button } from './Button';
import { Leaf, Package, MapPin, Edit, Trash2, CheckCircle, XCircle, Info, X, Mail } from 'lucide-react';

interface StockCardProps {
  item: StockItem;
  onReserve: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  isOwner: boolean;
}

const InfoModal: React.FC<{ item: StockItem; onClose: () => void }> = ({ item, onClose }) => {
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="relative bg-white dark:bg-dark-surface rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-200 dark:border-white/10 animate-fadeIn"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Image agrandie */}
        <div className="w-full h-72 bg-gray-100 dark:bg-white/5 overflow-hidden">
          {item.photo ? (
            <img 
              src={item.photo} 
              alt={item.piece} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
              <Package size={64} className="mb-3 opacity-40" />
              <span className="text-sm font-medium">Pas de photo disponible</span>
            </div>
          )}
        </div>

        {/* Infos */}
        <div className="p-6 space-y-4">
          {/* Nom de la pièce */}
          <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
            {item.piece}
          </h2>

          {/* Site + Email sur la même ligne */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm">
              <MapPin size={16} className="text-primary shrink-0" />
              <span className="font-medium">{item.site}</span>
            </div>
            {item.ownerEmail && (
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm">
                <Mail size={16} className="text-primary shrink-0" />
                <a 
                  href={`mailto:${item.ownerEmail}`}
                  className="hover:text-primary transition-colors"
                >
                  {item.ownerEmail}
                </a>
              </div>
            )}
          </div>

          {/* Commentaires si présents */}
          {item.commentaires && (
            <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4 border border-gray-200 dark:border-white/10">
              <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Commentaires</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">{item.commentaires}</p>
            </div>
          )}

          {/* Dimensions si présentes */}
          {(item.longueur || item.largeur || item.hauteur) && (
            <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4 border border-gray-200 dark:border-white/10">
              <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Dimensions</p>
              <div className="flex gap-4 text-sm text-gray-700 dark:text-gray-300">
                {item.longueur && <span><span className="text-gray-400 text-xs">L </span><span className="font-bold">{item.longueur}</span> mm</span>}
                {item.largeur && <span><span className="text-gray-400 text-xs">l </span><span className="font-bold">{item.largeur}</span> mm</span>}
                {item.hauteur && <span><span className="text-gray-400 text-xs">H </span><span className="font-bold">{item.hauteur}</span> mm</span>}
              </div>
            </div>
          )}

          {/* Poids si présent */}
          {item.poids && (
            <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4 border border-gray-200 dark:border-white/10">
              <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Poids</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 font-bold">{item.poids} kg</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const StockCard: React.FC<StockCardProps> = ({ item, onReserve, onEdit, onDelete, isOwner }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="group relative bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 flex flex-col overflow-hidden h-full">
        {/* Image Section - Fixed Height */}
        <div className="relative h-56 w-full bg-gray-100 dark:bg-white/5 overflow-hidden">
          {item.photo ? (
            <img 
              src={item.photo} 
              alt={item.piece} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
              <Package size={48} className="mb-2 opacity-50" />
              <span className="text-xs font-medium">Pas de photo</span>
            </div>
          )}
          
          {/* Badges overlay */}
          <div className="absolute top-3 left-3">
            <span className="backdrop-blur-md bg-white/90 dark:bg-black/60 text-primary px-3 py-1 rounded-full text-xs font-bold shadow-sm">
              {item.categorie}
            </span>
          </div>
          <div className="absolute top-3 right-3">
             <div className="backdrop-blur-md bg-white/90 dark:bg-black/60 text-primary px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1">
               <Leaf size={12} />
               {item.co2} kg
             </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5 flex flex-col flex-grow">
          <div className="flex-grow">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight mb-2 line-clamp-2" title={item.piece}>
                {item.piece}
              </h3>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <MapPin size={16} className="text-primary/70 shrink-0" />
                  <span className="truncate">{item.site}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-white/10 font-mono text-xs">{item.refSAP}</span>
                </div>
                {item.prixAchat && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-bold text-primary">{item.prixAchat.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</span>
                  </div>
                )}
              </div>
          </div>

          {/* Actions */}
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5 flex flex-col gap-2">
              {/* Bouton +d'infos */}
              <Button
                variant="secondary"
                onClick={() => setShowModal(true)}
                fullWidth
                icon={<Info size={18} />}
              >
                + d'infos
              </Button>

              <Button 
              variant={item.disponible ? 'primary' : 'secondary'}
              onClick={() => onReserve(item.id)}
              fullWidth
              className={!item.disponible ? 'bg-gray-600 dark:bg-gray-700 !text-gray-300 !border-gray-500' : ''}
              icon={item.disponible ? <CheckCircle size={18} /> : <XCircle size={18} />}
              >
              {item.disponible ? 'Réserver' : 'Réservé'}
              </Button>

              {isOwner && (
              <div className="flex gap-2">
                  <Button variant="secondary" className="flex-1 text-sm" onClick={() => onEdit(item.id)} icon={<Edit size={14} />}>
                  Modif.
                  </Button>
                  <Button 
                    variant="danger" 
                    className="flex-1 text-sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(item.id);
                    }}
                    icon={<Trash2 size={14} />}
                  >
                  Suppr.
                  </Button>
              </div>
              )}
          </div>
        </div>
      </div>

      {/* Modale +d'infos */}
      {showModal && <InfoModal item={item} onClose={() => setShowModal(false)} />}
    </>
  );
};