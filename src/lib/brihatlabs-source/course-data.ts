import type { ContentBlock, Course, Lesson, QuizQuestion, Unit } from "../types/course.ts";
import { fullStackCourse, mernStackCourse, softwareTestingCourse } from "./software-course-data.ts";
import { seedSubjects } from "./course-subjects.ts";

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const definitions: Record<string, string> = {
  "What is Artificial Intelligence?": "Artificial intelligence is the broad field of creating computer systems that perform tasks we associate with human intelligence, such as recognizing patterns, understanding language, and making decisions.",
  "What is Generative AI?": "Generative AI learns patterns from existing data and uses those patterns to create new text, images, audio, code, or other content.",
  "What is an AI Agent?": "An AI agent is a software system that uses a model to decide what to do next while pursuing a goal inside defined boundaries.",
  "What is Agentic AI?": "Agentic AI describes systems that can plan, take actions, inspect results, and adapt over multiple steps instead of producing one response and stopping.",
  "What is Machine Learning?": "Machine learning is a way to build software that learns useful patterns from examples instead of relying only on rules written by a programmer.",
  "What is Regression?": "Regression is a supervised learning task that predicts a continuous number, such as a price, temperature, or delivery time.",
  "What is Classification?": "Classification is a supervised learning task that assigns an input to one of several categories, such as spam or not spam.",
  "What is Unsupervised Learning?": "Unsupervised learning looks for structure in data that has no answer labels, often by grouping similar examples or reducing complexity.",
  "What is Reinforcement Learning?": "Reinforcement learning teaches an agent through interaction: actions produce rewards and new states, and the agent improves its policy over time.",
  "What is RAG?": "Retrieval-augmented generation first retrieves relevant knowledge and then gives it to a language model so the response can be grounded in useful context.",
  "What is MCP?": "The Model Context Protocol is an open standard for connecting AI applications to external tools, resources, and reusable prompts through a consistent interface.",
  "Linear Regression Intuition": "Linear regression learns a straight-line relationship between input features and a numerical target so it can estimate values for new examples.",
  "Gradient Descent": "Gradient descent helps a model reduce its mistakes by repeatedly measuring the slope of the error and taking a small step toward lower error.",
  "K-Means": "K-Means is a clustering algorithm that repeatedly assigns points to nearby centers and moves those centers until the groups stabilize.",
  "Decision Trees": "A decision tree makes predictions by asking a sequence of feature-based questions and following the answers down to a leaf.",
  "Random Forest": "A random forest combines many varied decision trees and aggregates their predictions to improve stability and accuracy.",
  "Data Leakage": "Data leakage happens when information unavailable at prediction time accidentally influences training, producing scores that look better than real-world performance.",
  "Overfitting": "Overfitting occurs when a model memorizes training details and noise so closely that it performs poorly on new data.",
  "What is Data?": "Data is a recorded observation, measurement, category, event, or fact that can be stored and examined.",
  "What is Data Analytics?": "Data analytics is the process of collecting, preparing, exploring, and communicating data so people can make better decisions.",
  "What is Data Science?": "Data science combines programming, statistics, subject knowledge, and modeling to discover patterns and build data-driven solutions.",
  "What is SQL?": "SQL is a language for asking questions of relational data stored in tables.",
  "What is EDA?": "Exploratory data analysis means examining a dataset before formal modeling so you can find patterns, missing values, unusual observations, and useful relationships.",
  "Mean": "The mean is the arithmetic average: add the values and divide by how many values there are.",
  "Median": "The median is the middle value after sorting, so it is often more resistant to extreme values than the mean.",
  "Standard Deviation": "Standard deviation measures the typical distance of values from their mean, expressed in the same unit as the data.",
  "P-Value": "A p-value is the probability, assuming the null hypothesis and test assumptions are true, of obtaining a result at least as extreme as the observed result.",
  "Confidence Intervals": "A confidence interval is a range produced by a procedure that captures the true parameter at a stated long-run rate when the procedure is repeated.",
  "What is Business Intelligence?": "Business intelligence combines prepared data, semantic models, reports, and dashboards to help organizations monitor and act on performance.",
  "What is Data Cleaning?": "Data cleaning is the process of finding and correcting missing, duplicate, inconsistent, invalid, or incorrectly typed values.",
  "What is a Dashboard?": "A dashboard is a focused visual display of related measures that helps a specific audience monitor and decide.",
};

const analogies: Record<Course["subject"], string> = {
  analytics: "Think of data analytics as a detective's case board: gather trustworthy clues, organize them, test explanations, and communicate what the evidence supports.",
  science: "Think of data science as a laboratory: frame a useful question, run a reproducible experiment on data, measure uncertainty, and turn the result into a tested solution.",
  agents: "Think of the system as a careful assistant: you provide a goal, it chooses from approved tools, checks each result, and stops when the job is complete or needs human help.",
  ml: "Think of learning from a solved workbook. The examples reveal a pattern; practice checks whether that pattern works on questions the learner has not seen before.",
  fullstack: "Think of a web application as a restaurant: the interface welcomes the customer, the server coordinates the work, and the database keeps the organized records.",
  mern: "Think of MERN as one JavaScript-speaking team: React handles the experience while Express, Node.js, and MongoDB coordinate data behind it.",
  testing: "Think of quality assurance as a careful pre-flight check: verify the expected behavior, probe risky conditions, document failures, and confirm the fix before release.",
};

function dailyLifeAnalogy(title: string, subject: Course["subject"]) {
  const value = title.toLowerCase();
  if (/clean|missing|duplicate|quality|wrangl/i.test(value)) return "Think of tidying a kitchen cupboard: remove duplicates, label items consistently, check what is missing, and only then decide what you can cook.";
  if (/sql|query|database|table|join|filter/i.test(value)) return "Think of asking a librarian for a specific list of books: state the conditions clearly, let the catalog find matching records, and check that the returned list answers your question.";
  if (/dashboard|visual|chart|plot|kpi|business intelligence/i.test(value)) return "Think of a car dashboard: a few clear signals show what needs attention now, while good labels and warnings help you choose the next action.";
  if (/mean|median|average|probability|statistics|distribution|correlation/i.test(value)) return "Think of comparing commute times: one unusual traffic jam can distort the average, so inspect the full pattern before describing a typical day.";
  if (/model|regression|classification|prediction|feature|algorithm/i.test(value) || subject === "ml" || subject === "science") return "Think of learning a recipe from several meals: notice the ingredients and results, try the recipe on a new meal, and change it when the evidence says it does not generalize.";
  if (/agent|tool|prompt|memory|rag|retrieval|mcp|guardrail|generat/i.test(value) || subject === "agents") return "Think of a careful personal assistant: clarify the goal, look up trusted information, use only approved tools, check the result, and ask for help when a decision is uncertain.";
  if (/test|qa|bug|defect|validation|evaluation/i.test(value) || subject === "testing") return "Think of checking a bicycle before a long ride: test the brakes and normal operation, try a risky condition, record what you found, and fix the problem before leaving.";
  return analogies[subject];
}

const formulas: Record<string, { expression: string; explanation: string }> = {
  "Linear Regression Intuition": { expression: "ŷ = m x + b", explanation: "ŷ is the predicted value, x is the input, m is the learned slope, and b is the learned starting point." },
  "Simple Linear Regression": { expression: "ŷ = β₀ + β₁x", explanation: "β₀ is the intercept and β₁ tells us how much the prediction changes when x increases by one unit." },
  "Mean Squared Error": { expression: "MSE = (1/n) Σ(yᵢ − ŷᵢ)²", explanation: "Subtract each prediction from the true value, square the errors, add them, and divide by the number of examples." },
  "Gradient Descent": { expression: "θnew = θold − α ∇J(θ)", explanation: "θ is a model parameter, α is the learning rate, and ∇J points toward increasing error, so subtraction moves toward lower error." },
  "Accuracy": { expression: "Accuracy = correct predictions / all predictions", explanation: "Accuracy is the share of examples the classifier predicted correctly." },
  "Precision": { expression: "Precision = TP / (TP + FP)", explanation: "Of everything predicted positive, precision measures how many were truly positive." },
  "Recall": { expression: "Recall = TP / (TP + FN)", explanation: "Of all truly positive examples, recall measures how many the model found." },
  "F1 Score": { expression: "F1 = 2 × (precision × recall) / (precision + recall)", explanation: "F1 combines precision and recall using their harmonic mean." },
  "RMSE": { expression: "RMSE = √MSE", explanation: "Taking the square root returns the error to the same unit as the target." },
  "R² Score": { expression: "R² = 1 − SSres / SStot", explanation: "R² compares the model's remaining error with the variation in the target values." },
  "Standardization": { expression: "z = (x − μ) / σ", explanation: "Subtract the feature mean μ and divide by standard deviation σ to center and scale values." },
  "Q-Learning": { expression: "Q(s,a) ← Q(s,a) + α[r + γ max Q(s′,a′) − Q(s,a)]", explanation: "The current action value is nudged toward the observed reward plus the best discounted future value." },
};

Object.assign(formulas, {
  "Mean": { expression: "Mean = (60 + 70 + 80 + 90 + 100) / 5 = 80", explanation: "Add all five scores, then divide by the five students. The result is the balance point of the scores." },
  "Variance": { expression: "Variance = Σ(xᵢ − x̄)² / n", explanation: "Measure every value's distance from the mean, square those distances, add them, and divide by the number of values for a population." },
  "Standard Deviation": { expression: "Standard deviation = √Variance", explanation: "The square root changes variance back into the original unit, making spread easier to interpret." },
  "Probability": { expression: "P(event) = favorable outcomes / possible outcomes", explanation: "For equally likely outcomes, divide the outcomes that satisfy the event by all possible outcomes." },
  "Confidence Intervals": { expression: "estimate ± critical value × standard error", explanation: "Start with the sample estimate, then add and subtract a margin that reflects sampling uncertainty and the chosen confidence level." },
  "Correlation": { expression: "r = cov(X,Y) / (σX σY)", explanation: "Correlation standardizes covariance so linear association ranges from −1 to +1; it does not prove causation." },
});

