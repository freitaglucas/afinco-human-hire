import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import CandidateDashboard from "./pages/CandidateDashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import CandidateProfile from "./pages/CandidateProfile";
import About from "./pages/About";
import Auth from "./pages/Auth";
import CandidateOnboarding from "./pages/CandidateOnboarding";
import RecruiterOnboarding from "./pages/RecruiterOnboarding";
import JobSwipe from "./pages/JobSwipe";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/onboarding/candidate" element={<CandidateOnboarding />} />
          <Route path="/onboarding/recruiter" element={<RecruiterOnboarding />} />
          <Route path="/jobs" element={<CandidateDashboard />} />
          <Route path="/jobs/swipe" element={<JobSwipe />} />
          <Route path="/recruiter" element={<RecruiterDashboard />} />
          <Route path="/profile/:id/:view" element={<CandidateProfile />} />
          <Route path="/about" element={<About />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
