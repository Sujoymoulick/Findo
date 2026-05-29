import React, { createContext, useContext, useState, useEffect } from 'react';

interface CookiePreferences {
  essential: boolean; // Always true
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

interface CookieContextType {
  preferences: CookiePreferences;
  hasConsented: boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  updatePreferences: (prefs: Partial<CookiePreferences>) => void;
}

const CookieContext = createContext<CookieContextType | undefined>(undefined);

const DEFAULT_PREFERENCES: CookiePreferences = {
  essential: true,
  analytics: false,
  marketing: false,
  functional: false,
};

export const CookieProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<CookiePreferences>(DEFAULT_PREFERENCES);
  const [hasConsented, setHasConsented] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('cookie-consent');
    if (saved) {
      setPreferences(JSON.parse(saved));
      setHasConsented(true);
    }
  }, []);

  const saveConsent = (prefs: CookiePreferences) => {
    setPreferences(prefs);
    setHasConsented(true);
    localStorage.setItem('cookie-consent', JSON.stringify(prefs));
  };

  const acceptAll = () => {
    const allOn = { essential: true, analytics: true, marketing: true, functional: true };
    saveConsent(allOn);
  };

  const rejectAll = () => {
    const allOff = { ...DEFAULT_PREFERENCES };
    saveConsent(allOff);
  };

  const updatePreferences = (prefs: Partial<CookiePreferences>) => {
    const newPrefs = { ...preferences, ...prefs, essential: true };
    saveConsent(newPrefs);
  };

  return (
    <CookieContext.Provider value={{ preferences, hasConsented, acceptAll, rejectAll, updatePreferences }}>
      {children}
    </CookieContext.Provider>
  );
};

export const useCookies = () => {
  const context = useContext(CookieContext);
  if (context === undefined) {
    throw new Error('useCookies must be used within a CookieProvider');
  }
  return context;
};
