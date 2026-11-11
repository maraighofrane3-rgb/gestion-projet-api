const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Project = require('../models/Project');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

//1 creation des tâches 
//bich n7adhrou HTTP POST endpoint lazem nverifio authentication w role mta3 l'utilisateur
router.post('/', authMiddleware, async (req, res) => { 
    try {
        //object destruction: bich n5ou les champs mta3 l'objet li jey men le body , javascript ya3ml extraction lil les propriétés w y7otouhom fi variables
        const { titre, description, statut, deadline, project, assignedUser } = req.body;

        // na3mlou verification si les projets mawjoudin fil BD wila lee 5ater kol task deja 3andha projet manajmouch na3mlou task l projet inexistant
        const projectExists = await Project.findById(project);
        if (!projectExists) {
            return res.status(404).json({ message: "le projet n'existe pas" });
        }

        // verification : seulement il manager 3andou il 7a9 li yassigni task l user akther
        if (assignedUser && req.user.role !== 'manager') {
            return res.status(403).json({ message: "seul le manager peut affecter une tache à un utilisateur" });
        }

        // creation de la nouvelle tâche avec les données reçues (Mongoose Task model)
        const newTask = new Task({
            titre,
            description,
            statut,
            deadline,
            project,
            assignedUser: assignedUser || null  //object property shorthand: ken assignedUser 3andouch valeur mil requete n7otou null
        });

        // na3mlou sauvegarde lil task fil BD
        const savedTask = await newTask.save();

        // affichage lil task crée 
        res.status(201).json(savedTask);

    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: "Erreur de validation des données : " + error.message });
        }
        res.status(500).json({ message: "Erreur lors de la création de la tache : ", error: error.message });
    }
});

module.exports = router;