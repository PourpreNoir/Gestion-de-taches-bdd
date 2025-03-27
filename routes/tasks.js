const express = require('express');
const Task = require('../models/Task');
const router = express.Router();

// Récupérer toutes les tâches
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des tâches' });
  }
});

// Ajouter une nouvelle tâche
router.post('/', async (req, res) => {
  try {
    const newTask = new Task(req.body);
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de la tâche' });
  }
});

// Supprimer une tâche par ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({ error: 'Tâche non trouvée' });
    }
    res.json({ message: 'Tâche supprimée avec succès', task: deletedTask });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de la tâche' });
  }
});

module.exports = router;