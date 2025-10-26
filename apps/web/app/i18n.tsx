"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';

type Lang = 'he' | 'en';
type Ctx = { lang: Lang; setLang: (l: Lang)=>void };
const I18nCtx = createContext<Ctx>({ lang: 'he', setLang: ()=>{} });

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>(()=> (typeof window !== 'undefined' && (localStorage.getItem('lang') as Lang)) || 'he');
  useEffect(()=> { if (typeof window !== 'undefined') { localStorage.setItem('lang', lang); document.documentElement.lang = lang; document.documentElement.dir = lang==='he' ? 'rtl' : 'ltr'; } }, [lang]);
  return <I18nCtx.Provider value={{ lang, setLang }}>{children}</I18nCtx.Provider>;
}

export function useI18n() { return useContext(I18nCtx); }


