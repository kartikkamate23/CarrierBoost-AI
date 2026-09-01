/**
 * The site footer now lives in components/shell/site-footer.tsx.
 *
 * This module is kept as the stable import path — every page that already
 * imports { Footer } continues to work unchanged, with identical props (none)
 * and identical behavior.
 */
export { SiteFooter as Footer } from "@/components/shell/site-footer";
