const express = require('express'); //importer le module express
const router = express.Router();  //importer le module express.Router() bch n3amlo les routes mta3na
const bcrypt = require('bcryptjs'); //importer le module bcryptjs bch ncryptiw les mots de passe mta3na
const jwt = require('jsonwebtoken'); //importer le module jsonwebtoken bch n3amlo les tokens mta3na
const User = require('../models/User'); //importer le model User fih il schema mta3 l'utilisateur bch n9rawh fi code mta3na

// post route ili ta3ml enregistrement lil utilisateur (register)
//async: attendre l'execution mta3 les opérations asynchrones (comme la recherche dans la base de données) avant de continuer
router.post('/register', async (req, res) => {
    try {
        //extraction des données mta3 l'utilisateur men request body
        const { nom, login, password, role } = req.body;

        // check si le login est déjà utilisé
        let user = await User.findOne({ login });
        if (user) {
            return res.status(400).json({ message: "cette adresse email est déjà utilisée" });
        }

        // ici pour crypter le mot de passe de l'utilisateur avant de le sauvegarder dans la base de données
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //creation d'un nouvel utilisateur avec les données fournies et le mot de passe crypté
        user = new User({
            nom,
            login,
            password: hashedPassword,
            role: role || 'user' 
        });

        await user.save();
        res.status(201).json({ message: " utilisateur enregistré avec succès" });

    } catch (error) {
        res.status(500).json({ message: "Erreur sur le serveur", error: error.message });
    }
});

//route login: vérifier le login et le mot de passe, et renvoyer un token JWT si les informations sont correctes
router.post('/login', async (req, res) => {
    try {
        const { login, password } = req.body;

        // chercher l'utilisateur par son login
        const user = await User.findOne({ login });
        if (!user) {
            return res.status(400).json({ message: "Login ou mot de passe incorrect" });
        }

        // vérifier si le mot de passe est correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Login ou mot de passe incorrect" });
        }

        // créer un token JWT et l'envoyer avec les informations de l'utilisateur
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' } // token expire fi 1 jour
                    );

        res.json({ 
            token, 
            user: { id: user._id, nom: user.nom, login: user.login, role: user.role } 
        });

    } catch (error) {
        res.status(500).json({ message: "Erreur sur le serveur", error: error.message });
    }
});

module.exports = router;