import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading placeholders that mirror the shape of the content they stand in for.
 *
 * Presentational only. Callers decide when loading is happening; these
 * components never fetch or track anything.
 *
 * Each root carries aria-hidden so screen readers skip the decorative bars —
 * announce loading with a live region alongside them.
 */

export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn("space-y-2", className)} aria-hidden="true">
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton key={index} className={cn("h-3.5", index === lines - 1 ? "w-3/5" : "w-full")} />
      ))}
    </div>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("surface-card p-5", className)} aria-hidden="true">
      <div className="flex items-center justify-between gap-3">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
      <Skeleton className="mt-4 h-8 w-20" />
      <Skeleton className="mt-4 h-1.5 w-full" />
    </div>
  );
}

export function SkeletonMetricGrid({
  count = 4,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 xl:grid-cols-4", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
}

export function SkeletonList({ count = 4, className }: { count?: number; className?: string }) {
  return (
    <div className={cn("space-y-3", className)} aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="surface-card flex items-center gap-3 p-4">
          <Skeleton className="h-9 w-9 shrink-0 rounded-lg" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-3.5 w-1/2" />
            <Skeleton className="h-3 w-1/3" />
          </div>
          <Skeleton className="h-3.5 w-12 shrink-0" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonChart({ className }: { className?: string }) {
  // Fixed heights keep the bars deterministic so SSR and hydration agree.
  const heights = ["40%", "65%", "50%", "80%", "58%", "72%", "45%", "88%"];
  return (
    <div className={cn("surface-card p-6", className)} aria-hidden="true">
      <Skeleton className="h-3.5 w-32" />
      <Skeleton className="mt-2 h-3 w-48" />
      <div className="mt-6 flex h-48 items-end gap-2.5">
        {heights.map((height, index) => (
          <Skeleton key={index} className="flex-1 rounded-t-md" style={{ height }} />
        ))}
      </div>
    </div>
  );
}

export function SkeletonPageHeader({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-3", className)} aria-hidden="true">
      <Skeleton className="h-3 w-28" />
      <Skeleton className="h-9 w-2/3 max-w-md" />
      <Skeleton className="h-4 w-full max-w-xl" />
    </div>
  );
}
