import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button";

const storageKey = "careerboost:launch-popup-dismissed";

export function LaunchPopup() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || window.sessionStorage.getItem(storageKey)) return;
    const timer = window.setTimeout(() => setOpen(true), 1400);
    return () => window.clearTimeout(timer);
  }, []);
  const close = () => {
    setOpen(false);
    window.sessionStorage.setItem(storageKey, "1");
  };
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="launch-popup-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-primary/20 bg-background p-7 shadow-2xl"
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close popup"
              className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
              CareerBoost AI
            </p>
            <h2 id="launch-popup-title" className="mt-3 font-display text-h3 text-foreground">
              Turn your next gap into momentum.
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Get a transparent resume score, a role-specific roadmap, and BrihatLabs courses that
              move you toward your next interview.
            </p>
            <Link
              to="/analyze"
              onClick={close}
              className={buttonVariants({ className: "mt-6 w-full" })}
            >
              Start your free analysis <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={close}
              className="mt-3 w-full text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Maybe later
            </button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
