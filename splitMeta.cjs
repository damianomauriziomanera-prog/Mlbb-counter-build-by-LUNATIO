const fs = require('fs');
const path = require('path');

const appTsxPath = path.join(__dirname, 'src', 'App.tsx');
let appContent = fs.readFileSync(appTsxPath, 'utf8');

// Extract renderMetaView
const metaStart = appContent.indexOf('const renderMetaView = (isInline = false) => {');
const metaEndStr = 'const renderSavedBuildsView = (isInline = false) => {';
const metaEnd = appContent.indexOf(metaEndStr);

if (metaStart !== -1 && metaEnd !== -1) {
  let metaBlock = appContent.substring(metaStart, metaEnd);
  // remove it from App.tsx
  appContent = appContent.replace(metaBlock, '');
  
  // Create MetaTab.tsx
  const metaTabContent = `
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, X, ArrowUpCircle, AlertCircle, RefreshCw, Star, Shield, Zap, Search, ArrowRight } from 'lucide-react';
import { HeroImageWithFallback } from '../Common/HeroImageWithFallback';
import { MetaHero } from '../../types';
import { HEROES } from '../../data/heroes';

export default function MetaTab({
  isInline = false,
  isMetaOpen,
  handleCloseTab,
  gamePatchVersion,
  isUpdating,
  handleUpdateMeta,
  metaSearch,
  setMetaSearch,
  metaRoleFilter,
  setMetaRoleFilter,
  metaSort,
  setMetaSort,
  metaSortDirection,
  setMetaSortDirection,
  filteredAndSortedMeta,
  selectedMetaHero,
  setSelectedMetaHero,
  calculateMetaScore
}: any) {
  // Rimosso controllo isMetaOpen e isInline iniziale per gestire il lazy loading meglio
  const renderMetaView = () => {
    ${metaBlock.replace('const renderMetaView = (isInline = false) => {', '').replace(/if \(!isMetaOpen && !isInline\) return null;/g, '')}
  
  return renderMetaView();
}
`;

  fs.writeFileSync(path.join(__dirname, 'src', 'components', 'Tabs', 'MetaTab.tsx'), metaTabContent);
  fs.writeFileSync(appTsxPath, appContent);
  console.log('Extracted MetaTab');
}
