import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { MaquinasPage } from "./pages/MaquinasPage";
import { CidadesPage } from "./pages/CidadesPage";
import { SetoresPage } from "./pages/SetoresPage";
import { PessoasPage } from "./pages/PessoasPage";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Navigate to="/maquinas" />} />
            <Route path="/maquinas" element={<MaquinasPage />} />
            <Route path="/cidades" element={<CidadesPage />} />
            <Route path="/setores" element={<SetoresPage />} />
            <Route path="/pessoas" element={<PessoasPage />} />
            <Route path="*" element={<Navigate to="/maquinas" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}