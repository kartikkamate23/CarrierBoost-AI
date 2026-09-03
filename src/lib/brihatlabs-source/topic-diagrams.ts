import type { ContentBlock, Course } from "../types/course.ts";

/**
 * Topic-specific diagrams for lesson content.
 *
 * Before this module every lesson rendered the same four-node placeholder
 * flow ("input → apply X → validate → output"), which taught nothing. Each
 * entry here describes the actual mechanism of a topic, so the diagram on a
 * lesson page is worth looking at.
 *
 * Lookup order: exact lesson title, then a keyword rule matched against the
 * lesson and module title, then a subject-level fallback.
 */

type Diagram = { variant: NonNullable<Extract<ContentBlock, { type: "diagram" }>["variant"]>; items: string[] };

/** Exact-title diagrams. Keys are lesson titles as they appear in the catalog. */
const byTitle: Record<string, Diagram> = {
  // --- Analytics: lifecycle and roles -------------------------------------
  "What is Data Analytics?": { variant: "pipeline", items: ["Ask a business question", "Collect data", "Clean data", "Analyse", "Visualise", "Recommend"] },
  "Types of Data Analytics": { variant: "timeline", items: ["Descriptive: what happened", "Diagnostic: why it happened", "Predictive: what may happen", "Prescriptive: what to do"] },
  "Descriptive Analytics": { variant: "flow", items: ["Historical records", "Aggregate by period", "Report the measure", "What happened"] },
  "Diagnostic Analytics": { variant: "flow", items: ["Observed change", "Segment and compare", "Test explanations", "Why it happened"] },
  "Predictive Analytics": { variant: "flow", items: ["Historical patterns", "Fit a model", "Score new records", "What is likely next"] },
  "Prescriptive Analytics": { variant: "flow", items: ["Forecast", "Options and constraints", "Simulate outcomes", "Recommended action"] },
  "Data-Driven Decision Making": { variant: "pipeline", items: ["Decision to make", "Evidence gathered", "Analysis", "Options weighed", "Decision", "Measured outcome"] },
  "From Data to Insight": { variant: "pipeline", items: ["Raw data", "Information", "Analysis", "Insight", "Decision", "Impact"] },

  // --- Analytics: data shapes --------------------------------------------
  "Structured Data": { variant: "concept", items: ["Fixed rows and columns", "Defined data types", "SQL tables, CSV, Excel", "Easy to join and aggregate"] },
  "Semi-Structured Data": { variant: "concept", items: ["Labelled but not tabular", "Nested keys and arrays", "JSON, XML, event logs", "Flatten before analysis"] },
  "Unstructured Data": { variant: "concept", items: ["No predefined shape", "Text, image, audio, video", "Needs extraction first", "Then becomes analysable"] },

  // --- SQL ----------------------------------------------------------------
  "What is SQL?": { variant: "flow", items: ["Your question", "SQL query", "Database engine", "Result set"] },
  SELECT: { variant: "steps", items: ["FROM: choose the table", "WHERE: keep matching rows", "GROUP BY: form groups", "HAVING: filter groups", "SELECT: choose columns", "ORDER BY: sort the result"] },
  WHERE: { variant: "flow", items: ["All rows", "Apply WHERE condition", "Matching rows only", "Passed to grouping"] },
  "GROUP BY": { variant: "flow", items: ["Filtered rows", "Bucket by key column", "Aggregate each bucket", "One row per group"] },
  HAVING: { variant: "flow", items: ["Grouped rows", "Aggregate computed", "Apply HAVING condition", "Groups that qualify"] },
  "ORDER BY": { variant: "flow", items: ["Result rows", "Sort key chosen", "ASC or DESC applied", "Ordered output"] },
  "Aggregate Functions": { variant: "concept", items: ["COUNT: how many rows", "SUM: total of a column", "AVG: mean value", "MIN and MAX: extremes"] },
  "INNER JOIN": { variant: "flow", items: ["Left table", "Right table", "Match on join key", "Only matching pairs"] },
  "LEFT JOIN": { variant: "flow", items: ["Left table (all rows kept)", "Right table", "Match on join key", "Unmatched right side becomes NULL"] },
  "RIGHT JOIN": { variant: "flow", items: ["Left table", "Right table (all rows kept)", "Match on join key", "Unmatched left side becomes NULL"] },
  JOINs: { variant: "concept", items: ["INNER: rows in both", "LEFT: all of the left", "RIGHT: all of the right", "FULL: everything from both"] },
  Subqueries: { variant: "flow", items: ["Inner query runs first", "Produces a value or set", "Outer query consumes it", "Final result"] },
  CTEs: { variant: "steps", items: ["WITH names a result set", "Build it once from base tables", "Reference it by name", "Chain further CTEs", "Final SELECT reads the chain"] },
  "Window Functions": { variant: "flow", items: ["Rows kept as-is", "PARTITION BY defines the window", "ORDER BY orders within it", "Calculation added per row"] },
  CASE: { variant: "decision-tree", items: ["CASE WHEN condition", "THEN this value", "ELSE the fallback value"] },

  // --- Excel --------------------------------------------------------------
  "Pivot Tables": { variant: "flow", items: ["Flat source rows", "Drag field to Rows", "Drag field to Values", "Aggregated summary table"] },
  XLOOKUP: { variant: "flow", items: ["Lookup value", "Search the lookup array", "Find position", "Return matching value"] },
  "INDEX + MATCH": { variant: "flow", items: ["MATCH finds the row number", "INDEX takes the range", "INDEX returns that position", "Value returned"] },
  "Power Query": { variant: "pipeline", items: ["Connect to source", "Transform steps recorded", "Preview result", "Load to sheet or model", "Refresh repeats every step"] },
  "Excel Dashboard": { variant: "architecture", items: ["Raw data sheet", "Power Query cleaning", "Pivot tables", "Pivot charts and slicers", "Dashboard sheet"] },

  // --- Cleaning & EDA -----------------------------------------------------
  "What is Data Cleaning?": { variant: "pipeline", items: ["Profile the data", "Fix types", "Handle missing values", "Remove duplicates", "Validate rules", "Clean dataset"] },
  "Complete Data Cleaning Workflow": { variant: "pipeline", items: ["Load raw file", "Profile columns", "Fix data types", "Treat missing values", "Drop duplicates", "Handle outliers", "Validate", "Save clean copy"] },
  "Missing Values": { variant: "decision-tree", items: ["Why is the value missing?", "Missing at random: impute a sensible value", "Missing for a reason: keep it as its own category or drop"] },
  "Handling Outliers": { variant: "decision-tree", items: ["Is the extreme value real?", "Real: keep it and use a robust method", "Data error: correct or remove it"] },
  Outliers: { variant: "flow", items: ["Distribution inspected", "Threshold chosen (IQR or z-score)", "Extreme points flagged", "Investigated, not deleted blindly"] },
  "What is EDA?": { variant: "pipeline", items: ["Load dataset", "Check shape and types", "Summary statistics", "Distributions", "Relationships", "Questions for modelling"] },
  "Complete EDA Case Study": { variant: "pipeline", items: ["Business question", "Load and profile", "Clean", "Univariate view", "Bivariate view", "Findings", "Recommendation"] },
  "Summary Statistics": { variant: "concept", items: ["Centre: mean, median, mode", "Spread: range, variance, SD", "Shape: skew and peaks", "Extremes: min, max, outliers"] },
  Correlation: { variant: "concept", items: ["−1: strong inverse", "0: no linear relation", "+1: strong direct", "Never proof of causation"] },
  Distribution: { variant: "concept", items: ["Normal: symmetric bell", "Skewed: one long tail", "Bimodal: two peaks", "Uniform: flat spread"] },

  // --- Visualization ------------------------------------------------------
  "Choosing the Right Chart": { variant: "decision-tree", items: ["What is the question?", "Comparison or trend: bar or line", "Distribution or relationship: histogram or scatter"] },
  "Data Storytelling": { variant: "pipeline", items: ["Audience and decision", "One clear message", "Supporting evidence", "Chart that shows it", "Recommended action"] },
  "Why Visualization?": { variant: "flow", items: ["Rows of numbers", "Encode as position and length", "Pattern becomes visible", "Faster, safer decision"] },

  // --- BI -----------------------------------------------------------------
  "What is Business Intelligence?": { variant: "architecture", items: ["Source systems", "Data pipeline", "Semantic model", "Reports and dashboards", "Business decisions"] },
  "Power BI Introduction": { variant: "pipeline", items: ["Get data", "Transform in Power Query", "Model relationships", "Write DAX measures", "Build visuals", "Publish and share"] },
  "Data Modeling": { variant: "architecture", items: ["Fact table (events, measures)", "Dimension tables (who, what, when)", "Relationships on keys", "Measures built on top"] },
  "Dashboard Design": { variant: "steps", items: ["Name the audience and decision", "Choose three to five key measures", "Put the headline top-left", "Group related visuals", "Label clearly and test contrast"] },

  // --- Statistics ---------------------------------------------------------
  "Population vs Sample": { variant: "flow", items: ["Population: everyone of interest", "Sampling method", "Sample: the group measured", "Inference back to the population"] },
  "Hypothesis Testing": { variant: "steps", items: ["State null and alternative", "Choose the test and significance level", "Collect the data", "Compute the test statistic", "Compare the p-value", "State the conclusion and its limits"] },
  "P-Value": { variant: "flow", items: ["Assume the null is true", "Observe the sample result", "How extreme is it?", "p-value: probability of that or worse"] },
  "A/B Testing": { variant: "pipeline", items: ["Hypothesis", "Split traffic randomly", "Run both variants", "Collect the metric", "Test significance", "Ship or discard"] },
  "Bayes Theorem": { variant: "flow", items: ["Prior belief", "New evidence observed", "Update with the likelihood", "Posterior belief"] },
  "Confidence Intervals": { variant: "flow", items: ["Sample estimate", "Standard error", "Margin of error added", "Interval reported with the estimate"] },
  "Normal Distribution": { variant: "concept", items: ["Symmetric around the mean", "68% within 1 SD", "95% within 2 SD", "99.7% within 3 SD"] },

  // --- Machine learning ---------------------------------------------------
  "What is Machine Learning?": { variant: "flow", items: ["Examples with answers", "Algorithm finds the pattern", "Trained model", "Prediction on new data"] },
  "Traditional Programming vs ML": { variant: "concept", items: ["Programming: rules + data → answers", "ML: data + answers → rules", "Rules are written by a person", "Rules are learned from examples"] },
  "Machine Learning Workflow": { variant: "pipeline", items: ["Frame the problem", "Collect data", "Prepare features", "Train", "Evaluate", "Tune", "Deploy", "Monitor"] },
  "How Machines Learn": { variant: "steps", items: ["Start with a guess", "Predict on training examples", "Measure the error", "Adjust the parameters", "Repeat until the error stops falling"] },
  "Types of Machine Learning": { variant: "concept", items: ["Supervised: labelled examples", "Unsupervised: structure only", "Reinforcement: reward signal", "Self-supervised: labels from the data itself"] },
  "Supervised Learning": { variant: "flow", items: ["Features + known labels", "Model learns the mapping", "Predict a label", "Compare against held-out truth"] },
  "Unsupervised Learning": { variant: "flow", items: ["Features, no labels", "Find structure", "Groups or reduced dimensions", "Interpret and name them"] },
  "Reinforcement Learning": { variant: "flow", items: ["State observed", "Action chosen by the policy", "Reward and next state returned", "Policy updated"] },
  "Train-Test Split": { variant: "flow", items: ["Full dataset", "Shuffle and split", "Train set fits the model", "Test set is touched once, at the end"] },
  "Train/Test/Validation": { variant: "concept", items: ["Train: fit parameters", "Validation: choose settings", "Test: final honest estimate", "Never tune on the test set"] },
  "Data Leakage": { variant: "flow", items: ["Future or target information", "Leaks into the features", "Scores look excellent", "Production performance collapses"] },
  "Gradient Descent": { variant: "steps", items: ["Start at a random point", "Measure the slope of the error", "Step downhill by the learning rate", "Recompute the error", "Stop when it stops improving"] },
  "Cost Function": { variant: "flow", items: ["Prediction", "Compare with the truth", "Error scored by the cost function", "Parameters adjusted to lower it"] },
  "Confusion Matrix": { variant: "concept", items: ["True positive: caught correctly", "False positive: false alarm", "False negative: missed case", "True negative: correctly ignored"] },
  "Bias vs Variance": { variant: "concept", items: ["High bias: too simple, underfits", "High variance: too sensitive, overfits", "Total error balances the two", "Aim for the middle"] },
  Overfitting: { variant: "flow", items: ["Model memorises training noise", "Training score climbs", "Validation score falls", "Regularise or simplify"] },
  Underfitting: { variant: "flow", items: ["Model too simple for the pattern", "Training score stays low", "Validation score also low", "Add capacity or better features"] },
  "Cross Validation": { variant: "steps", items: ["Split into k folds", "Hold out fold 1, train on the rest", "Score it", "Repeat for every fold", "Average the scores and report the spread"] },
  "Hyperparameter Tuning": { variant: "flow", items: ["Candidate settings", "Train and score each on validation", "Pick the best", "Confirm once on the test set"] },
  "K-Means": { variant: "steps", items: ["Choose k", "Place k centres", "Assign each point to the nearest centre", "Move each centre to its cluster mean", "Repeat until assignments stop changing"] },
  "Elbow Method": { variant: "flow", items: ["Run k-means for several k", "Plot the within-cluster error", "Find where the drop flattens", "Pick that k"] },
  "Decision Trees": { variant: "decision-tree", items: ["Is the feature above the threshold?", "Yes: follow the left branch", "No: follow the right branch"] },
  "Random Forest": { variant: "flow", items: ["Many random data samples", "One decision tree per sample", "Each tree votes", "Majority (or mean) wins"] },
  "Ensemble Learning": { variant: "concept", items: ["Bagging: parallel, reduces variance", "Boosting: sequential, reduces bias", "Stacking: a model over models", "Diversity is what makes it work"] },
  Boosting: { variant: "flow", items: ["Weak model trained", "Its errors weighted up", "Next model targets those errors", "Weighted sum of all models"] },
  Bagging: { variant: "flow", items: ["Bootstrap samples drawn", "One model per sample", "Predictions collected", "Averaged into one answer"] },
  Regularization: { variant: "flow", items: ["Model grows complex", "Penalty added to the loss", "Large weights discouraged", "Simpler, better-generalising model"] },
  "Complete ML Pipeline": { variant: "pipeline", items: ["Raw data", "Preprocessing", "Feature engineering", "Model training", "Evaluation", "Serialisation", "Serving", "Monitoring"] },
  "Model Drift": { variant: "flow", items: ["Deployed model", "Real-world data shifts", "Accuracy degrades quietly", "Monitoring triggers retraining"] },
  "Introduction to MLOps": { variant: "pipeline", items: ["Versioned data", "Reproducible training", "Model registry", "Automated deployment", "Monitoring", "Retraining loop"] },
  "Introduction to Neural Networks": { variant: "architecture", items: ["Input layer (features)", "Hidden layer with weights", "Activation function", "Output layer (prediction)", "Backpropagation updates the weights"] },
  "Neural Networks": { variant: "architecture", items: ["Input layer (features)", "Hidden layers", "Activation functions", "Output layer", "Loss and backpropagation"] },
  PCA: { variant: "flow", items: ["Many correlated features", "Find directions of most variance", "Keep the top components", "Fewer features, most of the signal"] },

  // --- Agentic AI ---------------------------------------------------------
  "What is an AI Agent?": { variant: "flow", items: ["Goal given", "Model decides the next step", "Tool is called", "Result observed", "Loop or finish"] },
  "Agent Loop": { variant: "pipeline", items: ["Goal", "Think", "Act (tool call)", "Observe result", "Decide: continue or stop", "Answer"] },
  "Think → Act → Observe": { variant: "pipeline", items: ["Think: what is needed next", "Act: call the chosen tool", "Observe: read the real result", "Repeat until the goal is met"] },
  "ReAct Pattern": { variant: "pipeline", items: ["Reason about the goal", "Choose an action", "Execute the tool", "Observe the output", "Reason again with new evidence"] },
  "AI Agent Architecture": { variant: "architecture", items: ["Goal and instructions", "Model (the reasoning brain)", "Memory (short and long term)", "Tool layer with permissions", "Execution loop with limits", "Observability and logging"] },
  "Agent Components": { variant: "concept", items: ["Goal: what success means", "Brain: the model", "Memory: what it retains", "Tools: what it can do", "Loop: how it iterates"] },
  "What is an LLM?": { variant: "flow", items: ["Text in", "Split into tokens", "Model predicts the next token", "Repeat", "Text out"] },
  "How LLMs Work — Simple Explanation": { variant: "flow", items: ["Prompt", "Tokenised", "Next token predicted", "Appended and repeated", "Response complete"] },
  Tokens: { variant: "flow", items: ["Raw text", "Split into sub-word tokens", "Mapped to numbers", "Counted against the context window"] },
  "Context Window": { variant: "concept", items: ["System prompt", "Conversation history", "Retrieved documents", "Room left for the answer"] },
  "Function Calling": { variant: "pipeline", items: ["Tools described with a schema", "Model requests one with arguments", "Your code validates the request", "Function runs", "Result returned to the model"] },
  Temperature: { variant: "concept", items: ["Low: focused and repeatable", "Medium: balanced", "High: varied and creative", "Choose it from the task, not by habit"] },
  "What is RAG?": { variant: "pipeline", items: ["User question", "Embed the question", "Search the vector store", "Retrieve top chunks", "Add to the prompt", "Grounded answer"] },
  "RAG Pipeline": { variant: "pipeline", items: ["Documents", "Chunking", "Embedding", "Vector store", "Retrieve on query", "Rerank", "Generate with context"] },
  Chunking: { variant: "flow", items: ["Long document", "Split on meaningful boundaries", "Overlap kept between chunks", "Each chunk embedded separately"] },
  Embeddings: { variant: "flow", items: ["Text", "Embedding model", "Vector of numbers", "Similar meaning lands nearby"] },
  "Vector Databases": { variant: "flow", items: ["Vectors stored with metadata", "Query vector arrives", "Nearest-neighbour search", "Top matches returned"] },
  Retrieval: { variant: "flow", items: ["Query embedded", "Similarity search", "Top-k chunks", "Filtered and reranked"] },
  "Agentic RAG": { variant: "pipeline", items: ["Question", "Agent plans the search", "Retrieves", "Judges whether it is enough", "Searches again if not", "Answers with sources"] },
  "What is MCP?": { variant: "architecture", items: ["AI application (host)", "MCP client", "Transport", "MCP server", "Tools, resources, prompts"] },
  "MCP Architecture": { variant: "architecture", items: ["Host application", "MCP client per server", "JSON-RPC transport", "MCP server", "Underlying system or API"] },
  "What is a Multi-Agent System?": { variant: "architecture", items: ["Supervisor agent", "Task decomposition", "Specialist worker agents", "Shared state and messages", "Aggregated result"] },
  "Multi-Agent Workflow": { variant: "pipeline", items: ["Goal received", "Planner splits the work", "Workers run in parallel", "Results collected", "Supervisor reviews", "Final answer"] },
  Guardrails: { variant: "architecture", items: ["Input validation", "Allowed tool list", "Argument schema checks", "Output filtering", "Human approval for risky actions"] },
  "AI Agent Security": { variant: "concept", items: ["Least-privilege tool access", "Untrusted content is data, not instructions", "Secrets never in the prompt", "Every action logged and reversible"] },
  Observability: { variant: "architecture", items: ["Traces of every step", "Tool call logs", "Token and cost metrics", "Outcome evaluation", "Alerting"] },

  // --- Web foundations ----------------------------------------------------
  "How the Internet Works": { variant: "pipeline", items: ["You type a URL", "DNS resolves the domain", "TCP/TLS connection opens", "HTTP request sent", "Server responds", "Browser renders"] },
  "How Websites Work": { variant: "pipeline", items: ["Browser request", "DNS lookup", "Server handles the route", "Data fetched", "HTML/JSON returned", "Page rendered"] },
  "Client vs Server": { variant: "flow", items: ["Client sends a request", "Network", "Server applies trusted rules", "Response returned"] },
  "Client-Server Architecture": { variant: "architecture", items: ["Browser client", "HTTP over the network", "Application server", "Database", "Response back to the client"] },
  DNS: { variant: "flow", items: ["Domain name typed", "Resolver queried", "Authoritative server answers", "IP address returned"] },
  HTTP: { variant: "flow", items: ["Method and URL", "Headers and body", "Server processes", "Status code and response body"] },
  HTTPS: { variant: "flow", items: ["Client hello", "Certificate verified", "Keys exchanged", "Encrypted traffic"] },
  "Request and Response": { variant: "flow", items: ["Method, path, headers, body", "Sent to the server", "Handler runs", "Status, headers, body returned"] },
  "Web Application Architecture": { variant: "architecture", items: ["Browser (UI)", "CDN / static assets", "API server", "Business logic", "Database", "External services"] },
  "MERN Architecture": { variant: "architecture", items: ["React UI", "Axios / fetch over HTTP", "Express routes", "Node.js services", "Mongoose models", "MongoDB"] },
  "Frontend vs Backend": { variant: "concept", items: ["Frontend: what the user sees", "Backend: trusted rules and data", "API: the contract between them", "Both are needed for a full stack"] },

  // --- Frontend -----------------------------------------------------------
  "What is React?": { variant: "flow", items: ["State changes", "Components re-render", "Virtual DOM diffed", "Only real changes painted"] },
  Components: { variant: "architecture", items: ["App shell", "Layout components", "Feature components", "Shared UI primitives"] },
  State: { variant: "flow", items: ["Event happens", "setState called", "Component re-renders", "UI reflects the new state"] },
  useState: { variant: "flow", items: ["Initial value", "Value read on render", "Setter called by an event", "Re-render with the new value"] },
  useEffect: { variant: "flow", items: ["Component renders", "Effect runs after paint", "Dependencies watched", "Cleanup runs before the next run"] },
  "Box Model": { variant: "architecture", items: ["Content", "Padding", "Border", "Margin"] },
  Flexbox: { variant: "concept", items: ["One axis at a time", "justify-content: main axis", "align-items: cross axis", "flex-grow shares leftover space"] },
  "CSS Grid": { variant: "concept", items: ["Rows and columns together", "grid-template defines the tracks", "Items placed by line or area", "gap replaces margin hacks"] },
  "Responsive Design": { variant: "flow", items: ["Mobile layout first", "Fluid widths and relative units", "Media query at a real breakpoint", "Layout adapts, content does not shrink"] },
  DOM: { variant: "architecture", items: ["HTML document", "Parsed into a node tree", "JavaScript reads and edits nodes", "Browser repaints"] },
  Promises: { variant: "flow", items: ["Pending", "Work runs asynchronously", "Fulfilled with a value or rejected", "then / catch handles the outcome"] },
  "Async/Await": { variant: "flow", items: ["async function called", "await pauses on the promise", "Result assigned when it settles", "try/catch handles rejection"] },
  "Fetch API": { variant: "flow", items: ["fetch(url, options)", "Promise of a Response", "Check response.ok", "Parse the body as JSON"] },

  // --- Backend ------------------------------------------------------------
  "What is Backend Development?": { variant: "architecture", items: ["HTTP route", "Middleware", "Controller", "Service (business rules)", "Data access", "Database"] },
  "Express.js": { variant: "pipeline", items: ["Request arrives", "Middleware chain", "Route matched", "Controller runs", "Response sent"] },
  "Express Introduction": { variant: "pipeline", items: ["Request arrives", "Middleware chain", "Route matched", "Controller runs", "Response sent"] },
  Middleware: { variant: "pipeline", items: ["Request", "Logging", "Authentication", "Validation", "Route handler", "Error handler"] },
  "REST APIs": { variant: "concept", items: ["Resources have URLs", "Methods express intent", "Status codes report outcome", "Responses are representations"] },
  "REST API Design": { variant: "steps", items: ["Model the resources", "Use nouns in paths", "Map verbs to HTTP methods", "Return honest status codes", "Version and document it"] },
  "HTTP Methods": { variant: "concept", items: ["GET: read, no side effects", "POST: create", "PUT/PATCH: replace or update", "DELETE: remove"] },
  "Status Codes": { variant: "concept", items: ["2xx: it worked", "3xx: look elsewhere", "4xx: the request was wrong", "5xx: the server failed"] },
  Pagination: { variant: "flow", items: ["Large result set", "Limit and offset (or cursor)", "One page returned", "Next-page token supplied"] },
  "Rate Limiting": { variant: "decision-tree", items: ["Is the client under its quota?", "Yes: handle the request", "No: return 429 with a retry hint"] },

  // --- Databases ----------------------------------------------------------
  "What is a Database?": { variant: "architecture", items: ["Application", "Driver / ORM", "Query engine", "Storage and indexes", "Durable data files"] },
  "SQL vs NoSQL": { variant: "concept", items: ["SQL: fixed schema, strong joins", "NoSQL: flexible documents", "SQL: transactions across tables", "NoSQL: scale-out and nested data"] },
  Indexing: { variant: "flow", items: ["Query filters on a column", "Index consulted instead of every row", "Matching row pointers found", "Rows fetched quickly"] },
  Transactions: { variant: "steps", items: ["BEGIN", "Apply every change", "Check the constraints", "COMMIT together, or ROLLBACK entirely"] },
  "Database Relationships": { variant: "concept", items: ["One-to-one", "One-to-many", "Many-to-many via a join table", "Foreign keys enforce them"] },
  "Primary Keys": { variant: "concept", items: ["Unique per row", "Never NULL", "Stable over time", "Referenced by foreign keys"] },
  "Foreign Keys": { variant: "flow", items: ["Child row references a parent", "Database checks the parent exists", "Orphan rows rejected", "Referential integrity kept"] },
  Aggregation: { variant: "pipeline", items: ["$match: filter documents", "$group: bucket and accumulate", "$sort: order the groups", "$project: shape the output"] },
  Mongoose: { variant: "flow", items: ["Schema defines the shape", "Model compiled from the schema", "Document validated on save", "Stored in the collection"] },

  // --- Auth & security ----------------------------------------------------
  "Authentication vs Authorization": { variant: "flow", items: ["Who are you? (authentication)", "Identity established", "What may you do? (authorization)", "Action allowed or refused"] },
  JWT: { variant: "flow", items: ["Credentials verified", "Token signed by the server", "Client sends it on each request", "Signature and expiry checked"] },
  "Password Hashing": { variant: "flow", items: ["Plain password", "Salt generated", "Slow hash (bcrypt/argon2)", "Only the hash is stored"] },
  Login: { variant: "pipeline", items: ["Credentials submitted", "User looked up", "Hash compared", "Session or token issued", "Client stores it securely"] },
  "Refresh Tokens": { variant: "flow", items: ["Short-lived access token expires", "Refresh token presented", "Server verifies and rotates it", "New access token issued"] },
  "Protected Routes": { variant: "decision-tree", items: ["Is the request authenticated?", "Yes: run the handler", "No: return 401 and redirect to login"] },
  "Role-Based Access": { variant: "decision-tree", items: ["Does the role include this permission?", "Yes: perform the action", "No: return 403 Forbidden"] },
  CORS: { variant: "flow", items: ["Browser sends a cross-origin request", "Preflight OPTIONS asked", "Server returns allowed origins", "Browser permits or blocks"] },
  "SQL Injection": { variant: "flow", items: ["Untrusted input concatenated into SQL", "Attacker changes the query meaning", "Parameterised queries separate code from data", "Injection blocked"] },
  XSS: { variant: "flow", items: ["Untrusted text stored", "Rendered as HTML", "Script executes in a victim browser", "Escaping and CSP prevent it"] },
  CSRF: { variant: "flow", items: ["Victim is logged in", "Malicious site triggers a request", "Cookie sent automatically", "SameSite cookies and tokens block it"] },
  "Input Validation": { variant: "flow", items: ["Untrusted input", "Schema checked at the boundary", "Rejected or normalised", "Only valid data reaches the logic"] },
  "Secure API Design": { variant: "concept", items: ["Authenticate every request", "Authorise per resource", "Validate all input", "Rate-limit and log"] },

  // --- Git & delivery -----------------------------------------------------
  "What is Git?": { variant: "flow", items: ["Working directory", "git add → staging area", "git commit → local history", "git push → remote"] },
  "Git Workflow": { variant: "pipeline", items: ["Branch from main", "Commit small changes", "Push the branch", "Open a pull request", "Review", "Merge"] },
  Branches: { variant: "flow", items: ["main", "Branch created", "Commits diverge", "Merged back"] },
  "Merge Conflicts": { variant: "steps", items: ["Two branches edit the same lines", "Git marks the conflict", "You choose the correct result", "Remove the markers", "Commit the resolution"] },
  "Pull Requests": { variant: "pipeline", items: ["Branch pushed", "PR opened", "CI checks run", "Review comments", "Approved", "Merged"] },
  "What is Deployment?": { variant: "pipeline", items: ["Code merged", "Build produced", "Tests pass", "Artifact published", "Released to users", "Monitored"] },
  "CI/CD": { variant: "pipeline", items: ["Commit pushed", "Pipeline triggered", "Install and build", "Automated tests", "Artifact built", "Deployed", "Verified"] },
  Docker: { variant: "flow", items: ["Dockerfile", "docker build → image", "docker run → container", "Same behaviour everywhere"] },
  Dockerfile: { variant: "steps", items: ["FROM a base image", "COPY the application files", "RUN the install step", "EXPOSE the port", "CMD to start the process"] },
  "Docker Compose": { variant: "architecture", items: ["Web service", "API service", "Database service", "Shared network and volumes"] },
  "GitHub Actions": { variant: "pipeline", items: ["Trigger event", "Runner starts", "Job steps execute", "Artifacts and reports", "Deploy step"] },
  Monitoring: { variant: "flow", items: ["Application emits logs and metrics", "Collected centrally", "Thresholds evaluated", "Alert raised to a human"] },
  Scaling: { variant: "concept", items: ["Vertical: a bigger machine", "Horizontal: more machines", "Load balancer spreads traffic", "Stateless services scale most easily"] },

  // --- Testing ------------------------------------------------------------
  "What is Software Testing?": { variant: "pipeline", items: ["Understand the requirement", "Design the check", "Run it", "Compare expected with actual", "Report the evidence"] },
  "Software Development Life Cycle": { variant: "timeline", items: ["Requirements", "Design", "Implementation", "Testing", "Deployment", "Maintenance"] },
  "Software Testing Life Cycle": { variant: "timeline", items: ["Requirement analysis", "Test planning", "Test design", "Environment setup", "Execution", "Closure"] },
  "Bug Lifecycle": { variant: "timeline", items: ["New", "Assigned", "In progress", "Fixed", "Retest", "Closed"] },
  "Test Case": { variant: "steps", items: ["Precondition", "Test data", "Steps to perform", "Expected result", "Actual result", "Pass or fail with evidence"] },
  "Writing Test Cases": { variant: "steps", items: ["Identify the requirement", "Define the precondition", "Write unambiguous steps", "State one expected result", "Add the data needed to repeat it"] },
  "Boundary Value Analysis": { variant: "concept", items: ["Just below the minimum", "The minimum", "The maximum", "Just above the maximum"] },
  "Equivalence Partitioning": { variant: "concept", items: ["Split inputs into classes", "Valid class", "Invalid class", "Test one value per class"] },
  "Manual vs Automation": { variant: "concept", items: ["Manual: exploratory and usability", "Automation: repetitive regression", "Manual finds the unexpected", "Automation guards the known"] },
  "Testing Mindset": { variant: "concept", items: ["Ask what could go wrong", "Test the requirement, not the code you hope for", "Reproduce before reporting", "Evidence over opinion"] },
  "Severity | Priority": { variant: "concept", items: ["Severity: technical impact", "Priority: business urgency", "High severity, low priority is possible", "Both are recorded on the report"] },
  "Bug Report": { variant: "steps", items: ["Clear title", "Environment and build", "Steps to reproduce", "Expected vs actual", "Evidence: logs and screenshots", "Severity and priority"] },
  "What is an API?": { variant: "flow", items: ["Client request", "Contract (method, path, body)", "Server handler", "Structured response"] },
  Postman: { variant: "pipeline", items: ["Create a request", "Set headers and body", "Send", "Inspect status and body", "Add assertions to a collection"] },
  "What is Playwright?": { variant: "pipeline", items: ["Launch a browser", "Navigate to the page", "Locate an element", "Act on it", "Assert the outcome", "Report and trace"] },
  Locators: { variant: "concept", items: ["Prefer role and label", "Then test id", "Avoid brittle CSS chains", "Never depend on layout position"] },
  "Page Objects": { variant: "architecture", items: ["Test file (intent)", "Page object (interactions)", "Locators", "Application under test"] },
  "Load Testing": { variant: "flow", items: ["Model realistic traffic", "Ramp up users", "Measure response time and errors", "Find the breaking point"] },
  "Root Cause Analysis": { variant: "steps", items: ["Reproduce the failure", "Collect logs and data", "Form a hypothesis", "Test it", "Fix the cause, not the symptom"] },
  "Test Coverage": { variant: "concept", items: ["Requirements covered", "Paths covered", "Data classes covered", "Coverage is a signal, not a goal"] },
  "Traceability Matrix": { variant: "flow", items: ["Requirement", "Mapped test cases", "Execution result", "Coverage gap visible"] },
};

