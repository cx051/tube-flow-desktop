
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { useState, useEffect } from "react";
import { useLocalStorage } from "../hooks/use-local-storage";

export const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [uiScale, setUiScale] = useLocalStorage("ui-scale", 1);
  
  // Apply the UI scale from settings
  useEffect(() => {
    document.documentElement.style.setProperty(
      "transform", 
      `scale(${uiScale})`
    );
    document.documentElement.style.setProperty(
      "transform-origin", 
      "top left"
    );
  }, [uiScale]);

  return (
    <div className="h-screen flex overflow-hidden gradient-bg">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <main 
        className={`flex-1 transition-all duration-300 ease-in-out overflow-y-auto custom-scrollbar relative ${
          sidebarOpen ? "ml-64" : "ml-16"
        }`}
      >
        <div className="spotlight absolute inset-0 pointer-events-none"></div>
        <div className="container py-4 px-4 md:py-8 md:px-6">
          <Outlet context={{ uiScale, setUiScale }} />
        </div>
      </main>
    </div>
  );
};
