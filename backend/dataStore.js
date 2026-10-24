/**
 * TaskPulse — In-Memory Data Store
 * 
 * Intentional Runtime Errors in this file:
 *  - Bug #4 (Runtime TypeError): Calls task.title.toLowercase() with lowercase 'c' instead of 'toLowerCase()'
 */

class DataStore {
    constructor() {
        this.tasks = [
            {
                id: "task-1",
                title: "Design System Tokens & Dark Palette",
                description: "Establish HSL color variables and glassmorphic card styles",
                priority: "high",
                status: "completed",
                dueDate: "2026-10-20",
                createdAt: "2026-10-18T10:00:00Z"
            },
            {
                id: "task-2",
                title: "Implement REST API Endpoints",
                description: "Create CRUD handlers for tasks, stats, and search filtering",
                priority: "high",
                status: "in-progress",
                dueDate: "2026-10-28",
                createdAt: "2026-10-19T11:30:00Z"
            },
            {
                id: "task-3",
                title: "Write Automated Benchmark Test Suite",
                description: "Develop test assertions to evaluate AI model bug corrections",
                priority: "medium",
                status: "in-progress",
                dueDate: "2026-10-29",
                createdAt: "2026-10-20T09:15:00Z"
            },
            {
                id: "task-4",
                title: "Setup CI/CD GitHub Action Pipeline",
                description: "Automate linting and test execution on main branch pushes",
                priority: "low",
                status: "todo",
                dueDate: "2026-11-05",
                createdAt: "2026-10-21T14:20:00Z"
            },
            {
                id: "task-5",
                title: "Audit Accessibility & ARIA Labels",
                description: "Ensure WCAG 2.1 compliance across all modal dialogs",
                priority: "medium",
                status: "completed",
                dueDate: "2026-10-22",
                createdAt: "2026-10-22T08:00:00Z"
            }
        ];
        this.nextId = 6;
    }

    getAllTasks() {
        return [...this.tasks];
    }

    getTaskById(id) {
        return this.tasks.find(t => t.id === id) || null;
    }

    searchTasks(keyword) {
        if (!keyword) return this.getAllTasks();
        
        // BUG #4 (Intentional Runtime TypeError):
        // Calls 'toLowercase()' with lowercase 'c'.
        // JavaScript String prototype method is 'toLowerCase()' with capital 'C'!
        // Throws: TypeError: task.title.toLowercase is not a function
        return this.tasks.filter(task => 
            task.title.toLowercase().includes(keyword.toLowerCase())
        );
    }

    createTask({ title, description, priority, dueDate, status }) {
        const newTask = {
            id: `task-${this.nextId++}`,
            title: title ? title.trim() : "Untitled Task",
            description: description ? description.trim() : "",
            priority: priority || "medium",
            status: status || "todo",
            dueDate: dueDate || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
            createdAt: new Date().toISOString()
        };
        this.tasks.push(newTask);
        return newTask;
    }

    updateTask(id, updates) {
        const index = this.tasks.findIndex(t => t.id === id);
        if (index === -1) return null;

        this.tasks[index] = {
            ...this.tasks[index],
            ...updates,
            id: this.tasks[index].id,
            updatedAt: new Date().toISOString()
        };
        return this.tasks[index];
    }

    deleteTask(id) {
        const index = this.tasks.findIndex(t => t.id === id);
        if (index === -1) return false;
        this.tasks.splice(index, 1);
        return true;
    }
}

module.exports = new DataStore();
