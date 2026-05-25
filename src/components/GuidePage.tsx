import React, { useState } from 'react';
import { BookOpen, AlertTriangle, Shield, Sword, Crown, Zap, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';

const GuidePage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'start' | 'beginner' | 'intermediate' | 'advanced' | 'pro'>('start');

  const SectionButton = ({ id, label, icon: Icon, active }: { id: any, label: string, icon: any, active: boolean }) => (
    <button
      onClick={() => setActiveSection(id)}
      className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 w-full text-left ${
        active 
          ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shadow-lg shadow-indigo-500/10' 
          : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:bg-slate-800 hover:text-slate-200'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="flex-1">{label}</span>
      {active && <ChevronRight className="w-4 h-4 opacity-50" />}
    </button>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in pb-32">
      {/* Header */}
      <div className="mb-8 text-center space-y-4">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-500/20 rounded-2xl mb-2">
          <BookOpen className="w-10 h-10 text-indigo-400" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
          La Guida Definitiva MLBB
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
          Da zero a Mitico Immortale: tutto quello che devi sapere per dominare la Terra dell'Alba.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="w-full lg:w-72 flex-shrink-0 space-y-2">
          <div className="sticky top-24 space-y-2">
            <SectionButton id="start" label="1. Primi Passi & Eroi" icon={Zap} active={activeSection === 'start'} />
            <SectionButton id="beginner" label="2. Neofita (Le Basi)" icon={Shield} active={activeSection === 'beginner'} />
            <SectionButton id="intermediate" label="3. Intermedio (Rotazioni)" icon={Sword} active={activeSection === 'intermediate'} />
            <SectionButton id="advanced" label="4. Avanzato (Macro Game)" icon={AlertTriangle} active={activeSection === 'advanced'} />
            <SectionButton id="pro" label="5. Mondo Professionistico" icon={Crown} active={activeSection === 'pro'} />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-slate-900/50 rounded-2xl border border-slate-800 p-6 sm:p-8 overflow-hidden relative shadow-xl">
          {/* Background glow */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

          {activeSection === 'start' && (
            <div className="space-y-8 animate-slide-in-right">
              <h2 className="text-3xl font-bold text-white flex items-center gap-3 border-b border-slate-700/50 pb-4">
                <Zap className="text-indigo-400" /> Iniziare a Giocare
              </h2>
              
              <div className="space-y-6 text-slate-300 leading-relaxed text-lg">
                <p>
                  Hai appena installato <strong>Mobile Legends: Bang Bang</strong> e ti trovi davanti a decine di eroi, menu e offerte. Il primo consiglio fondamentale è: <strong>imposta correttamente il gioco</strong>.
                </p>
                
                <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                  <h3 className="text-xl font-bold text-indigo-300 mb-4">Impostazioni Cruciali (Impostazioni Base e Comandi)</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Mira Avanzata:</strong> Nelle impostazioni comandi, seleziona la mira avanzata (quella con 3 pulsanti: attacco minion, attacco torre, attacco eroe). Senza questa, attaccherai a caso i bersagli sbagliati.</li>
                    <li><strong>Puntamento Intelligente Eroe (Hero Lock):</strong> Attivalo. Ti permetterà di selezionare specificamente il ritratto dell'eroe nemico che vuoi attaccare, essenziale per gli Assassini.</li>
                    <li><strong>Modalità FPS Elevati:</strong> Se il tuo telefono lo permette, imposta gli FPS su Alto o Ultra. Un gioco fluido ti salva la vita nei combattimenti frenetici.</li>
                  </ul>
                </div>

                <h3 className="text-2xl font-bold text-white mt-8 mb-4">Quali Eroi usare (e quali EVITARE)</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Da usare */}
                  <div className="bg-emerald-900/20 border border-emerald-500/30 p-5 rounded-xl">
                    <h4 className="text-emerald-400 font-bold text-lg flex items-center gap-2 mb-3">
                      <CheckCircle2 className="w-5 h-5" /> Consigliati all'inizio
                    </h4>
                    <p className="text-sm mb-4 text-emerald-200/70">Meccaniche semplici per permetterti di imparare la mappa, non i tasti.</p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2"><span className="text-emerald-500 font-bold">Balmond (EXP/Jungle):</span> Gira su te stesso per fare danni e curarti. La mossa finale fa danni veri. Facilissimo.</li>
                      <li className="flex items-start gap-2"><span className="text-emerald-500 font-bold">Eudora (Mid):</span> Stun, esplosione, kill. Il suo combo 2-3-1 shotta chiunque ed è impossibile da sbagliare.</li>
                      <li className="flex items-start gap-2"><span className="text-emerald-500 font-bold">Tigreal (Roam):</span> Spingi i nemici, li alzi in aria. Imparerai benissimo a difendere la tua squadra.</li>
                      <li className="flex items-start gap-2"><span className="text-emerald-500 font-bold">Layla/Miya (Gold):</span> Stai lontano e spara. Occhio a non farti prendere.</li>
                      <li className="flex items-start gap-2"><span className="text-emerald-500 font-bold">Saber (Jungle):</span> 1-2-3 e hai ucciso il bersaglio. Il miglior eroe per imparare le imboscate.</li>
                    </ul>
                  </div>

                  {/* Da evitare */}
                  <div className="bg-rose-900/20 border border-rose-500/30 p-5 rounded-xl">
                    <h4 className="text-rose-400 font-bold text-lg flex items-center gap-2 mb-3">
                      <XCircle className="w-5 h-5" /> Da EVITARE
                    </h4>
                    <p className="text-sm mb-4 text-rose-200/70">Richiedono centinaia di partite solo per capirne le dita. Distraggono dallo scopo del gioco.</p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2"><span className="text-rose-500 font-bold">Fanny:</span> Usa i cavi per volare. È considerato l'eroe più difficile dei MOBA su mobile. Ignorala fino al grado Mitico.</li>
                      <li className="flex items-start gap-2"><span className="text-rose-500 font-bold">Ling:</span> Salta sui muri, richiede una gestione perfetta della barra dell'energia.</li>
                      <li className="flex items-start gap-2"><span className="text-rose-500 font-bold">Gusion:</span> Richiede di concatenare 10 pugnali in mezzo secondo ("Fast Hand").</li>
                      <li className="flex items-start gap-2"><span className="text-rose-500 font-bold">Chou / Benedetta / Wanwan:</span> Eroi dove un tap sbagliato ti butta in mezzo alla squadra nemica a morire.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'beginner' && (
            <div className="space-y-8 animate-slide-in-right">
              <h2 className="text-3xl font-bold text-white flex items-center gap-3 border-b border-slate-700/50 pb-4">
                <Shield className="text-blue-400" /> Livello Neofita: Le Basi
              </h2>
              
              <div className="space-y-6 text-slate-300 leading-relaxed text-lg">
                <p>
                  MLBB non è un gioco di uccisioni, è un gioco di <strong>distruzione degli edifici</strong>. L'unica cosa che conta è abbattere la base nemica (il Cristallo). Le kill servono solo per avere lo spazio di spingere.
                </p>

                <h3 className="text-2xl font-bold text-white mt-8 mb-4">I 5 Ruoli (Le 3 Corsie + 2 Vagabondi)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-800/80 p-4 rounded-lg border-l-4 border-amber-500">
                    <strong className="text-amber-400 block mb-1">Corsia dell'Esperienza (EXP Lane)</strong>
                    Corsia vicina alla Tartaruga all'inizio del gioco. I minion danno più XP. Solitamente giocata da <em>Combattenti (Fighters)</em> spessi che lottano in corpo a corpo.
                  </div>
                  <div className="bg-slate-800/80 p-4 rounded-lg border-l-4 border-yellow-400">
                    <strong className="text-yellow-400 block mb-1">Corsia dell'Oro (Gold Lane)</strong>
                    Corsia lontana dalla prima Tartaruga. I minion danno oro bonus. È il regno dei <em>Tiratori (Marksmen)</em>, che hanno bisogno di soldi per comprare oggetti e fare danni assurdi in Late Game.
                  </div>
                  <div className="bg-slate-800/80 p-4 rounded-lg border-l-4 border-blue-500">
                    <strong className="text-blue-400 block mb-1">Corsia Centrale (Mid Lane)</strong>
                    La via più breve. I minion arrivano prima. Giocata da <em>Maghi (Mages)</em> con alti danni ad area. Il Mago deve spingere i minion e spostarsi subito nelle altre corsie per gankare.
                  </div>
                  <div className="bg-slate-800/80 p-4 rounded-lg border-l-4 border-purple-500">
                    <strong className="text-purple-400 block mb-1">Giungla (Jungle)</strong>
                    Uccide i mostri neutrali con l'incantesimo <em>Retribution (Punizione)</em>. È il regista della partita, ruba gli obiettivi (Tartaruga/Lord) e fa imboscate a sorpresa. 
                  </div>
                  <div className="bg-slate-800/80 p-4 rounded-lg border-l-4 border-emerald-500 md:col-span-2">
                    <strong className="text-emerald-400 block mb-1">Vagabondo (Roam)</strong>
                    I <em>Tank</em> o <em>Supporti</em> comprano gli Stivali da Roaming (che bloccano i guadagni di oro/xp per lasciarli ai compagni). Proteggono la squadra, curano, o iniziano i combattimenti.
                  </div>
                </div>

                <div className="bg-indigo-900/20 p-6 rounded-xl border border-indigo-500/30 mt-6">
                  <h3 className="text-xl font-bold text-indigo-300 mb-2">L'Abitudine d'Oro: La Minimappa</h3>
                  <p>
                    I giocatori forti guardano la minimappa (in alto a sinistra) <strong>ogni 3 secondi</strong>. Se non vedi i nemici sulla mappa, significa che sono in un cespuglio. E se non sai dove sono, probabilmente stanno venendo a ucciderti. Abbraccia le torri, stai al sicuro.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'intermediate' && (
            <div className="space-y-8 animate-slide-in-right">
              <h2 className="text-3xl font-bold text-white flex items-center gap-3 border-b border-slate-700/50 pb-4">
                <Sword className="text-rose-400" /> Livello Intermedio: Gioco di Squadra
              </h2>
              
              <div className="space-y-6 text-slate-300 leading-relaxed text-lg">
                <p>
                  Ora che sai spingere i bottoni, devi capire come muoverti (le <strong>Rotazioni</strong>) e come sfruttare la mappa.
                </p>

                <h3 className="text-xl font-bold text-white mt-6">1. Le Rotazioni (Ganking)</h3>
                <p>
                  Non restare fermo nella tua corsia per 10 minuti. Il Mago (Mid) e il Roamer devono muoversi costantemente verso la Gold Lane o la EXP Lane per creare vantaggi numerici (3 contro 1 o 3 contro 2). Pulisci l'onda di minion, nasconditi e corri ad aiutare un compagno. Poi torna in tempo per l'onda successiva.
                </p>

                <h3 className="text-xl font-bold text-white mt-6">2. Tartaruga e Lord</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>La Tartaruga:</strong> Compare a 2:00. Ucciderla dà Oro e Scudi a tutta la squadra. Il team dovrebbe riunirsi intorno alla tana 10 secondi prima.</li>
                  <li><strong>Il Lord:</strong> Compare a 8:00 (e si potenzia a 12:00 e 18:00). Chi lo sconfigge lo evocherà per spingere la corsia più debole nemica. Mai tentare il Lord se tutti e 5 i nemici sono vivi, a meno che tu non abbia un vantaggio colossale. Usalo per chiudere la partita.</li>
                </ul>

                <h3 className="text-xl font-bold text-white mt-6">3. Le Build Situazionali</h3>
                <p>
                  I giocatori scarsi copiano le build fisse (Pro Builds) a prescindere dal nemico. I giocatori intermedi capiscono che se il nemico ha molti danni magici, devono comprare <em>Athena's Shield</em>. Se c'è un curatore (Estes, Uranus), devono comprare <em>Dominance Ice</em> (Tank/Fighter), <em>Sea Halberd</em> (Tiratore) o <em>Necklace of Durance</em> (Mago).
                </p>
                <div className="p-4 bg-slate-800/80 rounded border border-slate-700">
                  💡 <strong>Usa il nostro Simulatore:</strong> Inserisci gli eroi nemici nell'app e guarda come l'intelligenza artificiale adatta la tua build. Ti insegnerà automaticamente le dinamiche degli oggetti situazionali.
                </div>
              </div>
            </div>
          )}

          {activeSection === 'advanced' && (
            <div className="space-y-8 animate-slide-in-right">
              <h2 className="text-3xl font-bold text-white flex items-center gap-3 border-b border-slate-700/50 pb-4">
                <AlertTriangle className="text-amber-400" /> Livello Avanzato: Macro Game
              </h2>
              
              <div className="space-y-6 text-slate-300 leading-relaxed text-lg">
                <p>
                  Qui entriamo nel grado Mitico e Onore Mitico. Vittoria o sconfitta non dipendono dai riflessi, ma dall'intelletto tattico.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">
                    <h3 className="text-xl font-bold text-amber-400 mb-2">Freezing (Congelamento)</h3>
                    <p className="text-sm">
                      Se sei più forte del tuo avversario in corsia, non pulire l'onda di minion velocemente. Lascia che i minion si uccidano tra loro, ma posizionati <em>oltre</em> la linea dei minion. Il nemico avrà paura di avvicinarsi, non prenderà oro né XP, e rimarrà di 2 livelli indietro senza che tu debba mai ucciderlo.
                    </p>
                  </div>
                  <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">
                    <h3 className="text-xl font-bold text-amber-400 mb-2">Taglio dei Minion (Cutting)</h3>
                    <p className="text-sm">
                      Consiste nell'andare letteralmente *dietro* la torre nemica (di solito in EXP Lane) per uccidere i minion appena nascono (spawnano). Ti regala 15 secondi di tempo libero in cui il tuo avversario deve difendere la torre, mentre tu sei libero di rubare la giungla o andare in Mid Lane. Rischioso, ma vitale.
                    </p>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-white mt-8">Il Draft e il Counterpick</h3>
                <p>
                  Il Draft (la fase di selezione eroi) decide il 50% delle partite avanzate. Se il nemico prende <strong>Fanny</strong>, tu prendi <strong>Khufra</strong> (la sua palla blocca i cavi). Se prendono <strong>Estes</strong>, tu prendi <strong>Baxia</strong> (che taglia le cure passivamente). Se prendono eroi spessi, prendi <strong>Karrie</strong> (che infligge danni puri). La vera conoscenza avanzata sta nel sapere come annullare le meccaniche avversarie ancor prima che la partita inizi.
                </p>
              </div>
            </div>
          )}

          {activeSection === 'pro' && (
            <div className="space-y-8 animate-slide-in-right">
              <h2 className="text-3xl font-bold text-white flex items-center gap-3 border-b border-slate-700/50 pb-4">
                <Crown className="text-yellow-400" /> Mondo Professionistico (L'Eccellenza)
              </h2>
              
              <div className="space-y-6 text-slate-300 leading-relaxed text-lg">
                <p>
                  Immortali Mitici e tornei. In questo ambiente, ogni singolo secondo, ogni millimetro di mappa conta. Non c'è spazio per errori individuali, è una coreografia di squadra.
                </p>

                <h3 className="text-xl font-bold text-white mt-6">1. Tracciamento Cooldown (Spell Tracking)</h3>
                <p>
                  Un pro sa sempre quali nemici hanno il *Flicker* (Scatto) o la *Ultimate* in ricarica. Se sai che il Tiratore nemico ha bruciato il suo Flicker, comunicalo alla squadra (es. "Moskov no spell 120s") e saprete che per i prossimi 2 minuti sarà un bersaglio facile per ogni imboscata.
                </p>

                <h3 className="text-xl font-bold text-white mt-6">2. Split Pushing Millimetrico</h3>
                <p>
                  Quando il team fa finta di ingaggiare il Lord (Danza del Lord / *Lord Dance*), lo scopo non è fare il mostro, ma costringere i nemici a venire a controllare. Nel frattempo, un eroe rapido come *Ling* o *Zilong* sta spingendo silenziosamente una corsia remota. Il nemico deve scegliere: perdere il Lord o perdere la torre Inibitrice.
                </p>

                <h3 className="text-xl font-bold text-white mt-6">3. Condizione Psicologica (Mentalità)</h3>
                <div className="bg-yellow-900/20 p-6 rounded-xl border border-yellow-500/30">
                  <p className="italic font-medium text-yellow-200 mb-4">"Tiltare significa perdere."</p>
                  <p>I pro non si arrabbiano per un First Blood perso, né scrivono in chat per insultare il team. Sanno che MLBB è il re dei "Comeback" (Ribaltamenti di risultato). Una difesa eccellente intorno alla base al minuto 20, seguita da un <em>Wipeout</em> (annientamento totale), garantisce la vittoria anche se il team nemico aveva 30 uccisioni in più. Mai arrendersi.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuidePage;
