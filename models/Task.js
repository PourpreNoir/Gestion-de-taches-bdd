const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  description: { type: String },
  dateCreation: { type: Date, default: Date.now },
  echeance: { type: Date },
  statut: { type: String, enum: ['à faire', 'en cours', 'terminée', 'annulée'], default: 'à faire' },
  priorite: { type: String, enum: ['basse', 'moyenne', 'haute', 'critique'], default: 'moyenne' },
  auteur: {
    nom: { type: String, required: true },
    prenom: { type: String },
    email: { type: String, required: true }
  },
  categorie: { type: String },
  etiquettes: [{ type: String }],
  sousTaches: [{ titre: String, statut: String, echeance: Date }]
});

module.exports = mongoose.model('Task', taskSchema);