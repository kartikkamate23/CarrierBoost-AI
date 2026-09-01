import type { CodeLanguage, ContentBlock, Course, Lesson, QuizQuestion, Unit } from "../types/course.ts";

type SoftwareSubject = "fullstack" | "mern" | "testing";
type ModuleDefinition = [title: string, lessons: string[], description: string];

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const definitions: Record<string, string> = {
  "How the Internet Works": "The internet is a network of networks that moves data between devices using shared protocols. A browser resolves a domain, opens a connection, sends an HTTP request, and renders the server response.",
  "Client vs Server": "A client requests an experience or resource; a server receives that request, applies trusted application rules, and returns a response.",
  "What is HTML?": "HTML gives web content structure and meaning so browsers and assistive technologies can understand headings, navigation, forms, images, and relationships.",
  "What is CSS?": "CSS controls the presentation and layout of structured content while allowing the HTML to keep its semantic meaning.",
  "What is JavaScript?": "JavaScript is the programming language that adds behavior, state, data processing, and browser interaction to web experiences.",
  "What is React?": "React is a library for building interfaces from reusable components whose output is derived from data and state.",
  "What is Backend Development?": "Backend development implements trusted server-side rules, data access, authentication, integrations, and APIs that clients rely on.",
  "REST APIs": "A REST API lets applications exchange representations of resources through predictable HTTP requests and responses.",
  "What is a Database?": "A database is organized digital storage designed to save, retrieve, validate, and update application data reliably.",
  "SQL vs NoSQL": "SQL databases organize related data in tables with defined relationships; NoSQL databases offer other models such as flexible documents. The workload should drive the choice.",
  "Authentication vs Authorization": "Authentication establishes who a user is. Authorization decides what that authenticated identity is allowed to do.",
  "What is Git?": "Git records snapshots of a codebase so developers can review history, create branches, collaborate, and recover safely.",
  "What is Deployment?": "Deployment moves a tested application into an environment where intended users can access it reliably.",
  "Docker": "Docker packages an application and its runtime dependencies into a repeatable container image that can run consistently across environments.",
  "CI/CD": "CI/CD automates integration checks and delivery steps so teams can release smaller changes with fast, repeatable feedback.",
  "MERN Architecture": "MERN combines MongoDB, Express, React, and Node.js so teams can build a full web application primarily with JavaScript.",
  "What is MongoDB?": "MongoDB stores records as flexible BSON documents grouped into collections and supports queries, aggregation, indexing, and transactions.",
  "What is Node.js?": "Node.js runs JavaScript outside the browser and is commonly used for event-driven servers, command-line tools, and automation.",
  "Express Introduction": "Express is a minimal Node.js web framework for composing routes, middleware, request handling, and API responses.",
  "What is Software Testing?": "Software testing checks whether a product behaves as expected, handles risk, and provides useful evidence before people depend on it.",
  "Quality Assurance": "Quality assurance improves the process used to prevent defects and build confidence throughout delivery, not only after coding ends.",
  "Software Development Life Cycle": "The SDLC organizes how a product moves from requirements through design, implementation, testing, deployment, and maintenance.",
  "Software Testing Life Cycle": "The STLC organizes testing work from requirement analysis and planning through design, execution, defect reporting, regression, and closure.",
  "Manual Testing": "Manual testing is a person deliberately exploring and checking software without using a script to perform each interaction.",
  "Test Case": "A test case records a specific condition, setup, action, expected result, and evidence so a check can be repeated and reviewed.",
  "What is a Bug?": "A bug is observable product behavior that differs from an agreed requirement, expected behavior, or important user need.",
  "What is an API?": "An API is a defined way for software components to request capabilities or data from one another.",
  "What is Playwright?": "Playwright is a browser automation framework for reliable end-to-end testing across modern browser engines.",
  "Performance Testing": "Performance testing measures responsiveness, stability, and capacity under representative workloads.",
};

function simpleDefinition(title: string, moduleTitle: string, subject: SoftwareSubject) {
  if (definitions[title]) return definitions[title];
  const context = subject === "testing" ? "software quality workflow" : subject === "mern" ? "MERN application" : "full-stack web application";
  return `${title} is a practical part of the ${context}. In this lesson, you will learn its purpose, how it connects to ${moduleTitle.toLowerCase()}, and how to verify that it works.`;
}

function analogyFor(title: string, subject: SoftwareSubject) {
  if (/api|request|response|http/i.test(title)) return "Think of an API like a restaurant waiter: the client states a request, the waiter carries it to the kitchen, and a clear response returns to the client.";
  if (/database|mongo|sql|collection|document|table/i.test(title)) return "Think of a database as organized digital storage: labels, relationships, and indexes help the application put information away and find it again safely.";
  if (/git|commit|branch/i.test(title)) return "Think of Git as named save points for code. A branch lets you explore a change without rewriting the team’s shared history.";
  if (/docker|container|image/i.test(title)) return "Think of Docker as a standardized box containing the application and the runtime pieces it needs, with clear instructions for opening the box.";
  if (/test|qa|quality|bug|defect/i.test(title) || subject === "testing") return "Think of testing as a pre-flight check: inspect the important systems, simulate realistic and risky conditions, record evidence, and stop the release when safety is uncertain.";
  if (/component|react|frontend|html|css/i.test(title)) return "Think of the interface as a well-organized storefront: structure gives every area meaning, styling guides attention, and components keep repeated parts consistent.";
  return "Think of this concept as one station in a delivery line. It receives a clear input, performs one responsibility, exposes the result, and hands reliable evidence to the next station.";
}

