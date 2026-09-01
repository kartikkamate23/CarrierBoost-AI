export const HITAVIR_PORTAL_URL = "https://learn.hitavirtech.com/";

export type HitavirCourse = {
  id: string;
  title: string;
  summary: string;
  duration: string;
  categories: string[];
  skills: string[];
  url: string;
  source: "Hitavir Tech portal" | "Hitavir Tech published codelab";
  level?: string;
  estimatedHours?: string;
  modules?: number;
  lessons?: number;
  labels?: string[];
  featured?: boolean;
};

export const hitavirCoursePath = (id: string) => `/courses/${id}`;

// Titles, summaries, ordering, and durations are sourced from Hitavir Tech's
// public codelabs configuration and published course metadata. The portal is
// enrollment-gated, so the supplied portal course is intentionally limited to
// metadata that is publicly verifiable from its URL.
export const hitavirCourses: HitavirCourse[] = [
  {
    id: "learn-like-a-top-performer",
    title: "Learn Like a Top Performer",
    summary:
      "The operational playbook for learning data engineering — the 11 guidelines, a 7-step debugging protocol, rebuild challenges, and a personal learning system you build as a Git portfolio.",
    duration: "~2 h",
    categories: ["Learning skills", "Career foundations"],
    skills: ["learning", "study strategy", "performance"],
    url: "https://learn.hitavirtech.com/courses/learn-like-a-top-performer",
    source: "Hitavir Tech portal",
    level: "Beginner",
    estimatedHours: "~2 h",
    modules: 6,
    lessons: 25,
    labels: ["Learning system", "Career"],
    featured: true,
  },
  {
    id: "pyspark-intro",
    title: "PySpark for Data Engineering",
    summary:
      "Learn Apache Spark and PySpark foundations for distributed data processing and production data-engineering workloads.",
    duration: "Self-paced",
    categories: ["PySpark", "Apache Spark", "Data Engineering"],
    skills: ["spark", "pyspark", "distributed processing", "data pipeline"],
    url: "https://learn.hitavirtech.com/courses/pyspark/intro",
    source: "Hitavir Tech portal",
  },
  {
    id: "windows-setup",
    title: "DE Environment Setup on Windows 11",
    summary:
      "Build a professional data engineering workstation from scratch — terminal, Git, Python, Spark, VS Code, GitHub, Databricks CLI, and Docker.",
    duration: "~45 min",
    categories: ["Data Engineering", "Setup"],
    skills: ["windows", "git", "python", "vscode", "spark", "aws", "databricks"],
    url: "https://learn.hitavirtech.com/courses/windows-setup",
    source: "Hitavir Tech portal",
    level: "Beginner",
    estimatedHours: "~45 min",
    modules: 4,
    lessons: 11,
    labels: ["Windows 11", "Setup"],
  },
  {
    id: "git-github-basics",
    title: "Git & GitHub Basics (Git Bash)",
    summary:
      "Version control from zero: repositories, commits, branching, merging, GitHub remotes, and a real-world workflow simulation — all from the Git Bash command line.",
    duration: "~2 h",
    categories: ["Git", "GitHub", "Version Control"],
    skills: ["git", "github", "version control", "collaboration"],
    url: "https://learn.hitavirtech.com/courses/git-github-basics",
    source: "Hitavir Tech portal",
    level: "Beginner",
    estimatedHours: "~2 h",
    modules: 6,
    lessons: 19,
    labels: ["Git", "GitHub"],
  },
  {
    id: "github-ultimate",
    title: "GitHub Ultimate: Master Git & GitHub",
    summary:
      "Zero to expert — build a real portfolio repo while mastering branching, pull requests, rebasing, CI/CD with GitHub Actions, and professional team workflows.",
    duration: "~4 h",
    categories: ["Git", "GitHub", "DevOps"],
    skills: ["git", "github", "collaboration", "ci/cd", "open source"],
    url: "https://learn.hitavirtech.com/courses/github-ultimate",
    source: "Hitavir Tech portal",
    level: "Beginner–Expert",
    estimatedHours: "~4 h",
  },
  {
    id: "linux-basics",
    title: "Linux Basics (Git Bash)",
    summary:
      "Master the Linux command line with Git Bash on Windows — navigate, manage files, grep logs, chain pipes, and run a real DevOps workflow. No Linux install required.",
    duration: "~2.5 h",
    categories: ["Linux", "Command Line", "DevOps"],
    skills: ["linux", "bash", "terminal", "command line", "devops"],
    url: "https://learn.hitavirtech.com/courses/linux-basics",
    source: "Hitavir Tech portal",
    level: "Beginner–Intermediate",
    estimatedHours: "~2.5 h",
    modules: 6,
    lessons: 25,
    labels: ["Linux", "CLI"],
  },
  {
    id: "python-data-engineering",
    title: "Python Programming for Data Engineering",
    summary:
      "Learn Python from beginner to intermediate through real data-engineering examples, files, data structures, ETL, Pandas, and Parquet.",
    duration: "5 hours",
    categories: ["Python", "Data Engineering", "Programming"],
    skills: ["python", "etl", "pandas", "parquet", "data pipeline"],
    url: "https://learn.hitavirtech.com/courses/python-data-engineering",
    source: "Hitavir Tech portal",
    featured: true,
  },
  {
    id: "mysql-workbench-setup",
    title: "MySQL Workbench Setup (Windows)",
    summary:
      "Install MySQL Server and MySQL Workbench on Windows from scratch, connect as root, run your first SQL queries, and import a real database from a .sql file.",
    duration: "~1 h",
    categories: ["SQL", "Database", "Setup"],
    skills: ["mysql", "sql", "database", "windows"],
    url: "https://learn.hitavirtech.com/courses/mysql-workbench-setup",
    source: "Hitavir Tech portal",
    level: "Beginner",
    estimatedHours: "~1 h",
  },
  {
    id: "sql-for-data-engineering",
    title: "SQL for Data Engineering: Beginner to Expert",
    summary:
      "Move from zero SQL to production-ready MySQL using an e-commerce dataset, analytical queries, ETL patterns, and a star-schema capstone.",
    duration: "10 hours",
    categories: ["SQL", "Data Engineering", "MySQL"],
    skills: ["sql", "mysql", "etl", "data modelling", "warehouse"],
    url: "https://learn.hitavirtech.com/courses/sql-for-data-engineering",
    source: "Hitavir Tech portal",
    featured: true,
  },
  {
    id: "aws-analytics-part1",
    title: "Fundamentals of Analytics on AWS - Part 1",
    summary: "Learn analytics concepts, the 5 Vs of big data, and how they map to AWS services.",
    duration: "5 hours",
    categories: ["AWS", "Analytics", "Cloud"],
    skills: ["aws", "analytics", "big data", "s3", "glue", "athena", "redshift"],
    url: "https://learn.hitavirtech.com/courses/aws-analytics-part1",
    source: "Hitavir Tech portal",
  },
  {
    id: "aws-analytics-part2",
    title: "Fundamentals of Analytics on AWS - Part 2",
    summary:
      "Learn data lakes, data warehouses, lakehouses, and modern data architecture using AWS services.",
    duration: "5 hours",
    categories: ["AWS", "Analytics", "Data Engineering"],
    skills: ["aws", "data lake", "warehouse", "lakehouse", "glue", "athena", "redshift"],
    url: "https://learn.hitavirtech.com/courses/aws-analytics-part2",
    source: "Hitavir Tech portal",
  },
  {
    id: "azure-analytics-part1",
    title: "Fundamentals of Analytics on Azure - Part 1",
    summary:
      "Learn analytics concepts, the 5 Vs of big data, and how they map to Azure analytics services.",
    duration: "5 hours",
    categories: ["Azure", "Analytics", "Cloud"],
    skills: ["azure", "analytics", "big data", "data factory", "synapse", "power bi"],
    url: "https://learn.hitavirtech.com/courses/azure-analytics-part1",
    source: "Hitavir Tech portal",
  },
  {
    id: "azure-analytics-part2",
    title: "Fundamentals of Analytics on Azure - Part 2",
    summary:
      "Learn data lakes, data warehouses, lakehouses, Microsoft Fabric, and modern Azure data architecture.",
    duration: "5 hours",
    categories: ["Azure", "Analytics", "Data Engineering"],
    skills: ["azure", "data lake", "warehouse", "lakehouse", "fabric", "databricks"],
    url: "https://learn.hitavirtech.com/courses/azure-analytics-part2",
    source: "Hitavir Tech portal",
  },
  {
    id: "data-modelling",
    title: "Data Modelling for Data Engineering",
    summary:
      "Progress from beginner to advanced data modelling with star schemas, snowflake schemas, dimensional modelling, SCD, Data Vault, SQL, and PySpark.",
    duration: "10 hours",
    categories: ["Data Engineering", "Data Modelling", "SQL"],
    skills: ["data modelling", "star schema", "snowflake", "scd", "data vault", "warehouse"],
    url: "https://learn.hitavirtech.com/courses/data-modelling",
    source: "Hitavir Tech portal",
  },
  {
    id: "data-engineering-on-aws",
    title: "Data Engineering on AWS",
    summary:
      "Build an end-to-end HitaVir Retail pipeline across S3, a Medallion lake, Glue ETL with PySpark, Athena, Redshift, orchestration, security, monitoring, and a capstone.",
    duration: "12 hours",
    categories: ["AWS", "Data Engineering", "Foundations"],
    skills: [
      "aws",
      "data pipeline",
      "etl",
      "spark",
      "pyspark",
      "s3",
      "glue",
      "athena",
      "redshift",
      "orchestration",
      "security",
    ],
    url: "https://learn.hitavirtech.com/courses/data-engineering-on-aws",
    source: "Hitavir Tech portal",
    featured: true,
  },
];

