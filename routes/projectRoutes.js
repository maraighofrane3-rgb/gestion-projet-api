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

module.exports = router;