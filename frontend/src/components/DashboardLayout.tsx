import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  Shield,
  FileText,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

const roleNavItems: Record<string, NavItem[]> = {
  user: [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  ],
  officer: [
    { label: "Dashboard", path: "/officer", icon: FileText },
  ],
  admin: [
    { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { label: "All Complaints", path: "/admin", icon: Users },
  ],
};

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = user ? roleNavItems[user.role] || [] : [];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const roleBadge: Record<string, string> = {
    user: "Citizen",
    officer: "Officer",
    admin: "Admin",
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col gradient-sidebar transition-transform duration-300 lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-5">
          <Shield className="h-7 w-7 text-sidebar-primary" />
          <div>
            <h1 className="text-sm font-bold text-sidebar-accent-foreground">Smart Grievance</h1>
            <p className="text-[10px] font-medium uppercase tracking-wider text-sidebar-muted">Portal</p>
          </div>
          <button
            className="ml-auto text-sidebar-foreground lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Info */}
        <div className="border-b border-sidebar-border px-5 py-4">
          <p className="text-sm font-semibold text-sidebar-accent-foreground truncate">{user?.name}</p>
          <p className="text-xs text-sidebar-muted truncate">{user?.email}</p>
          <span className="mt-1.5 inline-block rounded-full bg-sidebar-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-sidebar-primary">
            {roleBadge[user?.role || "user"]}
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.label}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-sidebar-border p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center border-b border-border bg-card px-4 lg:px-6">
          <button
            className="mr-4 rounded-lg p-2 text-muted-foreground hover:bg-muted lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <h2 className="text-lg font-semibold text-foreground">
            {navItems.find((i) => i.path === location.pathname)?.label || "Dashboard"}
          </h2>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