const codeExamples: Record<string, string> = {
  "Simple Linear Regression": "from sklearn.linear_model import LinearRegression\n\nmodel = LinearRegression()\nmodel.fit(house_size, house_price)\nprint(model.coef_, model.intercept_)",
  "NumPy Arrays": "import numpy as np\n\nfeatures = np.array([[1200, 3], [1800, 4]])\nprint(features.shape)",
  "Array Operations": "import numpy as np\n\nprices = np.array([250000, 310000, 295000])\nnormalized = (prices - prices.mean()) / prices.std()\nprint(normalized)",
  "Pandas Introduction": "import pandas as pd\n\ndata = pd.DataFrame({\"size\": [1200, 1800], \"price\": [250000, 340000]})\nprint(data.head())",
  "Reading CSV Files": "import pandas as pd\n\ndata = pd.read_csv(\"houses.csv\")\nprint(data.shape)\nprint(data.head())",
  "Train-Test Split": "from sklearn.model_selection import train_test_split\n\nX_train, X_test, y_train, y_test = train_test_split(\n    X, y, test_size=0.2, random_state=42\n)",
  "Missing Values": "from sklearn.impute import SimpleImputer\n\nimputer = SimpleImputer(strategy=\"median\")\nX_clean = imputer.fit_transform(X_train)",
  "Encoding Categorical Data": "from sklearn.preprocessing import OneHotEncoder\n\nencoder = OneHotEncoder(handle_unknown=\"ignore\")\nX_encoded = encoder.fit_transform(X_train[[\"city\"]])",
  "Feature Scaling": "from sklearn.preprocessing import StandardScaler\n\nscaler = StandardScaler()\nX_train_scaled = scaler.fit_transform(X_train)\nX_test_scaled = scaler.transform(X_test)",
  "Python + Scikit-learn Implementation": "from sklearn.linear_model import LinearRegression\n\nmodel = LinearRegression()\nmodel.fit(X_train, y_train)\npredictions = model.predict(X_test)\nprint(predictions)",
  "Logistic Regression": "from sklearn.linear_model import LogisticRegression\n\nmodel = LogisticRegression(max_iter=1000)\nmodel.fit(X_train, y_train)\npredictions = model.predict(X_test)",
  "K-Nearest Neighbors": "from sklearn.neighbors import KNeighborsClassifier\n\nmodel = KNeighborsClassifier(n_neighbors=5)\nmodel.fit(X_train_scaled, y_train)\npredictions = model.predict(X_test_scaled)",
  "Decision Trees": "from sklearn.tree import DecisionTreeClassifier\n\nmodel = DecisionTreeClassifier(max_depth=4, random_state=42)\nmodel.fit(X_train, y_train)\npredictions = model.predict(X_test)",
  "Random Forest": "from sklearn.ensemble import RandomForestClassifier\n\nmodel = RandomForestClassifier(n_estimators=200, random_state=42)\nmodel.fit(X_train, y_train)\npredictions = model.predict(X_test)",
  "Naive Bayes": "from sklearn.naive_bayes import MultinomialNB\n\nmodel = MultinomialNB()\nmodel.fit(X_train, y_train)\npredictions = model.predict(X_test)",
  "Support Vector Machines": "from sklearn.svm import SVC\n\nmodel = SVC(kernel=\"rbf\", C=1.0)\nmodel.fit(X_train_scaled, y_train)\npredictions = model.predict(X_test_scaled)",
  "K-Means": "from sklearn.cluster import KMeans\n\nmodel = KMeans(n_clusters=3, random_state=42, n_init=10)\nclusters = model.fit_predict(X_scaled)\nprint(clusters)",
  "Hierarchical Clustering": "from sklearn.cluster import AgglomerativeClustering\n\nmodel = AgglomerativeClustering(n_clusters=3)\nclusters = model.fit_predict(X_scaled)",
  "DBSCAN": "from sklearn.cluster import DBSCAN\n\nmodel = DBSCAN(eps=0.5, min_samples=5)\nclusters = model.fit_predict(X_scaled)",
  "PCA": "from sklearn.decomposition import PCA\n\npca = PCA(n_components=2)\nX_2d = pca.fit_transform(X_scaled)\nprint(pca.explained_variance_ratio_)",
  "Confusion Matrix": "from sklearn.metrics import confusion_matrix\n\nmatrix = confusion_matrix(y_test, predictions)\nprint(matrix)",
  "Cross Validation": "from sklearn.model_selection import cross_val_score\n\nscores = cross_val_score(model, X, y, cv=5, scoring=\"accuracy\")\nprint(scores.mean(), scores.std())",
  "Grid Search": "from sklearn.model_selection import GridSearchCV\n\nsearch = GridSearchCV(model, {\"max_depth\": [3, 5, None]}, cv=5)\nsearch.fit(X_train, y_train)\nprint(search.best_params_)",
  "Random Search": "from sklearn.model_selection import RandomizedSearchCV\n\nsearch = RandomizedSearchCV(model, parameter_space, n_iter=20, cv=5, random_state=42)\nsearch.fit(X_train, y_train)",
  "Bagging": "from sklearn.ensemble import BaggingClassifier\n\nmodel = BaggingClassifier(n_estimators=100, random_state=42)\nmodel.fit(X_train, y_train)",
  "Boosting": "from sklearn.ensemble import AdaBoostClassifier\n\nmodel = AdaBoostClassifier(n_estimators=100, random_state=42)\nmodel.fit(X_train, y_train)",
  "Gradient Boosting": "from sklearn.ensemble import GradientBoostingClassifier\n\nmodel = GradientBoostingClassifier(random_state=42)\nmodel.fit(X_train, y_train)",
  "XGBoost Introduction": "from xgboost import XGBClassifier\n\nmodel = XGBClassifier(n_estimators=200, learning_rate=0.05, random_state=42)\nmodel.fit(X_train, y_train)",
  "L1 Regularization": "from sklearn.linear_model import Lasso\n\nmodel = Lasso(alpha=0.1)\nmodel.fit(X_train, y_train)",
  "L2 Regularization": "from sklearn.linear_model import Ridge\n\nmodel = Ridge(alpha=1.0)\nmodel.fit(X_train, y_train)",
  "Q-Learning": "q = {}\nfor episode in range(500):\n    state = env.reset()\n    while not env.done:\n        action = choose_action(q, state)\n        next_state, reward = env.step(action)\n        update_q_value(q, state, action, reward, next_state)\n        state = next_state",
  "Introduction to Neural Networks": "from sklearn.neural_network import MLPClassifier\n\nmodel = MLPClassifier(hidden_layer_sizes=(32, 16), max_iter=500, random_state=42)\nmodel.fit(X_train_scaled, y_train)",
  "Model Saving": "import joblib\n\njoblib.dump(model, \"model.joblib\")\nloaded_model = joblib.load(\"model.joblib\")",
  "Building an ML API": "from fastapi import FastAPI\n\napp = FastAPI()\n\n@app.post(\"/predict\")\ndef predict(features: list[float]):\n    return {\"prediction\": model.predict([features])[0].item()}",
  "Creating a Basic Agent": "def run_agent(goal, model, tools):\n    state = {\"goal\": goal, \"steps\": []}\n    while len(state[\"steps\"]) < 6:\n        action = model.decide(state, tools)\n        if action.type == \"finish\":\n            return action.answer\n        state[\"steps\"].append(tools.call(action))",
  "smolagents": "from smolagents import CodeAgent, InferenceClientModel\n\nmodel = InferenceClientModel()\nagent = CodeAgent(tools=[search_tool], model=model)\nresult = agent.run(\"Compare two reliable sources\")",
  "LlamaIndex": "from llama_index.core.agent.workflow import FunctionAgent\n\nagent = FunctionAgent(tools=[search_docs], llm=llm)\nresponse = await agent.run(\"Find the relevant policy\")",
  "Calculator Tool": "def calculator(expression: str) -> float:\n    \"\"\"Evaluate an approved arithmetic expression.\"\"\"\n    return safe_math_evaluate(expression)",
  "Building an Agent with LangGraph": "from langgraph.graph import StateGraph, START, END\n\ngraph = StateGraph(AgentState)\ngraph.add_node(\"reason\", reason)\ngraph.add_node(\"act\", act)\ngraph.add_edge(START, \"reason\")\ngraph.add_conditional_edges(\"reason\", route)\nagent = graph.compile()",
  "Build a Knowledge Agent": "def answer(question: str):\n    passages = retriever.search(question, top_k=4)\n    context = \"\\n\".join(item.text for item in passages)\n    return model.generate(question=question, context=context)",
  "Build an MCP-Powered Agent": "async with ClientSession(transport) as session:\n    await session.initialize()\n    tools = await session.list_tools()\n    result = await agent.run(goal, tools=tools.tools)",
  "Build a Multi-Agent System": "result = supervisor.run(\n    goal,\n    workers={\"research\": researcher, \"review\": reviewer},\n    max_handoffs=4,\n)",
};

