import { Link, useRouter } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Moon, Sun, FileText, LogOut, LayoutDashboard, Shield } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { user, isAdmin, signOut } = useAuth();
  const { theme, toggle } = useTheme();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.navigate({ to: "/" });
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 glass border-b border-glass-border"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-md">
            <FileText className="h-5 w-5" />
          </div>
          <span className="text-gradient">ResumeIQ</span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          {user && (
            <>
              <Link to="/dashboard" className="hidden sm:inline-flex">
                <Button variant="ghost" size="sm"><LayoutDashboard className="h-4 w-4 mr-1.5" /> Dashboard</Button>
              </Link>
              <Link to="/upload" className="hidden sm:inline-flex">
                <Button variant="ghost" size="sm">Upload</Button>
              </Link>
              {isAdmin && (
                <Link to="/admin" className="hidden sm:inline-flex">
                  <Button variant="ghost" size="sm"><Shield className="h-4 w-4 mr-1.5" /> Admin</Button>
                </Link>
              )}
            </>
          )}
          <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          {user ? (
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 sm:mr-1.5" /> <span className="hidden sm:inline">Sign out</span>
            </Button>
          ) : (
            <>
              <Link to="/login"><Button variant="ghost" size="sm">Login</Button></Link>
              <Link to="/signup"><Button size="sm" className="shadow-md btn-glow">Get started</Button></Link>
            </>
          )}
        </nav>
      </div>
    </motion.header>
  );
}
