import React, { useState } from 'react';
import { Shield, Sword, Zap, Activity, Sparkles, Target, Users } from 'lucide-react';
import { getWikiaImageUrl } from '../../lib/md5';
import { getItemFandomName } from '../../data/items';

export interface ImageWithFallbackProps {
  key?: React.Key;
  src: string;
  alt: string;
  className?: string;
  type: 'emblem' | 'talent' | 'spell' | 'item';
  id: string;
  title?: string;
}

const getProxiedUrl = (url: string): string => {
  if (!url) return '';
  if (url.startsWith('data:') || url.startsWith('blob:') || url.includes('ui-avatars.com') || url.includes('images.weserv.nl')) {
    return url;
  }
  return `https://images.weserv.nl/?url=${encodeURIComponent(url)}`;
};

export function ImageWithFallback({ src, alt, className = '', type, id, title }: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);
  const [imgSrc, setImgSrc] = useState(() => getProxiedUrl(src));
  const [prevSrc, setPrevSrc] = useState(src);

  if (src !== prevSrc) {
    setPrevSrc(src);
    setImgSrc(getProxiedUrl(src));
    setHasError(false);
  }

  if (hasError) {
    if (type === 'item') {
      const itemName = getItemFandomName(id);
      const fallbackSrc = getProxiedUrl(getWikiaImageUrl(`${itemName}.png`));
      return (
        <img 
          src={fallbackSrc} 
          alt={alt} 
          className={className} 
          title={title || alt}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (!target.src.includes('_Icon')) {
                const iconNameStr = getWikiaImageUrl(`${itemName}_Icon.png`);
                target.src = getProxiedUrl(iconNameStr);
            } else {
                target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(alt)}&background=020617&color=10b981&bold=true`;
            }
          }}
          referrerPolicy="no-referrer"
        />
      );
    }
    if (type === 'emblem') {
      let bgGrad = 'from-slate-700 to-slate-900';
      let textCol = 'text-amber-500';
      let IconObj: any = Shield;
      const lowerId = id.toLowerCase();

      if (lowerId.includes('tank')) {
        bgGrad = 'from-emerald-850 to-slate-900';
        textCol = 'text-emerald-400';
        IconObj = Shield;
      } else if (lowerId.includes('assassin') || lowerId.includes('assassino')) {
        bgGrad = 'from-rose-850 to-slate-900';
        textCol = 'text-rose-400';
        IconObj = Sword;
      } else if (lowerId.includes('mage') || lowerId.includes('mago')) {
        bgGrad = 'from-violet-850 to-slate-900';
        textCol = 'text-violet-400';
        IconObj = Zap;
      } else if (lowerId.includes('marksman') || lowerId.includes('tiratore')) {
        bgGrad = 'from-amber-600 to-slate-900';
        textCol = 'text-amber-400';
        IconObj = Target;
      } else if (lowerId.includes('support')) {
        bgGrad = 'from-sky-750 to-slate-900';
        textCol = 'text-sky-400';
        IconObj = Users;
      } else if (lowerId.includes('fighter') || lowerId.includes('combattente')) {
        bgGrad = 'from-orange-850 to-slate-900';
        textCol = 'text-orange-500';
        IconObj = Sword;
      }

      return (
        <div className={`rounded-full bg-gradient-to-tr ${bgGrad} flex items-center justify-center border border-slate-700 shadow-inner p-2 ${className}`}>
          <IconObj size={24} className={textCol} />
        </div>
      );
    }

    if (type === 'spell') {
      let bgGrad = 'from-slate-800 to-slate-950';
      let textCol = 'text-slate-300';
      let IconObj: any = Sparkles;
      const lowerId = id.toLowerCase();

      if (lowerId === 'execute' || lowerId === 'esecuzione') {
        bgGrad = 'from-red-900/95 to-slate-950';
        textCol = 'text-red-400';
        IconObj = Sword;
      } else if (lowerId === 'retribution' || lowerId === 'retribuzione') {
        bgGrad = 'from-orange-800/95 to-slate-950';
        textCol = 'text-orange-400';
        IconObj = Target;
      } else if (lowerId === 'flicker') {
        bgGrad = 'from-blue-900/95 to-slate-950';
        textCol = 'text-sky-450';
        IconObj = Zap;
      } else if (lowerId === 'sprint') {
        bgGrad = 'from-cyan-800/95 to-slate-950';
        textCol = 'text-cyan-400';
        IconObj = Activity;
      } else if (lowerId === 'inspire' || lowerId === 'ispirazione') {
        bgGrad = 'from-yellow-850 to-slate-950';
        textCol = 'text-yellow-400';
        IconObj = Sparkles;
      } else if (lowerId === 'aegis' || lowerId === 'scudo' || lowerId === 'revitalize' || lowerId === 'revitalizza') {
        bgGrad = 'from-emerald-900/95 to-slate-950';
        textCol = 'text-emerald-400';
        IconObj = Shield;
      } else if (lowerId === 'purify' || lowerId === 'purificazione') {
        bgGrad = 'from-teal-850 to-slate-950';
        textCol = 'text-teal-400';
        IconObj = Sparkles;
      }

      return (
        <div className={`rounded-lg bg-gradient-to-tr ${bgGrad} flex items-center justify-center border border-slate-700 shadow-inner p-2 ${className}`}>
          <IconObj size={24} className={textCol} />
        </div>
      );
    }

    return (
      <div className={`bg-slate-900 flex items-center justify-center border border-slate-800 rounded text-slate-700 ${className}`}>
        <Sparkles size={16} />
      </div>
    );
  }

  return (
    <img 
      src={imgSrc} 
      alt={alt} 
      className={className} 
      title={title || alt}
      onError={() => {
        if (!imgSrc.includes('weserv')) {
          setImgSrc(getProxiedUrl(src));
        } else {
          setHasError(true);
        }
      }} 
      referrerPolicy="no-referrer"
    />
  );
}
