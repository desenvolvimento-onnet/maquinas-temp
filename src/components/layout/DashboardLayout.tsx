import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Toaster } from "@/components/ui/sonner";

export function DashboardLayout() {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="flex flex-col bg-muted/20">
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
      <Toaster richColors position="top-right" />
    </div>
  );
}