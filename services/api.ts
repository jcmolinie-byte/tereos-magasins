// Service qui communique avec le serveur Render
import { StockItem } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const apiGetStock = async (): Promise<StockItem[]> => {
  const r = await fetch(`${API_URL}/api/stock`);
  const data = await r.json();
  return data.stock || [];
};

export const apiAddItem = async (item: Omit<StockItem, 'id' | 'disponible'>): Promise<StockItem> => {
  const r = await fetch(`${API_URL}/api/stock`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item)
  });
  const data = await r.json();
  return data.item;
};

export const apiUpdateItem = async (id: number, item: Partial<StockItem>): Promise<StockItem> => {
  const r = await fetch(`${API_URL}/api/stock/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item)
  });
  const data = await r.json();
  return data.item;
};

export const apiDeleteItem = async (id: number): Promise<void> => {
  await fetch(`${API_URL}/api/stock/${id}`, { method: 'DELETE' });
};

export const apiToggleAvailability = async (id: number): Promise<StockItem> => {
  const r = await fetch(`${API_URL}/api/stock/${id}/toggle-availability`, { method: 'PATCH' });
  const data = await r.json();
  return data.item;
};
