/**
 * The site header now lives in components/shell/site-header.tsx.
 *
 * This module is kept as the stable import path — every page that already
 * imports { Navbar } continues to work unchanged, with identical props (none)
 * and identical behavior.
 */
export { SiteHeader as Navbar } from "@/components/shell/site-header";