/** Keyword rules applied to `${title} ${moduleTitle}` when no exact match exists. */
const keywordRules: Array<[RegExp, Diagram]> = [
  [/\bcapstone|final project|end-to-end|portfolio\b/i, { variant: "pipeline", items: ["Problem statement", "Data or requirements gathered", "Build the solution", "Test and validate", "Document the decisions", "Present the result"] }],
  [/\bfinal assessment|assessment\b/i, { variant: "steps", items: ["Review every module", "Attempt the assessment", "Check the explanations", "Revisit weak topics", "Re-attempt to confirm"] }],
  [/\bdeploy|production|release|hosting\b/i, { variant: "pipeline", items: ["Build", "Automated checks", "Staging release", "Production release", "Monitor", "Roll back if needed"] }],
  [/\bmonitor|logging|observab|drift\b/i, { variant: "flow", items: ["System runs", "Signals collected", "Thresholds compared", "Human alerted"] }],
  [/\bsecurity|vulnerab|hardening\b/i, { variant: "concept", items: ["Least privilege", "Validate every input", "Encrypt in transit and at rest", "Log and review access"] }],
  [/\bclean|missing|duplicate|wrangl|quality\b/i, { variant: "pipeline", items: ["Profile the data", "Fix types", "Handle missing values", "Remove duplicates", "Validate", "Clean dataset"] }],
  [/\bjoin|merge\b/i, { variant: "flow", items: ["Left dataset", "Right dataset", "Match on the key", "Combined result"] }],
  [/\bfilter|where\b/i, { variant: "flow", items: ["All records", "Condition applied", "Matching records kept", "Smaller result"] }],
  [/\bsort|order by\b/i, { variant: "flow", items: ["Unordered records", "Sort key chosen", "Direction applied", "Ordered result"] }],
  [/\bgroup|aggregat\b/i, { variant: "flow", items: ["Detail rows", "Grouped by key", "Aggregate computed", "One row per group"] }],
  [/\bchart|visuali[sz]|plot|dashboard|kpi\b/i, { variant: "pipeline", items: ["Question", "Prepared data", "Chart type chosen", "Encoding and labels", "Reviewed for honesty", "Shared"] }],
  [/\bstatistic|probabilit|distribution|hypothesis\b/i, { variant: "pipeline", items: ["Question", "Sample collected", "Statistic computed", "Uncertainty quantified", "Conclusion stated with limits"] }],
  [/\bmodel|train|predict|regression|classif|cluster\b/i, { variant: "pipeline", items: ["Prepared features", "Train on the training split", "Predict on held-out data", "Score against the truth", "Tune", "Retrain the final model"] }],
  [/\bfeature engineering|feature selection|encoding|scaling|normali[sz]|standardi[sz]\b/i, { variant: "flow", items: ["Raw columns", "Transformation applied", "Fitted on training data only", "Same transform applied to new data"] }],
  [/\bagent|tool call|prompt|llm|rag|retriev|mcp\b/i, { variant: "pipeline", items: ["Goal and context", "Model decides", "Approved tool called", "Result observed", "Checked", "Response or next step"] }],
  [/\btest case|test scenario|test plan|test design\b/i, { variant: "steps", items: ["Requirement identified", "Precondition set", "Steps written", "Expected result defined", "Executed and evidenced"] }],
  [/\bautomation|playwright|selenium|cypress\b/i, { variant: "pipeline", items: ["Locate the element", "Perform the action", "Wait for the state", "Assert the outcome", "Report with a trace"] }],
  [/\bbug|defect|triage\b/i, { variant: "timeline", items: ["Found", "Reported", "Triaged", "Fixed", "Retested", "Closed"] }],
  [/\bapi\b/i, { variant: "flow", items: ["Client request", "Validation and auth", "Handler executes", "Structured response"] }],
  [/\bcomponent|react|jsx|hook|props|state\b/i, { variant: "flow", items: ["Props and state in", "Component renders", "User event", "State updates and re-renders"] }],
  [/\bhtml|css|layout|styling|semantic\b/i, { variant: "architecture", items: ["Semantic HTML structure", "CSS presentation layer", "Responsive rules", "Accessible rendered page"] }],
  [/\bdatabase|mongo|postgres|collection|document|table\b/i, { variant: "architecture", items: ["Application", "Query or ORM layer", "Database engine", "Indexes and storage"] }],
  [/\bgit\b/i, { variant: "flow", items: ["Working directory", "Staging area", "Local commit", "Remote repository"] }],
  [/\bauth|login|token|session|permission\b/i, { variant: "flow", items: ["Credentials or token", "Identity verified", "Permissions checked", "Access granted or refused"] }],
  [/\binterview|career|resume|job\b/i, { variant: "steps", items: ["Learn the concept", "Build a small proof", "Write it up", "Explain the trade-offs", "Answer follow-up questions"] }],
  [/\bwhy\b/i, { variant: "flow", items: ["Problem without it", "Cost of that gap", "Approach applied", "Measurable improvement"] }],
  [/\bpractice with|practical\b/i, { variant: "steps", items: ["Set up a tiny example", "Predict the result first", "Run it", "Compare with your prediction", "Explain any difference"] }],
  [/\bcommon .* mistakes|pitfall\b/i, { variant: "concept", items: ["Starting without a success measure", "Testing only on familiar examples", "Ignoring edge cases", "Skipping the write-up"] }],
];

