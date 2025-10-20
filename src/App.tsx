import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Receivables from "./pages/Receivables";
import Investors from "./pages/Investors";
import InvestorDetails from "./pages/InvestorDetails";
import Agent from "./pages/Agent";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/" element={<AppLayout><Home /></AppLayout>} />
          <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
          <Route path="/receivables" element={<AppLayout><Receivables /></AppLayout>} />
          <Route path="/investors" element={<AppLayout><Investors /></AppLayout>} />
          <Route path="/investors/:id" element={<AppLayout><InvestorDetails /></AppLayout>} />
          <Route path="/agent" element={<AppLayout><Agent /></AppLayout>} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
