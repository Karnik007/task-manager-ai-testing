/**
 * TaskPulse — Backend Input Validation Helper
 * 
 * Intentional Compile-Time Errors in this file:
 *  - Bug #1 (SyntaxError): 'cosnt' typo instead of 'const' (keyword typo)
 *  - Bug #2 (SyntaxError): Missing closing parenthesis in if statement
 */

// BUG #1 (Intentional Compile-Time Syntax Error):
// Typo in keyword 'cosnt' instead of 'const'.
// V8 throws: SyntaxError: Unexpected identifier 'MAX_TITLE_LEN'
cosnt MAX_TITLE_LEN = 120;
const MIN_TITLE_LEN = 3;

/**
 * Validates incoming task payload
 * @param {object} payload 
 * @returns {object} { isValid: boolean, error: string|null }
 */
function validateTaskPayload(payload) {
    if (!payload || typeof payload !== 'object') {
        return { isValid: false, error: "Payload must be a valid JSON object" };
    }

    const { title, priority, status } = payload;

    // BUG #2 (Intentional Compile-Time Syntax Error):
    // Missing closing parenthesis before the curly brace '{'
    // V8 throws: SyntaxError: Unexpected token '{'
    if (!title || typeof title !== 'string' || title.trim().length < MIN_TITLE_LEN {
        return { isValid: false, error: `Title must be at least ${MIN_TITLE_LEN} characters` };
    }

    if (title.length > MAX_TITLE_LEN) {
        return { isValid: false, error: `Title cannot exceed ${MAX_TITLE_LEN} characters` };
    }

    const validPriorities = ['low', 'medium', 'high'];
    if (priority && !validPriorities.includes(priority)) {
        return { isValid: false, error: "Priority must be 'low', 'medium', or 'high'" };
    }

    const validStatuses = ['todo', 'in-progress', 'completed'];
    if (status && !validStatuses.includes(status)) {
        return { isValid: false, error: "Status must be 'todo', 'in-progress', or 'completed'" };
    }

    return { isValid: true, error: null };
}

module.exports = {
    validateTaskPayload,
    MAX_TITLE_LEN,
    MIN_TITLE_LEN
};
