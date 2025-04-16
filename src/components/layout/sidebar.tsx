import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  AlertTriangle, 
  Users, 
  Settings,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAppDispatch } from "@/store";
import { logout } from "@/store/slices/auth";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  href,
  isActive
}) => {
  return (
    <Link to={href} className="w-full">
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-2 px-2",
          isActive && "bg-accent"
        )}
      >
        {icon}
        <span>{label}</span>
      </Button>
    </Link>
  );
};

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="flex h-full w-64 flex-col border-r bg-background">
      <div className="flex h-14 items-center px-4 border-b">
        <h2 className="text-lg font-semibold">Seglico</h2>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          <SidebarItem
            icon={<LayoutDashboard className="h-4 w-4" />}
            label="Dashboard"
            href="/dashboard"
            isActive={location.pathname === "/dashboard"}
          />
          <SidebarItem
            icon={<AlertTriangle className="h-4 w-4" />}
            label="Sanciones"
            href="/penalties"
            isActive={location.pathname.includes("/penalties")}
          />
          <SidebarItem
            icon={<Users className="h-4 w-4" />}
            label="Usuarios"
            href="/users"
            isActive={location.pathname.includes("/users")}
          />
          <SidebarItem
            icon={<Settings className="h-4 w-4" />}
            label="Configuración"
            href="/settings"
            isActive={location.pathname.includes("/settings")}
          />
        </nav>
      </div>
      <div className="p-4 mt-auto">
        <Separator className="my-2" />
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-2 px-2"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          <span>Cerrar sesión</span>
        </Button>
      </div>
    </div>
  );
}
