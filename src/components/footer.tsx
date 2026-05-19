import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/50 py-10">
      <div className="container mx-auto flex flex-col gap-3 px-4 text-center text-sm text-muted-foreground sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} ResumeIQ. AI-powered career intelligence.</p>
        <div className="flex justify-center gap-4">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <Link to="/login" className="hover:text-foreground">Login</Link>
          <Link to="/signup" className="hover:text-foreground">Sign up</Link>
        </div>
      </div>
    </footer>
  );
}
