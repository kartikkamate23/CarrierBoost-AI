import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Shield,
  Sparkles,
  Sun,
  Upload,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { BrandMark, BrandWordmark } from "@/components/shell/brand-mark";
import { landingSections, productNav, resourcesNav } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Tracks whether the page has scrolled past the top, so the header can swap
 * from transparent to a blurred, bordered bar. Presentational state only.
 */
function useScrolled(threshold = 8) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return scrolled;
}

const linkClass =
  "inline-flex h-9 items-center rounded-lg px-3 text-small font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

/**
 * The public site header.
 *
 * Every destination below already exists in src/routes. Authentication state,
 * the admin check and sign-out all come from the existing useAuth hook and are
 * called exactly as before — only the presentation changed.
 */
export function SiteHeader() {
  const { user, isAdmin, signOut } = useAuth();
  const { theme, toggle } = useTheme();
  const scrolled = useScrolled();

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300",
        scrolled
          ? "border-border bg-background/80 shadow-sm backdrop-blur-xl"
          : "border-transparent bg-background/0",
      )}
    >
      <a
        href="#main-content"
        className="sr-only z-[100] rounded-md bg-primary px-4 py-3 text-primary-foreground focus:not-sr-only focus:fixed focus:left-3 focus:top-3"
      >
        Skip to main content
      </a>

      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
        <Link
          to="/"
          className="flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="CareerBoost AI home"
        >
          <BrandMark />
          <BrandWordmark className="hidden sm:inline" />
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary navigation">
          <NavDropdown label="Product" items={productNav} />
          <Link to="/" hash={landingSections.features} className={linkClass}>
            Features
          </Link>
          <Link to="/" hash={landingSections.howItWorks} className={linkClass}>
            How it works
          </Link>
          <Link to="/pricing" className={linkClass}>
            Pricing
          </Link>
          <NavDropdown label="Resources" items={resourcesNav} />
        </nav>

        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            aria-pressed={theme === "dark"}
            className="h-9 w-9"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Moon className="h-4 w-4" aria-hidden="true" />
            )}
          </Button>

          <div className="hidden lg:flex lg:items-center lg:gap-2">
            {user ? (
              <>
                <Button asChild variant="ghost" size="sm" className="h-9">
                  <Link to="/dashboard">
                    <LayoutDashboard className="h-4 w-4" aria-hidden="true" /> Dashboard
                  </Link>
                </Button>
                <AccountMenu isAdmin={isAdmin} onSignOut={() => void signOut()} />
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm" className="h-9">
                  <Link to="/login">Log in</Link>
                </Button>
                <Button asChild size="sm" className="btn-glow h-9 shadow-sm">
                  <Link to="/signup">Get started free</Link>
                </Button>
              </>
            )}
          </div>

          <MobileNav
            isAdmin={isAdmin}
            isSignedIn={Boolean(user)}
            onSignOut={() => void signOut()}
          />
        </div>
      </div>
    </header>
  );
}

function NavDropdown({
  label,
  items,
}: {
  label: string;
  items: typeof productNav | typeof resourcesNav;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={cn(linkClass, "gap-1 data-[state=open]:text-foreground")}>
        {label}
        <ChevronDown
          className="h-3.5 w-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180"
          aria-hidden="true"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" sideOffset={10} className="w-80 p-2">
        {items.map((item) => (
          <DropdownMenuItem key={item.to} asChild className="cursor-pointer rounded-lg p-0">
            <Link to={item.to} className="flex flex-col items-start gap-0.5 px-3 py-2.5">
              <span className="text-small font-semibold text-foreground">{item.label}</span>
              <span className="text-small text-muted-foreground">{item.description}</span>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AccountMenu({ isAdmin, onSignOut }: { isAdmin: boolean; onSignOut: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 gap-1.5">
          Account
          <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={10} className="w-56">
        <DropdownMenuLabel>Your workspace</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link to="/upload">
            <Upload className="h-4 w-4" aria-hidden="true" /> New analysis
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link to="/tools/cover-letter" search={{ role: "" }}>
            <Sparkles className="h-4 w-4" aria-hidden="true" /> Cover letter
          </Link>
        </DropdownMenuItem>
        {isAdmin ? (
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link to="/admin">
              <Shield className="h-4 w-4" aria-hidden="true" /> Admin
            </Link>
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={onSignOut} className="cursor-pointer">
          <LogOut className="h-4 w-4" aria-hidden="true" /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const mobileLinkClass =
  "flex items-center justify-between rounded-lg px-4 py-3 text-small font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function MobileNav({
  isAdmin,
  isSignedIn,
  onSignOut,
}: {
  isAdmin: boolean;
  isSignedIn: boolean;
  onSignOut: () => void;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 lg:hidden" aria-label="Open menu">
          <Menu className="h-5 w-5" aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-[min(23rem,92vw)] flex-col p-0">
        <SheetHeader className="border-b p-5 text-left">
          <SheetTitle className="flex items-center gap-2.5">
            <BrandMark className="h-8 w-8" />
            <BrandWordmark />
          </SheetTitle>
          <SheetDescription className="text-small">
            Navigate career tools and account options.
          </SheetDescription>
        </SheetHeader>

        <div className="scrollbar-slim flex-1 overflow-y-auto p-4">
          <MobileGroup title="Product">
            {productNav.map((item) => (
              <SheetClose asChild key={item.to}>
                <Link to={item.to} className={mobileLinkClass}>
                  {item.label}
                </Link>
              </SheetClose>
            ))}
          </MobileGroup>

          <MobileGroup title="Pricing">
            <SheetClose asChild>
              <Link to="/pricing" className={mobileLinkClass}>
                Pricing
              </Link>
            </SheetClose>
          </MobileGroup>

          <MobileGroup title="Resources">
            {resourcesNav.map((item) => (
              <SheetClose asChild key={item.to}>
                <Link to={item.to} className={mobileLinkClass}>
                  {item.label}
                </Link>
              </SheetClose>
            ))}
          </MobileGroup>

          {isSignedIn ? (
            <MobileGroup title="Workspace">
              <SheetClose asChild>
                <Link to="/dashboard" className={mobileLinkClass}>
                  Dashboard
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link to="/upload" className={mobileLinkClass}>
                  New analysis
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link to="/tools/cover-letter" search={{ role: "" }} className={mobileLinkClass}>
                  Cover letter
                </Link>
              </SheetClose>
              {isAdmin ? (
                <SheetClose asChild>
                  <Link to="/admin" className={mobileLinkClass}>
                    Admin
                  </Link>
                </SheetClose>
              ) : null}
            </MobileGroup>
          ) : null}
        </div>

        <div className="border-t p-4">
          {isSignedIn ? (
            <Button className="w-full" variant="outline" onClick={onSignOut}>
              <LogOut className="h-4 w-4" aria-hidden="true" /> Sign out
            </Button>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <SheetClose asChild>
                <Button asChild variant="outline">
                  <Link to="/login">Log in</Link>
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button asChild>
                  <Link to="/signup">Get started</Link>
                </Button>
              </SheetClose>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function MobileGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5 last:mb-0">
      <p className="px-4 pb-1.5 text-caption uppercase text-muted-foreground">{title}</p>
      <nav className="grid gap-0.5" aria-label={title}>
        {children}
      </nav>
    </div>
  );
}