const legacyCourseIds: Record<string, string> = {
  "windows-de-setup": "windows-setup",
  "git-github-basics-gitbash": "git-github-basics",
  "aws-analytics-fundamentals-part1": "aws-analytics-part1",
  "aws-analytics-fundamentals-part2": "aws-analytics-part2",
  "azure-analytics-fundamentals-part1": "azure-analytics-part1",
  "azure-analytics-fundamentals-part2": "azure-analytics-part2",
};

export function findHitavirCourse(courseId: string) {
  const resolvedId = legacyCourseIds[courseId] ?? courseId;
  return hitavirCourses.find((course) => course.id === resolvedId);
}

const skillAliases: Record<string, string[]> = {
  airflow: ["orchestration", "data pipeline", "aws"],
  api: ["python", "git"],
  docker: ["windows", "devops"],
  kafka: ["data pipeline", "big data"],
  "power bi": ["power bi", "analytics", "azure"],
  rag: ["learning", "python"],
  llm: ["learning", "python"],
};

type RoleProfile = {
  patterns: RegExp;
  signals: string[];
  preferred: string[];
};

const roleProfiles: RoleProfile[] = [
  {
    patterns: /data engineer|etl|pipeline|big data|spark|databricks/i,
    signals: [
      "data engineering",
      "etl",
      "pipeline",
      "spark",
      "pyspark",
      "sql",
      "python",
      "warehouse",
      "data modelling",
      "aws",
      "azure",
    ],
    preferred: [
      "learn-like-a-top-performer",
      "git-github-basics",
      "linux-basics",
      "github-ultimate",
      "mysql-workbench-setup",
      "windows-setup",
      "python-data-engineering",
      "sql-for-data-engineering",
      "pyspark-intro",
      "data-modelling",
      "aws-analytics-part1",
      "aws-analytics-part2",
      "data-engineering-on-aws",
    ],
  },
  {
    patterns:
      /data analyst|business analyst|analytics|business intelligence|power bi|bi developer/i,
    signals: [
      "analytics",
      "sql",
      "mysql",
      "power bi",
      "data modelling",
      "warehouse",
      "python",
      "aws",
      "azure",
    ],
    preferred: [
      "learn-like-a-top-performer",
      "mysql-workbench-setup",
      "sql-for-data-engineering",
      "data-modelling",
      "python-data-engineering",
      "azure-analytics-part1",
    ],
  },
  {
    patterns: /machine learning|\bml\b|artificial intelligence|\bai\b|genai|llm|data scientist/i,
    signals: ["python", "analytics", "big data", "git", "github", "linux", "aws", "azure"],
    preferred: [
      "learn-like-a-top-performer",
      "git-github-basics",
      "linux-basics",
      "python-data-engineering",
      "aws-analytics-part1",
      "azure-analytics-part1",
    ],
  },
  {
    patterns: /devops|cloud engineer|site reliability|\bsre\b|platform engineer/i,
    signals: ["devops", "ci/cd", "aws", "azure", "linux", "git", "github", "security"],
    preferred: [
      "git-github-basics",
      "linux-basics",
      "github-ultimate",
      "windows-setup",
      "aws-analytics-part1",
      "azure-analytics-part1",
    ],
  },
  {
    patterns: /software|backend|frontend|full.?stack|java|python developer|web developer/i,
    signals: ["git", "github", "linux", "python", "sql", "mysql", "database", "devops"],
    preferred: [
      "git-github-basics",
      "linux-basics",
      "github-ultimate",
      "mysql-workbench-setup",
      "sql-for-data-engineering",
      "python-data-engineering",
    ],
  },
];