/** Last-resort diagrams, one per subject, so no lesson falls back to a placeholder. */
const bySubject: Record<Course["subject"], Diagram> = {
  analytics: { variant: "pipeline", items: ["Business question", "Data collected", "Cleaned", "Analysed", "Visualised", "Recommendation"] },
  science: { variant: "pipeline", items: ["Problem framed", "Data prepared", "Explored", "Modelled", "Evaluated", "Deployed and monitored"] },
  ml: { variant: "pipeline", items: ["Data", "Features", "Training", "Evaluation", "Tuning", "Prediction"] },
  agents: { variant: "pipeline", items: ["Goal", "Plan", "Tool call", "Observation", "Check", "Answer"] },
  fullstack: { variant: "architecture", items: ["Browser UI", "API layer", "Business logic", "Database"] },
  mern: { variant: "architecture", items: ["React UI", "Express API", "Node services", "MongoDB"] },
  testing: { variant: "pipeline", items: ["Requirement", "Test design", "Execution", "Defect report", "Fix", "Retest"] },
};

/**
 * Best available diagram for a lesson. Always returns something specific
 * enough to be worth drawing.
 */
export function diagramForTopic(
  title: string,
  moduleTitle: string,
  subject: Course["subject"],
): Diagram {
  const exact = byTitle[title];
  if (exact) return exact;
  const haystack = `${title} ${moduleTitle}`;
  for (const [pattern, diagram] of keywordRules) if (pattern.test(haystack)) return diagram;
  return bySubject[subject];
}

export function hasTopicDiagram(title: string) {
  return Boolean(byTitle[title]);
}
