/**
 * TaskPulse — Node.js REST API Server
 */

const http = require('http');
const DataStore = require('./dataStore');
const TaskController = require('./taskController');

// Attempt to load validators (Exposes Compile-Time SyntaxErrors #1 & #2)
let Validators = null;
let validatorCompileError = null;
try {
    Validators = require('./validators');
} catch (syntaxErr) {
    validatorCompileError = {
        name: syntaxErr.name,
        message: syntaxErr.message,
        stack: syntaxErr.stack
    };
    console.warn(`⚠️ [Compile-Time SyntaxError Detected in validators.js]: ${syntaxErr.message}`);
}

const PORT = process.env.PORT || 5000;

let express;
try {
    express = require('express');
} catch (e) {
    express = null;
}

if (express) {
    const app = express();
    let cors;
    try {
        cors = require('cors');
        app.use(cors());
    } catch (e) {
        app.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            res.header("Access-Control-Allow-Headers", "Content-Type");
            if (req.method === 'OPTIONS') return res.sendStatus(200);
            next();
        });
    }

    app.use(express.json());

    // API Routes
    app.get('/api/tasks', TaskController.getTasks);
    app.get('/api/tasks/:id', TaskController.getTaskById);
    app.get('/api/tasks/:id/audit', TaskController.getTaskAuditLog);
    app.get('/api/stats', TaskController.getTaskStats);
    app.post('/api/tasks', TaskController.createTask);
    app.put('/api/tasks/:id', TaskController.updateTask);
    app.delete('/api/tasks/:id', TaskController.deleteTask);

    app.get('/api/health', (req, res) => {
        res.json({
            status: "healthy",
            timestamp: new Date().toISOString(),
            validatorStatus: validatorCompileError ? "compile_error" : "valid",
            validatorCompileError: validatorCompileError
        });
    });

    if (require.main === module) {
        app.listen(PORT, () => {
            console.log(`🚀 TaskPulse Server running on http://localhost:${PORT}`);
        });
    }

    module.exports = app;
} else {
    // Native Node HTTP Server
    const server = http.createServer((req, res) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");

        if (req.method === 'OPTIONS') {
            res.writeHead(200);
            return res.end();
        }

        const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
        const pathname = parsedUrl.pathname;

        const sendJson = (code, data) => {
            res.writeHead(code, { "Content-Type": "application/json" });
            res.end(JSON.stringify(data));
        };

        const mockRes = {
            setHeader: (k, v) => res.setHeader(k, v),
            status: (code) => ({ json: (d) => sendJson(code, d) }),
            json: (d) => sendJson(200, d)
        };

        if (pathname === '/api/tasks' && req.method === 'GET') {
            req.query = Object.fromEntries(parsedUrl.searchParams);
            return TaskController.getTasks(req, mockRes);
        }

        if (pathname === '/api/stats' && req.method === 'GET') {
            return TaskController.getTaskStats(req, mockRes);
        }

        if (pathname === '/api/health') {
            return sendJson(200, {
                status: "healthy",
                validatorStatus: validatorCompileError ? "compile_error" : "valid",
                validatorCompileError: validatorCompileError
            });
        }

        sendJson(404, { success: false, error: "Not Found" });
    });

    if (require.main === module) {
        server.listen(PORT, () => {
            console.log(`🚀 TaskPulse (Native Server) running on http://localhost:${PORT}`);
        });
    }

    module.exports = server;
}
