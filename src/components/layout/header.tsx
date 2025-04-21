import { UserIcon } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAppSelector } from "@/store";

export default function Header() {
  const { user } = useAppSelector(state => state.auth);
  
  // This would normally come from your auth context/store
  const username = typeof user === "string" ? user : "Admin";
  const userInitials = username.split(' ').map(n => n[0]).join('').toUpperCase() || "US";
  
  return (
    <header className="sticky top-0 z-30 flex items-center justify-end px-4 py-2 border-b shadow-sm bg-background">

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative px-3 gap-2 flex py-2 justify-start rounded-full">
              <Avatar className="h-8 w-8 border" >
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium hidden md:block">
                {username}
              </span>
              
            </Button>
            
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem>Configuración</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Cerrar sesión</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* User Name Display */}
        
      </div>
    </header>
  );
}
