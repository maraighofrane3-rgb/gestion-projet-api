const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

 
// 1 bich na3mlou creation creation lil projet  
router.post('/', authMiddleware, async (req, res) => {
    try {
        // extraction des données mta3 l'utilisateur men request body
        const { nom, description, statut } = req.body;

        // creatiion d'un projet bil information mta3 l'utilisateur li 3andou l'accès lil route 
        const newProject = new Project({
            nom,
            description,
            statut,
            owner: req.user.userId  // l'utilisateur li 3andou l'accès lil route (req.user.userId) houwa il owner lil projet
        });

        // on sauvegarde le projet fi il base de données
        const savedProject = await newProject.save(); //await: attendre l'execution mta3 les opérations asynchrones (comme la sauvegarde dans la base de données) avant de continuer

        // retourner il response fil cas de succès (code Http status: 201)
        res.status(201).json(savedProject);

    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création du projet", error: error.message });
    }
});

//2 bich na3mlou l'affichage lil projets (GET route) w n7otou fih les fonctionnalités mta3 search w sort
router.get('/', authMiddleware, async (req, res) => {
    try {
        // Query object: howa l'object li fih les conditions mta3 la recherche (search) wla les filtres mta3 l'affichage (filter) li 7abina napplyiwom 3la les projets
        let query = {}; 
        // retrieve il role mil utilisateur authentifié
        if (req.user.role === 'user') {
            query.owner = req.user.userId; 
        }
        

        // search a partir mil nom wila description mta3 il projet
        if (req.query.search) {
            query.$or = [
                { nom: { $regex: req.query.search, $options: 'i' } },
                { description: { $regex: req.query.search, $options: 'i' } }//$options: 'i' :  (mouch sensible a la casse)
            ];
        }

        // sort: controller l'ordre d'affichage des projets
        let sortOptions = { createdAt: -1 }; // il jdod 9bal
        if (req.query.sortBy) {
            const [field, order] = req.query.sortBy.split(':');
            sortOptions = { [field]: order === 'desc' ? -1 : 1 };
        }

        // njibou les projets men il base de données mongoose selon les conditions mta3 query w napplyiwom l'ordre mta3 sortOptions w npopulateiwom l'information mta3 l'owner (nom, login, role)
        const projects = await Project.find(query) //await: attendre l'execution mta3 les opérations asynchrones
            .populate('owner', 'nom login role');

        res.json(projects);

    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des projets", error: error.message });
    }
});

// 3 bich na3mlou l'affichage lil projet mta3 id spécifique (GET route)
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('owner', 'nom login role');

        // cas ou le projet n'existe pas (404 Not Found)
        if (!project) {
            return res.status(404).json({ message: "Le projet est introuvable" });
        }

        // cas ou l'utilisateur role mte3ou "user" w houwa mouch l'owner lil projet
        if (req.user.role === 'user' && project.owner._id.toString() !== req.user.userId) {
            return res.status(403).json({ message: "Vous n'êtes pas le propriétaire de ce projet" });
        }

        res.json(project);

    } catch (error) {
        res.status(500).json({ message: "Erreur dans le serveur", error: error.message });
    }
});

// 4 bich na3mlou l'update lil projet mta3 id spécifique (PUT route)
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: "Le projet est introuvable" });
        }

        // cas ou l'utilisateur role mte3ou "user" w houwa mouch l'owner lil projet
        if (req.user.role === 'user' && project.owner.toString() !== req.user.userId) {
            return res.status(403).json({ message: "Vous n'êtes pas le propriétaire de ce projet" });
        }

        // update lil projet bil informations mta3 l'utilisateur li 3andou l'accès lil route
        const { nom, description, statut } = req.body;
        if (nom) project.nom = nom;
        if (description) project.description = description;
        if (statut) project.statut = statut; 

        // sauvegarde lil modification mta3 id spécifique fi il base de données
        const updatedProject = await project.save();
        res.json(updatedProject);

    } catch (error) {
        res.status(500).json({ message: "Erreur dans la mise à jour", error: error.message });
    }
});

// 5 bich na3mlou l'delete lil projet mta3 id spécifique (DELETE route)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: "Le projet est introuvable" });
        }

        // cas ou l'utilisateur role mte3ou "user" w houwa mouch l'owner lil projet
        // manager 3andou l'accès lil delete lil projet mta3 ay utilisateur
        if (req.user.role === 'user' && project.owner.toString() !== req.user.userId) {
            return res.status(403).json({ message: "Vous n'êtes pas le propriétaire de ce projet" });
        }

        // delete lil projet mta3 id spécifique fi il base de données
        await project.deleteOne();
        res.json({ message: "Le projet a été supprimé avec succès ✅" });

    } catch (error) {
        res.status(500).json({ message: "Erreur dans la suppression", error: error.message });
    }
});

module.exports = router;