function diagramFor(title: string, moduleTitle: string, subject: SoftwareSubject): ContentBlock {
  if (/authentication|login|jwt|protected route/i.test(`${title} ${moduleTitle}`)) return { type: "diagram", variant: "flow", items: ["Login form", "POST /login", "Verify credentials", "Issue secure token/session", "Protected request", "Authorization check"] };
  if (/deployment|docker|ci\/cd|production build|github actions/i.test(`${title} ${moduleTitle}`)) return { type: "diagram", variant: "pipeline", items: ["Developer", "Git repository", "CI checks", "Build", "Automated tests", "Container", "Cloud", "Production"] };
  if (subject === "mern") return { type: "diagram", variant: "architecture", items: ["React UI", "HTTP / Axios", "Express route", "Node service", "Mongoose model", "MongoDB", "JSON response", "UI update"] };
  if (subject === "testing" && /manual vs automation|testing pyramid|why automation/i.test(`${title} ${moduleTitle}`)) return { type: "diagram", variant: "concept", items: ["Many fast unit checks", "Focused API / integration checks", "A few valuable UI journeys"] };
  if (subject === "testing") return { type: "diagram", variant: "flow", items: ["Requirement", "Test design", "Test data", "Execute", "Record evidence", "Report defect", "Retest", "Regression", "Quality decision"] };
  return { type: "diagram", variant: "flow", items: ["User", "React UI", "HTTP request", "Express API", "Business logic", "Database", "Response", "UI update"] };
}

function codeFor(title: string, moduleTitle: string, subject: SoftwareSubject): { language: CodeLanguage; code: string } | null {
  const value = `${title} ${moduleTitle}`;
  if (/html|semantic|form|heading|paragraph|link|image|list|table/i.test(value)) return { language: "html", code: `<main>\n  <h1>Project dashboard</h1>\n  <form aria-label="Add task">\n    <label for="task">Task name</label>\n    <input id="task" name="task" required />\n    <button>Add task</button>\n  </form>\n</main>` };
  if (/css|flexbox|grid|responsive|media quer|box model/i.test(value)) return { language: "css", code: `.card-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));\n  gap: 1rem;\n}\n\nbutton:focus-visible { outline: 3px solid #5b55e7; }` };
  if (/react|component|jsx|state|hook|router|frontend/i.test(value)) return { language: "javascript", code: `function TaskList({ tasks }) {\n  const [filter, setFilter] = useState("");\n  const visible = tasks.filter(task => task.title.includes(filter));\n  return <ul>{visible.map(task => <li key={task.id}>{task.title}</li>)}</ul>;\n}` };
  if (/express|route|controller|middleware|rest|backend|server|status code|request body/i.test(value)) return { language: "javascript", code: `app.post("/api/tasks", validateTask, async (req, res, next) => {\n  try {\n    const task = await taskService.create(req.body);\n    res.status(201).json(task);\n  } catch (error) { next(error); }\n});` };
  if (/mongo|mongoose|document|collection|aggregation|index/i.test(value)) return { language: "javascript", code: `const taskSchema = new Schema({\n  title: { type: String, required: true },\n  ownerId: { type: ObjectId, required: true, index: true },\n  completed: { type: Boolean, default: false }\n});` };
  if (/sql|database testing|select|where|join|group by|data validation/i.test(value)) return { language: "sql", code: `SELECT u.id, u.email, COUNT(o.id) AS order_count\nFROM users AS u\nLEFT JOIN orders AS o ON o.user_id = u.id\nGROUP BY u.id, u.email\nORDER BY order_count DESC;` };
  if (/playwright|locator|assertion|browser automation|page object|cross-browser/i.test(value)) return { language: "typescript", code: `import { test, expect } from "@playwright/test";\n\ntest("user can sign in", async ({ page }) => {\n  await page.goto("/login");\n  await page.getByLabel("Email").fill("learner@example.com");\n  await page.getByRole("button", { name: "Sign in" }).click();\n  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();\n});` };
  if (/postman|api test|http method|headers|request body|json/i.test(value)) return { language: "javascript", code: `pm.test("creates a task", () => {\n  pm.response.to.have.status(201);\n  const body = pm.response.json();\n  pm.expect(body).to.have.property("id");\n});` };
  if (/javascript|variable|array|object|function|promise|async|fetch|event|dom/i.test(value)) return { language: "javascript", code: `async function loadTasks() {\n  const response = await fetch("/api/tasks");\n  if (!response.ok) throw new Error("Could not load tasks");\n  return response.json();\n}` };
  if (/dockerfile|docker|container|image/i.test(value)) return { language: "bash", code: `docker build -t task-app .\ndocker run --env-file .env -p 3000:3000 task-app\ndocker compose up --build` };
  return subject === "testing" ? { language: "typescript", code: `const testCase = {\n  precondition: "A registered user exists",\n  action: "Submit valid credentials",\n  expected: "Dashboard opens without exposing secrets"\n};` } : null;
}

