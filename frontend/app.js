/**
 * TaskPulse — Main Application Controller
 * 
 * Intentional Runtime Errors in this file:
 *  - Bug #7 (Runtime TypeError): 'document.querySelecter' typo instead of 'querySelector'
 *  - Bug #8 (Runtime ReferenceError): 'generateCsvPayload' is invoked without being declared
 */

const API_BASE = "http://localhost:5000/api";

// Fallback seed tasks for standalone browser testing
const MOCK_TASKS = [
    {
        id: "task-1",
        title: "Design System Tokens & Dark Palette",
        description: "Establish HSL color variables and glassmorphic card styles",
        priority: "high",
        status: "completed",
        dueDate: "2026-10-20"
    },
    {
        id: "task-2",
        title: "Implement REST API Endpoints",
        description: "Create CRUD handlers for tasks, stats, and search filtering",
        priority: "high",
        status: "in-progress",
        dueDate: "2026-10-28"
    },
    {
        id: "task-3",
        title: "Write Automated Benchmark Test Suite",
        description: "Develop test assertions to evaluate AI model bug corrections",
        priority: "medium",
        status: "in-progress",
        dueDate: "2026-10-29"
    },
    {
        id: "task-4",
        title: "Setup CI/CD GitHub Action Pipeline",
        description: "Automate linting and test execution on main branch pushes",
        priority: "low",
        status: "todo",
        dueDate: "2026-11-05"
    },
    {
        id: "task-5",
        title: "Audit Accessibility & ARIA Labels",
        description: "Ensure WCAG 2.1 compliance across all modal dialogs",
        priority: "medium",
        status: "completed",
        dueDate: "2026-10-22"
    }
];

let state = {
    tasks: [...MOCK_TASKS],
    backendOnline: false,
    filters: {
        status: "",
        priority: "",
        search: ""
    }
};

// DOM References
const listTodo = document.getElementById("list-todo");
const listInProgress = document.getElementById("list-in-progress");
const listCompleted = document.getElementById("list-completed");
const badgeTodo = document.getElementById("badge-todo");
const badgeProgress = document.getElementById("badge-progress");
const badgeCompleted = document.getElementById("badge-completed");

const statTotal = document.getElementById("stat-total");
const statCompleted = document.getElementById("stat-completed");
const statPending = document.getElementById("stat-pending");
const statRate = document.getElementById("stat-rate");
const backendStatusPill = document.getElementById("backend-status");
const backendStatusText = document.getElementById("backend-status-text");

const modal = document.getElementById("task-modal");
const btnOpenModal = document.getElementById("btn-open-modal");
const btnCloseModal = document.getElementById("btn-close-modal");
const btnCancel = document.getElementById("btn-cancel");
const taskForm = document.getElementById("create-task-form");

const searchInput = document.getElementById("search-input");
const statusFilter = document.getElementById("status-filter");
const priorityFilter = document.getElementById("priority-filter");

/**
 * Initializes the frontend application
 */
async function init() {
    setupEventListeners();
    await checkBackendHealth();
    await fetchTasks();
    render();
}

/**
 * Checks connection to backend
 */
async function checkBackendHealth() {
    try {
        const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(1500) });
        if (res.ok) {
            state.backendOnline = true;
            backendStatusPill.className = "backend-status-pill online";
            backendStatusText.textContent = "Backend API: Online (Port 5000)";
        } else {
            throw new Error();
        }
    } catch (e) {
        state.backendOnline = false;
        backendStatusPill.className = "backend-status-pill offline";
        backendStatusText.textContent = "Backend: Offline (Using Local Simulation)";
    }
}

/**
 * Attaches event listeners
 */
function setupEventListeners() {
    // Modal open / close
    btnOpenModal.addEventListener("click", () => {
        modal.classList.add("active");
        
        // BUG #7 (Intentional Runtime TypeError):
        // Calls 'document.querySelecter' with typo ('selecter' instead of 'querySelector')
        // Browser throws: TypeError: document.querySelecter is not a function
        try {
            const input = document.querySelecter("#task-title");
            if (input) input.focus();
        } catch (err) {
            console.warn("[Runtime TypeError Bug #7 Detected]:", err.message);
            // Fallback so user can still type
            const inputFallback = document.querySelector("#task-title");
            if (inputFallback) inputFallback.focus();
        }
    });

    const closeModal = () => modal.classList.remove("active");
    btnCloseModal.addEventListener("click", closeModal);
    btnCancel.addEventListener("click", closeModal);

    // Form submit
    taskForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const title = document.getElementById("task-title").value.trim();
        const desc = document.getElementById("task-desc").value.trim();
        const priority = document.getElementById("task-priority").value;
        const due = document.getElementById("task-due").value;

        if (!title) return;

        const newTask = {
            id: `task-${Date.now()}`,
            title,
            description: desc,
            priority,
            dueDate: due || new Date().toISOString().split('T')[0],
            status: "todo"
        };

        if (state.backendOnline) {
            try {
                await fetch(`${API_BASE}/tasks`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newTask)
                });
            } catch (err) {
                console.warn("Backend save failed, saved locally:", err);
            }
        }

        state.tasks.unshift(newTask);
        taskForm.reset();
        closeModal();
        render();
    });

    // Search input
    searchInput.addEventListener("input", (e) => {
        state.filters.search = e.target.value.toLowerCase();
        render();
    });

    // Status filter
    statusFilter.addEventListener("change", (e) => {
        state.filters.status = e.target.value;
        render();
    });

    // Priority filter
    priorityFilter.addEventListener("change", (e) => {
        state.filters.priority = e.target.value;
        render();
    });
}

