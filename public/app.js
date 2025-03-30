// Fonction pour récupérer les tâches depuis l'API
async function fetchTasks() {
    try {
        const response = await fetch('/tasks');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const tasks = await response.json();
        return tasks;
    } catch (error) {
        console.error('Erreur lors de la récupération des tâches:', error);
        return [];
    }
}

// Gestionnaire d'événements pour le formulaire d'ajout de tâche
document.getElementById('task-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const task = {
        auteur: {
            nom: document.getElementById('auteur-nom').value,
            prenom: document.getElementById('auteur-prenom').value,
            email: document.getElementById('auteur-email').value
        },
        titre: document.getElementById('titre').value,
        description: document.getElementById('description').value,
        categorie: document.getElementById('categorie').value,
        priorite: document.getElementById('priorite').value,
        statut: 'à faire',
        commentaire: document.getElementById('commentaire').value
    };

    try {
        const response = await fetch('/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(task)
        });

        if (response.ok) {
            this.reset();
            displayTasks();
        } else {
            const error = await response.json();
            throw new Error(error.message || 'Erreur lors de l\'ajout de la tâche');
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert(error.message || 'Erreur lors de l\'ajout de la tâche');
    }
});

// Fonction pour afficher les tâches
async function displayTasks() {
    const taskList = document.getElementById('task-list');
    const tasks = await fetchTasks();
    
    // Appliquer les filtres
    const searchTerm = document.getElementById('filtre-titre').value.toLowerCase();
    const statutFilter = document.getElementById('filtre-statut').value;
    const prioriteFilter = document.getElementById('filtre-priorite').value;
    
    let filteredTasks = tasks;
    
    // Recherche dans tous les champs de texte
    if (searchTerm) {
        filteredTasks = filteredTasks.filter(task => 
            task.titre.toLowerCase().includes(searchTerm) ||
            task.description.toLowerCase().includes(searchTerm) ||
            (task.commentaire && task.commentaire.toLowerCase().includes(searchTerm)) ||
            task.auteur.nom.toLowerCase().includes(searchTerm) ||
            task.auteur.prenom.toLowerCase().includes(searchTerm)
        );
    }
    
    // Filtre par statut
    if (statutFilter) {
        filteredTasks = filteredTasks.filter(task => task.statut === statutFilter);
    }
    
    // Filtre par priorité
    if (prioriteFilter) {
        filteredTasks = filteredTasks.filter(task => task.priorite === prioriteFilter);
    }

    taskList.innerHTML = '';
    
    filteredTasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = `task-card priority-${task.priorite}`;
        
        taskElement.innerHTML = `
            <h3>${task.titre}</h3>
            <p>${task.description}</p>
            <div class="task-meta">
                <span>Auteur: ${task.auteur.prenom} ${task.auteur.nom}</span>
                <span>Catégorie: ${getCategorieName(task.categorie)}</span>
                <span>Priorité: ${task.priorite}</span>
                <span>Statut: ${task.statut}</span>
            </div>
            ${task.commentaire ? `<p>Commentaire: ${task.commentaire}</p>` : ''}
            <div class="task-actions">
                <button class="btn edit-btn" data-task-id="${task._id}">Modifier</button>
                <button class="btn danger delete-btn" data-task-id="${task._id}">Supprimer</button>
            </div>
        `;
        
        taskList.appendChild(taskElement);
    });

    // Ajouter les gestionnaires d'événements aux boutons
    taskList.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            editTask(btn.dataset.taskId);
        });
    });

    taskList.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            deleteTask(btn.dataset.taskId);
        });
    });
}

// Fonction pour obtenir le nom de la catégorie
function getCategorieName(categorieId) {
    const categories = {
        '1': 'Personnel',
        '2': 'Travail',
        '3': 'Projet',
        '4': 'Autres'
    };
    return categories[categorieId] || 'Inconnue';
}

// Fonction pour éditer une tâche
async function editTask(taskId) {
    try {
        const response = await fetch(`/tasks/${taskId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const task = await response.json();
        
        document.getElementById('edit-task-form-container').classList.remove('hidden');
        document.getElementById('edit-titre').value = task.titre;
        document.getElementById('edit-description').value = task.description;
        document.getElementById('edit-priorite').value = task.priorite;
        document.getElementById('edit-statut').value = task.statut;
        document.getElementById('edit-commentaire').value = task.commentaire;
        
        document.getElementById('edit-task-form').dataset.taskId = taskId;
    } catch (error) {
        console.error('Erreur lors de la récupération de la tâche:', error);
        alert('Erreur lors de la récupération de la tâche');
    }
}

// Fonction pour annuler l'édition
function cancelEdit() {
    document.getElementById('edit-task-form-container').classList.add('hidden');
    document.getElementById('edit-task-form').reset();
}

// Gestionnaire d'événements pour le formulaire de modification
document.getElementById('edit-task-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const taskId = this.dataset.taskId;
    const taskData = {
        titre: document.getElementById('edit-titre').value,
        description: document.getElementById('edit-description').value,
        priorite: document.getElementById('edit-priorite').value,
        statut: document.getElementById('edit-statut').value,
        commentaire: document.getElementById('edit-commentaire').value
    };

    try {
        const response = await fetch(`/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(taskData)
        });

        if (response.ok) {
            document.getElementById('edit-task-form-container').classList.add('hidden');
            this.reset();
            displayTasks();
        } else {
            const error = await response.json();
            throw new Error(error.message || 'Erreur lors de la modification de la tâche');
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert(error.message || 'Erreur lors de la modification de la tâche');
    }
});

// Fonction pour supprimer une tâche
async function deleteTask(taskId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
        try {
            const response = await fetch(`/tasks/${taskId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                displayTasks();
            } else {
                const error = await response.json();
                throw new Error(error.message || 'Erreur lors de la suppression de la tâche');
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert(error.message || 'Erreur lors de la suppression de la tâche');
        }
    }
}

// Gestionnaire d'événements pour les filtres
document.getElementById('appliquer-filtres').addEventListener('click', displayTasks);

// Gestionnaire d'événements pour la recherche en temps réel
document.getElementById('filtre-titre').addEventListener('input', displayTasks);

// Afficher les tâches au chargement de la page
document.addEventListener('DOMContentLoaded', displayTasks);