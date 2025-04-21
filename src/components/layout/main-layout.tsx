import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";
import Header from "./header";
import { Toaster } from "@/components/ui/toaster";

export default function MainLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Fixed sidebar with its own scrolling */}
      <div className="h-screen flex-shrink-0 overflow-y-auto border-r">
        <Sidebar />
      </div>
      
      {/* Main content area with its own scrolling */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
        <Toaster />
      </div>
    </div>
  );
}
