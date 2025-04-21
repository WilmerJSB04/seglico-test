import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  AlertTriangle, 
  LogOut,
  Menu,
  ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAppDispatch } from "@/store";
import { logout } from "@/store/slices/auth";
import { useState } from "react";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive?: boolean;
  isExpanded?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  href,
  isActive,
  isExpanded = true
}) => {
  return (
    <Link to={href} className="w-full">
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-2 px-2",
          isActive && "bg-accent",
          !isExpanded && "justify-center px-0"
        )}
        title={label}
      >
        {icon}
        {isExpanded && <span>{label}</span>}
      </Button>
    </Link>
  );
};

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isExpanded, setIsExpanded] = useState(true);
  
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={cn(
      "flex flex-col border-r bg-background transition-all duration-300 shadow-sm",
      isExpanded ? "w-64" : "w-16"
    )}>
      <div className="flex h-14 items-center px-4 border-b justify-between">
        {isExpanded ? (
          <h2 className="text-lg font-bold">SEGLICO</h2>
        ) : (
          <span className="text-lg font-bold mx-auto">S</span>
        )}
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-0 h-8 w-8" 
          onClick={toggleSidebar}
        >
          {isExpanded ? <ChevronLeft size={18} /> : <Menu size={18} />}
        </Button>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          <SidebarItem
            icon={<LayoutDashboard className="h-4 w-4" />}
            label="Dashboard"
            href="/dashboard"
            isActive={location.pathname === "/dashboard"}
            isExpanded={isExpanded}
          />
          <SidebarItem
            icon={<AlertTriangle className="h-4 w-4" />}
            label="Sanciones"
            href="/penalties"
            isActive={location.pathname.includes("/penalties")}
            isExpanded={isExpanded}
          />
        </nav>
      </div>
      <div className="p-4 mt-auto">
        <Separator className="my-2" />
        <Button 
          variant="ghost" 
          className={cn(
            "w-full gap-2",
            isExpanded ? "justify-start px-2" : "justify-center px-0"
          )}
          onClick={handleLogout}
          title="Cerrar sesión"
        >
          <LogOut className="h-4 w-4" />
          {isExpanded && <span>Cerrar sesión</span>}
        </Button>
      </div>
    </div>
  );
}