/**
 * Triggers task export (Contains Bug #8)
 */
function exportTasksToCSV() {
    // BUG #8 (Intentional Runtime ReferenceError):
    // 'generateCsvPayload' is called but is never declared or imported!
    // V8 throws: ReferenceError: generateCsvPayload is not defined
    try {
        const payload = generateCsvPayload(state.tasks);
        console.log("CSV Export payload generated:", payload);
    } catch (err) {
        console.warn("[Runtime ReferenceError Bug #8 Detected]:", err.message);
        throw err;
    }
}
window.exportTasksToCSV = exportTasksToCSV;

/**
 * Fetches tasks from backend or mock
 */
async function fetchTasks() {
    if (state.backendOnline) {
        try {
            const res = await fetch(`${API_BASE}/tasks`);
            const data = await res.json();
            if (data.success && Array.isArray(data.data)) {
                state.tasks = data.data;
            }
        } catch (e) {
            console.warn("Using fallback local tasks.");
        }
    }
}

/**
 * Renders the tasks into the Kanban board
 */
function render() {
    // Filter tasks
    const filtered = state.tasks.filter(task => {
        if (state.filters.status && task.status !== state.filters.status) return false;
        if (state.filters.priority && task.priority !== state.filters.priority) return false;
        if (state.filters.search) {
            const q = state.filters.search;
            const matchTitle = task.title.toLowerCase().includes(q);
            const matchDesc = task.description && task.description.toLowerCase().includes(q);
            if (!matchTitle && !matchDesc) return false;
        }
        return true;
    });

    // Clear lists
    listTodo.innerHTML = "";
    listInProgress.innerHTML = "";
    listCompleted.innerHTML = "";

    let countTodo = 0;
    let countProg = 0;
    let countDone = 0;

    filtered.forEach(task => {
        const el = createTaskElement(task);
        if (task.status === "todo") {
            listTodo.appendChild(el);
            countTodo++;
        } else if (task.status === "in-progress") {
            listInProgress.appendChild(el);
            countProg++;
        } else if (task.status === "completed") {
            listCompleted.appendChild(el);
            countDone++;
        }
    });

    badgeTodo.textContent = countTodo;
    badgeProgress.textContent = countProg;
    badgeCompleted.textContent = countDone;

    // Update Stats
    const total = state.tasks.length;
    const completed = state.tasks.filter(t => t.status === "completed").length;
    const pending = total - completed;
    const rate = total === 0 ? 0 : Math.round((completed / total) * 100);

    statTotal.textContent = total;
    statCompleted.textContent = completed;
    statPending.textContent = pending;
    statRate.textContent = `${rate}%`;
}

/**
 * Creates a DOM element for a task card
 */
function createTaskElement(task) {
    const card = document.createElement("div");
    card.className = "task-item";
    card.dataset.id = task.id;

    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "completed";

    card.innerHTML = `
        <div class="task-item-title">${escapeHtml(task.title)}</div>
        ${task.description ? `<div class="task-item-desc">${escapeHtml(task.description)}</div>` : ''}
        <div class="task-item-meta">
            <span class="priority-badge badge-priority-${task.priority}">${task.priority}</span>
            <span class="due-badge ${isOverdue ? 'overdue' : ''}">Due: ${task.dueDate || 'No date'}</span>
        </div>
        <div class="task-item-actions">
            ${task.status !== 'completed' ? `<button class="action-btn" onclick="advanceTaskStatus('${task.id}')">Advance &rarr;</button>` : ''}
            <button class="action-btn delete" onclick="deleteTask('${task.id}')">&times; Delete</button>
        </div>
    `;
    return card;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

window.advanceTaskStatus = (id) => {
    const task = state.tasks.find(t => t.id === id);
    if (!task) return;
    if (task.status === "todo") task.status = "in-progress";
    else if (task.status === "in-progress") task.status = "completed";
    render();
};

window.deleteTask = (id) => {
    state.tasks = state.tasks.filter(t => t.id !== id);
    render();
};

document.addEventListener("DOMContentLoaded", init);
