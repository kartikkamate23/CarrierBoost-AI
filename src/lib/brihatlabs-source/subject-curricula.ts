/**
 * Curricula for the standalone subject courses.
 *
 * These 25 courses previously shared one generated module of eight
 * placeholder lessons ("What is X?", "Why X matters", "X workflow", …), which
 * made a course page look complete while teaching nothing specific. Each
 * subject now has a real three-module progression ending in a project.
 *
 * Lesson titles deliberately reuse the titles taught in the flagship courses
 * wherever the topic is the same, so a learner meets consistent wording and
 * the lesson inherits the written definition, diagram, and table for it.
 */

export type SubjectModule = [title: string, lessons: string[], description: string];

export type SubjectCurriculum = {
  modules: SubjectModule[];
  /** Title of the closing project lesson, appended as the final module. */
  project: string;
  /** One-line brief shown on the project lesson. */
  projectBrief: string;
};

const QUIZ = "Module Quiz";

export const subjectCurricula: Record<string, SubjectCurriculum> = {
  python: {
    modules: [
      ["Python Language Foundations", ["Python Setup", "Variables", "Data Types", "Operators", "Conditions", "Loops", "Functions", QUIZ], "Install Python, then work through the syntax every later lesson assumes."],
      ["Collections and Program Structure", ["Lists", "Tuples", "Sets", "Dictionaries", "Modules", "File Handling", "Exception Handling", QUIZ], "Choose the right container, split code into modules, and handle failure deliberately."],
      ["Python for Data Work", ["NumPy", "NumPy Arrays", "Array Operations", "Pandas", "DataFrames", "Reading CSV Files", "Filtering Data", "GroupBy", QUIZ], "Move from plain Python to the array and table libraries used in real analysis."],
    ],
    project: "Build a Python Data Utility",
    projectBrief: "Write a small command-line tool that loads a CSV, validates it, summarises it, and writes a clean output file with a log of what it changed.",
  },
  sql: {
    modules: [
      ["Querying a Single Table", ["What is SQL?", "Databases", "Tables", "SELECT", "WHERE", "ORDER BY", QUIZ], "Read data out of one table with confidence, and understand the order the database evaluates a query in."],
      ["Grouping and Joining", ["Aggregate Functions", "COUNT", "SUM", "AVG", "GROUP BY", "HAVING", "INNER JOIN", "LEFT JOIN", QUIZ], "Summarise many rows and combine tables without silently losing or duplicating records."],
      ["Analytical SQL", ["Subqueries", "CTEs", "Window Functions", "CASE", "Indexing", "Transactions", "SQL Data Cleaning", QUIZ], "Answer questions that need intermediate results, ranking, and running totals."],
    ],
    project: "Build a SQL Analytics Report",
    projectBrief: "Answer five business questions from a multi-table schema using CTEs and window functions, and validate every number against a second query.",
  },
  excel: {
    modules: [
      ["Working in a Spreadsheet", ["Excel for Analytics", "Rows and Columns", "Sorting", "Filtering", "Basic Formulas", "IF", QUIZ], "Structure a sheet so that every later formula and pivot works on clean, consistent data."],
      ["Lookups and Summaries", ["SUMIF", "COUNTIF", "XLOOKUP", "INDEX + MATCH", "Pivot Tables", "Pivot Charts", "Conditional Formatting", QUIZ], "Combine data across sheets and summarise it without rewriting formulas by hand."],
      ["Repeatable Analysis and Dashboards", ["Data Cleaning in Excel", "Power Query", "Excel Dashboard", "Dashboard Design", "KPIs", QUIZ], "Record the cleaning steps once so a refresh reproduces the whole analysis."],
    ],
    project: "Build an Excel Sales Dashboard",
    projectBrief: "Clean a raw sales export in Power Query, model it with pivot tables, and publish a one-screen dashboard with slicers and a stated headline measure.",
  },
  git: {
    modules: [
      ["Tracking Your Own Work", ["What is Git?", "Repository", "git init", "git clone", "git add", "git commit", QUIZ], "Record a project's history in small, reviewable steps you can return to."],
      ["Working with a Remote and Branches", ["git push", "git pull", "Branches", "Merge", "Merge Conflicts", QUIZ], "Share work, develop in parallel, and resolve the conflicts that come with it."],
      ["Collaborating on GitHub", ["Pull Requests", "GitHub Issues", "README", "Git Workflow", "GitHub Actions", QUIZ], "Use the review and automation workflow teams actually run on."],
    ],
    project: "Build a Reviewed Git Workflow",
    projectBrief: "Take a small project through a full branch, pull request, review, conflict resolution, and merge, with CI running the checks on every push.",
  },
  statistics: {
    modules: [
      ["Describing Data", ["Why Statistics?", "Population vs Sample", "Mean", "Median", "Mode", "Variance", "Standard Deviation", "Percentiles", QUIZ], "Summarise a dataset honestly, and know which summary each distribution shape calls for."],
      ["Probability", ["Probability", "Conditional Probability", "Bayes Theorem", "Probability Distributions", "Normal Distribution", QUIZ], "Reason about uncertainty with the rules that inference is built on."],
      ["Inference and Experiments", ["Correlation", "Covariance", "Hypothesis Testing", "P-Value", "Confidence Intervals", "A/B Testing", QUIZ], "Tell a real effect from a coincidence, and report the confidence honestly."],
    ],
    project: "Run and Report an A/B Test",
    projectBrief: "Design a test with a pre-declared metric, analyse the result with a confidence interval, and write the conclusion including what the data cannot tell you.",
  },
  pandas: {
    modules: [
      ["Numeric Computing with NumPy", ["NumPy", "NumPy Arrays", "Array Operations", "Basic Statistics", QUIZ], "Work with typed arrays and vectorised maths instead of Python loops."],
      ["Tables with pandas", ["Pandas", "Series", "DataFrames", "Reading CSV Files", "Loading Excel", "Loading JSON", "Data Selection", QUIZ], "Load real files and select exactly the rows and columns you intend to."],
      ["Reshaping and Combining", ["Filtering Data", "Sorting Data", "GroupBy", "Aggregation", "Merging DataFrames", "Data Types", QUIZ], "Group, aggregate, and join tables while checking the row count at every step."],
    ],
    project: "Build a pandas Analysis Notebook",
    projectBrief: "Load three related files, join them, produce a grouped summary, and state one finding with the check that proves the numbers are right.",
  },
  eda: {
    modules: [
      ["Finding What Is Wrong", ["What is Data Cleaning?", "Why Data Quality Matters", "Missing Values", "Duplicate Records", "Incorrect Values", "Data Types", QUIZ], "Profile a raw dataset and name every quality problem before fixing any of them."],
      ["Cleaning and Validating", ["String Cleaning", "Date Cleaning", "Outliers", "Handling Outliers", "Data Validation", "Data Quality Checks", "Complete Data Cleaning Workflow", QUIZ], "Apply fixes as recorded, repeatable rules rather than manual edits."],
      ["Exploring the Clean Data", ["What is EDA?", "Summary Statistics", "Distribution", "Correlation", "Univariate Analysis", "Bivariate Analysis", "Detecting Anomalies", QUIZ], "Examine one variable, then pairs, then report what would change a decision."],
    ],
    project: "Build an End-to-End EDA Report",
    projectBrief: "Take one messy public dataset from raw file to a written report: cleaning log, distributions, relationships, and three findings with their caveats.",
  },
  visualization: {
    modules: [
      ["Choosing an Honest Chart", ["Why Visualization?", "Choosing the Right Chart", "Bar Charts", "Line Charts", "Pie Charts", QUIZ], "Match the chart to the question, and know what each encoding can and cannot show."],
      ["Charts for Distribution and Relationship", ["Histograms", "Scatter Plots", "Box Plots", "Heatmaps", "Correlation Heatmap", QUIZ], "See the shape of one variable and the relationship between two."],
      ["Building and Presenting", ["Matplotlib", "Seaborn", "Plotly", "Interactive Visualization", "Data Storytelling", "Common Visualization Mistakes", QUIZ], "Produce the chart in code, then frame it so a reader reaches the right conclusion."],
    ],
    project: "Build a Visual Data Story",
    projectBrief: "Turn one dataset into a five-chart narrative with a stated audience, one message per chart, and a recommended action at the end.",
  },
  "power-bi": {
    modules: [
      ["Getting Data In", ["What is Business Intelligence?", "Power BI Introduction", "Importing Data", "Power Query", QUIZ], "Connect to a source and record the cleaning steps so a refresh reproduces them."],
      ["Modelling and Measures", ["Data Modeling", "Relationships", "DAX Introduction", "KPIs", QUIZ], "Build a model where one measure works correctly across every slice."],
      ["Reports People Use", ["Charts", "Filters", "Slicers", "Dashboard Design", "Dashboard Best Practices", "Accessibility", QUIZ], "Design for one audience and one decision, and check it is readable for everyone."],
    ],
    project: "Build a Power BI Sales Dashboard",
    projectBrief: "Model a star schema from a raw export, define three DAX measures with targets, and publish a dashboard that answers a named manager's weekly question.",
  },
  tableau: {
    modules: [
      ["Connecting and Exploring", ["What is Business Intelligence?", "Tableau Introduction", "Importing Data", "Data Modeling", QUIZ], "Connect to data, understand the grain, and build a first worksheet."],
      ["Building Views", ["Charts", "Filters", "KPIs", "Choosing the Right Chart", "Interactive Visualization", QUIZ], "Build views that answer one question each, with working filters and clear labels."],
      ["Dashboards and Storytelling", ["Dashboard Design", "Dashboard Best Practices", "Data Storytelling", "Common Visualization Mistakes", "Accessibility", QUIZ], "Combine worksheets into a dashboard someone will actually act on."],
    ],
    project: "Build a Tableau Executive Dashboard",
    projectBrief: "Build a dashboard for one named audience with a headline measure, two supporting views, working filters, and a short written interpretation.",
  },
  "ml-fundamentals": {
    modules: [
      ["How Machine Learning Works", ["What is Machine Learning?", "Traditional Programming vs ML", "Types of Machine Learning", "Supervised Learning", "Unsupervised Learning", "Machine Learning Workflow", QUIZ], "Understand what a model actually learns, and when learning beats writing rules."],
      ["Preparing Data Properly", ["Features and Labels", "Train-Test Split", "Missing Values", "Encoding Categorical Data", "Feature Scaling", "Feature Engineering", "Data Leakage", QUIZ], "Prepare data so the score you measure is the score you would get in production."],
      ["Training and Evaluating", ["Linear Regression", "Logistic Regression", "Decision Trees", "Random Forest", "Accuracy", "Precision", "Recall", "Confusion Matrix", "Overfitting", "Cross Validation", QUIZ], "Fit models and read the metric that reflects the cost of each kind of mistake."],
    ],
    project: "Build Your First Predictive Model",
    projectBrief: "Take a tabular dataset from raw file to a trained model inside a pipeline, and report the metric that matches the real cost of a wrong prediction.",
  },
  "deep-learning": {
    modules: [
      ["Neural Network Foundations", ["Introduction to Neural Networks", "Neural Networks", "Activation Functions", "ML vs Deep Learning", "When to Use Deep Learning", QUIZ], "Understand what layers, weights, and activations actually do before using a framework."],
      ["Training a Network", ["Cost Function", "Gradient Descent", "Learning Rate", "Backpropagation", "Epochs and Batches", "Overfitting", "Dropout", "Regularization", QUIZ], "Run the training loop and recognise the symptoms when it goes wrong."],
      ["Architectures and Practice", ["Convolutional Neural Networks", "Recurrent Neural Networks", "Transformers", "Transfer Learning", "Training a Neural Network", QUIZ], "Choose the architecture that matches the data, and start from a pretrained model."],
    ],
    project: "Build an Image Classifier",
    projectBrief: "Fine-tune a pretrained network on a small image set, report accuracy per class, and show three examples the model gets wrong with an explanation.",
  },
  nlp: {
    modules: [
      ["Turning Text into Data", ["NLP Introduction", "Text Data", "Text Preprocessing", "Tokens", "Stop Words", "Stemming and Lemmatization", QUIZ], "Normalise messy human language into tokens a model can work with."],
      ["Representing Meaning", ["Bag of Words", "TF-IDF", "Word Embeddings", "Embeddings", QUIZ], "Move from counting words to representing meaning as vectors."],
      ["NLP Tasks", ["Text Classification", "Sentiment Analysis", "Named Entity Recognition", "Transformers", "Transfer Learning", QUIZ], "Apply the representations to the tasks that appear in real products."],
    ],
    project: "Build a Text Classifier",
    projectBrief: "Classify real reviews end to end: preprocess, represent, train, evaluate per class, and show where the model fails on sarcasm or negation.",
  },
  "generative-ai": {
    modules: [
      ["How Generative Models Work", ["What is Generative AI?", "What is an LLM?", "How LLMs Work — Simple Explanation", "Tokens", "Context Window", "Image and Audio Generation", QUIZ], "Understand next-token prediction and the limits it creates."],
      ["Controlling the Output", ["Prompts", "System Prompt", "User Prompt", "Prompt Engineering", "Few-Shot Prompting", "Temperature", "Model Parameters", "Structured Output", QUIZ], "Get reliable, parseable output instead of plausible-looking text."],
      ["Using It Responsibly", ["Hallucination", "Function Calling", "Evaluating Generative Output", "Responsible Generative AI", "Cost Optimization", QUIZ], "Verify what the model produces and keep confidential data out of it."],
    ],
    project: "Build a Grounded Generative Assistant",
    projectBrief: "Build an assistant that answers from a supplied document set, returns structured output, cites its source, and refuses when the source does not cover the question.",
  },
  rag: {
    modules: [
      ["Why Retrieval", ["What is RAG?", "Why Agents Need Knowledge", "Hallucination", "Documents", "Context", QUIZ], "Understand what retrieval fixes that a larger prompt or a bigger model does not."],
      ["Building the Index", ["Chunking", "Embeddings", "Vector Databases", "Retrieval", "RAG Pipeline", QUIZ], "Split, embed, store, and search your own documents."],
      ["Making It Trustworthy", ["Agentic RAG", "Traditional RAG vs Agentic RAG", "Evaluating Generative Output", "Guardrails", "Cost Optimization", QUIZ], "Measure retrieval quality and ground every answer in a citable source."],
    ],
    project: "Build a Grounded Question-Answering System",
    projectBrief: "Index a document set, answer ten questions with citations, and report retrieval quality plus the questions the system correctly declined to answer.",
  },
  "ai-agents": {
    modules: [
      ["What an Agent Is", ["What is an AI Agent?", "What is Agentic AI?", "LLM vs AI Agent", "Agent Components", "AI Agent Architecture", QUIZ], "Separate an agent from a single model call, and name every part it needs."],
      ["The Agent Loop", ["Agent Goal", "Agent Memory", "Agent Tools", "Agent Planning", "Agent Loop", "Think → Act → Observe", "ReAct Pattern", QUIZ], "Build the think, act, observe cycle with a stopping condition that actually fires."],
      ["Tools and Production Safety", ["Function Calling", "Tool Selection", "Tool Parameters", "Tool Errors", "Guardrails", "AI Agent Security", "Observability", "Agent Evaluation", QUIZ], "Give an agent real capability without giving it unbounded permission."],
    ],
    project: "Build an AI Research Agent",
    projectBrief: "Build an agent that researches a question with a search and a summarise tool, cites sources, respects a step budget, and logs every tool call.",
  },
  mcp: {
    modules: [
      ["The Protocol", ["What is MCP?", "Why MCP?", "MCP Architecture", "MCP Client", "MCP Server", QUIZ], "Understand what MCP standardises and which problem that removes."],
      ["What a Server Exposes", ["MCP Tools", "MCP Resources", "MCP Prompts", "Structured Output", QUIZ], "Distinguish executable tools from readable resources and reusable prompts."],
      ["Connecting It Safely", ["Connecting an AI Agent to MCP", "Guardrails", "AI Agent Security", "Authentication", "Authorization", "Logging", QUIZ], "Wire a server into an agent with permission checks you control."],
    ],
    project: "Build and Connect an MCP Server",
    projectBrief: "Expose one real capability as an MCP server with a typed tool and a resource, connect it to an agent, and show the permission check refusing a disallowed call.",
  },
  spark: {
    modules: [
      ["Distributed Processing", ["What is Apache Spark?", "Spark Architecture", "Partitioning", "Lazy Evaluation", "Transformations and Actions", QUIZ], "Understand how work is split across a cluster and when it actually runs."],
      ["Working with Data", ["Spark DataFrames", "PySpark", "Spark SQL", "Aggregation", "JOINs", QUIZ], "Express jobs with the DataFrame and SQL APIs you already half know."],
      ["Making Jobs Fast", ["Shuffles", "Caching", "Data Types", "Monitoring", QUIZ], "Find and fix the shuffles and skew that make a job slow."],
    ],
    project: "Build a Spark Batch Pipeline",
    projectBrief: "Process a multi-file dataset with PySpark: clean, join, aggregate, write partitioned output, and explain one optimisation you made and its measured effect.",
  },
  airflow: {
    modules: [
      ["Workflows as Code", ["What is Apache Airflow?", "DAGs", "Tasks and Operators", "Dependencies", QUIZ], "Express a multi-step pipeline as a graph that runs in the right order."],
      ["Scheduling and Waiting", ["Scheduling", "Sensors", "XComs", "Backfilling", QUIZ], "Run on a schedule, wait for upstream data, and rerun past intervals safely."],
      ["Running It in Production", ["Retries and Alerting", "Monitoring", "Environment Variables", "Logging", "Airflow Best Practices", QUIZ], "Handle failure, keep secrets out of code, and make problems visible."],
    ],
    project: "Build a Scheduled Data Pipeline",
    projectBrief: "Build a DAG that ingests, validates, transforms, and loads data on a schedule, with idempotent tasks, retries, and an alert on failure.",
  },
  kafka: {
    modules: [
      ["The Event Log", ["What is Apache Kafka?", "Topics", "Partitions", "Brokers", "Replication", QUIZ], "Understand the log abstraction that everything else in Kafka builds on."],
      ["Producing and Consuming", ["Producers", "Consumers", "Consumer Groups", "Offsets", "Delivery Guarantees", QUIZ], "Write and read events reliably, and know what your delivery guarantee costs."],
      ["Streams in Practice", ["Stream Processing", "Monitoring", "Scaling", "Error Handling", QUIZ], "Transform events as they arrive and keep the pipeline observable."],
    ],
    project: "Build a Real-Time Event Pipeline",
    projectBrief: "Produce events to a partitioned topic, consume them in a group, handle a poison message without stopping the stream, and show consumer lag under load.",
  },
  react: {
    modules: [
      ["Components and Data", ["What is React?", "Why React?", "Components", "JSX", "Props", "State", QUIZ], "Describe an interface as a function of its data instead of patching the DOM."],
      ["Hooks and Interaction", ["useState", "useEffect", "useRef", "Custom Hooks", "Events", "Conditional Rendering", "Lists", "Forms", QUIZ], "Manage state and side effects, and render every state a screen can be in."],
      ["Real Applications", ["React Router", "Context API", "API Integration", "Loading States", "Error Handling", "Accessibility", QUIZ], "Add routing, shared state, and honest loading and error handling."],
    ],
    project: "Build a React Task Application",
    projectBrief: "Build a routed app that loads data from an API and renders all four states — loading, empty, error, and success — with keyboard-accessible forms.",
  },
  nextjs: {
    modules: [
      ["The Framework", ["What is Next.js?", "What is React?", "File-Based Routing", "Server Components", "Client Components", QUIZ], "Understand what Next.js adds to React and where each component type belongs."],
      ["Rendering and Data", ["Data Fetching in Next.js", "Server-Side Rendering", "Static Generation", "API Routes", "Loading States", QUIZ], "Choose the rendering strategy that matches how fresh the content must be."],
      ["Shipping It", ["Image Optimization", "Environment Variables", "Error Handling", "Accessibility", "Deploying Next.js", QUIZ], "Optimise the payload and deploy with configuration kept out of the code."],
    ],
    project: "Build a Full-Stack Next.js Application",
    projectBrief: "Build an app with a server-rendered listing, a static marketing page, an API route writing to a store, and environment-specific configuration.",
  },
  nodejs: {
    modules: [
      ["The Node Runtime", ["What is Node.js?", "Node Runtime", "npm", "Modules", "File System", "Async Programming", "Environment Variables", QUIZ], "Run JavaScript on a server and understand why it handles many connections at once."],
      ["Building an API with Express", ["HTTP Server", "Express", "Routing", "Middleware", "Controllers", "Services", "Request", "Response", QUIZ], "Compose routes and middleware into a structure that stays readable as it grows."],
      ["Production Concerns", ["REST API Design", "Validation", "Status Codes", "Error Handling", "Rate Limiting", "Pagination", "API Documentation", QUIZ], "Validate input, return honest status codes, and protect the service from overload."],
    ],
    project: "Build a Production-Ready REST API",
    projectBrief: "Build a validated, paginated, rate-limited API with centralised error handling, environment configuration, and documentation for every endpoint.",
  },
  postgresql: {
    modules: [
      ["Relational Foundations", ["What is a Database?", "Relational Databases", "Tables", "Primary Keys", "Foreign Keys", "Database Relationships", QUIZ], "Design a schema whose rules the database itself enforces."],
      ["Querying", ["SELECT", "WHERE", "ORDER BY", "GROUP BY", "HAVING", "JOINs", "Subqueries", "CTEs", "Window Functions", QUIZ], "Answer real questions across several tables."],
      ["Performance and Safety", ["Indexing", "Transactions", "Database Security", "Data Validation", "Monitoring", QUIZ], "Keep queries fast and keep related writes consistent."],
    ],
    project: "Design and Query a PostgreSQL Schema",
    projectBrief: "Design a normalised schema with constraints, load sample data, answer five analytical questions, and show one query made faster by an index with timings.",
  },
  "software-testing": {
    modules: [
      ["Foundations of Quality", ["What is Software Testing?", "Why Testing?", "Quality Assurance", "QA vs QC vs Testing", "Verification", "Validation", "Software Testing Principles", "Testing Mindset", QUIZ], "Understand what testing can and cannot prove, and how quality is actually built in."],
      ["Designing Tests", ["Software Testing Life Cycle", "Test Scenario", "Test Case", "Writing Test Cases", "Test Data", "Boundary Value Analysis", "Equivalence Partitioning", "Positive Testing", "Negative Testing", QUIZ], "Choose the conditions worth checking, and write cases anyone can repeat."],
      ["Finding and Reporting Defects", ["What is a Bug?", "Defect vs Error vs Failure", "Bug Lifecycle", "Severity", "Priority", "Bug Report", "Reproduction Steps", "Regression Testing", "Retesting", QUIZ], "Report defects so clearly that a developer can reproduce them without asking."],
    ],
    project: "Build a Complete Test Suite",
    projectBrief: "Test one real web feature end to end: a test plan, designed cases covering boundaries and negatives, executed evidence, filed defects, and a sign-off note.",
  },
};