function courseSearchText(course: HitavirCourse) {
  return [course.title, ...course.categories, ...course.skills].join(" ").toLowerCase();
}

export function getCoursesForTargetRole(targetRole: string, limit = 6): HitavirCourse[] {
  const role = targetRole.trim().toLowerCase();
  const profile = roleProfiles.find((item) => item.patterns.test(role));
  const roleTerms = role.split(/[^a-z0-9+#.]+/).filter((term) => term.length > 2);
  const signals = profile?.signals ?? roleTerms;
  const preferred = profile?.preferred ?? [
    "learn-like-a-top-performer",
    "git-github-basics",
    "linux-basics",
  ];

  const ranked = hitavirCourses
    .map((course, index) => {
      const text = courseSearchText(course);
      const matches = signals.filter((signal) => text.includes(signal)).length;
      const preferredIndex = preferred.indexOf(course.id);
      return {
        course,
        index,
        score: matches * 10 + (preferredIndex >= 0 ? 100 - preferredIndex : 0),
      };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map(({ course }) => course);

  const fallbacks = preferred
    .map((id) => hitavirCourses.find((course) => course.id === id))
    .filter((course): course is HitavirCourse => Boolean(course));
  return [...fallbacks, ...ranked]
    .filter(
      (course, index, courses) => courses.findIndex((item) => item.id === course.id) === index,
    )
    .slice(0, Math.max(1, limit));
}

export function recommendHitavirCourses(
  skillKeys: string[],
  limit = 6,
  targetRole = "",
): HitavirCourse[] {
  const wanted = new Set(
    skillKeys.flatMap((key) => [key.toLowerCase(), ...(skillAliases[key.toLowerCase()] ?? [])]),
  );
  const roleCourses = targetRole
    ? getCoursesForTargetRole(targetRole, hitavirCourses.length)
    : hitavirCourses;
  const ranked = roleCourses
    .map((course, index) => {
      const matches = course.skills.reduce(
        (total, skill) =>
          total +
          (Array.from(wanted).some(
            (wantedSkill) => skill.includes(wantedSkill) || wantedSkill.includes(skill),
          )
            ? 1
            : 0),
        0,
      );
      return {
        course,
        index,
        score: matches + (matches > 0 && course.featured ? 0.25 : 0),
      };
    })
    .filter(({ score, course }) => score > 0 || course.id === "learn-like-a-top-performer")
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map(({ course }) => course);

  const combined = [...ranked, ...roleCourses];
  return combined
    .filter(
      (course, index, courses) => courses.findIndex((item) => item.id === course.id) === index,
    )
    .slice(0, limit);
}

export const featuredHitavirCourses = hitavirCourses.filter((course) => course.featured);

export const hitavirCourseOutlines: Record<string, string[]> = {
  "learn-like-a-top-performer": [
    "Course overview",
    "Learning strategy",
    "Practice and reflection",
    "Complete enrolled activities in the Hitavir Tech portal",
  ],
  "pyspark-intro": [
    "Apache Spark and distributed processing fundamentals",
    "PySpark DataFrames and transformations",
    "Reading, cleaning, and writing engineering datasets",
    "Joins, aggregations, partitioning, and performance",
    "Build a practical PySpark data pipeline",
  ],
  "windows-setup": [
    "Windows Terminal",
    "Git and Git Bash",
    "Python 3.11 and Java 11",
    "Apache Spark",
    "VS Code, GitHub, Databricks CLI, and Docker Desktop",
    "Final verification checklist",
  ],
  "git-github-basics": [
    "Git and GitHub introduction",
    "Git Bash setup",
    "Repositories, commits, and history",
    "Branches and merges",
    "Push, pull, and clone",
    "Real-world workflow and mini project",
  ],
  "github-ultimate": [
    "Git installation and configuration",
    "Staging, branches, merges, and conflicts",
    "Remotes, pull requests, and code reviews",
    "Rebase, cherry-pick, stash, tags, and releases",
    "GitHub Actions and open-source contribution",
    "Collaboration simulation and interview preparation",
  ],
  "linux-basics": [
    "Git Bash installation and shell fundamentals",
    "Files, directories, navigation, and permissions",
    "Search, find, pipes, and environment variables",
    "Project simulation and troubleshooting",
    "Command cheat sheet and interview questions",
  ],
  "python-data-engineering": [
    "Environment setup and PEP 8",
    "Variables, data types, control flow, and functions",
    "Data structures and file handling",
    "Error handling, logging, and pandas",
    "Complete ETL mini project",
    "Best practices, debugging, and interview preparation",
  ],
  "mysql-workbench-setup": [
    "Download and install MySQL",
    "Configure MySQL Server",
    "Connect with MySQL Workbench",
    "Run first SQL queries",
    "Import a database and troubleshoot setup",
  ],
  "sql-for-data-engineering": [
    "SQL in data engineering and professional style",
    "MySQL setup and seed data",
    "Queries, tables, constraints, and data changes",
    "Aggregations, joins, subqueries, views, and indexes",
    "Cleaning, window functions, CTEs, and optimization",
    "End-to-end sales reporting capstone",
    "Python, Airflow, Spark SQL, and Databricks integration",
  ],
  "aws-analytics-part1": [
    "Analytics concepts and the 5 Vs of big data",
    "AWS analytics service families",
    "Volume, variety, velocity, veracity, and value",
    "First AWS analytics pipeline lab",
    "Self-assessment and cheat sheet",
  ],
  "aws-analytics-part2": [
    "Data lakes and data warehouses",
    "Modern data architecture",
    "AWS services and common use cases",
    "Reference architecture",
    "Quiz, resources, and cheat sheet",
  ],
  "azure-analytics-part1": [
    "Analytics concepts and the 5 Vs of big data",
    "Azure analytics service families",
    "Volume, variety, velocity, veracity, and value",
    "First Azure analytics pipeline lab",
    "Self-assessment and cheat sheet",
  ],
  "azure-analytics-part2": [
    "Data lakes and data warehouses",
    "Modern data architecture",
    "Azure services and common use cases",
    "Reference architecture",
    "Quiz, resources, and cheat sheet",
  ],
  "data-modelling": [
    "Conceptual, logical, and physical data models",
    "OLTP, OLAP, normalization, and denormalization",
    "Star and snowflake schemas",
    "Fact tables, dimensions, SCD, and surrogate keys",
    "Kimball, Inmon, Medallion, and Data Vault",
    "Cloud performance and enterprise case study",
  ],
  "data-engineering-on-aws": [
    "AWS workbench and data-engineer responsibilities",
    "Data discovery, S3, and the data lake",
    "AWS Glue ETL with PySpark",
    "Athena, Redshift Serverless, and lakehouse serving",
    "Orchestration, automation, security, and monitoring",
    "Assessment, capstone, and resource teardown",
  ],
};