const analyticsCodeExamples: Record<string, { language: "sql" | "excel" | "python"; code: string }> = {
  "Basic Formulas": { language: "excel", code: "=SUM(B2:B13)\n=AVERAGE(B2:B13)\n=MAX(B2:B13)\n=MIN(B2:B13)" },
  "IF": { language: "excel", code: "=IF(C2>=1000, \"High value\", \"Standard\")" },
  "SUMIF": { language: "excel", code: "=SUMIF(A2:A100, \"North\", C2:C100)" },
  "COUNTIF": { language: "excel", code: "=COUNTIF(D2:D100, \"Returned\")" },
  "XLOOKUP": { language: "excel", code: "=XLOOKUP(A2, Products!A:A, Products!C:C, \"Not found\")" },
  "INDEX + MATCH": { language: "excel", code: "=INDEX(Products!C:C, MATCH(A2, Products!A:A, 0))" },
  "SELECT": { language: "sql", code: "SELECT order_id, category, sales\nFROM orders;" },
  "WHERE": { language: "sql", code: "SELECT order_id, category, sales\nFROM orders\nWHERE sales >= 500;" },
  "GROUP BY": { language: "sql", code: "SELECT\n    category,\n    SUM(sales) AS total_sales\nFROM orders\nGROUP BY category\nORDER BY total_sales DESC;" },
  "HAVING": { language: "sql", code: "SELECT category, SUM(sales) AS total_sales\nFROM orders\nGROUP BY category\nHAVING SUM(sales) >= 10000;" },
  "INNER JOIN": { language: "sql", code: "SELECT o.order_id, c.customer_name, o.sales\nFROM orders AS o\nINNER JOIN customers AS c\n  ON o.customer_id = c.customer_id;" },
  "LEFT JOIN": { language: "sql", code: "SELECT c.customer_name, o.order_id\nFROM customers AS c\nLEFT JOIN orders AS o\n  ON c.customer_id = o.customer_id;" },
  "Window Functions": { language: "sql", code: "SELECT category, order_date, sales,\n  SUM(sales) OVER (\n    PARTITION BY category ORDER BY order_date\n  ) AS running_sales\nFROM orders;" },
  "CTEs": { language: "sql", code: "WITH category_sales AS (\n  SELECT category, SUM(sales) AS total_sales\n  FROM orders GROUP BY category\n)\nSELECT * FROM category_sales\nWHERE total_sales >= 10000;" },
  "Loading CSV": { language: "python", code: "import pandas as pd\n\norders = pd.read_csv(\"orders.csv\")\nprint(orders.head())\nprint(orders.shape)" },
  "Loading Excel": { language: "python", code: "import pandas as pd\n\norders = pd.read_excel(\"orders.xlsx\", sheet_name=\"Sales\")\nprint(orders.dtypes)" },
  "Loading JSON": { language: "python", code: "import pandas as pd\n\nrecords = pd.read_json(\"events.json\")\nprint(records.head())" },
  "Filtering Data": { language: "python", code: "high_value = orders.loc[orders[\"sales\"] >= 500]\nprint(high_value[[\"order_id\", \"sales\"]])" },
  "GroupBy": { language: "python", code: "category_sales = (\n    orders.groupby(\"category\", as_index=False)[\"sales\"].sum()\n    .sort_values(\"sales\", ascending=False)\n)\nprint(category_sales)" },
  "Merging DataFrames": { language: "python", code: "result = orders.merge(\n    customers, on=\"customer_id\", how=\"left\", validate=\"many_to_one\"\n)\nprint(result.head())" },
  "Complete Data Cleaning Workflow": { language: "python", code: "clean = (\n    orders.drop_duplicates(subset=\"order_id\")\n      .assign(order_date=lambda d: pd.to_datetime(d[\"order_date\"], errors=\"coerce\"))\n      .dropna(subset=[\"order_date\", \"sales\"])\n)\nassert clean[\"order_id\"].is_unique" },
  "EDA with Pandas": { language: "python", code: "print(orders.info())\nprint(orders.describe(include=\"all\"))\nprint(orders.isna().sum())\nprint(orders.groupby(\"region\")[\"sales\"].agg([\"count\", \"mean\", \"sum\"]))" },
  "Matplotlib": { language: "python", code: "import matplotlib.pyplot as plt\n\nmonthly.plot(x=\"month\", y=\"sales\", marker=\"o\")\nplt.title(\"Monthly sales trend\")\nplt.ylabel(\"Sales ($)\")\nplt.show()" },
  "Seaborn": { language: "python", code: "import seaborn as sns\n\nsns.scatterplot(data=orders, x=\"discount\", y=\"profit\", hue=\"category\")" },
  "Plotly": { language: "python", code: "import plotly.express as px\n\nfig = px.line(monthly, x=\"month\", y=\"sales\", markers=True)\nfig.show()" },
};

const scienceCodeExamples: Record<string, { language: "sql" | "excel" | "python"; code: string }> = {
  ...analyticsCodeExamples,
  "Probability": { language: "python", code: "import numpy as np\n\nrng = np.random.default_rng(42)\nrolls = rng.integers(1, 7, size=10_000)\nprint((rolls == 6).mean())" },
  "Hypothesis Testing": { language: "python", code: "from scipy import stats\n\nresult = stats.ttest_ind(conversion_a, conversion_b, equal_var=False)\nprint(result.statistic, result.pvalue)" },
  "Confidence Intervals": { language: "python", code: "from scipy import stats\n\nresult = stats.ttest_1samp(sample, popmean=0)\nprint(result.confidence_interval(confidence_level=0.95))" },
  "Train/Test Split": { language: "python", code: "from sklearn.model_selection import train_test_split\n\nX_train, X_test, y_train, y_test = train_test_split(\n    X, y, test_size=0.2, random_state=42, stratify=y\n)" },
  "Feature Engineering": { language: "python", code: "features = customers.assign(\n    average_order_value=customers[\"revenue\"] / customers[\"orders\"].clip(lower=1),\n    tenure_years=customers[\"tenure_months\"] / 12,\n)" },
  "Complete EDA Project": { language: "python", code: "profile = data.describe(include=\"all\")\nmissing = data.isna().mean().sort_values(ascending=False)\ncorrelations = data.select_dtypes(\"number\").corr()\nprint(profile, missing.head(), correlations)" },
  "Model Serialization": { language: "python", code: "import joblib\n\njoblib.dump(pipeline, \"churn_pipeline.joblib\")\nloaded = joblib.load(\"churn_pipeline.joblib\")\nprint(loaded.predict(new_customers))" },
  "FastAPI": { language: "python", code: "from fastapi import FastAPI\n\napp = FastAPI()\n\n@app.post(\"/predict\")\ndef predict(features: list[float]):\n    prediction = pipeline.predict([features])[0]\n    return {\"prediction\": int(prediction)}" },
};

const codeBySubject = { analytics: analyticsCodeExamples, science: scienceCodeExamples } as const;

const comparisons: Record<string, { headers: string[]; rows: string[][] }> = {
  "AI vs Generative AI vs AI Agents": { headers: ["Concept", "Primary goal", "Typical output"], rows: [["AI", "Perform intelligent tasks", "Decision or prediction"], ["Generative AI", "Create new content", "Text, image, audio, or code"], ["AI agent", "Pursue a goal through actions", "Completed task or handoff"]] },
  "LLM vs AI Agent": { headers: ["Capability", "LLM", "AI agent"], rows: [["Generate language", "Yes", "Uses an LLM"], ["Call approved tools", "Not by itself", "Yes"], ["Maintain workflow state", "Only supplied context", "Application-managed"], ["Repeat toward a goal", "Not by itself", "Bounded loop"]] },
  "AI vs ML vs Deep Learning": { headers: ["Concept", "Scope", "Example"], rows: [["AI", "Broad intelligent systems", "Planning assistant"], ["Machine learning", "Learn patterns from data", "Spam classifier"], ["Deep learning", "Neural networks with many layers", "Image recognition"]] },
  "Traditional Programming vs ML": { headers: ["Approach", "Developer provides", "System produces"], rows: [["Traditional programming", "Rules and data", "Answers"], ["Machine learning", "Examples and answers", "A learned model"]] },
  "Types of Machine Learning": { headers: ["Type", "Feedback", "Goal"], rows: [["Supervised", "Labels", "Predict"], ["Unsupervised", "No labels", "Discover structure"], ["Reinforcement", "Rewards", "Learn actions"], ["Self-supervised", "Signals created from data", "Learn representations"]] },
  "Framework Comparison": { headers: ["Framework", "Useful when", "Core strength"], rows: [["smolagents", "You want a lightweight Python agent", "Small, direct abstractions"], ["LangGraph", "Workflow state and branching matter", "Graph orchestration"], ["LlamaIndex", "Knowledge and retrieval are central", "Data and RAG workflows"]] },
  "Traditional RAG vs Agentic RAG": { headers: ["Approach", "Retrieval", "Control flow"], rows: [["Traditional RAG", "Usually once", "Predetermined pipeline"], ["Agentic RAG", "Chosen and repeated as needed", "Model-guided within limits"]] },
  "Single Agent vs Multi-Agent": { headers: ["Design", "Strength", "Tradeoff"], rows: [["Single agent", "Simpler ownership and debugging", "One role handles more context"], ["Multi-agent", "Specialized roles and parallel work", "More coordination and failure paths"]] },
};

Object.assign(comparisons, {
  "Data Analytics vs Data Science": { headers: ["Area", "Data Analytics", "Data Science"], rows: [["Main question", "What happened and why?", "What patterns can we discover and predict?"], ["Typical output", "Insight, KPI, dashboard", "Experiment, model, data product"], ["Common tools", "Excel, SQL, BI, Python", "Python, SQL, statistics, ML"]] },
  "Data Science vs Machine Learning": { headers: ["Area", "Data Science", "Machine Learning"], rows: [["Scope", "End-to-end data problem solving", "Algorithms that learn patterns"], ["Includes", "Data collection through business impact", "Training, evaluation, and prediction"], ["Relationship", "May use ML", "One toolkit within data science"]] },
  "Data Science vs Data Analytics": { headers: ["Area", "Data Science", "Data Analytics"], rows: [["Emphasis", "Patterns, experiments, predictions", "Performance, causes, decisions"], ["Modeling", "Often predictive", "Often descriptive and diagnostic"], ["Shared foundation", "Python, SQL, statistics", "SQL, visualization, business context"]] },
  "Dashboard vs Report": { headers: ["Feature", "Dashboard", "Report"], rows: [["Purpose", "Monitor a focused set of measures", "Explore or explain details"], ["Typical length", "Compact overview", "One or many pages"], ["Interaction", "Filters and high-level drill", "Detailed analysis and narrative"]] },
  "Structured Data": { headers: ["Data type", "Organization", "Example"], rows: [["Structured", "Fixed rows and columns", "Orders table"], ["Semi-structured", "Keys or tags, flexible shape", "JSON event"], ["Unstructured", "No fixed tabular model", "Email or image"]] },
  "Types of Data Analytics": { headers: ["Type", "Question", "Example"], rows: [["Descriptive", "What happened?", "Monthly revenue"], ["Diagnostic", "Why did it happen?", "Revenue by region"], ["Predictive", "What may happen?", "Demand forecast"], ["Prescriptive", "What should we do?", "Inventory recommendation"]] },
});

