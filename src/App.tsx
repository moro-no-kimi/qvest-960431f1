import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import RoleNav from "@/components/RoleNav";
import StudentPage from "./pages/StudentPage";
import LibrarianPage from "./pages/LibrarianPage";
import DistrictPage from "./pages/DistrictPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <RoleNav />
        <Routes>
          <Route path="/" element={<StudentPage />} />
          <Route path="/librarian" element={<LibrarianPage />} />
          <Route path="/district" element={<DistrictPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
