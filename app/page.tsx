'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [trajets, setTrajets] = useState<any[]>([]);
  const [depart, setDepart] = useState('');
  const [destination, setDestination] = useState('');
  // 1. Nouvel état pour le chargement
  const [loading, setLoading] = useState(true);

  const fetchTrajets = async () => {
    setLoading(true); // On commence le chargement
    try {
      let query = supabase.from('trajets').select('*');
      if (depart) query = query.ilike('depart', `%${depart}%`);
      if (destination) query = query.ilike('destination', `%${destination}%`);

      const { data, error } = await query;
      if (!error) setTrajets(data || []);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false); // On arrête le chargement quoi qu'il arrive
    }
  };

  useEffect(() => { fetchTrajets(); }, [depart, destination]);

  return (
    <main className="min-h-screen bg-gray-50 p-4 pb-24"> {/* pb-24 pour laisser de la place à la barre de navigation */}
      <h1 className="text-3xl font-extrabold text-green-700 text-center mb-8">FasoBillets 🚌</h1>

      <div className="max-w-md mx-auto bg-white p-6 rounded-3xl shadow-lg mb-8 space-y-4 border border-gray-100">
        <input 
          placeholder="D'où partez-vous ? (ex: Ouaga)" 
          className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-green-500 text-black"
          onChange={(e) => setDepart(e.target.value)}
        />
        <input 
          placeholder="Où allez-vous ? (ex: Bobo)" 
          className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-green-500 text-black"
          onChange={(e) => setDestination(e.target.value)}
        />
      </div>

      <div className="max-w-md mx-auto space-y-4">
        {/* 2. Affichage conditionnel pendant le chargement */}
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
                  <span>Départ : <b className="text-black">{t.heure_depart.substring(0, 5)}</b></span>
                  <span className="bg-gray-100 px-2 py-0.5 rounded text-[10px] italic uppercase">{t.type_bus}</span>
                </div>

                {t.telephone && (
                  <a 
                    href={`tel:${t.telephone}`}
                    className="mt-4 flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-all active:scale-95"
                  >
                    <span>📞</span> Appeler la gare
                  </a>
                )}
              </div>
            ))}
            
            {trajets.length === 0 && (
              <p className="text-center text-gray-400 mt-10 italic">Aucun bus disponible pour ce trajet actuellement. 🚛</p>
            )}
          </>
        )}
      </div>
    </main>
  );
}