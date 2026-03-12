import { useState, useCallback, useEffect } from 'react';

export function useTrackerState(key) {
  const [checked, setChecked] = useState(() => {
    try {
      const raw = localStorage.getItem(`tracker:${key}`);
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.detail && e.detail.key === key) {
        try {
          const raw = localStorage.getItem(`tracker:${key}`);
          setChecked(raw ? new Set(JSON.parse(raw)) : new Set());
        } catch {
          setChecked(new Set());
        }
      }
    };
    window.addEventListener('tracker-storage-change', handleStorageChange);
    return () => window.removeEventListener('tracker-storage-change', handleStorageChange);
  }, [key]);

  const toggle = useCallback(
    (name) => {
      setChecked((prev) => {
        const next = new Set(prev);
        if (next.has(name)) next.delete(name);
        else next.add(name);
        try {
          localStorage.setItem(`tracker:${key}`, JSON.stringify([...next]));
          window.dispatchEvent(new CustomEvent('tracker-storage-change', { detail: { key } }));
        } catch { /* storage full — ignore */ }
        return next;
      });
    },
    [key],
  );

  const resetAll = useCallback(() => {
    setChecked(new Set());
    try {
      localStorage.removeItem(`tracker:${key}`);
      window.dispatchEvent(new CustomEvent('tracker-storage-change', { detail: { key } }));
    } catch { /* ignore */ }
  }, [key]);

  return [checked, toggle, resetAll];
}