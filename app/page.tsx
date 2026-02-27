'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Home() {
  // Fonctions utilitaires pour les dates (YYYY-MM-DD)
  const getToday = () => new Date().toISOString().split('T')[0];
  const getTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const [trajets, setTrajets] = useState<any[]>([]);
  const [depart, setDepart] = useState('');
  const [destination, setDestination] = useState('');
  const [dateVoyage, setDateVoyage] = useState(getToday()); // Date par défaut : aujourd'hui
  const [loading, setLoading] = useState(true);

  const fetchTrajets = async () => {
    setLoading(true);
    try {
      let query = supabase.from('trajets').select('*');
      
      // Filtres de recherche
      if (depart) query = query.ilike('depart', `%${depart}%`);
      if (destination) query = query.ilike('destination', `%${destination}%`);
      if (dateVoyage) query = query.eq('date_depart', dateVoyage); // Nouveau filtre date

      const { data, error } = await query;
      if (!error) setTrajets(data || []);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  // On relance la recherche dès qu'un filtre change (ville ou date)
  useEffect(() => { fetchTrajets(); }, [depart, destination, dateVoyage]);

  const shareOnWhatsApp = (t: any) => {
    const message = `*FasoBillets* 🚌\n\n📍 *Trajet* : ${t.depart} ➔ ${t.destination}\n🏢 *Compagnie* : ${t.compagnie}\n📅 *Date* : ${t.date_depart}\n🕒 *Départ* : ${t.heure_depart.substring(0, 5)}\n💰 *Prix* : ${t.prix} FCFA\n\nTrouvez votre ticket ici : https://fasobillets.vercel.app`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4 pb-24">
      <h1 className="text-3xl font-extrabold text-green-700 text-center mb-8">FasoBillets 🚌</h1>

      {/* BLOC DE RECHERCHE STYLE O BILET */}
      <div className="max-w-md mx-auto bg-white p-6 rounded-3xl shadow-lg mb-8 space-y-4 border border-gray-100">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-400 ml-2 uppercase">Départ</label>
          <input 
            placeholder="D'où partez-vous ? (ex: Ouaga)" 
            className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-green-500 text-black outline-none"
            onChange={(e) => setDepart(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-400 ml-2 uppercase">Destination</label>
          <input 
            placeholder="Où allez-vous ? (ex: Bobo)" 
            className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-green-500 text-black outline-none"
            onChange={(e) => setDestination(e.target.value)}
          />
        </div>

        {/* CALENDRIER ET BOUTONS RAPIDES */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-400 ml-2 uppercase">Date du voyage</label>
          <div className="flex gap-2">
            <input 
              type="date"
              value={dateVoyage}
              className="flex-1 p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-green-500 text-black outline-none"
              onChange={(e) => setDateVoyage(e.target.value)}
            />
            <button 
              onClick={() => setDateVoyage(getToday())}
              className={`px-3 rounded-xl font-bold text-xs transition-all ${dateVoyage === getToday() ? 'bg-green-600 text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            >
              Auj.
            </button>
            <button 
              onClick={() => setDateVoyage(getTomorrow())}
              className={`px-3 rounded-xl font-bold text-xs transition-all ${dateVoyage === getTomorrow() ? 'bg-green-600 text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            >
              Dem.
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
            <p className="text-gray-500 font-medium">Recherche des trajets...</p>
          </div>
        ) : (
          <>
            {trajets.map((t) => (
              <div key={t.id} className="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-green-500 mb-4 animate-in fade-in duration-500">
                <div className="flex justify-between font-bold">
                  <span className="text-green-800 uppercase text-[10px] tracking-widest">{t.compagnie}</span>
                  <span className="text-green-600 font-black">{t.prix} FCFA</span>
                </div>
                
                <p className="text-gray-700 font-bold text-lg mt-1">{t.depart} ➔ {t.destination}</p>
                
                <div className="flex justify-between items-center mt-3 text-sm text-gray-500">
                  <div className="flex flex-col">
                    <span>Heure : <b className="text-black">{t.heure_depart.substring(0, 5)}</b></span>
                    <span className="text-[10px] text-gray-400">{t.date_depart}</span>
                  </div>
                  {/* ICÔNES DE CONFORT STYLE O BILET */}
                  <div className="flex gap-2">
                    <span title="AC" className="grayscale opacity-50 text-lg">❄️</span>
                    <span title="Wi-Fi" className="grayscale opacity-50 text-lg">📶</span>
                    <span title="USB" className="grayscale opacity-50 text-lg">🔌</span>
                    <span className="bg-gray-100 px-2 py-0.5 rounded text-[10px] italic uppercase self-center">{t.type_bus}</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  {t.telephone && (
                    <a 
                      href={`tel:${t.telephone}`}
                      className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white font-bold py-3 rounded-xl active:scale-95 transition-all shadow-sm"
                    >
                      📞 Appeler
                    </a>
                  )}
                  <button 
                    onClick={() => shareOnWhatsApp(t)}
                    className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-green-600 text-green-600 font-bold py-3 rounded-xl active:scale-95 transition-all"
                  >
                    📤 Partager
                  </button>
                </div>
              </div>
            ))}
            
            {trajets.length === 0 && (
              <div className="text-center py-10">
                <p className="text-3xl mb-2 text-gray-300">🚍</p>
                <p className="text-gray-400 italic">Aucun bus trouvé pour cette date. Essayez demain !</p>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}