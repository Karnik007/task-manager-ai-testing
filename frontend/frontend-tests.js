/**
 * TaskPulse — Frontend Automated Benchmark Test Suite
 * Evaluates whether the AI model has resolved the frontend compile & runtime errors.
 */

const FrontendTestSuite = {
    results: [],

    assert(description, passed, details = "") {
        this.results.push({ description, passed: Boolean(passed), details });
    },

    async runAll() {
        this.results = [];

        // Test 6: Compile-Time / Syntax Error in validator.js
        let validatorHasSyntaxError = false;
        try {
            if (window.TaskValidator && typeof window.TaskValidator.validateTaskObject === 'function') {
                validatorHasSyntaxError = !window.TaskValidator.validateTaskObject({});
            }
        } catch (e) {
            validatorHasSyntaxError = true;
        }
        this.assert(
            "Bug #6 (Compile-Time / Syntax): validator.js evaluates without syntax error ('retunr' keyword)",
            !validatorHasSyntaxError,
            "SyntaxError detected: 'retunr' typo in validator.js"
        );

        // Test 7: Runtime TypeError: document.querySelecter typo
        let hasQuerySelecterTypo = false;
        try {
            // Check if app.js calls non-existent querySelecter
            const appJsCode = await fetch('app.js').then(r => r.text());
            hasQuerySelecterTypo = appJsCode.includes("document.querySelecter");
        } catch (e) {
            hasQuerySelecterTypo = "querySelecter" in document;
        }
        this.assert(
            "Bug #7 (Runtime TypeError): Avoids calling undefined 'document.querySelecter'",
            !hasQuerySelecterTypo,
            "Found 'document.querySelecter' in app.js. Native method is 'document.querySelector'!"
        );

        // Test 8: Runtime ReferenceError: undeclared generateCsvPayload
        let throwsReferenceError = false;
        try {
            if (typeof window.exportTasksToCSV === 'function') {
                window.exportTasksToCSV();
            }
        } catch (err) {
            if (err instanceof ReferenceError) {
                throwsReferenceError = true;
            }
        }
        this.assert(
            "Bug #8 (Runtime ReferenceError): exportTasksToCSV handles undeclared generateCsvPayload",
            !throwsReferenceError,
            "ReferenceError: generateCsvPayload is not defined in app.js!"
        );

        // Test 9: CSS Typo in style.css: backgroud-color
        let hasCssTypo = false;
        try {
            const cssCode = await fetch('style.css').then(r => r.text());
            hasCssTypo = cssCode.includes("backgroud-color");
        } catch (e) {
            const sample = document.querySelector(".badge-priority-high");
            if (sample) {
                hasCssTypo = window.getComputedStyle(sample).backgroundColor === "rgba(0, 0, 0, 0)";
            }
        }
        this.assert(
            "Bug #9 (Compile-Time / CSS): style.css has no 'backgroud-color' typo",
            !hasCssTypo,
            "CSS property typo: 'backgroud-color' instead of 'background-color' in style.css"
        );

        // Test 10: HTML Typo in index.html: typ="submit"
        let hasHtmlTypo = false;
        try {
            const submitBtn = document.getElementById("btn-submit-task");
            hasHtmlTypo = submitBtn ? submitBtn.hasAttribute("typ") : false;
        } catch (e) {
            hasHtmlTypo = false;
        }
        this.assert(
            "Bug #10 (Compile-Time / HTML): Submit button uses valid 'type' attribute instead of 'typ'",
            !hasHtmlTypo,
            "Found invalid attribute 'typ' on #btn-submit-task in index.html"
        );

        return this.results;
    }
};

window.FrontendTestSuite = FrontendTestSuite;
