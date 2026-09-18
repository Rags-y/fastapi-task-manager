const API_URL = "/tasks";

let allTasks = [];


// ==============================
// Load Tasks
// ==============================

async function loadTasks() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to load tasks");
        }

        const data = await response.json();

        allTasks = data.tasks;

        updateStatistics(allTasks);
        applyCurrentView();

    } catch (error) {
        console.error(error);

        document.getElementById("tasks-container").innerHTML = `
            <div class="empty-state">
                <h3>Unable to load tasks</h3>
                <p>Please make sure the FastAPI server is running.</p>
            </div>
        `;
    }
}


// ==============================
// Statistics
// ==============================

function updateStatistics(tasks) {
    const total = tasks.length;

    const pending = tasks.filter(
        task => task.status === "pending"
    ).length;

    const inProgress = tasks.filter(
        task => task.status === "in-progress"
    ).length;

    const completed = tasks.filter(
        task => task.status === "completed"
    ).length;


    document.getElementById("total-count").textContent = total;

    document.getElementById("pending-count").textContent = pending;

    document.getElementById("progress-count").textContent = inProgress;

    document.getElementById("completed-count").textContent = completed;
}


// ==============================
// Render Tasks
// ==============================

function renderTasks(tasks) {

    const container =
        document.getElementById("tasks-container");


    if (tasks.length === 0) {

        container.innerHTML = `
            <div class="empty-state">

                <div class="empty-icon">
                    ▦
                </div>

                <h3>
                    No tasks found
                </h3>

                <p>
                    Create a task or change your search/filter.
                </p>

            </div>
        `;

        return;
    }


    container.innerHTML = tasks.map(task => `

        <div class="task-card">

            <div class="task-top">

                <div>

                    <div class="task-title">
                        ${escapeHTML(task.title)}
                    </div>

                    <div class="task-description">
                        ${escapeHTML(task.description)}
                    </div>

                </div>

            </div>


            <div class="task-meta">

                <span class="badge priority-${task.priority}">
                    ${formatText(task.priority)}
                </span>

                <span class="badge status-${task.status}">
                    ${formatText(task.status)}
                </span>

            </div>


            <div class="task-actions">

                <button
                    type="button"
                    onclick="editTask(${task.id})"
                >
                    ✎ Edit
                </button>

                <button
                    type="button"
                    class="delete-btn"
                    onclick="deleteTask(${task.id})"
                >
                    🗑 Delete
                </button>

            </div>

        </div>

    `).join("");
}


// ==============================
// Create Task
// ==============================

document
    .getElementById("task-form")
    .addEventListener("submit", async function(event) {

        event.preventDefault();


        const task = {

            title:
                document
                    .getElementById("title")
                    .value
                    .trim(),

            description:
                document
                    .getElementById("description")
                    .value
                    .trim(),

            priority:
                document
                    .getElementById("priority")
                    .value,

            status:
                document
                    .getElementById("status")
                    .value

        };


        try {

            const response = await fetch(API_URL, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(task)

            });


            const data = await response.json();


            if (!response.ok) {

                throw new Error(
                    data.detail ||
                    "Failed to create task"
                );

            }


            showMessage(
                "Task created successfully!",
                "success"
            );


            document
                .getElementById("task-form")
                .reset();


            await loadTasks();


        } catch (error) {

            showMessage(
                error.message,
                "error"
            );

        }

    });


// ==============================
// Search Tasks
// ==============================

async function searchTasks() {

    const keyword =
        document
            .getElementById("search-input")
            .value
            .trim();


    if (!keyword) {

        applyCurrentView();

        return;
    }


    try {

        const response = await fetch(
            `${API_URL}/search?keyword=${encodeURIComponent(keyword)}`
        );


        const data = await response.json();


        if (!response.ok) {

            throw new Error(
                data.detail ||
                "Search failed"
            );

        }


        applyFilters(data.results);


    } catch (error) {

        console.error(error);

    }

}


// ==============================
// Filter Tasks
// ==============================

function filterTasks() {
    applyCurrentView();
}


