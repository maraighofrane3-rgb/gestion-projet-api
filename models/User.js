//importer le module mongoose ili fih tools ili ya3mlou schemas w models w yconnectiw b MongoDB
const mongoose = require('mongoose');

//creation du schema pour le model User: nom, login, password, role (user ou manager), createdAt
const userSchema = new mongoose.Schema({
    nom: { type: String, required: true }, 
    login: { type: String, required: true, unique: true }, 
    password: { type: String, required: true }, 
    role: { 
        type: String, 
        enum: ['user', 'manager'], 
        default: 'user' 
    },
    createdAt: { type: Date, default: Date.now } 
});
//ta3ml export lil model User bch n9rawh fi fichiers okhrin
module.exports = mongoose.model('User', userSchema);