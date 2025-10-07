import { createContext, useContext, useEffect, useState, useMemo } from 'react';

interface SettingsContextType {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  // Initialize dark mode: prefer explicit user setting in localStorage; otherwise use system preference
  const getInitialDark = () => {
    const stored = localStorage.getItem('darkMode');
    if (stored === '1') return true;
    if (stored === '0') return false;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  };

  const [darkMode, setDarkMode] = useState<boolean>(() => getInitialDark());

  // Apply dark class and persist explicit user preference when it changes
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
      localStorage.setItem('darkMode', '1');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('darkMode', '0');
    }
  }, [darkMode]);

  // If user hasn't set an explicit preference, follow system changes
  useEffect(() => {
    const stored = localStorage.getItem('darkMode');
    if (stored === '1' || stored === '0') return; // user preference exists

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setDarkMode(e.matches);
    if (mq.addEventListener) mq.addEventListener('change', handler);
    else {
      // addListener is deprecated but still present on some browsers; fall back using any-cast
      (mq as any).addListener(handler);
    }
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', handler);
      else {
        (mq as any).removeListener(handler);
      }
    };
  }, []);

  const providerValue = useMemo(() => ({ darkMode, setDarkMode }), [darkMode]);

  return (
    <SettingsContext.Provider value={providerValue}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within a SettingsProvider');
  return ctx;
}
