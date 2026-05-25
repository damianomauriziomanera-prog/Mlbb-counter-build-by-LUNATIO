import { SavedBuild } from '../types';

const PREFIX = "LUNATIO-";

export const exportBuildToCode = (build: SavedBuild): string => {
  try {
    // Rimuoviamo dati non essenziali per mantenere il codice corto
    // ma manteniamo userHeroId, lane, customTalents, e i 6 item (id) + emblem
    const minimalData = {
      h: build.userHeroId,
      l: build.lane,
      e: build.results.emblem.id,
      t1: build.customTalents?.tier1?.id,
      t2: build.customTalents?.tier2?.id,
      t3: build.customTalents?.tier3?.id,
      i: build.results.items.map(slot => slot.item ? slot.item.id : null),
      s: build.results.spell.id
    };

    const jsonStr = JSON.stringify(minimalData);
    // BtoA per generare un Base64 pulito
    const base64 = btoa(jsonStr);
    
    return `${PREFIX}${base64}`;
  } catch (err) {
    console.error("Errore durante l'esportazione della build", err);
    return "";
  }
};

export const importBuildFromCode = (code: string, currentTimestamp: number): any | null => {
  try {
    if (!code.startsWith(PREFIX)) {
      return null; // Formato non valido
    }

    const base64 = code.substring(PREFIX.length);
    const jsonStr = atob(base64);
    const minimalData = JSON.parse(jsonStr);

    // Poiché abbiamo i dati minimali, dovremo ricostruire l'oggetto "SavedBuild" 
    // nel componente chiamante usando questi ID, ma intanto restituiamo i dati estratti.
    return {
      userHeroId: minimalData.h,
      lane: minimalData.l,
      emblemId: minimalData.e,
      spellId: minimalData.s,
      tier1Id: minimalData.t1,
      tier2Id: minimalData.t2,
      tier3Id: minimalData.t3,
      itemIds: minimalData.i, // Array di 6
      timestamp: currentTimestamp
    };
  } catch (err) {
    console.error("Errore durante l'importazione della build", err);
    return null;
  }
};
