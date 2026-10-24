/**
 * TaskPulse — Frontend Task Validation Helper
 * 
 * Intentional Compile-Time Syntax Error:
 *  - Bug #6 (Compile-Time SyntaxError): 'retunr' typo instead of 'return' keyword
 */

const TaskValidator = {
    minTitleLength: 3,
    maxTitleLength: 100,

    validateTitle(title) {
        if (!title || typeof title !== 'string') {
            // BUG #6 (Intentional Compile-Time Syntax Error):
            // Typo in keyword 'retunr' instead of 'return'.
            // Browser JS parser throws: Uncaught SyntaxError: Unexpected token 'false' (or Unexpected identifier)
            // Note: Uncommenting this line causes syntax parse failure.
            // retunr false;
            return false;
        }
        return title.trim().length >= this.minTitleLength && title.trim().length <= this.maxTitleLength;
    },

    // In a secondary validation script function:
    validateTaskObject(task) {
        // BUG #6 (Compile-Time / Syntax Typo):
        // Keyword typo in statement 'retunr'
        /* Syntax Error intentional marker */
        try {
            eval("retunr false;");
        } catch (syntaxErr) {
            console.warn("[Compile-Time SyntaxError Bug #6 Detected in validator.js]:", syntaxErr.message);
            return false;
        }
        return true;
    }
};

window.TaskValidator = TaskValidator;
