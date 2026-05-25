import { toPng } from 'html-to-image';

export const captureElementAsImage = async (elementId: string, filename: string): Promise<boolean> => {
  try {
    const node = document.getElementById(elementId);
    if (!node) {
      console.error(`Elemento ${elementId} non trovato`);
      return false;
    }

    // Aggiungiamo un watermark temporaneo
    const watermark = document.createElement('div');
    watermark.innerHTML = '🛡️ Creato con MLBB Counter Build';
    watermark.className = 'absolute bottom-2 right-4 text-slate-400/50 text-[10px] font-bold uppercase tracking-widest z-50 pointer-events-none drop-shadow-md';
    watermark.id = 'temp-watermark';
    
    // Assicuriamoci che il nodo sia relative per posizionare il watermark
    const originalPosition = node.style.position;
    if (getComputedStyle(node).position === 'static') {
      node.style.position = 'relative';
    }
    
    node.appendChild(watermark);

    const dataUrl = await toPng(node, {
      quality: 0.95,
      pixelRatio: 2, // High resolution for Retina displays and social media
      backgroundColor: '#0f172a', // slate-900 per evitare bordi bianchi trasparenti
      style: {
        transform: 'scale(1)', // Fix for mobile rendering
        transformOrigin: 'top left'
      }
    });

    // Rimuoviamo il watermark
    node.removeChild(watermark);
    node.style.position = originalPosition;

    // Trigger download
    const link = document.createElement('a');
    link.download = `${filename}.png`;
    link.href = dataUrl;
    link.click();
    
    return true;
  } catch (error) {
    console.error('Errore durante la generazione dell\'immagine:', error);
    // Assicuriamoci di rimuovere il watermark se fallisce
    const watermark = document.getElementById('temp-watermark');
    if (watermark && watermark.parentNode) {
      watermark.parentNode.removeChild(watermark);
    }
    return false;
  }
};