const chartGuides: Record<string, { best: string; avoid: string; mistake: string; items: string[] }> = {
  "Bar Charts": { best: "Compare values across categories.", avoid: "Do not use when hundreds of categories make labels unreadable.", mistake: "Starting a bar axis above zero can exaggerate differences.", items: ["Categories", "Aligned baseline", "Bar length", "Comparison"] },
  "Line Charts": { best: "Show a measure changing over ordered time.", avoid: "Do not connect unrelated categories with a line.", mistake: "Uneven time gaps shown as equal spacing can mislead.", items: ["Time", "Ordered values", "Connected trend", "Change"] },
  "Pie Charts": { best: "Show a few clearly different parts of one whole.", avoid: "Do not use for many slices or close comparisons.", mistake: "Slices that do not total one meaningful whole are misleading.", items: ["One whole", "Few parts", "Proportion", "100%"] },
  "Histograms": { best: "Inspect the distribution of one numeric variable.", avoid: "Do not use it to compare unrelated categories.", mistake: "Changing bin width can hide or invent apparent patterns.", items: ["Numeric values", "Bins", "Counts", "Distribution shape"] },
  "Scatter Plots": { best: "Explore the relationship between two numeric variables.", avoid: "Do not claim causation from a visual association.", mistake: "Overplotting can hide dense regions and subgroups.", items: ["X value", "Y value", "Points", "Relationship"] },
  "Box Plots": { best: "Compare medians, spread, and potential outliers across groups.", avoid: "Do not use alone when the audience needs to see every observation.", mistake: "Treating every point beyond a whisker as an error is incorrect.", items: ["Quartiles", "Median", "Whiskers", "Potential outliers"] },
  "Heatmaps": { best: "Reveal patterns in a matrix through a consistent color scale.", avoid: "Do not use when exact values matter more than pattern.", mistake: "A diverging color scale without a meaningful midpoint distorts interpretation.", items: ["Rows", "Columns", "Color scale", "Pattern"] },
};

const officialResources: Partial<Record<Course["subject"], { title: string; url: string; description: string }>> = {
  analytics: { title: "pandas user guide", url: "https://pandas.pydata.org/docs/user_guide/", description: "Official guides for DataFrames, missing data, grouping, merging, plotting, and data import/export." },
  science: { title: "scikit-learn user guide", url: "https://scikit-learn.org/stable/user_guide.html", description: "Official guidance for preprocessing, model selection, evaluation, pipelines, and common pitfalls." },
  ml: { title: "scikit-learn model selection and evaluation", url: "https://scikit-learn.org/stable/model_selection.html", description: "Official reference for cross-validation, metrics, tuning, and model evaluation." },
  agents: { title: "Model Context Protocol documentation", url: "https://modelcontextprotocol.io/docs/getting-started/intro", description: "Official introduction to MCP concepts and architecture." },
};

function dataFoundationsBlocks(): ContentBlock[] {
  return [
    { type: "heading", text: "Understanding data" },
    { type: "paragraph", text: "Data is the foundation of every analytics system. It is a recorded observation, measurement, event, category, or fact that can be stored and examined. A customer purchase, a website visit, a product price, and a temperature reading are all data because each captures something that happened in the world." },
    { type: "paragraph", text: "Before an analyst creates a dashboard or calculates a metric, they need to know what each record represents, who produced it, and what could make it incomplete or misleading." },
    { type: "heading", text: "Why data matters" },
    { type: "paragraph", text: "Organizations use data to understand behavior, measure performance, detect patterns, identify problems, predict outcomes, and support decisions. The same data can answer very different questions when its meaning and limits are understood." },
    { type: "list", items: ["Customer purchases and product returns", "Website visits and conversion events", "Inventory levels and product prices", "Employee records and support requests", "Financial transactions and operational costs"] },
    { type: "heading", text: "Common forms of data" },
    { type: "paragraph", text: "Structured data follows a defined layout, usually rows and columns. SQL tables, CSV files, and Excel workbooks make this data easy to filter, join, and aggregate." },
    { type: "paragraph", text: "Semi-structured data has labels or nesting but not a fixed relational table. JSON, XML, and event logs are common examples. Unstructured data has no predefined tabular shape: documents, images, audio, video, emails, and free-text reviews all need extra processing before they can be analyzed consistently." },
    { type: "table", headers: ["Form", "Examples", "Typical use"], rows: [["Structured", "SQL tables, CSV, Excel", "Reporting, joins, metrics"], ["Semi-structured", "JSON, XML, logs", "APIs, product events, integrations"], ["Unstructured", "Images, documents, audio", "Text analysis, classification, search"]] },
    { type: "heading", text: "A practical example" },
    { type: "paragraph", text: "Consider an e-commerce order. One row might contain a customer ID, product, quantity, price, location, date, and payment method. Individually these fields are records; together they can reveal which products sell most, which region generates the highest revenue, when demand changes, and which customers are likely to return." },
    { type: "diagram", variant: "pipeline", items: ["Raw order records", "Checked fields", "Useful measures", "Analysis", "Insight", "Decision"] },
    { type: "callout", title: "Daily-life analogy", text: "Think of planning a weekly grocery budget: collect receipts, group purchases, compare totals, check unusual prices, and decide what to change next week. The receipts are evidence, not the conclusion.", tone: "info" },
    { type: "heading", text: "What an analyst checks first" },
    { type: "list", items: ["Where the data came from and how it was collected", "What each field means and which values are allowed", "Whether records are missing, duplicated, stale, or biased", "How the data needs to be transformed for the question", "Which business decision the analysis is meant to support"] },
    { type: "callout", title: "Key takeaway", text: "Data alone is not insight. Its value comes from a defensible path: raw data → information → analysis → insight → decision.", tone: "success" },
  ];
}

function learningBlocks(title: string, moduleTitle: string, subject: Course["subject"], type: Lesson["type"]): ContentBlock[] {
  if (title === "What is Data?") return dataFoundationsBlocks();
  const simple = definitions[title] || `${title} is a practical part of ${moduleTitle}. It gives learners a clear mental model and a repeatable way to use the idea in real work.`;
  const subjectContext = ({
    analytics: { input: "Business question + raw data", output: "Insight + recommendation", example: `Imagine a retailer asking why revenue changed. ${title} helps the analyst move from transaction rows to a checked explanation that a decision-maker can use.` },
    science: { input: "Problem + representative data", output: "Tested solution + impact", example: `Imagine a subscription team trying to understand churn. ${title} helps the data scientist explore evidence, quantify uncertainty, and test a solution on data that was not used to build it.` },
    ml: { input: "Data or examples", output: "Useful prediction or pattern", example: `Imagine a small dataset where each row contains familiar information such as an email's words or a house's size. ${title} gives us a disciplined way to learn from those rows and check the result on new examples.` },
    agents: { input: "Goal and context", output: "Checked action or answer", example: `Imagine asking an assistant to research a topic. ${title} helps the system decide what context it needs, what approved action to take, and how to verify the observation before responding.` },
  } as const)[subject as "analytics" | "science" | "ml" | "agents"] ?? { input: "Defined problem + evidence", output: "Checked result", example: `Use ${title} in one small workflow, inspect the output, and record how you know it works.` };
  const specializedCode = subject === "analytics" || subject === "science" ? codeBySubject[subject][title] : undefined;
  const code = specializedCode ?? (codeExamples[title] ? { language: "python" as const, code: codeExamples[title] } : undefined);
  const chartGuide = chartGuides[title];
  const blocks: ContentBlock[] = [
    { type: "heading", text: `Understanding ${title}` }, { type: "paragraph", text: simple },
    { type: "heading", text: `Why ${title} matters` }, { type: "paragraph", text: `${title} turns an abstract idea into a process we can inspect, test, and improve. The goal is to know when it is useful, what assumptions it makes, and what evidence would make the result trustworthy.` },
    { type: "callout", title: "Daily-life analogy", text: dailyLifeAnalogy(title, subject), tone: "info" },
    { type: "heading", text: "A practical example" }, { type: "paragraph", text: subjectContext.example },
    { type: "heading", text: "How the workflow fits together" }, { type: "diagram", variant: /architecture/i.test(title) ? "architecture" : type === "project" || /workflow|pipeline|lifecycle/i.test(title) ? "pipeline" : "flow", items: [subjectContext.input, `Apply ${title}`, "Validate assumptions", subjectContext.output] },
    { type: "heading", text: "A repeatable approach" },
    { type: "list", items: ["Start with a clear input and desired outcome.", `Apply the core idea behind ${title} in one small step.`, "Inspect the result instead of assuming it is correct.", "Adjust the process and repeat with new examples."] },
    { type: "heading", text: "Important considerations" }, { type: "paragraph", text: `In technical work, ${title} belongs inside a reproducible ${moduleTitle.toLowerCase()} workflow. Record the input, transformations, assumptions, output, and validation so another person can understand and repeat the result.` },
  ];
  if (chartGuide) blocks.push(
    { type: "heading", text: "When to use this chart" },
    { type: "paragraph", text: chartGuide.best },
    { type: "diagram", variant: "concept", items: chartGuide.items },
    { type: "callout", title: "When not to use it", text: chartGuide.avoid, tone: "warning" },
    { type: "callout", title: "Common chart mistake", text: chartGuide.mistake, tone: "warning" },
  );
  if (comparisons[title]) blocks.push({ type: "heading", text: "Compare the ideas" }, { type: "table", ...comparisons[title] });
  if (formulas[title]) blocks.push({ type: "heading", text: "Math, one step at a time" }, { type: "formula", ...formulas[title] });
  if (code) blocks.push(
    { type: "heading", text: `Practical ${code.language === "sql" ? "SQL" : code.language === "excel" ? "Excel" : "Python"}` },
    { type: "code", language: code.language, code: code.code },
    { type: "paragraph", text: `Input: the source values or table. Processing: the ${code.language.toUpperCase()} expression applies the requested operation. Output: a smaller, clearer result that can be inspected. It works because every transformation is explicit and repeatable.` },
  );
  blocks.push(
    { type: "heading", text: "Practice" }, { type: "callout", title: "Try it", text: `Use a tiny five-row example to apply ${title}. Write down the input, expected result, actual result, and one check that would catch an error.`, tone: "info" },
    { type: "heading", text: "Common mistakes" }, { type: "list", items: ["Using the concept before defining the goal and success measure.", "Testing only on the same examples used during setup or training.", "Ignoring edge cases, permissions, data quality, or failure handling."] },
    { type: "heading", text: "Interview questions" }, { type: "list", items: [`How would you explain ${title} to a beginner?`, `When would you use ${title}, and when would you avoid it?`, "What evidence would show that the approach is working?"] },
    { type: "callout", title: "Key takeaways", text: `${title} is one step in a bigger workflow. Start with the goal, make each step visible, test it on a new example, and use evidence to improve the result.`, tone: "success" },
  );
  if (officialResources[subject] && (/introduction|workflow|project|pandas|evaluation|mcp/i.test(`${title} ${moduleTitle}`))) blocks.push({ type: "resource", ...officialResources[subject] });
  return blocks;
}

