import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CalendarDays, CheckCircle2, RotateCcw } from "lucide-react";
import { ProductPage } from "@/components/product-page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  analyzeCareerReadiness,
  createRoadmap,
  getRoadmapPreview,
  type CareerAnalysis,
  type ExperienceLevel,
} from "@/lib/career-engine";
import { loadTargetRole, saveTargetRole } from "@/lib/target-role";

export const Route = createFileRoute("/roadmap")({
  component: RoadmapPage,
  head: () => ({ meta: [{ title: "Career Roadmap | CareerBoost AI" }] }),
});
function getAnalysis() {
  return analyzeCareerReadiness(
    "Summary Data analyst. Skills Python SQL. Experience Built reporting pipelines. Education Bachelor degree. Projects Warehouse model.",
    "Data Engineer",
  );
}
function RoadmapPage() {
  const [analysis, setAnalysis] = useState<CareerAnalysis>(() => getAnalysis());
  const [role, setRole] = useState("Data Engineer");
  const [weeks, setWeeks] = useState(8);
  const [hours, setHours] = useState(6);
  const [level, setLevel] = useState("Intermediate");
  const [style, setStyle] = useState("Hands-on");
  const [plan, setPlan] = useState(() =>
    createRoadmap(analysis, { role, weeks, hoursPerWeek: hours, level, style }),
  );
  useEffect(() => {
    try {
      const value = sessionStorage.getItem("careerboost-guest-analysis");
      if (value) {
        const parsed = JSON.parse(value) as CareerAnalysis;
        setAnalysis(parsed);
        setRole(parsed.role);
        saveTargetRole(parsed.role);
        setPlan(
          createRoadmap(parsed, {
            role: parsed.role,
            weeks: 8,
            hoursPerWeek: 6,
            level: "Intermediate",
            style: "Hands-on",
          }),
        );
      } else setRole(loadTargetRole());
    } catch (error) {
      console.warn("Could not restore guest analysis for roadmap", error);
    }
  }, []);
  const generate = () => {
    const safeWeeks = Math.min(24, Math.max(2, Number.isFinite(weeks) ? weeks : 8));
    const safeHours = Math.min(30, Math.max(2, Number.isFinite(hours) ? hours : 6));
    setWeeks(safeWeeks);
    setHours(safeHours);
    saveTargetRole(role.trim() || analysis.role);
    setPlan(
      createRoadmap(analysis, {
        role: role.trim() || analysis.role,
        weeks: safeWeeks,
        hoursPerWeek: safeHours,
        level,
        style,
      }),
    );
  };
  return (
    <ProductPage
      eyebrow="Career Roadmap"
      title="Your plan should fit your life—not the average learner."
      description="Set your target, availability, experience, and learning preference. CareerBoost maps current evidence gaps to a time-bound sequence of BrihatLabs courses and proof."
    >
      <SavedProofItems analysis={analysis} />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,.72fr)_minmax(0,1.28fr)]">
        <div className="surface-card h-fit p-6 lg:sticky lg:top-20">
          <div className="space-y-4">
            <Field label="Target role" htmlFor="roadmap-role">
              <Input id="roadmap-role" value={role} onChange={(e) => setRole(e.target.value)} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Weeks" htmlFor="roadmap-weeks">
                <Input
                  id="roadmap-weeks"
                  type="number"
                  min={2}
                  max={24}
                  value={weeks}
                  onChange={(e) => setWeeks(Number(e.target.value))}
                />
              </Field>
              <Field label="Hours / week" htmlFor="roadmap-hours">
                <Input
                  id="roadmap-hours"
                  type="number"
                  min={2}
                  max={30}
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                />
              </Field>
            </div>
            <Field label="Experience level" htmlFor="roadmap-level">
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger id="roadmap-level">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Beginner", "Intermediate", "Advanced"].map((x) => (
                    <SelectItem value={x} key={x}>
                      {x}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Learning style" htmlFor="roadmap-style">
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger id="roadmap-style">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Hands-on", "Visual", "Reading-first", "Discussion-led"].map((x) => (
                    <SelectItem value={x} key={x}>
                      {x}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Button onClick={generate} className="w-full">
              <RotateCcw className="mr-2 h-4 w-4" />
              Generate roadmap
            </Button>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-h3 text-foreground">{plan.length}-week plan</h2>
            <Button asChild variant="outline">
              <Link to="/skillpath">Start learning</Link>
            </Button>
          </div>
          <div className="mt-5 space-y-4">
            {plan.map((week) => (
              <article key={week.week} className="surface-card lift p-5">
                <div className="flex justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                      {week.week}
                    </span>
                    <div>
                      <h3 className="font-display text-h3 capitalize text-foreground">
                        {week.focus}
                      </h3>
                      <p className="mt-0.5 text-small text-muted-foreground">
                        {week.hours} hours planned
                      </p>
                    </div>
                  </div>
                  <CalendarDays className="h-5 w-5 text-muted-foreground" />
                </div>
                <ul className="mt-4 grid gap-2.5 text-small text-muted-foreground sm:grid-cols-2">
                  {week.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button asChild variant="outline" size="sm" className="mt-4">
                  <Link to="/courses/$courseId" params={{ courseId: week.course.id }}>
                    View course content
                  </Link>
                </Button>
              </article>
            ))}
          </div>
        </div>
      </div>
    </ProductPage>
  );
}

function SavedProofItems({ analysis }: { analysis: CareerAnalysis }) {
  const [saved, setSaved] = useState<Record<string, ExperienceLevel>>({});
  useEffect(() => {
    try {
      const value = JSON.parse(localStorage.getItem("careerboost-proof-roadmap") ?? "{}");
      setSaved(value && typeof value === "object" ? value : {});
    } catch (error) {
      console.warn("Could not load saved proof roadmap", error);
      setSaved({});
    }
  }, []);
  const items = Object.entries(saved).flatMap(([key, level]) => {
    const gap = analysis.gaps.find((item) => item.key === key);
    return gap ? [getRoadmapPreview(gap, level)] : [];
  });
  if (!items.length) return null;
  return (
    <section className="mb-8 rounded-2xl border border-primary/25 bg-primary/5 p-5">
      <h2 className="font-display text-h3 text-foreground">Personalized proof items</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Saved from your ResumeIQ analysis and retained across refresh and authentication navigation.
      </p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {items.map((item) => (
          <article key={item.skill} className="surface-card p-4">
            <div className="flex justify-between gap-3">
              <h3 className="text-small font-semibold text-foreground">{item.skill}</h3>
              <span className="text-caption normal-case tracking-normal text-primary">
                {item.level}
              </span>
            </div>
            <p className="mt-2 text-small text-muted-foreground">{item.projectType}</p>
            <p className="mt-2 text-small text-muted-foreground">
              {item.estimatedHours} hours · Expected level: {item.expectedLevel}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}
