"use client";
import { useEffect } from "react";

export default function HashScroller(){
  useEffect(()=>{
    const scrollToHash = () => {
      if (typeof window === 'undefined') return;
      const h = window.location.hash.replace('#','');
      if (!h) return;
      const el = document.getElementById(h);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    scrollToHash();
    const onHash = () => setTimeout(scrollToHash, 0);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  },[]);
  return null;
}

