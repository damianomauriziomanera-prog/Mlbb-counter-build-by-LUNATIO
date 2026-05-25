import { auth, db, googleProvider } from './firebase';
import { signInWithPopup, signOut, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { SavedBuild } from '../types';

// Login con Google
export const loginWithGoogle = async (): Promise<User | null> => {
  if (!auth || !googleProvider) return null;
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Errore durante il login con Google:", error);
    return null;
  }
};

// Logout
export const logout = async (): Promise<void> => {
  if (!auth) return;
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Errore durante il logout:", error);
  }
};

// Sincronizza le build salvate sul Cloud
export const syncBuildsToCloud = async (userId: string, builds: SavedBuild[]): Promise<boolean> => {
  if (!db) return false;
  try {
    const userDocRef = doc(db, 'users', userId);
    await setDoc(userDocRef, { savedBuilds: builds }, { merge: true });
    return true;
  } catch (error) {
    console.error("Errore nel salvataggio sul cloud:", error);
    return false;
  }
};

// Recupera le build salvate dal Cloud
export const fetchBuildsFromCloud = async (userId: string): Promise<SavedBuild[] | null> => {
  if (!db) return null;
  try {
    const userDocRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return data.savedBuilds as SavedBuild[] || [];
    }
    return [];
  } catch (error) {
    console.error("Errore nel recupero dal cloud:", error);
    return null;
  }
};

// Merge logica: Unisce build locali e cloud (basato su ID e Timestamp)
export const mergeBuilds = (localBuilds: SavedBuild[], cloudBuilds: SavedBuild[]): SavedBuild[] => {
  const mergedMap = new Map<string, SavedBuild>();

  localBuilds.forEach(b => mergedMap.set(b.id, b));
  
  cloudBuilds.forEach(cb => {
    const existing = mergedMap.get(cb.id);
    if (!existing || cb.timestamp > existing.timestamp) {
      mergedMap.set(cb.id, cb);
    }
  });

  // Ritorna le build ordinate per timestamp decrescente
  return Array.from(mergedMap.values()).sort((a, b) => b.timestamp - a.timestamp);
};
