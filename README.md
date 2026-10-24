# ⚡ TaskPulse — Fullstack AI Code-Correction & Testing Benchmark

> **A modern, fullstack task management Kanban application built with deliberate compile-time and runtime errors for benchmarking AI-powered automated code repair and static analysis systems.**

[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/Karnik007/task-manager-ai-testing)
[![AI Benchmark](https://img.shields.io/badge/AI%20Benchmark-Compile%20%26%20Runtime%20Errors-purple)](#error-manifest-summary)
[![Stack](https://img.shields.io/badge/Stack-Node.js%20%7C%20Express%20%7C%20Vanilla%20JS-brightgreen)](#project-architecture)

---

## 🎯 Benchmark Objective

Unlike generic bug benchmarks with subjective domain logic bugs, TaskPulse contains **strictly verifiable Compile-Time and Runtime Errors**:
1. **Compile-Time & Syntax Errors**: AST parse failures, keyword typos (`cosnt`, `retunr`), missing parentheses, and HTML/CSS syntax violations.
2. **Runtime Exceptions**: Explicit `TypeError` (e.g. `undefined is not a function`, reading properties of `undefined`) and `ReferenceError` (undeclared identifiers).
3. **Automated Verification**: Comes with automated test runners for both backend (`backend/backend-test.js`) and frontend (`frontend/frontend-tests.html`).

---

## 📁 Project Architecture

```
task-manager-ai-testing/
├── backend/                  # Node.js API Service
│   ├── package.json          # Dependencies (Express, Cors, Dotenv)
│   ├── server.js             # Express / Native HTTP API Server
│   ├── taskController.js     # Route handlers (Contains Runtime Errors #3, #5)
│   ├── dataStore.js          # In-memory store (Contains Runtime TypeError #4)
│   ├── validators.js         # Input validation (Contains Compile SyntaxErrors #1, #2)
│   └── backend-test.js       # Node evaluation test suite
│
├── frontend/                 # Client Web Dashboard
│   ├── index.html            # Main dashboard UI (Contains HTML Syntax Error #10)
│   ├── style.css             # Glassmorphic dark styling (Contains CSS Syntax Error #9)
│   ├── app.js                # Frontend controller (Contains Runtime Errors #7, #8)
│   ├── validator.js          # Validation helper (Contains Compile SyntaxError #6)
│   ├── frontend-tests.html   # Browser test runner
│   └── frontend-tests.js     # Browser test assertions
│
├── requirements.txt          # Python/Linter environment requirements for AI scanners
├── bugs.md                   # Complete Ground Truth Master Solution Key
└── README.md                 # Project documentation
```

---

## 🚀 Running the Project

### 1. Frontend (Browser)
Open `frontend/index.html` directly in any web browser. The app runs smoothly with simulated data even if the backend is not started.

To run the automated frontend tests:
Open `frontend/frontend-tests.html` in your browser.

### 2. Backend (Node.js)
```bash
cd backend
npm install   # (Optional: server runs in zero-dependency native mode if npm is omitted)
node server.js
```
The API starts at `http://localhost:5000`.

To run the backend automated evaluation suite:
```bash
node backend-test.js
```

---

## 🐞 Error Manifest Summary

| ID | Layer | Type | Target File | Issue Description |
|---|---|---|---|---|
| **#1** | Backend | SyntaxError | `backend/validators.js` | Keyword typo `cosnt MAX_TITLE_LEN = 120;` |
| **#2** | Backend | SyntaxError | `backend/validators.js` | Missing closing parenthesis in `if (...) {` |
| **#3** | Backend | ReferenceError | `backend/taskController.js` | Undeclared identifier `logger.info()` |
| **#4** | Backend | TypeError | `backend/dataStore.js` | Non-existent method `task.title.toLowercase()` |
| **#5** | Backend | TypeError | `backend/taskController.js` | Reading `task.metadata.author` on undefined `metadata` |
| **#6** | Frontend | SyntaxError | `frontend/validator.js` | Keyword typo `retunr false;` |
| **#7** | Frontend | TypeError | `frontend/app.js` | DOM method typo `document.querySelecter()` |
| **#8** | Frontend | ReferenceError | `frontend/app.js` | Undeclared function `generateCsvPayload()` |
| **#9** | Frontend | CSS Syntax | `frontend/style.css` | Property typo `backgroud-color` |
| **#10**| Frontend | HTML Syntax | `frontend/index.html` | Attribute typo `typ="submit"` on button |

Detailed explanations, AST outputs, and correction diffs are available in [bugs.md](bugs.md).

---

## 🤖 Injecting into AI Model
Clone the repository:
```bash
git clone https://github.com/Karnik007/task-manager-ai-testing.git
cd task-manager-ai-testing
```

Prompt your AI model:
> *"Audit this fullstack repository for compile-time syntax errors and runtime exceptions in both frontend and backend. Correct each error in place, ensuring `node backend/backend-test.js` passes 100% and `frontend/frontend-tests.html` turns all checks green."*

---

## 📄 License
MIT License. Created for AI code-correction and automated repair benchmarking.
