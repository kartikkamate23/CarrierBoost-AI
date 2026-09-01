type SubjectSeed = [string, string, string, string, "beginner" | "intermediate" | "advanced", number];

const subjectSeeds: SubjectSeed[] = [
  ["subj-python", "python", "Python Programming", "Learn Python from fundamentals to advanced programming concepts", "beginner", 40],
  ["subj-sql", "sql", "SQL & Databases", "Master SQL for querying, analyzing, and managing relational data", "beginner", 30],
  ["subj-excel", "excel", "Excel for Analytics", "Advanced Excel techniques for data analysis and visualization", "beginner", 25],
  ["subj-git", "git", "Git & GitHub", "Version control and collaborative development with Git", "beginner", 10],
  ["subj-statistics", "statistics", "Statistics & Probability", "Statistical foundations for data analysis and hypothesis testing", "intermediate", 35],
  ["subj-pandas", "pandas", "Pandas & NumPy", "Data manipulation and numerical computing libraries", "intermediate", 30],
  ["subj-eda", "eda", "Data Cleaning & EDA", "Exploratory data analysis and data quality techniques", "intermediate", 25],
  ["subj-visualization", "visualization", "Data Visualization", "Create compelling visualizations with matplotlib and seaborn", "intermediate", 20],
  ["subj-powerbi", "power-bi", "Power BI", "Build interactive dashboards with Microsoft Power BI", "intermediate", 30],
  ["subj-tableau", "tableau", "Tableau", "Advanced data visualization and business intelligence", "intermediate", 30],
  ["subj-ml-fundamentals", "ml-fundamentals", "Machine Learning Fundamentals", "Supervised learning, unsupervised learning, and model evaluation", "intermediate", 50],
  ["subj-deep-learning", "deep-learning", "Deep Learning", "Neural networks, CNNs, RNNs, and transformers", "advanced", 45],
  ["subj-nlp", "nlp", "Natural Language Processing", "Text processing, embeddings, and language models", "advanced", 35],
  ["subj-genai", "generative-ai", "Generative AI", "Large language models, prompting, and generative applications", "advanced", 40],
  ["subj-rag", "rag", "RAG Systems", "Retrieval-augmented generation and vector databases", "advanced", 30],
  ["subj-agents", "ai-agents", "AI Agents", "Agentic AI, tool use, multi-agent systems, and orchestration", "advanced", 50],
  ["subj-mcp", "mcp", "Model Context Protocol", "Building interoperable AI systems with MCP", "advanced", 20],
  ["subj-spark", "spark", "Apache Spark", "Distributed data processing and PySpark fundamentals", "advanced", 35],
  ["subj-airflow", "airflow", "Apache Airflow", "Workflow orchestration and data pipeline management", "advanced", 25],
  ["subj-kafka", "kafka", "Apache Kafka", "Event streaming and real-time data pipelines", "advanced", 30],
  ["subj-react", "react", "React", "Modern JavaScript UI library and component architecture", "intermediate", 40],
  ["subj-nextjs", "nextjs", "Next.js", "Full-stack React framework with server-side rendering", "intermediate", 35],
  ["subj-nodejs", "nodejs", "Node.js & Express", "Server-side JavaScript and REST API development", "intermediate", 35],
  ["subj-postgres", "postgresql", "PostgreSQL", "Advanced relational database design and optimization", "intermediate", 30],
  ["subj-testing", "software-testing", "Software Testing", "Manual testing, test case design, and QA methodologies", "beginner", 30],
];

export const seedSubjects = subjectSeeds.map(([id, slug, name, description, difficulty, estimatedHours]) => ({
  id, slug, name, description, icon: "BookOpen", difficulty, estimatedHours, status: "published" as const,
}));