function quizQuestions(moduleTitle: string, subject: Course["subject"]): QuizQuestion[] {
  const mlQuestions: Array<[string, string[], number, string]> = [
    ["Which data should remain untouched until final evaluation?", ["Training data", "Test data", "Augmented data", "Cached data"], 1, "The test set estimates performance on unseen data and should not guide training or tuning."],
    ["Supervised learning normally learns from which kind of data?", ["Only random numbers", "Labeled examples", "No examples", "Encrypted files"], 1, "Supervised learning uses inputs paired with known target labels."],
    ["What is the safest way to preprocess data during cross-validation?", ["Fit preprocessing on all data first", "Use a pipeline fitted inside each fold", "Skip preprocessing", "Copy the test labels"], 1, "A pipeline fits preprocessing only on the training portion of each fold and reduces leakage."],
    ["What does overfitting usually mean?", ["Strong training performance but weak new-data performance", "The model never trains", "The dataset has no columns", "Every prediction is correct"], 0, "An overfit model captures training-specific noise and generalizes poorly."],
    ["Which task predicts a continuous number?", ["Regression", "Clustering", "Classification only", "Tokenization"], 0, "Regression predicts numerical quantities such as price or demand."],
    ["Why set random_state in a learning example?", ["To make results reproducible", "To guarantee perfection", "To remove features", "To encrypt the model"], 0, "A fixed seed makes random splits and initialization repeatable."],
    ["What is feature engineering?", ["Creating useful inputs from raw data", "Deleting every column", "Changing labels after testing", "Deploying a website"], 0, "Feature engineering represents raw information in forms that help a model learn."],
    ["What does cross-validation estimate?", ["How performance varies across training splits", "A user's password", "Only file size", "The CPU temperature"], 0, "Cross-validation repeats training and validation across folds to estimate generalization."],
    ["Which practice helps detect model drift?", ["Monitor production inputs and outcomes", "Never log metrics", "Train once and forget", "Use the training score forever"], 0, "Production monitoring reveals changing inputs and declining predictive quality."],
  ];
  const agentQuestions: Array<[string, string[], number, string]> = [
    ["What makes an AI system agentic?", ["A larger font", "A bounded loop of decisions and actions", "One static response", "Unlimited permissions"], 1, "Agents pursue goals through controlled decisions, actions, observations, and stopping conditions."],
    ["What should application code do before running a tool call?", ["Validate permissions and arguments", "Trust every string", "Disable logs", "Remove timeouts"], 0, "Trusted code should validate tool choice, inputs, authorization, and limits."],
    ["In ReAct, what follows an action?", ["Observation", "Deletion", "A new model", "Payment"], 0, "The tool result becomes an observation that informs the next reasoning step."],
    ["What is RAG mainly used for?", ["Grounding responses in retrieved knowledge", "Styling buttons", "Replacing every database", "Removing context"], 0, "RAG retrieves relevant knowledge and supplies it as context to generation."],
    ["Which MCP primitive lets a model invoke an operation?", ["Tool", "Color", "Cookie", "Viewport"], 0, "MCP tools expose executable functions; resources expose contextual data."],
    ["Why limit the number of agent steps?", ["To bound failures, time, and cost", "To make loops infinite", "To hide errors", "To remove goals"], 0, "Step limits keep failure modes and resource use bounded."],
    ["What is short-term agent memory?", ["Task state retained across steps", "A permanent public database", "A CSS variable", "A payment plan"], 0, "Short-term memory keeps the context needed to continue the current workflow."],
    ["Why prefer structured tool arguments?", ["They can be validated reliably", "They are always longer", "They remove permissions", "They cannot fail"], 0, "Schemas make tool requests easier to parse, validate, and observe."],
    ["What makes a production agent observable?", ["Traces, logs, metrics, and outcomes", "No records", "Only a prompt", "Unlimited retries"], 0, "Observability connects agent decisions and tool use to measurable outcomes."],
  ];
  const analyticsQuestions: Array<[string, string[], number, string]> = [
    ["Which step should happen before presenting an insight?", ["Validate the data and calculation", "Choose decorative colors", "Delete the question", "Hide assumptions"], 0, "A useful insight needs trustworthy data, a reproducible calculation, and a check against the business question."],
    ["What does WHERE filter in a SQL query?", ["Rows before grouping", "Groups after aggregation", "Chart colors", "Workbook tabs"], 0, "WHERE removes rows before GROUP BY and aggregate calculations."],
    ["What does HAVING filter?", ["Aggregated groups", "Raw rows before FROM", "File names", "Dashboard users"], 0, "HAVING applies a condition after rows have been grouped and aggregates computed."],
    ["Which chart best shows a monthly trend?", ["Line chart", "Pie chart", "Single KPI only", "Unsorted table"], 0, "A line chart uses ordered time on the horizontal axis to reveal change and trend."],
    ["What is a KPI?", ["A measure tied to an important objective", "Any number in a table", "A file format", "A SQL database"], 0, "A key performance indicator connects a carefully defined measure to an important goal."],
    ["Why keep a data-cleaning log?", ["To make transformations reproducible", "To hide missing values", "To avoid validation", "To change the source silently"], 0, "A cleaning log records decisions and helps another analyst reproduce or review the work."],
    ["What does an INNER JOIN keep?", ["Rows with matching join keys in both inputs", "Every left row", "Every right row", "Only duplicate columns"], 0, "An inner join returns the combined rows whose join condition matches."],
    ["Which analytics type asks why something happened?", ["Diagnostic", "Descriptive", "Predictive", "Prescriptive"], 0, "Diagnostic analytics investigates drivers and explanations for an observed result."],
    ["What makes a dashboard accessible?", ["Clear labels, contrast, focus order, and non-color cues", "Tiny text", "Color alone", "No keyboard support"], 0, "Accessible dashboards communicate meaning through readable labels, contrast, structure, and keyboard-friendly interaction."],
  ];
  const scienceQuestions: Array<[string, string[], number, string]> = [
    ["Which data should remain untouched until final evaluation?", ["Training data", "Test data", "Feature names", "Notebook comments"], 1, "The test set estimates performance on unseen data and should not guide training or tuning."],
    ["What is data leakage?", ["Information unavailable at prediction time influences training", "A missing chart title", "A slow query", "A compressed file"], 0, "Leakage makes evaluation overly optimistic by giving the model information it would not have in real use."],
    ["A p-value is calculated under which assumption?", ["The null hypothesis and test assumptions", "The alternative is certainly true", "The sample has no uncertainty", "Every effect is important"], 0, "A p-value describes extremeness under the null model; it is not the probability that the null is true."],
    ["Why use cross-validation?", ["Estimate performance across multiple training splits", "Guarantee a perfect model", "Remove the test set", "Avoid metrics"], 0, "Cross-validation shows how estimates vary across folds while keeping a final test set for unbiased evaluation."],
    ["What is feature engineering?", ["Creating useful inputs from raw information", "Editing predictions after testing", "Deleting every column", "Publishing a dashboard"], 0, "Feature engineering represents raw information in forms that support analysis or modeling."],
    ["Which metric focuses on found positives among all true positives?", ["Recall", "Precision", "Accuracy", "RMSE"], 0, "Recall is TP divided by TP plus FN."],
    ["Why use a pipeline for preprocessing and modeling?", ["Keep fitted transformations inside each training split", "Fit on the test set first", "Hide steps", "Remove reproducibility"], 0, "Pipelines reduce leakage and keep transformations and models reproducible."],
    ["What does a confidence interval communicate?", ["Uncertainty from a stated estimation procedure", "A guaranteed range for every observation", "The probability the sample is correct", "Model accuracy only"], 0, "A confidence interval quantifies uncertainty through the long-run behavior of its construction procedure."],
    ["What should follow model deployment?", ["Monitoring inputs, outcomes, and performance", "Deleting training records", "Ignoring drift", "Stopping evaluation"], 0, "A deployed model needs monitoring for changing data, reliability, and business impact."],
  ];
  const banks = { analytics: analyticsQuestions, science: scienceQuestions, ml: mlQuestions, agents: agentQuestions };
  const shared = banks[subject as keyof typeof banks] ?? mlQuestions;
  // Rotate the subject bank from the module title so every module receives a
  // stable but different assessment instead of the same quiz repeated.
  const moduleSeed = Array.from(moduleTitle).reduce((sum, character) => sum + character.charCodeAt(0), 0);
  const rotated = shared.map((_, index) => shared[(index + moduleSeed) % shared.length]);
  const contextual: [string, string[], number, string] = [`What is the best way to learn ${moduleTitle}?`, ["Use small examples, inspect results, then practice", "Memorize labels only", "Skip every exercise", "Avoid feedback"], 0, `Progress through ${moduleTitle} comes from combining intuition, visible examples, practice, and feedback.`];
  return [contextual, ...rotated].map(([prompt, options, answer, explanation], index) => ({ id: `${slugify(moduleTitle)}-q${index + 1}`, prompt, options, answer, explanation, }));
}

function makeUnit(index: number, title: string, lessonTitles: string[], description: string, subject: Course["subject"]): Unit {
  const lessons = lessonTitles.map((lessonTitle, lessonIndex): Lesson => {
    const quiz = /quiz|assessment/i.test(lessonTitle);
    const project = /build|project|prediction|classifier|segmentation|attrition|api/i.test(lessonTitle) && !quiz;
    const type: Lesson["type"] = quiz ? "quiz" : project ? "project" : "lesson";
    return { id: slugify(lessonTitle), title: lessonTitle, type, duration: quiz ? "12 min" : project ? "20 min" : `${8 + (lessonIndex % 4) * 2} min`, description: quiz ? `Check your understanding of ${title}.` : `Learn ${lessonTitle.toLowerCase()} with intuition, a visual flow, practical examples, and clear takeaways.`, content: learningBlocks(lessonTitle, title, subject, type), questions: quiz ? quizQuestions(title, subject) : undefined };
  });
  return { id: `module-${index + 1}`, title, description, lessons };
}

