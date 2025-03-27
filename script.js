document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3000/tasks')
        .then(res => res.json())
        .then(tasks => {
            const tasksList = document.getElementById('tasks');
            tasks.forEach(task => {
                const li = document.createElement('li');
                li.textContent = `${task.titre} - ${task.statut}`;
                tasksList.appendChild(li);
            });
        })
        .catch(err => console.error(err));
});