function resourceFor(title: string, moduleTitle: string, subject: SoftwareSubject): ContentBlock {
  const value = `${title} ${moduleTitle}`;
  if (/react/i.test(value)) return { type: "resource", title: "React Learn", url: "https://react.dev/learn", description: "Use the official React learning guide to verify current component, state, event, and effect patterns." };
  if (/mongo|mongoose/i.test(value)) return { type: "resource", title: "MongoDB Documentation", url: "https://www.mongodb.com/docs/manual/", description: "Review the official database manual for document modeling, CRUD, aggregation, indexing, and transactions." };
  if (/express|middleware|route/i.test(value)) return { type: "resource", title: "Express Documentation", url: "https://expressjs.com/en/guide/routing.html", description: "Use the official Express guides for routing, middleware, and error-handling behavior." };
  if (/playwright|automation/i.test(value)) return { type: "resource", title: "Playwright Documentation", url: "https://playwright.dev/docs/intro", description: "Practice with the official guidance for user-facing locators, web-first assertions, fixtures, projects, and CI." };
  if (/postman|api testing/i.test(value)) return { type: "resource", title: "Postman Documentation", url: "https://learning.postman.com/docs/getting-started/overview/", description: "Use the official API client, collection, environment, scripting, and runner documentation." };
  if (/docker|container|compose/i.test(value)) return { type: "resource", title: "Docker Get Started", url: "https://docs.docker.com/get-started/", description: "Follow the official container, image, Dockerfile, Compose, and production workflow guidance." };
  if (/git|github/i.test(value)) return { type: "resource", title: "GitHub Documentation", url: "https://docs.github.com/en/get-started", description: "Review official version-control collaboration, pull-request, issue, and Actions workflows." };
  if (subject === "testing") return { type: "resource", title: "Web Testing — MDN", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Testing", description: "Connect testing technique to accessibility, cross-browser behavior, automation, and responsible web delivery." };
  return { type: "resource", title: "MDN Web Docs", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development", description: "Use MDN to verify web-platform terminology, semantic HTML, accessible CSS, JavaScript, HTTP, and browser behavior." };
}

function learningBlocks(title: string, moduleTitle: string, subject: SoftwareSubject, type: Lesson["type"]): ContentBlock[] {
  const blocks: ContentBlock[] = [
    { type: "heading", text: "What is it?" },
    { type: "paragraph", text: simpleDefinition(title, moduleTitle, subject) },
    { type: "heading", text: "Why it matters" },
    { type: "paragraph", text: `${title} matters because production work needs clear responsibilities, predictable behavior, and evidence that the result serves a real user or delivery goal.` },
    { type: "callout", title: "Daily-life analogy", text: analogyFor(title, subject), tone: "info" },
    { type: "heading", text: "See the workflow" },
    diagramFor(title, moduleTitle, subject),
    { type: "heading", text: "Step by step" },
    { type: "list", items: ["Define the user, requirement, and expected outcome.", `Place ${title} in the larger ${moduleTitle.toLowerCase()} workflow.`, "Build the smallest observable example.", "Check the normal path, an invalid input, and an edge case.", "Record what worked, what failed, and what should improve next."] },
    { type: "heading", text: "Technical explanation" },
    { type: "paragraph", text: `In technical terms, ${title} should expose a clear contract: known inputs, one primary responsibility, observable output, explicit failure behavior, and boundaries for security and performance. That contract makes the work easier to integrate, test, and maintain.` },
    { type: "heading", text: "Practical example" },
    { type: "paragraph", text: `Imagine a task-management application. Apply ${title} to one small user journey, such as creating a task, loading a list, protecting an account, or verifying a response. Keep the example small enough to explain and repeat.` },
  ];
  const code = codeFor(title, moduleTitle, subject);
  if (code) blocks.push({ type: "code", ...code });
  blocks.push(
    { type: "callout", title: "Practice exercise", text: `Create a five-minute example of ${title}. Write the expected input and output first, implement or test one normal case, then add one failure case and explain the evidence you observed.`, tone: "warning" },
    { type: "heading", text: "Common mistakes" },
    { type: "list", items: ["Starting with a tool before defining the user outcome.", "Testing only the happy path and ignoring invalid, empty, slow, or unauthorized conditions.", "Hiding assumptions, secrets, errors, or validation inside code that teammates cannot review."] },
    { type: "heading", text: "Interview questions" },
    { type: "list", items: [`How would you explain ${title} to a beginner?`, `Where does ${title} belong in a production system?`, `How would you test or validate ${title}?`, "What trade-off or failure mode would you discuss with a teammate?"] },
    { type: "callout", title: "Still confused?", text: `${analogyFor(title, subject)} Now trace one request or test from its starting point to the final evidence, naming what each step receives and returns.`, tone: "info" },
    { type: "callout", title: type === "project" ? "Portfolio milestone" : "Key takeaways", text: type === "project" ? `Build this milestone in a public-ready repository. Include a README, setup steps, decisions, validation evidence, one limitation, a demo, and a resume bullet you can defend in an interview.` : `${title} is useful when it solves a defined problem, has a visible contract, handles failure deliberately, and can be verified with repeatable evidence.`, tone: "success" },
    resourceFor(title, moduleTitle, subject),
  );
  return blocks;
}

const fullStackQuestions: Array<[string, string[], number, string]> = [
  ["Which layer gives web content structure and meaning?", ["HTML", "CSS", "DNS", "Docker"], 0, "Semantic HTML describes the document structure and meaning."],
  ["Which HTTP method is commonly used to create a new resource?", ["GET", "POST", "DELETE", "HEAD"], 1, "POST commonly submits a representation used to create a resource."],
  ["Where should password verification happen?", ["Trusted server code", "Public CSS", "The URL", "A client comment"], 0, "Credential verification belongs in trusted server-side code."],
  ["What is middleware?", ["Code in the request-response pipeline", "A database table", "A CSS selector", "A browser tab"], 0, "Middleware inspects or changes a request, response, or control flow."],
  ["What does a database index usually trade?", ["Extra storage and write work for faster reads", "Security for color", "HTML for CSS", "Tests for users"], 0, "Indexes speed suitable queries but require storage and maintenance during writes."],
  ["What should CI run before deployment?", ["Repeatable build and tests", "Only a logo", "A manual password", "Nothing"], 0, "CI should provide fast evidence that the change builds and behaves as expected."],
  ["Which status code means a resource was created?", ["201", "404", "500", "301"], 0, "201 Created reports successful resource creation."],
  ["What is authorization?", ["Deciding what an identity may do", "Hashing CSS", "Resolving DNS", "Rendering HTML"], 0, "Authorization evaluates permissions after identity is known."],
  ["Why use environment variables?", ["Separate environment-specific configuration from source", "Make secrets public", "Replace tests", "Style forms"], 0, "Environment variables keep deploy-specific settings outside committed source."],
];

const mernQuestions: typeof fullStackQuestions = [
  ["What does React primarily manage in MERN?", ["The user interface", "MongoDB indexes", "DNS", "Container images"], 0, "React composes the browser interface from components and state."],
  ["What does Express provide?", ["Routing and middleware", "A document database", "CSS layout", "A browser engine"], 0, "Express composes Node.js HTTP routes and middleware."],
  ["What is a MongoDB document?", ["A BSON record", "A CSS file", "A Git branch", "An HTTP status"], 0, "MongoDB stores records as BSON documents in collections."],
  ["What does Mongoose add?", ["Schemas, models, validation, and query helpers", "Browser rendering", "DNS hosting", "CSS animation"], 0, "Mongoose models application data and provides validation and query APIs."],
  ["Where should a JWT signature be verified?", ["Trusted backend middleware", "The public React bundle only", "A README", "A CSS class"], 0, "The backend must verify token integrity and claims before trusting them."],
  ["What makes an Express error handler distinct?", ["It accepts four arguments", "It has no parameters", "It runs in CSS", "It stores documents"], 0, "Express recognizes error middleware by the error, request, response, and next parameters."],
  ["Why paginate a list endpoint?", ["Bound response size and work", "Remove authorization", "Avoid JSON", "Disable indexes"], 0, "Pagination keeps large datasets and responses manageable."],
  ["Why create a MongoDB index?", ["Support frequent query patterns", "Replace validation", "Style documents", "Render React"], 0, "Indexes improve matching and sorting for planned query patterns."],
  ["What should React show during an API request?", ["Explicit loading and error states", "A frozen page", "A secret token", "Nothing ever"], 0, "Visible states help users understand progress and recover from failure."],
];

const testingQuestions: typeof fullStackQuestions = [
  ["How does QA differ from testing?", ["QA improves the process; testing evaluates the product", "They are unrelated", "QA is only automation", "Testing is only documentation"], 0, "QA is broader process-oriented quality work; testing supplies product evidence."],
  ["What is smoke testing?", ["A broad check of critical stability", "Only a performance test", "A database backup", "A design review"], 0, "Smoke checks establish that a build is stable enough for deeper testing."],
  ["What is retesting?", ["Checking a specific fix again", "Running every historical test", "Writing requirements", "Deploying without evidence"], 0, "Retesting verifies that a reported defect was fixed."],
  ["What is regression testing?", ["Checking that change did not break existing behavior", "Only retesting one bug", "Deleting old tests", "Measuring color"], 0, "Regression testing looks for unintended effects across existing behavior."],
  ["What does severity describe?", ["Impact of a defect", "Scheduling urgency only", "Tester seniority", "Code length"], 0, "Severity represents the effect on users or the system."],
  ["Why test an API independently of the UI?", ["Get faster, focused service evidence", "Avoid status codes", "Remove authentication", "Skip data validation"], 0, "API checks isolate service contracts and often run faster than UI journeys."],
  ["Which Playwright locator best follows user perception?", ["getByRole with an accessible name", "A long CSS chain", "A random class", "Pixel coordinates"], 0, "Role and accessible name align the test with the interface users experience."],
  ["What does boundary-value analysis target?", ["Values at and around limits", "Only average inputs", "CSS borders", "Deployment regions"], 0, "Defects often cluster around minimum, maximum, and transition boundaries."],
  ["What belongs in a useful bug report?", ["Clear steps, expected/actual result, environment, and evidence", "Only a title", "A guess without reproduction", "A password"], 0, "Reproducible evidence helps the team understand and resolve the defect."],
];

function quizQuestions(moduleTitle: string, subject: SoftwareSubject): QuizQuestion[] {
  const bank = subject === "testing" ? testingQuestions : subject === "mern" ? mernQuestions : fullStackQuestions;
  const moduleSeed = Array.from(moduleTitle).reduce((sum, character) => sum + character.charCodeAt(0), 0);
  const rotated = bank.map((_, index) => bank[(index + moduleSeed) % bank.length]);
  const contextual: [string, string[], number, string] = [`Which skill is central to the ${moduleTitle} module?`, [moduleTitle, "Memorize names only", "Skip failure cases", "Avoid feedback"], 0, `A small observable ${moduleTitle} example plus deliberate practice builds transferable understanding.`];
  return [contextual, ...rotated].map(([prompt, options, answer, explanation], index) => ({ id: `${slugify(moduleTitle)}-q${index + 1}`, prompt, options, answer, explanation }));
}

function makeUnits(definitions: ModuleDefinition[], subject: SoftwareSubject): Unit[] {
  return definitions.map(([title, sourceTitles, description], index) => {
    const lessonTitles = sourceTitles.some((item) => /quiz|assessment/i.test(item)) ? sourceTitles : [...sourceTitles, "Module Quiz"];
    const lessons = lessonTitles.map((lessonTitle, lessonIndex): Lesson => {
      const quiz = /quiz|assessment/i.test(lessonTitle);
      const project = /project|capstone|portfolio website|task management application|blog platform|job portal|e-commerce application|test a login system|playwright automation|performance testing/i.test(lessonTitle) && !quiz;
      const type: Lesson["type"] = quiz ? "quiz" : project ? "project" : "lesson";
      return { id: `module-${index + 1}-${slugify(lessonTitle)}`, title: lessonTitle, type, duration: quiz ? "12 min" : project ? "24 min" : `${8 + (lessonIndex % 4) * 2} min`, description: quiz ? `Check your understanding of ${title}.` : `Understand ${lessonTitle.toLowerCase()}, see it in context, practice it, and learn how to validate the result.`, content: learningBlocks(lessonTitle, title, subject, type), questions: quiz ? quizQuestions(title, subject) : undefined };
    });
    return { id: `module-${index + 1}`, title, description, lessons };
  });
}

const fullStackModules: ModuleDefinition[] = [
  ["Web & Internet Foundations", ["How the Internet Works", "Client vs Server", "Browser", "DNS", "HTTP", "HTTPS", "Request and Response", "URLs", "Domains", "Hosting", "Frontend vs Backend", "Full Stack Developer", "Web Application Architecture", "Module Quiz"], "Trace a web request from a user’s browser through the network, application server, and database."],
  ["HTML", ["What is HTML?", "HTML Document Structure", "Elements", "Attributes", "Headings", "Paragraphs", "Links", "Images", "Lists", "Tables", "Forms", "Semantic HTML", "Accessibility", "Responsive Portfolio Website", "Module Quiz"], "Create semantic, accessible documents and forms that work before styling or scripting is added."],
  ["CSS", ["What is CSS?", "Selectors", "Colors", "Fonts", "Box Model", "Margin", "Padding", "Borders", "Display", "Position", "Flexbox", "CSS Grid", "Responsive Design", "Media Queries", "Animations", "CSS Project", "Module Quiz"], "Build responsive layouts with clear hierarchy, resilient sizing, and accessible interaction states."],
  ["JavaScript", ["What is JavaScript?", "Variables", "Data Types", "Operators", "Conditions", "Loops", "Functions", "Arrays", "Objects", "DOM", "Events", "Async JavaScript", "Promises", "Async/Await", "Fetch API", "JSON", "Modules", "Error Handling", "Local Storage", "Task Management Application", "Module Quiz"], "Use modern JavaScript to model data, respond to users, call APIs, and handle failure."],
  ["Frontend Development with React", ["What is React?", "Why React?", "Components", "JSX", "Props", "State", "Events", "Conditional Rendering", "Lists", "Forms", "useState", "useEffect", "useRef", "Custom Hooks", "React Router", "Context API", "API Integration", "Error Handling", "Loading States", "Blog Platform Project", "React Project", "Module Quiz"], "Compose accessible interfaces from components, state, events, routing, and explicit loading and error states."],
  ["Backend Development", ["What is Backend Development?", "Node.js", "npm", "Modules", "Express.js", "Server", "Routes", "Middleware", "Controllers", "Services", "REST APIs", "HTTP Methods", "Status Codes", "Request Body", "Query Parameters", "Authentication", "Authorization", "Error Handling", "REST API Project", "Backend Project", "Module Quiz"], "Design a layered backend with predictable APIs, validation, authorization, and error handling."],
  ["Databases", ["What is a Database?", "SQL vs NoSQL", "Relational Databases", "Tables", "Primary Keys", "Foreign Keys", "SQL Basics", "CRUD", "JOINs", "MongoDB", "Documents", "Collections", "CRUD in MongoDB", "Database Relationships", "Indexing", "Transactions", "Database Security", "Module Quiz"], "Choose, model, query, validate, index, and secure relational and document data."],
  ["Authentication & Security", ["Authentication vs Authorization", "Login", "Registration", "Password Hashing", "Sessions", "Cookies", "JWT", "Refresh Tokens", "Role-Based Access", "CORS", "HTTPS", "Environment Variables", "Input Validation", "SQL Injection", "XSS", "CSRF", "Secure API Design", "Authentication System Project", "Module Quiz"], "Protect identities, credentials, sessions, permissions, inputs, and browser-server boundaries."],
  ["Git, GitHub & Collaboration", ["What is Git?", "Repository", "git init", "git clone", "git add", "git commit", "git push", "git pull", "Branches", "Merge", "Pull Requests", "Merge Conflicts", "GitHub Issues", "README", "Git Workflow", "Module Quiz"], "Use reviewable version-control workflows and documentation to collaborate safely."],
  ["Testing Full Stack Applications", ["Why Testing?", "Unit Testing", "Integration Testing", "API Testing", "Frontend Testing", "Backend Testing", "Postman", "Test Cases", "Error Testing", "Edge Cases", "Module Quiz"], "Build a balanced test strategy across units, integrations, APIs, interfaces, and risky edge cases."],
  ["Docker, CI/CD & Deployment", ["What is Deployment?", "Environment Variables", "Build Process", "Docker", "Images", "Containers", "Dockerfile", "Docker Compose", "CI/CD", "GitHub Actions", "Cloud Deployment", "Reverse Proxy", "Production Logs", "Monitoring", "Scaling", "Module Quiz"], "Package, test, release, observe, and scale a web application through repeatable automation."],
  ["Production Full Stack Capstone", ["Capstone Architecture", "File Upload", "Search and Filtering", "Pagination", "Admin Panel", "API Testing", "Automated Tests", "Production-Ready Full Stack Application", "E-Commerce Application", "Portfolio README and Demo", "Final Assessment"], "Combine frontend, backend, data, security, tests, containers, CI/CD, and deployment in a portfolio capstone."],
];

const mernModules: ModuleDefinition[] = [
  ["Web Development Foundations", ["How Websites Work", "Frontend vs Backend", "Client-Server Architecture", "HTTP", "REST", "JSON", "Git", "GitHub", "npm", "MERN Architecture", "Module Quiz"], "Understand the request-response and JavaScript architecture that connects every MERN layer."],
  ["HTML & CSS", ["HTML Basics", "Semantic HTML", "Forms", "CSS Basics", "Box Model", "Flexbox", "Grid", "Responsive Design", "Modern UI", "Mini Project"], "Build the semantic, accessible, responsive interface foundation a React application enhances."],
  ["Modern JavaScript", ["Variables", "Functions", "Arrays", "Objects", "Destructuring", "Spread Operator", "Array Methods", "Modules", "Promises", "Async/Await", "Fetch", "JSON", "Error Handling", "ES6+", "JavaScript Project"], "Use the JavaScript language features that power React, Node.js, and Express codebases."],
  ["React", ["React Introduction", "Vite", "Components", "JSX", "Props", "State", "Events", "useState", "useEffect", "Forms", "Lists", "Conditional Rendering", "React Router", "Context API", "useReducer", "Custom Hooks", "API Calls", "Loading & Error States", "Redux Toolkit", "MERN Task Manager", "Blog Platform", "React Project"], "Build stateful React interfaces that communicate clearly with an API and recover from failure."],
  ["Node.js", ["What is Node.js?", "Node Runtime", "npm", "Modules", "File System", "Environment Variables", "HTTP Server", "Express", "Middleware", "Error Handling", "Async Programming", "Node Project"], "Run event-driven JavaScript on the server and structure asynchronous application work."],
  ["Express.js & REST APIs", ["Express Introduction", "Routing", "Controllers", "Middleware", "Request", "Response", "HTTP Methods", "Status Codes", "REST API Design", "Validation", "Error Handling", "Pagination", "Filtering", "Search", "Rate Limiting", "API Documentation", "Postman", "REST API Project"], "Design secure, documented, validated Express APIs that clients can use predictably."],
  ["MongoDB", ["What is MongoDB?", "SQL vs NoSQL", "Database", "Collection", "Document", "MongoDB Atlas", "MongoDB Compass", "CRUD", "Queries", "Filters", "Sorting", "Aggregation", "Indexing", "Relationships", "Mongoose", "Schemas", "Models", "MongoDB Project"], "Model document data, write queries and aggregations, and support real access patterns with indexes."],
  ["Authentication & Authorization", ["User Registration", "Login", "Password Hashing", "JWT", "Access Tokens", "Refresh Tokens", "Cookies", "Protected Routes", "Role-Based Access", "Admin Authentication", "Security", "CORS", "Input Validation", "Authentication Application"], "Implement end-to-end identity and permission flows without exposing secrets to the client."],
  ["Full MERN Integration", ["Connect React to Express", "API Calls", "Axios", "Authentication Flow", "React State", "Backend Validation", "Database Operations", "File Upload", "Search", "Filtering", "Pagination", "Error Handling", "Production Architecture", "Job Portal Project"], "Connect every MERN layer into observable user journeys with shared contracts and error states."],
  ["Deployment + Capstone", ["Environment Variables", "Production Build", "Docker", "Docker Compose", "Deployment", "CI/CD", "GitHub Actions", "Monitoring", "Security", "Performance", "E-Commerce Application", "Production MERN Application", "Capstone"], "Ship a production MERN application with roles, admin tools, tests, containers, monitoring, and a defendable portfolio story."],
];

const testingModules: ModuleDefinition[] = [
  ["Introduction to Software Testing", ["What is Software Testing?", "Why Testing?", "Quality Assurance", "Quality Control", "QA vs QC vs Testing", "Verification", "Validation", "Software Testing Principles", "Testing Mindset", "Tester Responsibilities", "QA Career Paths", "Module Quiz"], "Build a quality mindset and distinguish prevention, evaluation, verification, and validation."],
  ["SDLC & STLC", ["Software Development Life Cycle", "Waterfall", "Agile", "Scrum", "Kanban", "V-Model", "Software Testing Life Cycle", "Requirement Analysis", "Test Planning", "Test Design", "Test Execution", "Defect Reporting", "Test Closure", "Module Quiz"], "Place testing activities and evidence throughout modern product delivery lifecycles."],
  ["Manual Testing", ["Manual Testing", "Test Scenario", "Test Case", "Test Data", "Preconditions", "Expected Result", "Actual Result", "Functional Testing", "Smoke Testing", "Sanity Testing", "Regression Testing", "Retesting", "Exploratory Testing", "Usability Testing", "Compatibility Testing", "Accessibility Testing", "UAT", "Test a Login System", "E-Commerce Manual Testing", "Module Quiz"], "Design and execute meaningful manual checks across critical, exploratory, usability, and acceptance risks."],
  ["Test Case Design", ["Writing Test Cases", "Positive Testing", "Negative Testing", "Boundary Value Analysis", "Equivalence Partitioning", "Decision Tables", "State Transition Testing", "Risk-Based Testing", "Test Coverage", "Traceability Matrix", "Test Case Review", "Test Case Optimization", "Practical Test Case Project"], "Turn requirements and risks into efficient, reviewable test conditions with explicit coverage."],
  ["Defect Management", ["What is a Bug?", "Defect vs Error vs Failure", "Bug Lifecycle", "Severity", "Priority", "Blocker", "Critical", "Major", "Minor", "Bug Report", "Reproduction Steps", "Screenshots", "Logs", "Root Cause Analysis", "Bug Triage", "Jira Introduction", "Defect Management Project"], "Report reproducible defects, prioritize impact, support triage, and verify fixes through closure."],
  ["API Testing", ["What is an API?", "REST API", "HTTP Methods", "GET", "POST", "PUT", "PATCH", "DELETE", "Status Codes", "Headers", "Request Body", "JSON", "Authentication", "Postman", "Collections", "Environment Variables", "API Test Cases", "API Automation Basics", "API Testing with Postman", "API Testing Project"], "Validate API contracts, data, errors, authentication, and workflows independently from the user interface."],
  ["SQL & Backend Testing", ["Why QA Needs SQL", "Database Testing", "SELECT", "WHERE", "ORDER BY", "GROUP BY", "JOINs", "INSERT", "UPDATE", "DELETE", "Data Validation", "Backend Validation", "UI vs Database Validation", "API + Database Testing", "Database Testing with SQL", "SQL Testing Project"], "Use SQL evidence to verify persistence, relationships, transformations, and backend side effects."],
  ["Automation Testing with Playwright", ["Why Automation?", "Manual vs Automation", "What is Playwright?", "Installation", "Browser Automation", "Locators", "Assertions", "Click", "Fill", "Navigation", "Screenshots", "Test Hooks", "Page Objects", "Test Data", "Test Reports", "Parallel Testing", "Cross-Browser Testing", "CI Integration", "Playwright Automation", "Automation Project"], "Automate valuable browser journeys with accessible locators, web-first assertions, isolation, reports, and CI."],
  ["Performance, Security & Advanced Testing", ["Performance Testing", "Load Testing", "Stress Testing", "Spike Testing", "Endurance Testing", "Response Time", "Throughput", "Apache JMeter", "Basic Security Testing", "Authentication Testing", "Authorization Testing", "Input Validation", "Accessibility Testing", "Cross-Browser Testing", "Mobile Testing", "Performance Testing Project", "Module Quiz"], "Investigate non-functional risk through representative workloads, security boundaries, accessibility, and compatibility."],
  ["CI/CD + AI-Assisted QA + Capstone", ["Git for Testers", "GitHub", "CI/CD", "GitHub Actions", "Automated Test Pipelines", "Test Reports", "Release Quality Gates", "Generative AI for Test Cases", "AI-Generated Test Data", "AI-Assisted Bug Analysis", "AI Defect Hotspot Analysis", "Responsible Use of AI in QA", "End-to-End QA Workflow", "QA Dashboard", "Final Sign-Off Report", "End-to-End QA Project", "Final Capstone"], "Combine manual, API, database, automation, performance, CI/CD, and responsible AI evidence in a complete QA portfolio."],
];

export const fullStackCourse: Course = {
  id: "full-stack-development", slug: "full-stack-development", shortTitle: "Full Stack Development", subject: "fullstack", title: "Full Stack Development — Build Modern Web Applications",
  subtitle: "Learn how modern applications work from semantic frontend foundations through APIs, databases, security, testing, containers, CI/CD, cloud delivery, and production operations.",
  shortDescription: "Learn frontend, backend, databases, APIs, authentication, deployment and production web development.", level: "Beginner → Advanced", duration: "~25–35 hours", lessonCountLabel: "120+", tags: ["Full Stack", "Web Development", "JavaScript"],
  focus: "Build complete modern web applications", curriculumHeadline: "From the first HTTP request to a production deployment", nextCourseSlug: "mern-stack-development", nextCourseText: "Recommended next: MERN Stack Development", careerPath: "Development",
  outcomes: ["Build semantic, accessible, responsive React interfaces", "Design secure REST APIs and model SQL and document data", "Test, containerize, deploy, monitor, and explain a production application"],
  audience: ["Beginners preparing for web-development roles", "Frontend or backend learners who want the full application lifecycle"], prerequisites: ["No professional experience required", "Comfort using a computer and installing development tools"],
  builds: ["Responsive Portfolio Website", "Task Management Application", "Blog Platform", "Authentication System", "REST API", "E-Commerce Application", "Production-Ready Full Stack Application"],
  assessment: "Ten-question module quizzes, practical exercises, six guided projects, and a production-ready full-stack capstone.", certificateCriteria: "Complete every lesson and quiz, submit all required project milestones, and score at least 60% on each assessment.",
  jobs: ["Full Stack Developer", "Frontend Developer", "Backend Developer", "Web Developer"], portfolioChecklist: ["Public GitHub repository", "Accessible live demo", "Architecture and data model", "Testing evidence", "Setup and deployment README", "Resume bullet and interview explanation"],
  units: makeUnits(fullStackModules, "fullstack"),
};

export const mernStackCourse: Course = {
  id: "mern-stack-development", slug: "mern-stack-development", shortTitle: "MERN Stack", subject: "mern", title: "MERN Stack — Build Production-Ready Web Applications",
  subtitle: "Master MongoDB, Express, React, and Node.js by building complete JavaScript applications with authentication, search, roles, testing, containers, and deployment.",
  shortDescription: "Master MongoDB, Express, React and Node.js by building complete full-stack applications.", level: "Beginner → Advanced", duration: "~20–30 hours", lessonCountLabel: "100+", tags: ["MERN", "React", "Node.js", "MongoDB"],
  focus: "Build production JavaScript full-stack applications", curriculumHeadline: "From four JavaScript technologies to one production system", nextCourseSlug: "software-testing-qa", nextCourseText: "Recommended next: Software Testing & QA", careerPath: "Development",
  outcomes: ["Build stateful React applications with explicit API states", "Design Express and Node.js services backed by modeled MongoDB data", "Secure, test, containerize, monitor, and deploy an integrated MERN product"],
  audience: ["JavaScript learners specializing in MERN", "Web developers building portfolio-ready applications"], prerequisites: ["Basic HTML, CSS, and JavaScript", "Full Stack Development is recommended for broader foundations"],
  builds: ["MERN Task Manager", "Blog Platform", "Authentication Application", "Job Portal", "E-Commerce Application", "Production MERN Application"],
  assessment: "Ten-question module quizzes, integrated layer exercises, five guided projects, and a production MERN capstone.", certificateCriteria: "Complete every lesson and quiz, submit all required project milestones, and score at least 60% on each assessment.",
  jobs: ["MERN Developer", "React Developer", "Node.js Developer", "JavaScript Developer"], portfolioChecklist: ["Public GitHub repository", "React and API architecture", "Document model and indexes", "Auth and test evidence", "Docker and deployment guide", "Resume bullet and interview explanation"],
  units: makeUnits(mernModules, "mern"),
};

export const softwareTestingCourse: Course = {
  id: "software-testing-qa", slug: "software-testing-qa", shortTitle: "Software Testing & QA", subject: "testing", title: "Software Testing — Manual, Automation & Modern QA",
  subtitle: "Learn quality from requirements through manual testing, API and SQL validation, Playwright automation, performance, release gates, and responsible AI-assisted QA.",
  shortDescription: "Learn testing fundamentals, API testing, automation, performance and responsible AI-assisted QA.", level: "Beginner → Intermediate", duration: "~15–20 hours", lessonCountLabel: "90+", tags: ["Testing", "QA", "Automation", "API"],
  focus: "Build evidence that software is ready to depend on", curriculumHeadline: "From a requirement to an evidence-based release decision", nextCourseText: "Continue with advanced automation and quality engineering projects.", careerPath: "Quality",
  outcomes: ["Design risk-based scenarios, cases, data, and traceability", "Validate UI, API, database, accessibility, performance, and security behavior", "Automate valuable Playwright journeys and integrate quality evidence into CI/CD"],
  audience: ["Beginners preparing for software-testing roles", "Developers and analysts strengthening quality-engineering skills"], prerequisites: ["No testing experience required", "Basic web and data familiarity is helpful"],
  builds: ["Login System Test Pack", "E-Commerce Manual Test Pack", "Postman API Collection", "SQL Validation Suite", "Playwright Automation Suite", "Performance Test Report", "End-to-End QA Project"],
  assessment: "Ten-question module quizzes, test-design exercises, six realistic projects, and an end-to-end QA capstone with release evidence.", certificateCriteria: "Complete every lesson and quiz, submit all required project milestones, and score at least 60% on each assessment.",
  jobs: ["QA Tester", "Software Tester", "QA Analyst", "Automation Tester", "QA Engineer"], portfolioChecklist: ["Test plan and traceability matrix", "Test cases and bug reports", "Postman collection and SQL queries", "Playwright suite and reports", "QA dashboard and sign-off", "Resume bullet and interview explanation"],
  units: makeUnits(testingModules, "testing"),
};
