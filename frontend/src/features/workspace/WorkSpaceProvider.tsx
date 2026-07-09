import { createContext, ReactNode, useState } from "react";

export type WorkSpaceView = null | "profile" | "security" | "settings";

interface SpaceContextType {
  activeView: WorkSpaceView;
  setActiveView: (view: WorkSpaceView) => void;
  openView: (view: NonNullable<WorkSpaceView>) => void;
  closeView: () => void;
}

export const SpaceContext = createContext<SpaceContextType | undefined>(
  undefined,
);

export function WorkSpaceProvider({ children }: { children: ReactNode }) {
  const [activeView, setActiveView] = useState<WorkSpaceView>(null);

  const openView = (view: NonNullable<WorkSpaceView>) => setActiveView(view);
  const closeView = () => setActiveView(null);

  return (
    <SpaceContext.Provider
      value={{
        activeView,
        setActiveView,
        openView,
        closeView,
      }}
    >
      {children}
    </SpaceContext.Provider>
  );
}
