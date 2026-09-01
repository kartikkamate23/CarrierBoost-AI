import { useCallback, useEffect, useMemo, useState } from "react";

type StoredProgress = { completedLessonIds?: string[]; quizScores?: Record<string, number> };

const keyFor = (courseSlug: string) => `careerboost:course-progress:${courseSlug}`;

export function useCourseProgress(courseSlug: string, lessonIds: string[]) {
  const lessonKey = useMemo(() => lessonIds.join("|"), [lessonIds]);
  const validIds = useMemo(() => new Set(lessonIds), [lessonKey]);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [quizScores, setQuizScores] = useState<Record<string, number>>({});

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = JSON.parse(window.localStorage.getItem(keyFor(courseSlug)) ?? "null") as StoredProgress | null;
      setCompletedLessonIds((stored?.completedLessonIds ?? []).filter((id) => validIds.has(id)));
      setQuizScores(stored?.quizScores ?? {});
    } catch {
      setCompletedLessonIds([]);
      setQuizScores({});
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

  const recordQuizScore = useCallback((lessonId: string, score: number) => {
    setQuizScores((current) => {
      const next = { ...current, [lessonId]: score };
      if (typeof window !== "undefined") {
        const existing = JSON.parse(window.localStorage.getItem(keyFor(courseSlug)) ?? "{}") as StoredProgress;
        window.localStorage.setItem(keyFor(courseSlug), JSON.stringify({ ...existing, quizScores: next }));
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
    quizScores,
    recordQuizScore,
  };
}
