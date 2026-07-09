import { useContext } from "react";
import { SpaceContext } from "./WorkSpaceProvider";

export function useWorkSpace() {
  const context = useContext(SpaceContext);

  if (!context) {
    throw new Error("useWorkSpace must be used within a WorkSpaceProvider");
  }

  return context;
}
