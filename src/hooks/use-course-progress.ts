import { useCallback, useEffect, useMemo, useState } from "react";

type StoredProgress = { completedLessonIds?: string[] };

const keyFor = (courseSlug: string) => `careerboost:course-progress:${courseSlug}`;

export function useCourseProgress(courseSlug: string, lessonIds: string[]) {
  const lessonKey = useMemo(() => lessonIds.join("|"), [lessonIds]);
  const validIds = useMemo(() => new Set(lessonIds), [lessonKey]);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = JSON.parse(window.localStorage.getItem(keyFor(courseSlug)) ?? "null") as StoredProgress | null;
      setCompletedLessonIds((stored?.completedLessonIds ?? []).filter((id) => validIds.has(id)));
    } catch {
      setCompletedLessonIds([]);
    }
  }, [courseSlug, validIds]);

  const setLessonCompleted = useCallback((lessonId: string, completed: boolean) => {
    setCompletedLessonIds((current) => {
      const next = completed
        ? Array.from(new Set([...current, lessonId]))
        : current.filter((id) => id !== lessonId);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(keyFor(courseSlug), JSON.stringify({ completedLessonIds: next }));
      }
      return next;
    });
  }, [courseSlug]);

  const completedCount = completedLessonIds.length;
  const progressPercent = lessonIds.length ? Math.round((completedCount / lessonIds.length) * 100) : 0;
  return {
    completedLessonIds,
    completedCount,
    progressPercent,
    isCompleted: (lessonId: string) => completedLessonIds.includes(lessonId),
    setLessonCompleted,
  };
}
