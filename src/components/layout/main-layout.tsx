import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function MainLayout() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="flex items-center justify-end p-4 border-b shadow-sm">
          <ThemeToggle />
        </div>
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
