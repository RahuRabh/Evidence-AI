import { useContext } from "react";
import { ChatContext } from "./ChatProvider"

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error(
      "useChat must be used within an explicit <ChatProvider> layout wrapper",
    );
  }
  return context;
};
