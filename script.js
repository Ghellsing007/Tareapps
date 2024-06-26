// script.js
document.addEventListener('DOMContentLoaded', function () {
    const taskForm = document.getElementById('task-form');
    const newTaskInput = document.getElementById('new-task');
    const taskList = document.getElementById('task-list');

    // Cargar tareas existentes
    fetch('/api/tasks')
        .then(response => response.json())
        .then(tasks => {
            tasks.forEach(task => {
                addTaskToDOM(task);
            });
        });

    taskForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const taskText = newTaskInput.value.trim();
        if (taskText === '') {
            alert('Por favor, escribe una tarea.');
            return;
        }

        fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: taskText })
        })
        .then(response => response.json())
        .then(task => {
            addTaskToDOM(task);
            newTaskInput.value = '';
        });
    });

    function addTaskToDOM(task) {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';

        const taskText = document.createElement('span');
        taskText.textContent = task.text;
        li.appendChild(taskText);

        const buttonsDiv = document.createElement('div');

        const editButton = document.createElement('button');
        editButton.textContent = 'Editar';
        editButton.className = 'edit btn btn-warning btn-sm mr-2';
        editButton.addEventListener('click', function () {
            const newText = prompt('Edita la tarea:', task.text);
            if (newText !== null && newText.trim() !== '') {
                fetch(`/api/tasks/${task._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ text: newText.trim() })
                })
                .then(response => response.json())
                .then(updatedTask => {
                    taskText.textContent = updatedTask.text;
                });
            }
        });
        buttonsDiv.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.className = 'delete btn btn-danger btn-sm';
        deleteButton.addEventListener('click', function () {
            fetch(`/api/tasks/${task._id}`, {
                method: 'DELETE'
            })
            .then(() => {
                taskList.removeChild(li);
            });
        });
        buttonsDiv.appendChild(deleteButton);

        li.appendChild(buttonsDiv);
        taskList.appendChild(li);
    }
});
