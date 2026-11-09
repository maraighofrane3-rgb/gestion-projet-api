//importer le module mongoose ili fih tools ili ya3mlou schemas w models w yconnectiw b MongoDB
const mongoose = require('mongoose');

//creation du schema pour le model Task: titre, description, statut (todo, doing, done), deadline, project (Project), assignedUser (User), createdAt
const taskSchema = new mongoose.Schema({
    titre: { type: String, required: true }, 
    description: { type: String }, 
    statut: { 
        type: String, 
        enum: ['todo', 'doing', 'done'],
        default: 'todo' 
    },
    deadline: { type: Date }, // Deadline متاع المهمة
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true }, 
    assignedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
    createdAt: { type: Date, default: Date.now }
});
//ta3ml export lil model Task bch n9rawh fi fichiers okhrin
module.exports = mongoose.model('Task', taskSchema);