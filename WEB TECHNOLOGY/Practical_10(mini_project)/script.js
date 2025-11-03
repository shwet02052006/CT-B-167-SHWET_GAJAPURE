// DOM Elements
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const taskCount = document.getElementById('taskCount');
const filterBtns = document.querySelectorAll('.filter-btn');
const taskForm = document.getElementById('taskForm');
const liveStatus = document.getElementById('liveStatus');

// Tasks array to store all tasks
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = localStorage.getItem('taskFilter') || 'all';

// Initialize the app
function init() {
    renderTasks();
    updateTaskCount();
    
    // Event Listeners
    taskForm.addEventListener('submit', addTask);
    addTaskBtn.setAttribute('aria-label', 'Add task');
    
    // Delegate interactions within the task list
    taskList.addEventListener('change', (e) => {
        if (e.target.classList.contains('task-checkbox')) {
            const li = e.target.closest('li');
            const id = Number(li.dataset.id);
            toggleTaskCompletion(id);
        }
    });

    taskList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const li = e.target.closest('li');
            const id = Number(li.dataset.id);
            deleteTask(id);
        }
    });
    
    // Filter button event listeners
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            currentFilter = this.dataset.filter;
            // Update aria-pressed for accessibility
            filterBtns.forEach(b => b.setAttribute('aria-pressed', String(b === this)));
            localStorage.setItem('taskFilter', currentFilter);
            renderTasks();
        });
    });
}

// Add a new task
function addTask(e) {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    const text = taskInput.value.trim();

    if (text === '') {
        setStatus('Please enter a task.');
        taskInput.focus();
        return;
    }

    const newTask = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date().toISOString()
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();
    updateTaskCount();
    setStatus('Task added.');

    // Clear input
    taskInput.value = '';
    taskInput.focus();
}

// Delete a task
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
    updateTaskCount();
    setStatus('Task deleted.');
}

// Toggle task completion
function toggleTaskCompletion(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    saveTasks();
    renderTasks();
    updateTaskCount();
    setStatus('Task updated.');
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Render tasks based on current filter
function renderTasks() {
    // Filter tasks based on current selection
    let filteredTasks = tasks;
    if (currentFilter === 'pending') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }
    
    // Clear the task list
    taskList.innerHTML = '';
    
    if (filteredTasks.length === 0) {
        const emptyState = document.createElement('li');
        emptyState.className = 'empty-state';
        emptyState.textContent = currentFilter === 'all' ? 'No tasks yet. Add one above!' :
                                currentFilter === 'pending' ? 'No pending tasks!' :
                                'No completed tasks!';
        taskList.appendChild(emptyState);
        return;
    }
    
    // Create and append task items
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.dataset.id = String(task.id);

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';
        checkbox.checked = !!task.completed;
        checkbox.setAttribute('aria-label', task.completed ? 'Mark as pending' : 'Mark as completed');

        const textSpan = document.createElement('span');
        textSpan.className = 'task-text';
        textSpan.textContent = task.text; // prevents XSS

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.type = 'button';
        deleteBtn.textContent = 'Delete';
        deleteBtn.setAttribute('aria-label', `Delete task: ${task.text}`);

        li.appendChild(checkbox);
        li.appendChild(textSpan);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
}

// Update task count
function updateTaskCount() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    
    taskCount.textContent = `Total: ${totalTasks} | Pending: ${pendingTasks} | Completed: ${completedTasks}`;
}

// Announce changes for assistive tech
function setStatus(message) {
    if (!liveStatus) return;
    liveStatus.textContent = message;
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', init);