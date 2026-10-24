# TaskPulse — AI Benchmark Ground Truth Key (Compile-Time & Runtime Errors)

This benchmark suite contains **10 deliberate compile-time and runtime errors** across the fullstack Node.js and Vanilla JS codebase. 
It contains **no purely logical errors** — all errors manifest as explicit syntax parse failures, AST compilation errors, or runtime exceptions (`TypeError`, `ReferenceError`).

---

## Master Error Matrix

| ID | Layer | Error Classification | File | Trigger / Exception |
|---|---|---|---|---|
| **#1** | Backend | **Compile-Time** (SyntaxError) | `backend/validators.js` | `SyntaxError: Unexpected identifier 'MAX_TITLE_LEN'` due to `cosnt` keyword typo |
| **#2** | Backend | **Compile-Time** (SyntaxError) | `backend/validators.js` | `SyntaxError: Unexpected token '{'` due to missing closing parenthesis in `if` |
| **#3** | Backend | **Runtime** (ReferenceError) | `backend/taskController.js` | `ReferenceError: logger is not defined` when fetching tasks in `getTasks()` |
| **#4** | Backend | **Runtime** (TypeError) | `backend/dataStore.js` | `TypeError: task.title.toLowercase is not a function` (lowercase 'c' instead of `toLowerCase()`) |
| **#5** | Backend | **Runtime** (TypeError) | `backend/taskController.js` | `TypeError: Cannot read properties of undefined (reading 'author')` on `task.metadata` |
| **#6** | Frontend | **Compile-Time** (SyntaxError) | `frontend/validator.js` | `SyntaxError: Unexpected token 'false'` due to `retunr` keyword typo |
| **#7** | Frontend | **Runtime** (TypeError) | `frontend/app.js` | `TypeError: document.querySelecter is not a function` ('selecter' instead of 'querySelector') |
| **#8** | Frontend | **Runtime** (ReferenceError) | `frontend/app.js` | `ReferenceError: generateCsvPayload is not defined` in `exportTasksToCSV()` |
| **#9** | Frontend | **Compile-Time** (CSS Syntax) | `frontend/style.css` | Invalid CSS property: `backgroud-color` instead of `background-color` in `.badge-priority-high` |
| **#10**| Frontend | **Compile-Time** (HTML Syntax)| `frontend/index.html` | Invalid tag attribute: `typ="submit"` instead of `type="submit"` on `#btn-submit-task` |

---

## Detailed Error Specifications & Corrections

### Bug #1: Keyword Typo `cosnt` (Compile-Time)
- **File**: `backend/validators.js`
- **Error Type**: `SyntaxError: Unexpected identifier 'MAX_TITLE_LEN'`
- **Buggy Code**:
  ```javascript
  cosnt MAX_TITLE_LEN = 120;
  ```
- **Correction**:
  ```javascript
  const MAX_TITLE_LEN = 120;
  ```
- **Explanation**: JavaScript reserved keyword for constant declaration is `const`. Typo `cosnt` causes V8 parser to fail during AST creation.

---

### Bug #2: Missing Closing Parenthesis in If Statement (Compile-Time)
- **File**: `backend/validators.js`
- **Error Type**: `SyntaxError: Unexpected token '{'`
- **Buggy Code**:
  ```javascript
  if (!title || typeof title !== 'string' || title.trim().length < MIN_TITLE_LEN {
  ```
- **Correction**:
  ```javascript
  if (!title || typeof title !== 'string' || title.trim().length < MIN_TITLE_LEN) {
  ```
- **Explanation**: An `if` condition in JavaScript must be enclosed within matching parentheses before opening the block with `{`.

---

### Bug #3: Undeclared Variable `logger` (Runtime ReferenceError)
- **File**: `backend/taskController.js`
- **Error Type**: `ReferenceError: logger is not defined`
- **Buggy Code**:
  ```javascript
  logger.info(`Retrieved ${tasks.length} tasks from store`);
  ```
