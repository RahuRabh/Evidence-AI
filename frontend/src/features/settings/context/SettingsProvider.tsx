import { createContext, ReactNode, useState } from "react";

export type SettingsView = null | "profile" | "security" | "settings";

interface SettingsContextType {
  activeView: SettingsView;
  setActiveView: (view: SettingsView) => void;
  openView: (view: NonNullable<SettingsView>) => void;
  closeView: () => void;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [activeView, setActiveView] = useState<SettingsView>(null);

  const openView = (view: NonNullable<SettingsView>) => setActiveView(view);
  const closeView = () => setActiveView(null);

  return (
    <SettingsContext.Provider
      value={{
        activeView,
        setActiveView,
        openView,
        closeView,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
