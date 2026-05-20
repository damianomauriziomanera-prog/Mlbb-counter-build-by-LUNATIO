import React, { useState, useEffect, useRef } from 'react';
import { Sword, Shield, Zap, Users, Upload } from 'lucide-react';
import { getWikiaImageUrl } from '../../lib/md5';

interface HeroImageWithFallbackProps {
  key?: string | number | null;
  src?: string;
  name?: string;
  id?: string;
  role?: string;
  className?: string;
  title?: string;
}

const getProxiedUrl = (url: string): string => {
  if (!url) return '';
  if (url.startsWith('data:') || url.startsWith('blob:') || url.includes('ui-avatars.com') || url.includes('images.weserv.nl')) {
    return url;
  }
  return `https://images.weserv.nl/?url=${encodeURIComponent(url)}`;
};

export function HeroImageWithFallback({ 
  src = '', 
  name = '', 
  id = '', 
  role = '', 
  className = '', 
  title = '' 
}: HeroImageWithFallbackProps) {
  const [attempt, setAttempt] = useState(-1);
  const [imgSrc, setImgSrc] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const normId = id ? id.toLowerCase() : name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const customIcon = localStorage.getItem(`hero_custom_icon_${normId}`);
    
    if (customIcon) {
      setImgSrc(customIcon);
      setAttempt(-1); // indicates it's a loaded custom image
    } else {
      if (src) {
        setImgSrc(getProxiedUrl(src));
      } else if (name) {
        const filename = name.replace(/\s+/g, '_') + '.png';
        setImgSrc(getProxiedUrl(getWikiaImageUrl(filename)));
      }
      setAttempt(0);
    }
  }, [src, name, id]);

  useEffect(() => {
    const handleStorageChange = (e: Event) => {
        const normId = id ? id.toLowerCase() : name.toLowerCase().replace(/[^a-z0-9]/g, '');
        const customIcon = localStorage.getItem(`hero_custom_icon_${normId}`);
        if(customIcon) {
             setImgSrc(customIcon);
             setAttempt(-1);
        }
    };
    window.addEventListener('custom-icon-updated', handleStorageChange);
    return () => window.removeEventListener('custom-icon-updated', handleStorageChange);
  }, [id, name]);

  const handleError = () => {
    // If our custom icon failed (shouldn't happen with base64 but just in case)
    if (attempt === -1) {
       setAttempt(0);
       return;
    }

    const filename = name.replace(/\s+/g, '_');
    const normId = id ? id.toLowerCase() : name.toLowerCase().replace(/[^a-z0-9]/g, '');

    if (attempt === 0) {
      setImgSrc(getProxiedUrl(getWikiaImageUrl(`${filename}_Icon.png`)));
      setAttempt(1);
    } else if (attempt === 1) {
      setImgSrc(getProxiedUrl(`https://shop.mobilelegends.com/static/img/hero_icon/${normId}.png`));
      setAttempt(2);
    } else if (attempt === 2) {
      setImgSrc(getProxiedUrl(getWikiaImageUrl(`${filename}.png`)));
      setAttempt(3);
    } else if (attempt === 3) {
      setImgSrc(getProxiedUrl(getWikiaImageUrl(`${filename}_Hero.png`)));
      setAttempt(4);
    } else if (attempt === 4) {
      setImgSrc(getWikiaImageUrl(`${filename}_Icon.png`));
      setAttempt(5);
    } else if (attempt === 5) {
      setImgSrc(`https://shop.mobilelegends.com/static/img/hero_icon/${normId}.png`);
      setAttempt(6);
    } else if (attempt === 6) {
      setImgSrc(`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0f172a&color=f59e0b&bold=true`);
      setAttempt(7);
    } else {
      setAttempt(8);
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const normId = id ? id.toLowerCase() : name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const reader = new FileReader();

    reader.onload = (event) => {
      const result = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 120; // 120x120 thumbnails
        canvas.width = MAX_SIZE;
        canvas.height = MAX_SIZE;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Fill black background
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(0, 0, MAX_SIZE, MAX_SIZE);
          
          // Draw centered image, maintaining ratio and cropping
          const scale = Math.max(MAX_SIZE / img.width, MAX_SIZE / img.height);
          const x = (MAX_SIZE / 2) - (img.width / 2) * scale;
          const y = (MAX_SIZE / 2) - (img.height / 2) * scale;
          ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          try {
             localStorage.setItem(`hero_custom_icon_${normId}`, dataUrl);
             window.dispatchEvent(new Event('custom-icon-updated')); // sync other instances
             setImgSrc(dataUrl);
             setAttempt(-1);
          } catch(err) {
             console.error("Storage quota exceeded", err);
             alert("Memoria locale piena. Impossibile salvare l'icona.");
          }
        }
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  if (!imgSrc || attempt === 8) {
    let bgGrad = 'from-slate-800 to-slate-950';
    let textCol = 'text-slate-350';
    let IconObj = Sword;
    const lowerRole = role ? role.toLowerCase() : '';

    if (lowerRole.includes('tank')) {
      bgGrad = 'from-emerald-950 via-slate-900 to-slate-950';
      textCol = 'text-emerald-400';
      IconObj = Shield;
    } else if (lowerRole.includes('assassin') || lowerRole.includes('assassino')) {
      bgGrad = 'from-rose-950 via-slate-900 to-slate-950';
      textCol = 'text-rose-400';
      IconObj = Sword;
    } else if (lowerRole.includes('mage') || lowerRole.includes('mago')) {
      bgGrad = 'from-violet-950 via-slate-900 to-slate-950';
      textCol = 'text-violet-400';
      IconObj = Zap;
    } else if (lowerRole.includes('marksman') || lowerRole.includes('tiratore')) {
      bgGrad = 'from-amber-950 via-slate-900 to-slate-900';
      textCol = 'text-amber-400';
      IconObj = Sword;
    } else if (lowerRole.includes('support')) {
      bgGrad = 'from-sky-950 via-slate-900 to-slate-950';
      textCol = 'text-sky-400';
      IconObj = Users;
    }

    return (
      <div className={`flex flex-col items-center justify-center bg-gradient-to-br border border-slate-850 shadow-inner group relative overflow-hidden ${bgGrad} ${className}`} title={title || name}>
        <div className="flex flex-col items-center justify-center p-1 pointer-events-none transition-opacity group-hover:opacity-10">
          <IconObj size={className.includes('w-16') || className.includes('w-12') ? 22 : 13} className={`${textCol} opacity-80`} />
          <span className="text-[7.5px] font-black uppercase tracking-wider text-slate-400 select-none mt-0.5 max-w-full truncate text-center leading-none">
            {name.substring(0, 4)}
          </span>
        </div>
        
        <div 
          onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
          className="absolute inset-0 bg-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-black/40 cursor-pointer"
          title={`Carica icona per ${name}`}
        >
          <Upload size={className.includes('w-16') || className.includes('w-12') ? 20 : 14} className="text-white drop-shadow-md" />
        </div>

        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          ref={fileInputRef}
          onChange={handleUpload}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    );
  }

  return (
    <div className={`relative group ${className}`}>
      <img 
        src={imgSrc} 
        alt={name} 
        className={`w-full h-full object-cover`} 
        title={title || name}
        onError={handleError} 
        referrerPolicy="no-referrer"
      />
      <div 
        onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
        className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer"
        title={`Cambia icona per ${name}`}
      >
        <Upload size={className.includes('w-16') || className.includes('w-12') ? 20 : 14} className="text-white" />
      </div>

      <input 
        type="file" 
        accept="image/*" 
        className="hidden" 
        ref={fileInputRef}
        onChange={handleUpload}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}
