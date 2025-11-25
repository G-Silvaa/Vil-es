import React, { useState } from 'react';
import { generateVillain } from './services/gemini';
import { VillainDisplay } from './components/VillainDisplay';
import { Villain } from './types';

function App() {
  const [description, setDescription] = useState('');
  const [villain, setVillain] = useState<Villain | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setLoading(true);
    setError(null);
    setVillain(null);

    try {
      const data = await generateVillain(description);
      setVillain(data);
    } catch (err) {
      setError("Ocorreu um erro ao invocar este vilão. O Éter está instável. Tente novamente ou verifique sua Chave de API.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] bg-slate-950 font-sans selection:bg-dragon-red selection:text-white pb-20">
      
      {/* Header */}
      <header className="bg-gradient-to-b from-slate-900 to-transparent pt-12 pb-8 px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 via-yellow-300 to-yellow-600 drop-shadow-sm mb-2">
          D&D 5e Villain Forge
        </h1>
        <p className="text-slate-400 font-serif italic max-w-xl mx-auto">
          "Forje a escuridão. Descreva seu antagonista e deixe o tomo revelar suas estatísticas, segredos e maldições."
        </p>
      </header>

      <main className="container mx-auto px-4 max-w-5xl">
        
        {/* Input Form */}
        <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700 p-6 rounded-xl shadow-xl mb-12">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label htmlFor="description" className="text-yellow-500 font-display font-bold uppercase tracking-widest text-sm">
              Invocação (Descrição do Vilão)
            </label>
            <textarea
              id="description"
              className="w-full h-32 bg-slate-950 text-slate-200 border border-slate-700 rounded-lg p-4 focus:ring-2 focus:ring-yellow-600 focus:border-transparent transition-all font-serif resize-none"
              placeholder="Ex: Um lich antigo que era um bardo famoso, usa magia sônica e vive em uma torre feita de vidro solidificado..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
            />
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading || !description.trim()}
                className={`
                  px-8 py-3 rounded-lg font-display font-bold uppercase tracking-widest transition-all
                  ${loading 
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-red-900 to-red-700 hover:from-red-800 hover:to-red-600 text-white shadow-lg hover:shadow-red-900/50 transform hover:-translate-y-0.5'
                  }
                `}
              >
                {loading ? 'Conjurando...' : 'Invocar Vilão'}
              </button>
            </div>
          </form>

          {/* Quick Prompts */}
          {!villain && !loading && (
             <div className="mt-4 text-xs text-slate-500 flex flex-wrap gap-2 justify-center">
               <span>Tente:</span>
               <button onClick={() => setDescription("Um goblin inventor obcecado por explosivos que monta uma aranha mecânica gigante.")} className="hover:text-yellow-500 underline decoration-dotted">Goblin Artífice Louco</button>
               <span className="text-slate-700">•</span>
               <button onClick={() => setDescription("Uma fada corrompida pelo pântano que rouba memórias em vez de dentes.")} className="hover:text-yellow-500 underline decoration-dotted">Fada do Pântano</button>
               <span className="text-slate-700">•</span>
               <button onClick={() => setDescription("Um paladino caído que acredita que a única salvação é o silêncio eterno.")} className="hover:text-yellow-500 underline decoration-dotted">Cavaleiro do Silêncio</button>
             </div>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-900/30 border border-red-500/50 p-6 rounded-lg text-center mb-8 animate-fade-in">
             <p className="text-red-200 font-serif text-lg">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 animate-pulse">
            <div className="w-16 h-16 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-yellow-600 font-display text-xl">Consultando os Planos Inferiores...</p>
          </div>
        )}

        {/* Result Display */}
        {villain && (
          <div className="animate-slide-up">
            <VillainDisplay villain={villain} />
            
            <div className="text-center mt-8">
               <button 
                onClick={() => {
                  setVillain(null);
                  setDescription("");
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-slate-500 hover:text-slate-300 font-serif italic hover:underline"
               >
                 Invocar outra abominação
               </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default App;