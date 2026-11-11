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

// 2 Récupérer les taches GET /apo/tasks: 

router.get('/', authMiddleware, async (req, res) => {
    try {
        // na3mlou objet vide query  bich n7otou fih les critères de recherche
        let query = {};

        //si il utilisateur 3ta id mta3 il projet njibou les taches mte3ou
        if (req.query.project) {
            query.project = req.query.project;
        }

        // search: nlawjou 3la mot fi titre wila description mta3 tache
        if (req.query.search) {
            query.$or = [
                { titre: { $regex: req.query.search, $options: 'i' } },
                { description: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        // ken il user b3ath statut, na3mlou affichage lil les taches b nafs il statut
        if (req.query.statut) {
            query.statut = req.query.statut;
        }

        // Tri avec (sort), par defaut les taches les plus récentes il lwela
        let sortOptions = { createdAt: -1 }; 
        //cas il utilisateur 5tar methode de tri spécifique
        if (req.query.sortBy) {
            const [field, order] = req.query.sortBy.split(':');
            sortOptions = { [field]: order === 'desc' ? -1 : 1 };// -1: tri decroissant 1: tri croissant
        }
        //les taches ili fehom nafs les critéres de recherche
        const tasks = await Task.find(query)
            .sort(sortOptions) //tri choisi
            .populate('project', 'nom')
            .populate('assignedUser', 'nom login');
        //naba3thou liste des taches lel frontend sous forme JSON
        res.json(tasks);

    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des taches", error: error.message });
    }
});

// 3 Récupérer une tâche par son ID (GET /api/tasks/:id)

router.get('/:id', authMiddleware, async (req, res) => {
    try {
        // Nlawjou 3al tâche fi MongoDB bel ID elli jena fel URL
        const task = await Task.findById(req.params.id)
            // Njibou esm w description mta3 projet elli marbout bel tâche
            .populate('project', 'nom description')
            // Njibou esm, login w role mta3 l'utilisateur elli affectinelou el tâche
            .populate('assignedUser', 'nom login role');

        //verification lil existence du tache
        if (!task) {
            return res.status(404).json({ message: "La tache demandée n'existe pas" });
        }

        res.json(task);

    } catch (error) {
        res.status(500).json({ message: "Erreur interne du serveur", error: error.message });
    }
});

// 4 Modifier une tâche (PUT /api/tasks/:id)
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        //nlawjou 3la task fil BD a partir mil ID
        const task = await Task.findById(req.params.id);
        //cas: tache mouch mawjouda fil BD
        if (!task) {
            return res.status(404).json({ message: "Tache introuvable" });
        }

        //seul le manager ynajm ybadel il utilisateur il assigné l tache
        if (req.body.assignedUser && req.user.role !== 'manager') {
            return res.status(403).json({ message: "Seul un Manager peut modifier l'utilisateur assigné à la tache" });
        }

        // Récuperation lil données envoyées par client
        const { titre, description, statut, deadline, project, assignedUser } = req.body;
        //ken les champs ili mawjoudin fil requete nbadlohom
        if (titre) task.titre = titre;
        if (description) task.description = description;
        //le modéle Mongoose ya3ml verification automatique
        if (statut) task.statut = statut; 
        if (deadline) task.deadline = deadline;
        if (project) task.project = project;
        if (assignedUser !== undefined) task.assignedUser = assignedUser;

        //enregitrement lil modifications fil BD
        const updatedTask = await task.save();
        //affichage de tache (type JSON)
        res.json(updatedTask);

    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: "Erreur de validation des données : " + error.message });
        }
        res.status(500).json({ message: "Erreur lors de la modification de la tache ", error: error.message });
    }
});


// 5 supprimer une tache (DELETE /api/tasks/:id)

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        //nlawjou 3la il tache ili bich nfas5ouha fil BD
        const task = await Task.findById(req.params.id);
        //verifier mawjouda iwla lee
        if (!task) {
            return res.status(404).json({ message: "المهمة ما موجودةش" });
        }

        // nfas5ou il tache mil BD
        await task.deleteOne();
        res.json({ message: "Tache supprimée avec succès. " });

    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression de la tache. ", error: error.message });
    }
});

module.exports = router;