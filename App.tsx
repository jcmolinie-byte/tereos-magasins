import React, { useState, useEffect, useCallback } from 'react';
import { getStoredUser, saveStoredUser, getStoredTheme, saveStoredTheme } from './services/storage';
import { apiGetStock, apiAddItem, apiUpdateItem, apiDeleteItem, apiToggleAvailability } from './services/api';
import { StockItem, User, TabView, AppNotification } from './types';
import { Button } from './components/Button';
import { StockCard } from './components/StockCard';
import { DepositForm } from './components/DepositForm';
import { LogOut, Search, PlusCircle, LayoutGrid, CheckCircle, Info, Moon, Sun, Package, Trash2, X, Euro, Leaf, Filter, ChevronDown, RefreshCw } from 'lucide-react';
import { SITES, CATEGORIES } from './constants';

function App() {
  const [user, setUser] = useState<User | null>(getStoredUser());
  const [stock, setStock] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>(getStoredTheme());

  const [currentTab, setCurrentTab] = useState<TabView>('stock');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategorie, setFilterCategorie] = useState('');
  const [filterSite, setFilterSite] = useState('');
  const [editingItem, setEditingItem] = useState<StockItem | null>(null);
  const [notification, setNotification] = useState<AppNotification | null>(null);
  const [showCO2Modal, setShowCO2Modal] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Charger le stock depuis le serveur
  const loadStock = useCallback(async () => {
    setLoading(true);
    try {
      const items = await apiGetStock();
      setStock(items);
    } catch (e) {
      showNotify('error', 'Impossible de charger le stock. Vérifiez votre connexion.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) loadStock();
  }, [user, loadStock]);

  useEffect(() => {
    saveStoredTheme(theme);
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [theme]);

  useEffect(() => { saveStoredUser(user); }, [user]);

  const showNotify = (type: AppNotification['type'], message: string) => {
    setNotification({ id: Date.now(), type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      setUser({ id: Date.now(), email, site: 'Artenay', token: 'mock-token' });
      setLoginError('');
    } else {
      setLoginError('Veuillez remplir tous les champs');
    }
  };

  const handleLogout = () => { setUser(null); setStock([]); setCurrentTab('stock'); };

  const handleDepositSubmit = async (data: Omit<StockItem, 'id' | 'disponible' | 'ownerEmail'>) => {
    try {
      if (editingItem) {
        const updated = await apiUpdateItem(editingItem.id, { ...data, ownerEmail: editingItem.ownerEmail });
        setStock(prev => prev.map(i => i.id === editingItem.id ? updated : i));
        showNotify('success', 'Pièce modifiée avec succès');
        setEditingItem(null);
      } else {
        const newItem = await apiAddItem({ ...data, ownerEmail: user?.email || null });
        setStock(prev => [newItem, ...prev]);
        showNotify('success', 'Pièce ajoutée au stock');
      }
      setCurrentTab('stock');
    } catch (e) {
      showNotify('error', 'Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await apiDeleteItem(id);
      setStock(prev => prev.filter(i => i.id !== id));
      showNotify('delete', 'Pièce supprimée');
    } catch (e) {
      showNotify('error', 'Erreur lors de la suppression');
    }
  };

  const handleReserve = async (id: number) => {
    try {
      const targetItem = stock.find(i => i.id === id);
      if (targetItem?.disponible && targetItem.ownerEmail) {
        const subject = encodeURIComponent(`Réservation : ${targetItem.piece}`);
        const body = encodeURIComponent(
          `Bonjour,\n\nJe souhaite réserver la pièce suivante :\n\n- Pièce : ${targetItem.piece}\n- Référence SAP : ${targetItem.refSAP}\n- Site : ${targetItem.site}\n\nCordialement,`
        );
        window.location.href = `mailto:${targetItem.ownerEmail}?subject=${subject}&body=${body}`;
      }
      const updated = await apiToggleAvailability(id);
      setStock(prev => prev.map(i => i.id === id ? updated : i));
      const isNowAvailable = updated.disponible;
      showNotify(isNowAvailable ? 'cancel' : 'reservation', isNowAvailable ? 'Réservation annulée' : 'Ouverture du client mail...');
    } catch (e) {
      showNotify('error', 'Erreur lors de la réservation');
    }
  };

  const handleEditInit = (id: number) => {
    const item = stock.find(i => i.id === id);
    if (item) { setEditingItem(item); setCurrentTab('deposit'); }
  };

  const filteredStock = stock.filter(item => {
    const matchSearch =
      item.piece.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.site.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.refSAP.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategorie = filterCategorie ? item.categorie === filterCategorie : true;
    const matchSite = filterSite ? item.site === filterSite : true;
    return matchSearch && matchCategorie && matchSite;
  });

  const totalCO2 = stock.filter(i => i.disponible).reduce((acc, curr) => acc + curr.co2, 0);
  const totalPrixAchat = stock.reduce((acc, curr) => acc + (curr.prixAchat || 0), 0);
  const myReservations = stock.filter(i => !i.disponible);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4">
        <div className="w-full max-w-lg bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <img src="/logo-usines.png" alt="Magasins-Tereos" style={{ height: '140px', width: '100%', objectFit: 'contain' }} />
            </div>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
              <input type="email" required className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary" placeholder="votre@email.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Mot de passe</label>
              <input type="password" required className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            {loginError && <div className="text-red-400 text-sm text-center">{loginError}</div>}
            <Button fullWidth type="submit">Se connecter</Button>
          </form>
          <div className="mt-6 text-center text-xs text-gray-500">Demo Mode: entrez n'importe quel email/mot de passe</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pb-20 transition-colors duration-300 ${theme === 'dark' ? 'dark' : ''}`}>
      <header className="sticky top-0 z-50 backdrop-blur-lg border-b border-gray-200 dark:border-white/5 bg-white/80 dark:bg-dark-bg/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <h1 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }} className="text-2xl text-gray-900 dark:text-white tracking-tight">Magasins-Tereos</h1>
            <Button variant="ghost" onClick={handleLogout} className="hidden md:flex" icon={<LogOut size={18} />}>Déconnexion</Button>
          </div>
        </div>
      </header>

      <div className="bg-white dark:bg-dark-surface border-b border-gray-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto">
          <nav className="flex items-center justify-between">
            <div className="flex space-x-1">
              {[
                { tab: 'stock', icon: <LayoutGrid size={18} />, label: 'Stock Disponible' },
                { tab: 'deposit', icon: <PlusCircle size={18} />, label: 'Déposer une pièce' },
                { tab: 'reservations', icon: <CheckCircle size={18} />, label: 'Réservations' },
              ].map(({ tab, icon, label }) => (
                <button key={tab} onClick={() => { setCurrentTab(tab as TabView); setEditingItem(null); }}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${currentTab === tab ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}>
                  {icon}{label}
                </button>
              ))}
            </div>
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-500/10 px-4 py-2 rounded-full border border-amber-200 dark:border-amber-500/20">
                <Euro size={14} className="text-amber-600 dark:text-amber-400" />
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Évité :</span>
                <span className="text-base font-bold text-amber-600 dark:text-amber-400">{totalPrixAchat.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</span>
              </div>
              <div className="flex items-center gap-3 bg-primary/5 px-4 py-2 rounded-full border border-primary/10 cursor-pointer hover:bg-primary/10 transition" onClick={() => setShowCO2Modal(true)}>
                <Leaf size={14} className="text-primary" />
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">CO₂</span>
                <span className="text-base font-bold text-primary">{totalCO2} kg</span>
              </div>
            </div>
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentTab === 'stock' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative shrink-0">
                <select value={filterCategorie} onChange={e => setFilterCategorie(e.target.value)}
                  className={`appearance-none pl-9 pr-8 py-4 rounded-2xl border text-sm font-medium cursor-pointer outline-none transition-all ${filterCategorie ? 'bg-primary text-white border-primary' : 'bg-white dark:bg-dark-surface border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-primary shadow-lg shadow-gray-200/50 dark:shadow-none'}`}>
                  <option value="">Toutes catégories</option>
                  {CATEGORIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                </select>
                <Filter size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${filterCategorie ? 'text-white' : 'text-gray-400'}`} />
                <ChevronDown size={14} className={`absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${filterCategorie ? 'text-white' : 'text-gray-400'}`} />
              </div>
              <div className="relative shrink-0">
                <select value={filterSite} onChange={e => setFilterSite(e.target.value)}
                  className={`appearance-none pl-9 pr-8 py-4 rounded-2xl border text-sm font-medium cursor-pointer outline-none transition-all ${filterSite ? 'bg-primary text-white border-primary' : 'bg-white dark:bg-dark-surface border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-primary shadow-lg shadow-gray-200/50 dark:shadow-none'}`}>
                  <option value="">Tous les sites</option>
                  {SITES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <Filter size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${filterSite ? 'text-white' : 'text-gray-400'}`} />
                <ChevronDown size={14} className={`absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${filterSite ? 'text-white' : 'text-gray-400'}`} />
              </div>
              <div className="relative flex-1">
                <input type="text" placeholder="Rechercher (nom, site, ref SAP)..."
                  className="w-full pl-12 pr-4 py-4 bg-white dark:bg-dark-surface border-none rounded-2xl shadow-lg shadow-gray-200/50 dark:shadow-none text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary outline-none transition-all"
                  value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              </div>
              <button onClick={loadStock} title="Rafraîchir" className="shrink-0 flex items-center gap-1.5 px-4 py-4 rounded-2xl border border-gray-200 dark:border-white/10 text-gray-500 text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                <RefreshCw size={16} />
              </button>
              {(filterCategorie || filterSite) && (
                <button onClick={() => { setFilterCategorie(''); setFilterSite(''); }}
                  className="shrink-0 flex items-center gap-1.5 px-4 py-4 rounded-2xl border border-red-300 dark:border-red-500/30 text-red-500 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-500/10 transition-all">
                  <X size={14} />Réinitialiser
                </button>
              )}
            </div>

            {loading ? (
              <div className="col-span-full text-center py-20 opacity-50">
                <RefreshCw className="mx-auto w-12 h-12 mb-4 animate-spin" />
                <p className="text-xl">Chargement du stock...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredStock.length > 0 ? filteredStock.map(item => (
                  <StockCard key={item.id} item={item} onReserve={handleReserve} onDelete={handleDelete} onEdit={handleEditInit} isOwner={true} />
                )) : (
                  <div className="col-span-full text-center py-20 opacity-50">
                    <Package className="mx-auto w-16 h-16 mb-4" />
                    <p className="text-xl">Aucune pièce trouvée.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {currentTab === 'deposit' && (
          <DepositForm initialData={editingItem || undefined} onSubmit={handleDepositSubmit} onCancel={() => { setEditingItem(null); setCurrentTab('stock'); }} />
        )}

        {currentTab === 'reservations' && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Réservations en cours</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {myReservations.length > 0 ? myReservations.map(item => (
                <StockCard key={item.id} item={item} onReserve={handleReserve} onDelete={handleDelete} onEdit={handleEditInit} isOwner={true} />
              )) : (
                <div className="col-span-full text-center py-20 opacity-50">
                  <CheckCircle className="mx-auto w-16 h-16 mb-4" />
                  <p className="text-xl">Aucune réservation active.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {notification && (
        <div className={`fixed top-24 right-4 z-[100] max-w-sm w-full p-4 rounded-xl shadow-2xl flex items-center gap-4 text-white animate-slideInRight ${notification.type === 'success' ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : notification.type === 'delete' || notification.type === 'cancel' ? 'bg-gradient-to-r from-red-500 to-orange-500' : notification.type === 'error' ? 'bg-gradient-to-r from-red-600 to-red-800' : 'bg-gradient-to-r from-blue-500 to-indigo-500'}`}>
          {notification.type === 'success' && <CheckCircle className="shrink-0" />}
          {notification.type === 'delete' && <Trash2 className="shrink-0" />}
          {notification.type === 'error' && <X className="shrink-0" />}
          {notification.type === 'reservation' && <Info className="shrink-0" />}
          <h4 className="font-bold">{notification.message}</h4>
        </div>
      )}

      {showCO2Modal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowCO2Modal(false)}>
          <div className="bg-white dark:bg-dark-surface p-8 rounded-2xl max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2"><Leaf className="text-primary" />Calcul CO₂</h3>
              <button onClick={() => setShowCO2Modal(false)} className="text-gray-500 hover:text-white"><X size={20}/></button>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">Le partage de pièces évite la fabrication de nouveaux équipements.</p>
            <ul className="space-y-2 mb-6 text-sm text-gray-500 dark:text-gray-400">
              {CATEGORIES.filter(c => c.value).map(c => (
                <li key={c.name} className="flex justify-between border-b border-gray-100 dark:border-white/5 py-2"><span>{c.name}</span><span className="font-bold text-primary">~{c.value} kg</span></li>
              ))}
            </ul>
            <Button fullWidth onClick={() => setShowCO2Modal(false)}>Compris</Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
