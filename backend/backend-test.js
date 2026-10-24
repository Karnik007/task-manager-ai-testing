/**
 * TaskPulse — Backend Automated Benchmark Suite
 * Evaluates whether the AI model has successfully corrected the compile-time and runtime errors.
 */

const fs = require('fs');
const path = require('path');
const DataStore = require('./dataStore');
const TaskController = require('./taskController');

const suite = [];
function test(title, fn) {
    suite.push({ title, fn });
}

// ----------------------------------------------------
// 1. Compile-Time Syntax Error #1: 'cosnt' keyword typo in validators.js
// ----------------------------------------------------
test("Bug #1 (Compile-Time): validators.js has no 'cosnt' typo and parses cleanly", () => {
    const filePath = path.join(__dirname, 'validators.js');
    const content = fs.readFileSync(filePath, 'utf-8');

    if (/cosnt\s+MAX_TITLE_LEN/.test(content)) {
        throw new Error("SyntaxError: Found keyword typo 'cosnt' instead of 'const' in validators.js");
    }
});

// ----------------------------------------------------
// 2. Compile-Time Syntax Error #2: Missing closing parenthesis in validators.js
// ----------------------------------------------------
test("Bug #2 (Compile-Time): validators.js compiles and exports validateTaskPayload", () => {
    try {
        // Clear module cache to re-evaluate
        delete require.cache[require.resolve('./validators')];
        const v = require('./validators');
        if (typeof v.validateTaskPayload !== 'function') {
            throw new Error("validateTaskPayload is not exported as a function");
        }
    } catch (err) {
        throw new Error(`Compile-Time SyntaxError in validators.js: ${err.message}`);
    }
});

// ----------------------------------------------------
// 3. Runtime ReferenceError #3: Undeclared 'logger' in taskController.js
// ----------------------------------------------------
test("Bug #3 (Runtime): taskController.js does not throw ReferenceError for undeclared 'logger'", () => {
    const filePath = path.join(__dirname, 'taskController.js');
    const content = fs.readFileSync(filePath, 'utf-8');

    // Check if undeclared logger.info call is still present without a declaration
    const hasUndeclaredLogger = /logger\.info\(/.test(content) && !/(const|let|var)\s+logger\s*=/.test(content);
    if (hasUndeclaredLogger) {
        throw new Error("ReferenceError: 'logger' is referenced without declaration or import in taskController.js");
    }
});

// ----------------------------------------------------
// 4. Runtime TypeError #4: 'toLowercase()' typo in dataStore.js
// ----------------------------------------------------
test("Bug #4 (Runtime): dataStore.searchTasks executes without TypeError", () => {
    try {
        const results = DataStore.searchTasks("design");
        if (!Array.isArray(results)) {
            throw new Error("Expected array of search results");
        }
    } catch (err) {
        throw new Error(`TypeError in DataStore.searchTasks: ${err.message} (Check 'toLowercase' vs 'toLowerCase')`);
    }
});

// ----------------------------------------------------
// 5. Runtime TypeError #5: Unhandled property access on undefined metadata
// ----------------------------------------------------
test("Bug #5 (Runtime): getTaskAuditLog safely handles missing task.metadata without throwing TypeError", () => {
    let thrownError = null;
    const mockRes = {
        status: (code) => ({
            json: (data) => {
                if (code >= 500) thrownError = new Error(data.error || "500 Error");
            }
        }),
        json: () => {}
    };

    TaskController.getTaskAuditLog({ params: { id: "task-1" } }, mockRes);
    if (thrownError) {
        throw new Error(`TypeError in getTaskAuditLog: ${thrownError.message} (Unsafe access on undefined task.metadata.author)`);
    }
});

// ----------------------------------------------------
// Run All Backend Tests
// ----------------------------------------------------
console.log("\n🚀 Running TaskPulse Backend AI Evaluation Tests...\n");
let passed = 0;
let failed = 0;

suite.forEach(t => {
    try {
        t.fn();
        console.log(`✅ PASS: ${t.title}`);
        passed++;
    } catch (err) {
        console.log(`❌ FAIL: ${t.title}`);
        console.log(`   ${err.message}\n`);
        failed++;
    }
});

console.log(`\n==========================================`);
console.log(`Backend Benchmark: Total: ${suite.length} | Passed: ${passed} | Failed: ${failed}`);
console.log(`==========================================\n`);
