// role de ce middleware: bich na3mlou control lil les errors ili ynajmou ysirou bich nar3rfou il mochkl win bidhabt wa9t il test


const errorMiddleware = (err, req, res, next) => {
    
    //affichage de l'erreur fil console 
    console.error(' Error: ', err.message);

    // Cas1: error mil validation de mongoose
    // Exemple : statut non autorisé ou champ obligatoire manquant
    if (err.name === 'ValidationError') {
        return res.status(400).json({ 
            message: 'Erreur dans les données envoyées.', 
            details: err.message 
        });
    }

    // Cas2: Erreur type mte3ha CastError: levée par Mongoose ki maynajmch ya3ml convertion d'une valeur lil type ili 7achtou bih par le schéma de la Base de données
    // exemple: ObjectId non valide
    if (err.name === 'CastError') {
        return res.status(400).json({ 
            message: "L'identifiant fourni est invalide." 
        });
    }

    // cas3 : error jey min key ducpliqué
    if (err.code === 11000) {
        return res.status(400).json({ 
            message: 'Cet identifiant est déjà utilisé.' 
        });
    }

    // cas4 : Error fil JWT
    //exemple : token non valide ou expiré
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        return res.status(401).json({ 
            message: 'Le token est invalide ou expiré. Veuillez vous reconnecter.' 
        });
    }

    // les autres erreurs 
    res.status(500).json({ 
        message: 'Une erreur interne est survenue sur le serveur. Veuillez réessayer plus tard.' 
    });
};
 //exporter le middleware 
module.exports = errorMiddleware;