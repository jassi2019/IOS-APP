import React, { createContext, useContext, useState } from 'react';
import type { TFeatureType } from '@/hooks/api/topics';

type FeatureContextValue = {
  activeFeature: TFeatureType | null;
  setActiveFeature: (feature: TFeatureType | null) => void;
};

const FeatureContext = createContext<FeatureContextValue | undefined>(undefined);

export const FeatureProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeFeature, setActiveFeature] = useState<TFeatureType | null>(null);
  return (
    <FeatureContext.Provider value={{ activeFeature, setActiveFeature }}>
      {children}
    </FeatureContext.Provider>
  );
};

export const useFeature = () => {
  const ctx = useContext(FeatureContext);
  if (!ctx) throw new Error('useFeature must be used within FeatureProvider');
  return ctx;
};
