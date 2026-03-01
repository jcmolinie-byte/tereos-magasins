export interface StockItem {
  id: number;
  site: string;
  categorie: string;
  piece: string;
  prixAchat?: number; // Prix d'achat en euros
  refSAP: string;
  co2: number;
  disponible: boolean;
  photo: string | null;
  commentaires?: string;
  longueur?: number;
  largeur?: number;
  hauteur?: number;
  poids?: number;
  ownerEmail: string | null;
}

export interface User {
  id: number;
  email: string;
  site: string;
  token: string; // Simulated token
}

export type TabView = 'stock' | 'deposit' | 'reservations';

export interface CO2Category {
  name: string;
  value: number | null; // null for custom input
}

export type NotificationType = 'success' | 'reservation' | 'cancel' | 'delete' | 'error';

export interface AppNotification {
  id: number;
  type: NotificationType;
  message: string;
  detail?: string;
}
