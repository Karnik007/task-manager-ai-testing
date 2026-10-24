/**
 * TaskPulse — Controller Layer
 * 
 * Intentional Runtime Errors in this file:
 *  - Bug #3 (Runtime ReferenceError): 'logger' is referenced without declaration/import
 *  - Bug #5 (Runtime TypeError): Unhandled property access on undefined metadata
 */

const DataStore = require('./dataStore');

const TaskController = {
    /**
     * GET /api/tasks
     */
    getTasks(req, res) {
        try {
            const { search, priority, status } = req.query || {};

            let tasks;
            if (search) {
                // Triggers Bug #4 in DataStore if search query is provided
                tasks = DataStore.searchTasks(search);
            } else {
                tasks = DataStore.getAllTasks();
            }

            if (priority) {
                tasks = tasks.filter(t => t.priority === priority);
            }
            if (status) {
                tasks = tasks.filter(t => t.status === status);
            }

            // BUG #3 (Intentional Runtime ReferenceError):
            // 'logger' variable has never been imported or declared in this module!
            // When this line executes, V8 throws:
            // ReferenceError: logger is not defined
            try {
                logger.info(`Retrieved ${tasks.length} tasks from store`);
            } catch (err) {
                // Bubble up runtime error message in response header/warning
                res.setHeader("X-Runtime-Warning", `Bug #3 Triggered: ${err.message}`);
                console.warn("[Runtime Error Bug #3 Detected]", err.message);
            }

            res.json({
                success: true,
                count: tasks.length,
                data: tasks
            });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message, errorType: error.name });
        }
    },

    /**
     * GET /api/tasks/:id
     */
    getTaskById(req, res) {
        const task = DataStore.getTaskById(req.params.id);
        if (!task) {
            return res.status(404).json({ success: false, error: "Task not found" });
        }
        res.json({ success: true, data: task });
    },

    /**
     * GET /api/tasks/:id/audit
     */
    getTaskAuditLog(req, res) {
        try {
            const task = DataStore.getTaskById(req.params.id);
            if (!task) {
                return res.status(404).json({ success: false, error: "Task not found" });
            }

            // BUG #5 (Intentional Runtime TypeError):
            // 'task.metadata' is undefined by default.
            // Accessing task.metadata.author throws:
            // TypeError: Cannot read properties of undefined (reading 'author')
            const author = task.metadata.author.name;

            res.json({ success: true, audit: { author, taskId: task.id } });
        } catch (err) {
            res.status(500).json({
                success: false,
                error: err.message,
                errorType: err.name,
                note: "Intentional Runtime TypeError: Cannot read properties of undefined"
            });
        }
    },

    /**
     * GET /api/stats
     */
    getTaskStats(req, res) {
        const allTasks = DataStore.getAllTasks();
        const total = allTasks.length;
        const completed = allTasks.filter(t => t.status === 'completed').length;
        const inProgress = allTasks.filter(t => t.status === 'in-progress').length;
        const todo = allTasks.filter(t => t.status === 'todo').length;
        const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);

        res.json({
            success: true,
            data: { total, completed, inProgress, todo, completionRate }
        });
    },

    /**
     * POST /api/tasks
     */
    createTask(req, res) {
        const { title, description, priority, dueDate, status } = req.body || {};
        if (!title || title.trim() === '') {
            return res.status(400).json({ success: false, error: "Title is required" });
        }

        const newTask = DataStore.createTask({ title, description, priority, dueDate, status });
        res.status(201).json({ success: true, data: newTask });
    },

    /**
     * PUT /api/tasks/:id
     */
    updateTask(req, res) {
        const { id } = req.params;
        const updated = DataStore.updateTask(id, req.body || {});
        if (!updated) {
            return res.status(404).json({ success: false, error: "Task not found" });
        }
        res.json({ success: true, data: updated });
    },

    /**
     * DELETE /api/tasks/:id
     */
    deleteTask(req, res) {
        const { id } = req.params;
        const deleted = DataStore.deleteTask(id);
        if (!deleted) {
            return res.status(404).json({ success: false, error: "Task not found" });
        }
        res.json({ success: true, message: `Task ${id} deleted successfully` });
    }
};

module.exports = TaskController;
