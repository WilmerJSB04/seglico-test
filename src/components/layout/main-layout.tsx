import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";
import Header from "./header";
import { Toaster } from "@/components/ui/toaster";

export default function MainLayout() {
  return (
    <div className="flex h-screen ">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
        <Toaster />
      </div>
    </div>
  );
}
