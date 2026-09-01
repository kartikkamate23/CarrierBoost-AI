import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type HitavirProgress = {
  courseSlug: string;
  status: "in_progress" | "completed";
  progressPercent: number;
  completedAt: string | null;
};

type SyncState = "loading" | "ready" | "signed_out" | "unavailable";

export function useHitavirProgress(courseIds: string[]) {
  const courseKey = [...courseIds].sort().join("|");
  const stableCourseIds = useMemo(() => courseKey.split("|").filter(Boolean), [courseKey]);
  const [items, setItems] = useState<Record<string, HitavirProgress>>({});
  const [syncState, setSyncState] = useState<SyncState>("loading");

  useEffect(() => {
    let active = true;

    const synchronize = async () => {
      const { data: authData } = await supabase.auth.getUser();
      if (!active) return;
      if (!authData.user) {
        setItems({});
        setSyncState("signed_out");
        return;
      }

      const { data, error } = await supabase
        .from("hitavir_course_progress")
        .select("course_slug,status,progress_percent,completed_at")
        .in("course_slug", stableCourseIds);
      if (!active) return;
      if (error) {
        setSyncState("unavailable");
        return;
      }

      setItems(
        Object.fromEntries(
          (data ?? []).map((item) => [
            item.course_slug,
            {
              courseSlug: item.course_slug,
              status: item.status,
              progressPercent: item.progress_percent,
              completedAt: item.completed_at,
            },
          ]),
        ),
      );
      setSyncState("ready");
    };

    void synchronize();
    const timer = window.setInterval(synchronize, 60_000);
    const onFocus = () => void synchronize();
    window.addEventListener("focus", onFocus);
    return () => {
      active = false;
      window.clearInterval(timer);
      window.removeEventListener("focus", onFocus);
    };
  }, [stableCourseIds]);

  return { items, syncState };
}