- **Correction**:
  ```javascript
  console.log(`Retrieved ${tasks.length} tasks from store`);
  // OR declare logger: const logger = console;
  ```
- **Explanation**: `logger` is accessed in the lexical scope without prior declaration (`const`, `let`, `var`) or module `require()`.

---

### Bug #4: Method Name Case Typo `toLowercase()` (Runtime TypeError)
- **File**: `backend/dataStore.js`
- **Error Type**: `TypeError: task.title.toLowercase is not a function`
- **Buggy Code**:
  ```javascript
  return this.tasks.filter(task => 
      task.title.toLowercase().includes(keyword.toLowerCase())
  );
  ```
- **Correction**:
  ```javascript
  return this.tasks.filter(task => 
      task.title.toLowerCase().includes(keyword.toLowerCase())
  );
  ```
- **Explanation**: String methods in JavaScript are camelCase. The native method is `toLowerCase()` with uppercase `C`.

---

### Bug #5: Reading Property of Undefined (Runtime TypeError)
- **File**: `backend/taskController.js`
- **Error Type**: `TypeError: Cannot read properties of undefined (reading 'author')`
- **Buggy Code**:
  ```javascript
  const author = task.metadata.author.name;
  ```
- **Correction**:
  ```javascript
  const author = task.metadata?.author?.name || "System";
  ```
- **Explanation**: `task.metadata` is undefined on newly created tasks. Accessing nested properties requires optional chaining (`?.`) or existence verification.

---

### Bug #6: Typo in Return Keyword (Compile-Time SyntaxError)
- **File**: `frontend/validator.js`
- **Error Type**: `SyntaxError: Unexpected token 'false'`
- **Buggy Code**:
  ```javascript
  retunr false;
  ```
- **Correction**:
  ```javascript
  return false;
  ```
- **Explanation**: Typo in JavaScript keyword `return`.

---

### Bug #7: Typo in DOM Query Method (Runtime TypeError)
- **File**: `frontend/app.js`
- **Error Type**: `TypeError: document.querySelecter is not a function`
- **Buggy Code**:
  ```javascript
  const input = document.querySelecter("#task-title");
  ```
- **Correction**:
  ```javascript
  const input = document.querySelector("#task-title");
  ```
- **Explanation**: The W3C DOM method name is `querySelector` with an 'o', not 'e'.

---

### Bug #8: Undeclared Function Call (Runtime ReferenceError)
- **File**: `frontend/app.js`
- **Error Type**: `ReferenceError: generateCsvPayload is not defined`
- **Buggy Code**:
  ```javascript
  const payload = generateCsvPayload(state.tasks);
  ```
- **Correction**:
  ```javascript
  const payload = JSON.stringify(state.tasks);
  // OR declare generateCsvPayload function before invoking
  ```
- **Explanation**: Calling a function that does not exist in the execution scope triggers a `ReferenceError`.

---

### Bug #9: Misspelled CSS Property (Compile-Time / CSS Parse Error)
- **File**: `frontend/style.css`
- **Error Type**: Invalid CSS Property Name
- **Buggy Code**:
  ```css
  .badge-priority-high {
      backgroud-color: rgba(239, 68, 68, 0.2);
  }
  ```
- **Correction**:
  ```css
  .badge-priority-high {
      background-color: rgba(239, 68, 68, 0.2);
  }
  ```
- **Explanation**: `backgroud-color` is missing an 'n'. The browser CSS parser drops invalid declarations.

---

### Bug #10: Misspelled HTML Tag Attribute (Compile-Time / HTML Syntax)
- **File**: `frontend/index.html`
- **Error Type**: Invalid HTML Button Attribute
- **Buggy Code**:
  ```html
  <button typ="submit" id="btn-submit-task" class="btn btn-primary">Create Task</button>
  ```
- **Correction**:
  ```html
  <button type="submit" id="btn-submit-task" class="btn btn-primary">Create Task</button>
  ```
- **Explanation**: Attribute `typ` is non-standard. The button fails to behave as a form submit button.
