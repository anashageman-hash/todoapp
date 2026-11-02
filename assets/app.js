
const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');
const message = document.getElementById('message');
const searchInput = document.getElementById('searchInput');
const taskFilter = document.getElementById('taskFilter');

let tasks = [];

async function loadTasks() {
    try {
        const response = await fetch('api.php?search=' + encodeURIComponent(searchInput.value));

        if (!response.ok) {
            throw new Error('Taken konden niet worden geladen.');
        }

        tasks = await response.json();
        renderTasks();
        updateStats();

    } catch (error) {
        taskList.textContent = error.message;
    }
}

function renderTasks() {
    taskList.innerHTML = '';

    let filteredTasks = tasks;

    if (taskFilter.value === 'open') {
        filteredTasks = tasks.filter(task => Number(task.is_done) === 0);
    }

    if (taskFilter.value === 'done') {
        filteredTasks = tasks.filter(task => Number(task.is_done) === 1);
    }

    if (filteredTasks.length === 0) {
        taskList.textContent = 'Geen taken gevonden. Voeg een nieuwe taak toe!';
        return;
    }

    filteredTasks.forEach(task => {
        const card = document.createElement('div');
        card.className = 'task-card';

        const left = document.createElement('div');
        left.className = 'task-info';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = Number(task.is_done) === 1;
        checkbox.addEventListener('change', () => toggleTask(task));

        const details = document.createElement('div');

        const title = document.createElement('h3');
        title.textContent = task.title;

        if (Number(task.is_done) === 1) {
            title.classList.add('completed');
        }

        const info = document.createElement('p');
        info.textContent = 'Prioriteit: ' + priorityName(task.priority);

        if (task.due_date) {
            info.textContent += ' | Deadline: ' + task.due_date;
        }

        details.append(title, info);
        left.append(checkbox, details);

        const actions = document.createElement('div');
        actions.className = 'actions';

        const editButton = document.createElement('button');
        editButton.textContent = 'Bewerken';
        editButton.className = 'edit-button';
        editButton.addEventListener('click', () => editTask(task));

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Verwijderen';
        deleteButton.className = 'delete-button';
        deleteButton.addEventListener('click', () => deleteTask(task.id));

        actions.append(editButton, deleteButton);
        card.append(left, actions);

        taskList.appendChild(card);
    });
}

function priorityName(priority) {
    const names = {
        low: 'Laag',
        normal: 'Normaal',
        high: 'Hoog'
    };

    return names[priority] || 'Normaal';
}

function updateStats() {
    const total = tasks.length;
    const done = tasks.filter(task => Number(task.is_done) === 1).length;
    const open = total - done;

    document.getElementById('totalCount').textContent = total;
    document.getElementById('openCount').textContent = open;
    document.getElementById('doneCount').textContent = done;
}

taskForm.addEventListener('submit', async function(event) {
    event.preventDefault();

    const title = document.getElementById('taskTitle').value.trim();
    const priority = document.getElementById('taskPriority').value;
    const dueDate = document.getElementById('taskDue').value;

    try {
        const response = await fetch('api.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: title,
                priority: priority,
                due_date: dueDate
            })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Taak toevoegen mislukt.');
        }

        taskForm.reset();
        document.getElementById('taskPriority').value = 'normal';

        showMessage('Taak toegevoegd!');
        loadTasks();

    } catch (error) {
        showMessage(error.message, true);
    }
});

async function toggleTask(task) {
    try {
        const response = await fetch('api.php', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: task.id,
                is_done: Number(task.is_done) !== 1
            })
        });

        if (!response.ok) {
            throw new Error('Taak aanpassen mislukt.');
        }

        loadTasks();

    } catch (error) {
        showMessage(error.message, true);
    }
}

async function editTask(task) {
    const newTitle = prompt('Nieuwe naam voor de taak:', task.title);

    if (newTitle === null) return;

    const title = newTitle.trim();

    if (title === '') {
        showMessage('De taaknaam mag niet leeg zijn.', true);
        return;
    }

    const newPriority = prompt(
        'Prioriteit: low, normal of high',
        task.priority
    );

    if (newPriority === null) return;

    const priority = newPriority.trim().toLowerCase();

    if (!['low', 'normal', 'high'].includes(priority)) {
        showMessage('Kies low, normal of high.', true);
        return;
    }

    try {
        const response = await fetch('api.php', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: task.id,
                title: title,
                priority: priority,
                due_date: task.due_date
            })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Bewerken mislukt.');
        }

        showMessage('Taak aangepast!');
        loadTasks();

    } catch (error) {
        showMessage(error.message, true);
    }
}

async function deleteTask(id) {
    if (!confirm('Weet je zeker dat je deze taak wilt verwijderen?')) {
        return;
    }

    try {
        const response = await fetch('api.php', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Verwijderen mislukt.');
        }

        showMessage('Taak verwijderd!');
        loadTasks();

    } catch (error) {
        showMessage(error.message, true);
    }
}

function showMessage(text, isError = false) {
    message.textContent = text;
    message.className = isError ? 'error-message' : 'success-message';
}

searchInput.addEventListener('input', loadTasks);
taskFilter.addEventListener('change', renderTasks);

loadTasks();
