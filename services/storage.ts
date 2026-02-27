// Ce fichier gère uniquement le thème et l'utilisateur en local
// Le STOCK est maintenant géré par le serveur Render

import { User } from '../types';

export const getStoredUser = (): User | null => {
  const data = localStorage.getItem('tereos_user');
  return data ? JSON.parse(data) : null;
};

export const saveStoredUser = (user: User | null) => {
  if (user) localStorage.setItem('tereos_user', JSON.stringify(user));
  else localStorage.removeItem('tereos_user');
};

export const getStoredTheme = (): 'light' | 'dark' => {
  const stored = localStorage.getItem('tereos_theme');
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const saveStoredTheme = (theme: 'light' | 'dark') => {
  localStorage.setItem('tereos_theme', theme);
};
