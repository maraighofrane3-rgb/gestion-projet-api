//importer le module mongoose ili fih tools ili ya3mlou schemas w models w yconnectiw b MongoDB
const mongoose = require('mongoose');

//creation du schema pour le model Project: nom, description, owner (user), statut (en cours, terminé, en pause), createdAt
const projectSchema = new mongoose.Schema({
    nom: { type: String, required: true }, 
    description: { type: String }, 
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    statut: { 
        type: String, 
        enum: ['en cours', 'terminé', 'en pause'], 
        default: 'en cours' 
    },
    createdAt: { type: Date, default: Date.now }
});
//ta3ml export lil model Project bch n9rawh fi fichiers okhrin

module.exports = mongoose.model('Project', projectSchema);