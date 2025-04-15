const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  auteur: {
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    email: { type: String, required: true }
  },
  titre: { type: String, required: true },
  description: { type: String },
  categorie: { type: String, required: true },
  priorite: { 
    type: String, 
    required: true,
    enum: ['basse', 'moyenne', 'haute', 'critique']
  },
  statut: { 
    type: String, 
    required: true,
    enum: ['à faire', 'en cours', 'terminée', 'annulée'],
    default: 'à faire'
  },
  commentaire: { type: String },
  dateCreation: { type: Date, default: Date.now },
  dateEcheance: { type: Date },
  rappel: { 
    type: Boolean, 
    default: false 
  },
  tags: [{ type: String }]
});

module.exports = mongoose.model('Task', taskSchema);