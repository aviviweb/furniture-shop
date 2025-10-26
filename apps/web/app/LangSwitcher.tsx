"use client";

import { useI18n } from './i18n';

export function LangSwitcher() {
  const { lang, setLang } = useI18n();
  return (
    <div style={{ position:'fixed', bottom:16, left:16, zIndex:9999, display:'flex', gap:8 }}>
      <button className="btn" onClick={()=> setLang(lang==='he' ? 'en' : 'he')}>{lang==='he' ? 'EN' : 'HE'}</button>
    </div>
  );
}


