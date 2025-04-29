
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { AppWrapper } from "./components/AppWrapper";
import Index from "./pages/Index";
import LeaveBooking from "./pages/LeaveBooking";
import NotFound from "./pages/NotFound";

// Create a context to pass props from micro-frontend host
import React from "react";

// Create QueryClient instance
const queryClient = new QueryClient();

// Navigation handler to support both standalone and embedded modes
const NavigationHandler = ({ basePath = "" }) => {
  const navigate = useNavigate();
  
  // Register navigation event listener for parent app communication
  useEffect(() => {
    const handleNavigationEvent = (event: CustomEvent) => {
      const path = event.detail.path;
      if (path) {
        navigate(path.replace(basePath, ""));
      }
    };

    window.addEventListener("navigate", handleNavigationEvent as EventListener);
    
    return () => {
      window.removeEventListener("navigate", handleNavigationEvent as EventListener);
    };
  }, [navigate, basePath]);
  
  return null;
};

interface AppProps {
  basePath?: string;
  theme?: string;
  onNavigate?: (path: string) => void;
  useCustomWrapper?: boolean;
  wrapperProps?: {
    customStyle?: string;
    logo?: string;
    headerTitle?: string;
  };
}

const App: React.FC<AppProps> = ({ 
  basePath = "", 
  theme = "light", 
  onNavigate,
  useCustomWrapper = false,
  wrapperProps = {}
}) => {
  // Set theme class on body if provided
  useEffect(() => {
    if (theme) {
      document.body.className = theme;
    }
    
    return () => {
      if (theme) {
        document.body.classList.remove(theme);
      }
    };
  }, [theme]);

  const AppContent = (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename={basePath}>
          <NavigationHandler basePath={basePath} />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/leave" element={<LeaveBooking />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );

  // Conditionally wrap the app content with the custom wrapper
  return useCustomWrapper ? (
    <AppWrapper {...wrapperProps}>
      {AppContent}
    </AppWrapper>
  ) : AppContent;
};

export default App;
