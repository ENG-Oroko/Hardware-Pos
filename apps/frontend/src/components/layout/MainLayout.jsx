import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";

/**
 * Shell for every authenticated screen: fixed sidebar + topbar, scrollable
 * content area in between. DashboardLayout wraps this with the
 * Tenant/Branch providers; keep this component focused on layout only.
 */
export default function MainLayout() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
