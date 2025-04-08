
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { TopBar } from "@/components/TopBar";
import Index from "./pages/Index";
import LeaveBooking from "./pages/LeaveBooking";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";
import AuthCallback from "./components/AuthCallback";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/auth-callback" element={<AuthCallback />} />
            
            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={
                <>
                  <TopBar />
                  <Index />
                </>
              } />
            </Route>
            
            {/* Protected routes with specific role requirements */}
            <Route element={<ProtectedRoute requiredRole="employee" />}>
              <Route path="/leave" element={
                <>
                  <TopBar />
                  <LeaveBooking />
                </>
              } />
            </Route>
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
