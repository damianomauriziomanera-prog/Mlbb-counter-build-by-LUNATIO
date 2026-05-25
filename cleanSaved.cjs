const fs = require('fs');
const path = require('path');

const appTsxPath = path.join(__dirname, 'src', 'App.tsx');
let appContent = fs.readFileSync(appTsxPath, 'utf8');

const savedStart = appContent.indexOf('const renderSavedBuildsView = (isInline = false) => {');
const endReturnStr = '  return (\n    <div className="min-h-screen bg-slate-950';
let savedEnd = appContent.indexOf(endReturnStr);

if (savedEnd === -1) {
  savedEnd = appContent.indexOf('return (\n    <div className="min-h-screen bg-slate-950');
}
if (savedEnd === -1) {
    savedEnd = appContent.indexOf('return (\r\n    <div className="min-h-screen');
}

if (savedStart !== -1 && savedEnd !== -1) {
  let savedBlock = appContent.substring(savedStart, savedEnd);
  appContent = appContent.replace(savedBlock, '');
  fs.writeFileSync(appTsxPath, appContent);
  console.log('Removed renderSavedBuildsView');
} else {
  console.log('Could not find boundaries', savedStart, savedEnd);
}