function applyCurrentView() {

    const keyword =
        document
            .getElementById("search-input")
            .value
            .trim()
            .toLowerCase();


    const status =
        document
            .getElementById("status-filter")
            .value;


    const priority =
        document
            .getElementById("priority-filter")
            .value;


    let filteredTasks = [...allTasks];


    // Search
    if (keyword) {

        filteredTasks =
            filteredTasks.filter(task =>

                task.title
                    .toLowerCase()
                    .includes(keyword)

                ||

                task.description
                    .toLowerCase()
                    .includes(keyword)

            );

    }


    // Status
    if (status) {

        filteredTasks =
            filteredTasks.filter(
                task => task.status === status
            );

    }


    // Priority
    if (priority) {

        filteredTasks =
            filteredTasks.filter(
                task => task.priority === priority
            );

    }


    renderTasks(filteredTasks);
}


function applyFilters(tasks) {

    const status =
        document
            .getElementById("status-filter")
            .value;


    const priority =
        document
            .getElementById("priority-filter")
            .value;


    let filteredTasks = [...tasks];


    if (status) {

        filteredTasks =
            filteredTasks.filter(
                task => task.status === status
            );

    }


    if (priority) {

        filteredTasks =
            filteredTasks.filter(
                task => task.priority === priority
            );

    }


    renderTasks(filteredTasks);
}


// ==============================
// Delete Task
// ==============================

async function deleteTask(taskId) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this task?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response = await fetch(
            `${API_URL}/${taskId}`,
            {
                method: "DELETE"
            }
        );


        const data = await response.json();


        if (!response.ok) {

            throw new Error(
                data.detail ||
                "Failed to delete task"
            );

        }


        showMessage(
            "Task deleted successfully!",
            "success"
        );


        await loadTasks();


    } catch (error) {

        alert(error.message);

    }

}


// ==============================
// Open Edit Modal
// ==============================

function editTask(taskId) {

    const task =
        allTasks.find(
            task => task.id === taskId
        );


    if (!task) {
        return;
    }


    document
        .getElementById("edit-task-id")
        .value = task.id;


    document
        .getElementById("edit-title")
        .value = task.title;


    document
        .getElementById("edit-description")
        .value = task.description;


    document
        .getElementById("edit-priority")
        .value = task.priority;


    document
        .getElementById("edit-status")
        .value = task.status;


    document
        .getElementById("edit-modal")
        .classList.add("show");

}


// ==============================
// Close Edit Modal
// ==============================

function closeEditModal() {

    document
        .getElementById("edit-modal")
        .classList.remove("show");

}


// ==============================
// Submit Edit Form
// ==============================

document
    .getElementById("edit-form")
    .addEventListener("submit", async function(event) {

        event.preventDefault();


        const taskId =
            document
                .getElementById("edit-task-id")
                .value;


        const updatedTask = {

            title:
                document
                    .getElementById("edit-title")
                    .value
                    .trim(),

            description:
                document
                    .getElementById("edit-description")
                    .value
                    .trim(),

            priority:
                document
                    .getElementById("edit-priority")
                    .value,

            status:
                document
                    .getElementById("edit-status")
                    .value

        };


        if (
            !updatedTask.title ||
            !updatedTask.description
        ) {

            alert(
                "Title and description cannot be empty."
            );

            return;
        }


        try {

            const response = await fetch(
                `${API_URL}/${taskId}`,
                {

                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(updatedTask)

                }
            );


            const data = await response.json();


            if (!response.ok) {

                throw new Error(
                    data.detail ||
                    "Failed to update task"
                );

            }


            closeEditModal();


            showMessage(
                "Task updated successfully!",
                "success"
            );


            await loadTasks();


        } catch (error) {

            alert(error.message);

        }

    });


// ==============================
// Close Modal on Background Click
// ==============================

document
    .getElementById("edit-modal")
    .addEventListener("click", function(event) {

        if (event.target === this) {
            closeEditModal();
        }

    });


// ==============================
// Close Modal with Escape Key
// ==============================

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Escape") {
            closeEditModal();
        }

    }
);


// ==============================
// Messages
// ==============================

function showMessage(message, type) {

    const element =
        document.getElementById("form-message");


    element.textContent = message;


    if (type === "success") {

        element.style.color = "#059669";

    } else {

        element.style.color = "#dc2626";

    }


    setTimeout(() => {

        element.textContent = "";

    }, 3000);

}


// ==============================
// Formatting
// ==============================

function formatText(text) {

    return text
        .replace("-", " ")
        .replace(
            /\b\w/g,
            letter => letter.toUpperCase()
        );

}


// ==============================
// Security Helper
// ==============================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


// ==============================
// Initial Load
// ==============================

loadTasks();