import { Navigate, Route, Routes } from "react-router-dom";

import { ResearchAssistantPage } from "../pages/ResearchAssistantPage/ResearchAssistantPage";

import "../styles/global.css";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<ResearchAssistantPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
