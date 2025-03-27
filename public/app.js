// Fetch and display tasks
async function fetchTasks() {
    try {
      const response = await fetch('/tasks');
      const tasks = await response.json();
  
      const taskList = document.getElementById('task-list');
      taskList.innerHTML = ''; // Clear the list
  
      tasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.innerHTML = `
          <strong>${task.titre}</strong> - ${task.priorite}
          <button onclick="deleteTask('${task._id}')">Supprimer</button>
        `;
        taskList.appendChild(taskItem);
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des tâches:', error);
    }
  }
  
  // Add a new task
  async function addTask(event) {
    event.preventDefault();
  
    const titleInput = document.getElementById('task-title');
    const descriptionInput = document.getElementById('task-description');
    const priorityInput = document.getElementById('task-priority');
    const authorNameInput = document.getElementById('task-author-name');
    const authorEmailInput = document.getElementById('task-author-email');
  
    const task = {
      titre: titleInput.value,
      description: descriptionInput.value,
      priorite: priorityInput.value,
      auteur: {
        nom: authorNameInput.value,
        email: authorEmailInput.value
      }
    };
  
    try {
      const response = await fetch('/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
      });
  
      if (response.ok) {
        titleInput.value = '';
        descriptionInput.value = '';
        priorityInput.value = 'moyenne';
        authorNameInput.value = '';
        authorEmailInput.value = '';
        fetchTasks(); // Refresh the task list
      } else {
        const errorData = await response.json();
        alert(`Erreur: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la tâche:', error);
    }
  }
  
  // Delete a task
  async function deleteTask(taskId) {
    try {
      const response = await fetch(`/tasks/${taskId}`, { method: 'DELETE' });
      if (response.ok) {
        fetchTasks(); // Refresh the task list
      } else {
        alert('Erreur lors de la suppression de la tâche');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la tâche:', error);
    }
  }
  
  // Event listeners
  document.getElementById('task-form').addEventListener('submit', addTask);
  
  // Fetch tasks on page load
  fetchTasks();