import { useContext } from "react";
import { SettingsContext } from "./SettingsProvider";

export function useSetting() {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error("useSetting must be used within a WorkSpaceProvider");
  }

  return context;
}
