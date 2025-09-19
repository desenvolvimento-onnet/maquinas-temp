import { NavLink } from "react-router-dom";
import { HardDrive, Building, Users, Briefcase } from "lucide-react";

export function Sidebar() {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
      isActive ? "bg-primary/10 text-primary" : "text-muted-foreground"
    }`;

  return (
    <div className="hidden border-r bg-background md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <a href="/" className="flex items-center gap-2 font-semibold">
            <Briefcase className="h-6 w-6 text-primary" />
            <span className="">Gestão de Ativos</span>
          </a>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            <NavLink to="/maquinas" className={navLinkClass}>
              <HardDrive className="h-4 w-4" />
              Máquinas
            </NavLink>
            <NavLink to="/cidades" className={navLinkClass}>
              <Building className="h-4 w-4" />
              Cidades
            </NavLink>
            <NavLink to="/setores" className={navLinkClass}>
              <Building className="h-4 w-4" />
              Setores
            </NavLink>
             <NavLink to="/pessoas" className={navLinkClass}>
              <Users className="h-4 w-4" />
              Supervisores & Responsáveis
            </NavLink>
          </nav>
        </div>
      </div>
    </div>
  );
}