const analyticsModules: Array<[string, string[], string]> = [
  ["Introduction to Data Analytics", ["What is Data?", "What is Data Analytics?", "Why Data Analytics Matters", "Data Analytics vs Data Analysis", "Data Analytics vs Data Science", "Data Analyst vs Data Scientist", "Data Analyst vs Data Engineer", "Data-Driven Decision Making", "Real-World Applications", "Types of Data Analytics", "Descriptive Analytics", "Diagnostic Analytics", "Predictive Analytics", "Prescriptive Analytics", "Module Quiz"], "Understand the analytics lifecycle, major roles, and the questions each analytics type answers."],
  ["Understanding Data", ["Structured Data", "Semi-Structured Data", "Unstructured Data", "Quantitative Data", "Qualitative Data", "Numerical Data", "Categorical Data", "Primary Data", "Secondary Data", "Internal vs External Data", "CSV", "Excel", "JSON", "XML", "Databases", "APIs", "Module Quiz"], "Recognize data types, origins, formats, and sources before analysis begins."],
  ["Excel for Data Analytics", ["Excel for Analytics", "Rows and Columns", "Sorting", "Filtering", "Basic Formulas", "IF", "SUMIF", "COUNTIF", "XLOOKUP", "INDEX + MATCH", "Pivot Tables", "Pivot Charts", "Conditional Formatting", "Data Cleaning in Excel", "Power Query", "Excel Dashboard", "Module Quiz"], "Use formulas, lookups, pivots, Power Query, and dashboards for repeatable spreadsheet analysis."],
  ["SQL for Data Analytics", ["What is SQL?", "Databases", "Tables", "SELECT", "WHERE", "ORDER BY", "GROUP BY", "HAVING", "Aggregate Functions", "COUNT", "SUM", "AVG", "MIN", "MAX", "INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "Subqueries", "CASE", "Window Functions", "CTEs", "SQL Data Cleaning", "SQL Analytics Project", "Module Quiz"], "Query, join, aggregate, clean, and analyze relational data without assuming prior SQL knowledge."],
  ["Python for Data Analytics", ["Why Python?", "Python Setup", "Python Data Types", "Lists", "Dictionaries", "Loops", "Functions", "NumPy Introduction", "NumPy Arrays", "Pandas Introduction", "Series", "DataFrames", "Loading CSV", "Loading Excel", "Loading JSON", "Filtering Data", "Sorting Data", "GroupBy", "Aggregation", "Merging DataFrames", "Module Quiz"], "Build a practical Python, NumPy, and pandas toolkit for tabular analysis."],
  ["Data Cleaning & Wrangling", ["What is Data Cleaning?", "Why Data Quality Matters", "Missing Values", "Duplicate Records", "Incorrect Values", "Data Types", "String Cleaning", "Date Cleaning", "Outliers", "Handling Outliers", "Data Transformation", "Normalization", "Encoding", "Data Validation", "Data Quality Checks", "Complete Data Cleaning Workflow", "Module Quiz"], "Create a documented cleaning workflow with explicit quality checks and defensible decisions."],
  ["Exploratory Data Analysis", ["What is EDA?", "Why EDA?", "Asking Questions", "Summary Statistics", "Mean", "Median", "Mode", "Variance", "Standard Deviation", "Distribution", "Correlation", "Covariance", "Detecting Patterns", "Detecting Anomalies", "EDA with Pandas", "EDA with Python", "Complete EDA Case Study", "Module Quiz"], "Explore distributions, relationships, anomalies, and uncertainty before communicating conclusions."],
  ["Data Visualization", ["Why Visualization?", "Choosing the Right Chart", "Bar Charts", "Line Charts", "Pie Charts", "Histograms", "Scatter Plots", "Box Plots", "Heatmaps", "Correlation Heatmap", "Matplotlib", "Seaborn", "Plotly", "Interactive Visualization", "Data Storytelling", "Common Visualization Mistakes", "Module Quiz"], "Choose honest charts, explain when to avoid them, and build clear static and interactive visuals."],
  ["Power BI / Tableau & Dashboards", ["What is Business Intelligence?", "What is a Dashboard?", "Dashboard vs Report", "Power BI Introduction", "Importing Data", "Power Query", "Data Modeling", "Relationships", "DAX Introduction", "KPIs", "Charts", "Filters", "Slicers", "Dashboard Design", "Tableau Introduction", "Dashboard Best Practices", "Build a Business Dashboard", "Module Quiz"], "Transform, model, visualize, and communicate business measures in focused dashboards."],
  ["Data Storytelling + Capstone", ["From Data to Insight", "Finding the Important Insight", "Data Storytelling", "Business Questions", "KPIs", "Communicating Results", "Presenting Data to Non-Technical People", "Common Analyst Mistakes", "E-Commerce Sales Analysis", "Customer Churn Analysis", "Movie Dataset Analysis", "Business Intelligence Dashboard", "Portfolio Projects", "Capstone Introduction", "Complete Analytics Workflow", "End-to-End Business Data Analytics Project", "Final Assessment"], "Turn evidence into a concise narrative, recommendation, dashboard, and portfolio-ready capstone."],
];

const scienceModules: Array<[string, string[], string]> = [
  ["Introduction to Data Science", ["What is Data Science?", "Why Data Science?", "Data Science vs Data Analytics", "Data Science vs Machine Learning", "Data Science vs AI", "Role of a Data Scientist", "Data Scientist vs Data Analyst", "Data Scientist vs ML Engineer", "Data Science Lifecycle", "Real-World Applications", "Module Quiz"], "Place data science between analytics and machine learning and understand the end-to-end lifecycle."],
  ["Python for Data Science", ["Python Setup", "Variables", "Data Types", "Operators", "Conditions", "Loops", "Functions", "Lists", "Tuples", "Sets", "Dictionaries", "File Handling", "Exception Handling", "NumPy", "NumPy Arrays", "Pandas", "DataFrames", "Module Quiz"], "Build the Python, NumPy, and pandas foundation needed for reproducible data work."],
  ["SQL for Data Science", ["Databases", "Relational Databases", "SQL Basics", "SELECT", "Filtering", "Sorting", "Aggregation", "GROUP BY", "JOINs", "Subqueries", "CTEs", "Window Functions", "Data Cleaning with SQL", "Advanced SQL", "SQL Data Science Project", "Module Quiz"], "Retrieve, reshape, validate, and summarize relational data for scientific analysis."],
  ["Mathematics & Statistics", ["Why Statistics?", "Population vs Sample", "Mean", "Median", "Mode", "Variance", "Standard Deviation", "Percentiles", "Probability", "Conditional Probability", "Bayes Theorem", "Probability Distributions", "Normal Distribution", "Correlation", "Covariance", "Hypothesis Testing", "P-Value", "Confidence Intervals", "A/B Testing", "Module Quiz"], "Develop intuition, numerical examples, code, and careful interpretation for foundational statistics."],
  ["Data Collection & Preprocessing", ["Data Sources", "APIs", "CSV", "Excel", "JSON", "Web Data", "Web Scraping Basics", "Data Cleaning", "Missing Values", "Duplicate Values", "Outliers", "Encoding", "Scaling", "Normalization", "Standardization", "Feature Selection", "Feature Engineering", "Train/Test Split", "Data Leakage", "Module Quiz"], "Collect representative data and prepare it without contaminating evaluation."],
  ["Exploratory Data Analysis", ["What is EDA?", "Univariate Analysis", "Bivariate Analysis", "Multivariate Analysis", "Distribution Analysis", "Correlation", "Outlier Detection", "Visualization", "Pandas EDA", "Matplotlib", "Seaborn", "Plotly", "Automated EDA", "Complete EDA Project", "Module Quiz"], "Use questions, summaries, and visualizations to understand data before formal modeling."],
  ["Machine Learning for Data Scientists", ["What is Machine Learning?", "Supervised Learning", "Unsupervised Learning", "Regression", "Classification", "Linear Regression", "Logistic Regression", "Decision Trees", "Random Forest", "K-Means", "Clustering", "Feature Engineering", "Model Training", "Model Prediction", "Module Quiz"], "Learn only the ML foundation needed to continue into the dedicated Machine Learning course."],
  ["Model Evaluation & Optimization", ["Why Model Evaluation?", "Train/Test/Validation", "Accuracy", "Precision", "Recall", "F1 Score", "Confusion Matrix", "MAE", "MSE", "RMSE", "R²", "Cross Validation", "Overfitting", "Underfitting", "Bias vs Variance", "Hyperparameter Tuning", "Module Quiz"], "Match evaluation metrics to the problem and optimize without leaking final-test information."],
  ["Advanced Data Science", ["Feature Engineering", "Dimensionality Reduction", "PCA", "Time Series Basics", "Forecasting", "Anomaly Detection", "Recommendation Systems", "NLP Introduction", "Text Data", "Sentiment Analysis", "Deep Learning Introduction", "Neural Networks", "Generative AI for Data Science", "AI-Assisted Data Analysis", "Module Quiz"], "Survey advanced problem types while keeping assumptions, baselines, and evaluation visible."],
  ["Production Data Science + Capstone", ["Complete Data Science Workflow", "Model Serialization", "APIs", "FastAPI", "Deployment", "Model Monitoring", "MLOps Introduction", "Customer Churn Prediction", "House Price Prediction", "Customer Segmentation", "Sales Forecasting", "Sentiment Analysis Project", "Data Science Portfolio", "Data Science Interview Preparation", "End-to-End Data Science Project", "Final Assessment"], "Package a reproducible solution, expose it safely, monitor it, and present business impact."],
];

const agentModules: Array<[string, string[], string]> = [
  ["Introduction to Agentic AI", ["What is Artificial Intelligence?", "What is Generative AI?", "What is an AI Agent?", "What is Agentic AI?", "AI vs Generative AI vs AI Agents", "LLM vs AI Agent", "Why AI Agents Matter", "Real-World AI Agent Applications", "AI Agent Architecture", "Module Quiz"], "Build a clear mental model of AI, generative systems, and goal-directed agents."],
  ["Large Language Models", ["What is an LLM?", "How LLMs Work — Simple Explanation", "Tokens", "Context Window", "Prompts", "System Prompt", "User Prompt", "Assistant Response", "Temperature", "Model Parameters", "Function Calling", "Structured Output", "Module Quiz"], "Understand the language-model capabilities that power modern agents."],
  ["Anatomy of an AI Agent", ["Agent Components", "Agent Brain", "Agent Goal", "Agent Memory", "Agent Tools", "Agent Planning", "Agent Reasoning", "Agent Actions", "Agent Observation", "Agent Loop", "Think → Act → Observe", "ReAct Pattern", "Module Quiz"], "Explore every part of a bounded reasoning and action loop."],
  ["Tools and Function Calling", ["What are Agent Tools?", "Why Agents Need Tools", "Calculator Tool", "Search Tool", "Weather Tool", "Database Tool", "API Tool", "Function Calling", "Tool Selection", "Tool Parameters", "Tool Results", "Tool Errors", "Build Your First Tool-Using Agent", "Module Quiz"], "Give agents structured, safe access to useful capabilities."],
  ["Building AI Agents with Python", ["Python Setup", "Virtual Environment", "Installing AI Libraries", "Connecting an LLM", "Creating a Basic Agent", "Adding Tools", "Agent Loop", "Memory", "Error Handling", "Build a Research Agent", "Module Quiz"], "Build a small agent from first principles with readable Python."],
  ["Agent Frameworks", ["Why Agent Frameworks?", "smolagents", "LangChain", "LangGraph", "LlamaIndex", "Framework Comparison", "When to Use Each Framework", "Building an Agent with LangGraph", "Agent State", "Graph-Based Agent Workflows", "Module Quiz"], "Compare frameworks and model stateful workflows as graphs."],
  ["RAG + AI Agents", ["What is RAG?", "Why Agents Need Knowledge", "Documents", "Chunking", "Embeddings", "Vector Databases", "Retrieval", "Context", "RAG Pipeline", "Agentic RAG", "Traditional RAG vs Agentic RAG", "Build a Knowledge Agent", "Module Quiz"], "Ground agent decisions in relevant, retrievable knowledge."],
  ["MCP", ["What is MCP?", "Why MCP?", "MCP Architecture", "MCP Client", "MCP Server", "MCP Tools", "MCP Resources", "MCP Prompts", "Connecting an AI Agent to MCP", "Build an MCP-Powered Agent", "Module Quiz"], "Connect AI applications to tools and context through an open protocol."],
  ["Multi-Agent Systems", ["What is a Multi-Agent System?", "Single Agent vs Multi-Agent", "Agent Roles", "Supervisor Agent", "Worker Agent", "Planner Agent", "Research Agent", "Communication Between Agents", "Multi-Agent Workflow", "Build a Multi-Agent System", "Module Quiz"], "Coordinate specialized agents while keeping ownership and handoffs clear."],
  ["Production AI Agents + Capstone", ["AI Agent Security", "Guardrails", "Authentication", "Authorization", "Logging", "Observability", "Agent Evaluation", "Cost Optimization", "Deployment", "Production Architecture", "Capstone Introduction", "Build an AI Research Agent", "Deploy the Agent", "Final Assessment"], "Evaluate, secure, deploy, and combine every skill in a research-agent capstone."],
];

const mlModules: Array<[string, string[], string]> = [
  ["Introduction to Machine Learning", ["What is Machine Learning?", "AI vs ML vs Deep Learning", "Why Machine Learning?", "How Machines Learn", "Traditional Programming vs ML", "Machine Learning Workflow", "Types of Machine Learning", "Supervised Learning", "Unsupervised Learning", "Reinforcement Learning", "Semi-Supervised Learning", "Self-Supervised Learning", "Real-World Applications", "Module Quiz"], "Learn the major learning paradigms and the end-to-end ML workflow."],
  ["Python for Machine Learning", ["Python Basics for ML", "NumPy Introduction", "NumPy Arrays", "Array Operations", "Pandas Introduction", "DataFrames", "Reading CSV Files", "Data Selection", "Data Cleaning", "Matplotlib", "Data Visualization", "Basic Statistics", "Jupyter Notebook", "Google Colab", "Module Quiz"], "Build the Python and data-handling foundation used throughout the course."],
  ["Data Preprocessing", ["Understanding Datasets", "Features and Labels", "Training Data", "Validation Data", "Test Data", "Train-Test Split", "Missing Values", "Duplicate Data", "Outliers", "Encoding Categorical Data", "Feature Scaling", "Normalization", "Standardization", "Feature Engineering", "Feature Selection", "Data Leakage", "Module Quiz"], "Turn raw data into reliable, leakage-free model inputs."],
  ["Linear Regression", ["What is Regression?", "Linear Regression Intuition", "Simple Linear Regression", "Multiple Linear Regression", "Prediction", "Cost Function", "Mean Squared Error", "Gradient Descent", "Learning Rate", "Training a Regression Model", "Evaluating Regression", "Python + Scikit-learn Implementation", "Real-World House Price Prediction", "Module Quiz"], "Learn regression visually, mathematically, and through a house-price project."],
  ["Classification", ["What is Classification?", "Binary Classification", "Multiclass Classification", "Logistic Regression", "K-Nearest Neighbors", "Decision Trees", "Random Forest", "Naive Bayes", "Support Vector Machines", "Model Training", "Prediction", "Classification Example", "Spam Detection Project", "Module Quiz"], "Compare practical classifiers and build a spam-detection project."],
  ["Unsupervised Learning", ["What is Unsupervised Learning?", "Clustering", "K-Means", "K-Means Intuition", "Choosing K", "Elbow Method", "Hierarchical Clustering", "DBSCAN", "Dimensionality Reduction", "PCA", "Association Rules", "Customer Segmentation Project", "Module Quiz"], "Discover patterns in unlabeled data and segment customers."],
  ["Model Evaluation", ["Why Model Evaluation?", "Accuracy", "Precision", "Recall", "F1 Score", "Confusion Matrix", "ROC Curve", "AUC", "MAE", "MSE", "RMSE", "R² Score", "Cross Validation", "Bias vs Variance", "Underfitting", "Overfitting", "Module Quiz"], "Choose metrics that match the problem and measure generalization honestly."],
  ["Model Improvement", ["Hyperparameters", "Hyperparameter Tuning", "Grid Search", "Random Search", "Regularization", "L1 Regularization", "L2 Regularization", "Feature Engineering", "Feature Selection", "Ensemble Learning", "Bagging", "Boosting", "Gradient Boosting", "XGBoost Introduction", "Model Comparison", "Module Quiz"], "Tune, regularize, ensemble, and compare models without leaking test information."],
  ["Reinforcement Learning + Advanced Concepts", ["What is Reinforcement Learning?", "Agent", "Environment", "State", "Action", "Reward", "Policy", "Q-Learning", "Exploration vs Exploitation", "Self-Supervised Learning", "Semi-Supervised Learning", "Introduction to Neural Networks", "ML vs Deep Learning", "When to Use Deep Learning", "Module Quiz"], "Build intuition for learning from rewards and connect ML to neural networks."],
  ["Real-World ML + Projects", ["Complete ML Pipeline", "Dataset → Model → Prediction", "Model Saving", "Pickle / Joblib", "Building an ML API", "FastAPI Introduction", "Deploying an ML Model", "Monitoring Models", "Model Drift", "Introduction to MLOps", "End-to-End ML Project", "House Price Prediction", "Spam Email Classifier", "Customer Segmentation", "Employee Attrition Prediction", "End-to-End ML Prediction API", "Build Your Own Machine Learning Project", "Final Assessment"], "Ship, monitor, and present complete machine-learning projects."],
];

export const agenticAiCourse: Course = {
  shortTitle: "Agentic AI", focus: "How can AI reason and perform tasks?", curriculumHeadline: "From first principles to production agents", nextCourseText: "Explore advanced AI projects.",
  outcomes: ["Explain agent loops, planning, memory, tools, RAG, and MCP", "Build bounded single-agent and multi-agent workflows", "Evaluate, secure, observe, and deploy an AI agent"],
  audience: ["Developers and technical learners new to agents", "ML or data practitioners moving into AI systems"], prerequisites: ["Basic Python", "Comfort reading API examples"],
  careerPath: "Data & AI", jobs: ["AI Engineer", "GenAI Engineer", "Agentic AI Engineer", "AI Developer"], portfolioChecklist: ["Public repository", "Architecture diagram", "Evaluation report", "Demo and README", "Resume-ready project summary"],
  builds: ["Tool-using research agent", "RAG knowledge agent", "MCP-powered agent", "Multi-agent workflow"], assessment: "Ten-question module quizzes, guided builds, and a production AI research-agent capstone.", certificateCriteria: "Complete every lesson and project, submit the capstone milestone, and score at least 60% on each module assessment.",
  id: "agentic-ai", slug: "agentic-ai", subject: "agents", title: "Agentic AI — Build Intelligent AI Agents",
  subtitle: "Learn how modern AI agents work and how to build intelligent systems that can reason, plan, use tools, access knowledge, remember context, and execute real-world tasks.",
  shortDescription: "Learn how AI agents reason, plan, use tools, access knowledge, and execute real-world tasks.", level: "Beginner → Intermediate", duration: "~12–15 hours", lessonCountLabel: "60+", tags: ["Agentic AI", "AI Agents", "LLM", "RAG", "MCP", "LangGraph", "Python"],
  units: agentModules.map((module, index) => makeUnit(index, module[0], module[1], module[2], "agents")),
};

export const machineLearningCourse: Course = {
  shortTitle: "Machine Learning", focus: "How can machines learn from data?", curriculumHeadline: "From first dataset to deployed model", nextCourseSlug: "agentic-ai", nextCourseText: "Recommended next: Agentic AI",
  outcomes: ["Prepare leakage-free data for training", "Train and compare regression, classification, and clustering models", "Evaluate, package, deploy, and monitor a prediction system"],
  audience: ["Python learners entering machine learning", "Analysts and data scientists strengthening modeling skills"], prerequisites: ["Basic Python", "Introductory data handling and statistics"],
  careerPath: "Data & AI", jobs: ["ML Engineer", "Junior ML Engineer", "AI Engineer"], portfolioChecklist: ["Reproducible notebook", "Model comparison", "Evaluation evidence", "Deployment instructions", "Resume-ready project summary"],
  builds: ["House-price predictor", "Spam classifier", "Customer segmentation", "Prediction API"], assessment: "Ten-question module quizzes, algorithm exercises, guided projects, and an end-to-end prediction API.", certificateCriteria: "Complete every lesson and project, submit the final ML project, and score at least 60% on each module assessment.",
  id: "machine-learning", slug: "machine-learning", subject: "ml", title: "Machine Learning — From Fundamentals to Real Projects",
  subtitle: "Learn Machine Learning from the ground up with simple explanations, visual intuition, practical Python examples, algorithms, model evaluation, and real-world projects.",
  shortDescription: "Understand ML algorithms, model training, evaluation and build practical prediction systems.", level: "Beginner → Intermediate", duration: "~15–20 hours", lessonCountLabel: "100+", tags: ["Machine Learning", "Python", "Scikit-learn"],
  units: mlModules.map((module, index) => makeUnit(index, module[0], module[1], module[2], "ml")),
};

export const dataAnalyticsCourse: Course = {
  id: "data-analytics", slug: "data-analytics", shortTitle: "Data Analytics", subject: "analytics", title: "Data Analytics — From Raw Data to Business Insights",
  subtitle: "Learn how to collect, clean, analyze, visualize, and communicate data so evidence can support better business decisions.",
  shortDescription: "Learn how to collect, clean, analyze, visualize and communicate data to make better decisions.", level: "Beginner", duration: "~12–15 hours", lessonCountLabel: "100+", tags: ["Data Analytics", "SQL", "Excel"],
  focus: "What happened and why?", curriculumHeadline: "From raw data to a clear business recommendation", nextCourseSlug: "data-science", nextCourseText: "Recommended next: Data Science",
  outcomes: ["Clean and analyze business data with Excel, SQL, and pandas", "Choose honest visualizations and define useful KPIs", "Build a dashboard and communicate an evidence-based recommendation"],
  audience: ["Beginners entering analytics", "Professionals who want practical data decision skills"], prerequisites: ["No prior analytics experience", "Basic computer and spreadsheet familiarity"],
  careerPath: "Data & AI", jobs: ["Data Analyst", "BI Analyst", "Reporting Analyst"], portfolioChecklist: ["Clean source data", "Documented SQL or workbook", "Dashboard", "Business recommendation", "Resume-ready project summary"],
  builds: ["E-commerce sales analysis", "Customer churn analysis", "Movie-data exploration", "Business intelligence dashboard"], assessment: "Ten-question module quizzes, SQL and spreadsheet practice, dashboard milestones, and an end-to-end analytics capstone.", certificateCriteria: "Complete every lesson and project, submit the final analytics capstone, and score at least 60% on each module assessment.",
  units: analyticsModules.map((module, index) => makeUnit(index, module[0], module[1], module[2], "analytics")),
};

export const dataScienceCourse: Course = {
  id: "data-science", slug: "data-science", shortTitle: "Data Science", subject: "science", title: "Data Science — From Data to Intelligent Predictions",
  subtitle: "Learn Python, statistics, SQL, data analysis, machine learning, deployment, and real-world data science through reproducible projects.",
  shortDescription: "Learn Python, statistics, SQL, data analysis, machine learning and real-world data science.", level: "Beginner → Intermediate", duration: "~18–22 hours", lessonCountLabel: "100+", tags: ["Data Science", "Python", "Statistics"],
  focus: "What patterns can we discover and predict?", curriculumHeadline: "From a business problem to a deployed data solution", nextCourseSlug: "machine-learning", nextCourseText: "Recommended next: Machine Learning",
  outcomes: ["Use Python, SQL, statistics, and EDA to investigate data", "Engineer features and build baseline predictive models", "Evaluate, deploy, monitor, and communicate a data-science solution"],
  audience: ["Analysts moving into data science", "Python learners who want an end-to-end data workflow"], prerequisites: ["Basic Python or completion of Data Analytics", "Comfort with simple algebra"],
  careerPath: "Data & AI", jobs: ["Junior Data Scientist", "Data Analyst", "ML Associate"], portfolioChecklist: ["Problem statement", "Reproducible analysis", "Model card", "Demo or API", "Resume-ready project summary"],
  builds: ["Churn prediction", "House-price prediction", "Customer segmentation", "Sales forecast", "Sentiment analysis"], assessment: "Ten-question module quizzes, statistical exercises, guided projects, and a deployed data-science capstone.", certificateCriteria: "Complete every lesson and project, submit the final data-science capstone, and score at least 60% on each module assessment.",
  units: scienceModules.map((module, index) => makeUnit(index, module[0], module[1], module[2], "science")),
};

export { fullStackCourse, mernStackCourse, softwareTestingCourse };
const coreCourses = [dataAnalyticsCourse, dataScienceCourse, machineLearningCourse, agenticAiCourse, fullStackCourse, mernStackCourse, softwareTestingCourse] satisfies Course[];

const subjectCourseSubjects: Record<string, Course["subject"]> = {
  python: "science", sql: "analytics", excel: "analytics", git: "fullstack", statistics: "science",
  pandas: "analytics", eda: "analytics", visualization: "analytics", "power-bi": "analytics", tableau: "analytics",
  "ml-fundamentals": "ml", "deep-learning": "ml", nlp: "ml", "generative-ai": "agents", rag: "agents", "ai-agents": "agents", mcp: "agents",
  spark: "ml", airflow: "ml", kafka: "ml", react: "fullstack", nextjs: "fullstack", nodejs: "fullstack", postgresql: "fullstack", "software-testing": "testing",
};

const subjectCourses: Course[] = seedSubjects.map((subject) => {
  const courseSubject = subjectCourseSubjects[subject.slug] ?? "analytics";
  const moduleTitle = `${subject.name} Foundations`;
  const lessonTitles = [
    `What is ${subject.name}?`,
    `Why ${subject.name} matters`,
    `${subject.name} workflow`,
    `Practical ${subject.name} example`,
    `Practice with ${subject.name}`,
    `Common ${subject.name} mistakes`,
    `Build with ${subject.name}`,
    "Module Quiz",
  ];
  return {
    id: `course-${subject.id}`,
    slug: subject.slug,
    shortTitle: subject.name,
    title: `${subject.name} — Practical Foundations`,
    subtitle: `${subject.description}. Build confidence through guided explanations, practice, and a portfolio-ready milestone.`,
    shortDescription: subject.description,
    level: subject.difficulty === "beginner" ? "Beginner" : subject.difficulty === "intermediate" ? "Intermediate" : "Advanced",
    duration: `~${subject.estimatedHours} hours`,
    lessonCountLabel: `${lessonTitles.length}`,
    tags: [subject.name, subject.difficulty, "Projects"],
    subject: courseSubject,
    focus: `Use ${subject.name} to solve practical problems`,
    curriculumHeadline: `From ${subject.name} concepts to applied evidence`,
    outcomes: [subject.description, `Apply ${subject.name} in a small, reproducible project`, "Explain decisions, validate results, and identify next steps"],
    audience: [`Learners building a foundation in ${subject.name}`, "Developers, analysts, and career switchers who prefer practical learning"],
    prerequisites: ["No prior professional experience required", "A willingness to practice and inspect results"],
    builds: [`${subject.name} practice project`, `${subject.name} validation checklist`, `${subject.name} portfolio milestone`],
    assessment: "A guided milestone and a ten-question module quiz with explanations and retry support.",
    certificateCriteria: "Complete every lesson, submit the project milestone, and score at least 60% on the module assessment.",
    careerPath: courseSubject === "fullstack" || courseSubject === "mern" ? "Development" : courseSubject === "testing" ? "Quality" : "Data & AI",
    jobs: ["Junior practitioner", "Analyst", "Developer"],
    portfolioChecklist: ["Reproducible project", "Validation evidence", "README with decisions", "Resume-ready explanation"],
    nextCourseText: "Continue with a connected course or career program.",
    units: [makeUnit(0, moduleTitle, lessonTitles, `Build a practical foundation in ${subject.name}.`, courseSubject)],
  };
});

/** The curated seven-course catalog shown in the main individual-course marketplace. */
export const courses = coreCourses;
/** All course records, including subject courses linked from career programs. */
export const allCourses = [...coreCourses, ...subjectCourses] satisfies Course[];

const courseSlugAliases: Record<string, string> = {
  powerbi: "power-bi", genai: "generative-ai", agents: "ai-agents", postgres: "postgresql", testing: "software-testing",
};

export function canonicalCourseSlug(courseSlug: string) { return courseSlugAliases[courseSlug] ?? courseSlug; }
export function findCourseExact(courseSlug: string) { const canonical = canonicalCourseSlug(courseSlug); return allCourses.find((course) => course.slug === canonical || course.id === courseSlug); }
export function findCourse(courseSlug: string) { return findCourseExact(courseSlug) ?? dataAnalyticsCourse; }
export function lessonsForCourse(courseSlug: string) { const course = findCourse(courseSlug); return course.units.flatMap((unit) => unit.lessons.map((lesson) => ({ course, unit, lesson }))); }
export const allLessons = allCourses.flatMap((course) => lessonsForCourse(course.slug));
export function findLessonExact(courseSlug: string, unitId: string, lessonId: string) {
  const course = findCourseExact(courseSlug);
  if (!course) return undefined;
  return course.units.flatMap((unit) => unit.lessons.map((lesson) => ({ course, unit, lesson }))).find(({ unit, lesson }) => unit.id === unitId && lesson.id === lessonId);
}
export function findLesson(courseSlug: string, unitId: string, lessonId: string) { const lessons = lessonsForCourse(courseSlug); return findLessonExact(courseSlug, unitId, lessonId) ?? lessons[0]; }
export function lessonHref(courseSlug: string, unitId: string, lessonId: string) { return `/learn/${courseSlug}/${unitId}/${lessonId}`; }
