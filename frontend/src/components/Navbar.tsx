import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Leaf, Menu, X, BarChart3, Package, GitCompareArrows, Database, FileText, Info, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCompare } from "@/contexts/CompareContext";
import { useAuth } from "@/contexts/AuthContext";

const navLinks = [
  { to: "/", label: "Home", icon: Leaf },
  { to: "/recommend", label: "Recommend", icon: Package },
  { to: "/compare", label: "Compare", icon: GitCompareArrows },
  { to: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { to: "/materials", label: "Materials", icon: Database },
  { to: "/report", label: "Report", icon: FileText },
  { to: "/about", label: "About", icon: Info },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { compareList } = useCompare();
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 eco-glass border-b border-border/50">
      <div className="eco-container">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center group-hover:scale-105 transition-transform">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Eco<span className="text-eco-leaf">Pack</span>AI
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label, icon: Icon }) => {
              const active = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                  {to === "/compare" && compareList.length > 0 && (
                    <span className="ml-1 w-5 h-5 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center">
                      {compareList.length}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Auth area */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-sm text-foreground">
                  <User className="w-3.5 h-3.5 text-eco-leaf" />
                  <span className="max-w-[140px] truncate">{user.email}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={logout} className="text-muted-foreground hover:text-foreground">
                  <LogOut className="w-4 h-4 mr-1" /> Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button asChild variant="ghost" size="sm">
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button asChild size="sm" className="bg-primary text-primary-foreground">
                  <Link to="/register">Register</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-1">
            {navLinks.map(({ to, label, icon: Icon }) => {
              const active = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              );
            })}
            <div className="border-t border-border pt-3 mt-2">
              {user ? (
                <button onClick={() => { logout(); setMobileOpen(false); }}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground w-full hover:text-foreground">
                  <LogOut className="w-4 h-4" /> Logout ({user.email.split("@")[0]})
                </button>
              ) : (
                <div className="flex gap-2 px-3">
                  <Button asChild variant="outline" size="sm" className="flex-1" onClick={() => setMobileOpen(false)}>
                    <Link to="/login">Sign In</Link>
                  </Button>
                  <Button asChild size="sm" className="flex-1 bg-primary text-primary-foreground" onClick={() => setMobileOpen(false)}>
                    <Link to="/register">Register</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
