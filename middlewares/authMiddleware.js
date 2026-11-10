//na3mlou imporation lil jsonwebtoken library bich na3mlou (creation , verification et decodage) lil token JWT
const jwt = require('jsonwebtoken');

//middleware function bich nverifyiw l'authentification mta3 l'utilisateur 9bal ma ykoun 3andou l'accès lil routes mta3na
const authMiddleware = (req, res, next) => {
    
    // njibou l'Authorization header men request
    const authHeader = req.header('Authorization');

    // check si l'Authorization header mouch mawjoud wila  mayabdech b "Bearer (c'est le format standard pour les tokens JWT)"
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Token non fourni ou invalide" });
    }

    // extraction token: njibou l'token men l'Authorization header (l'header ykoun fiha "Bearer <token>") : split l'header 3la espace w njibou l'élément 2 (l'token)
    const token = authHeader.split(' ')[1];

    try {
        // verification lil token: njibou l'token w nverifyiwh bch n3rfou si houwa valide wla lee (jwt.verify() : valider si le token est signé et expiré wla lee)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // njibou l'information mta3 l'utilisateur men l'token w n7otou fi req.user (pour que les routes suivantes ykounou 3andhom accès lil information mta3 l'utilisateur)
        req.user = decoded;

        //execution lil middleware suivant (next() : bch n3mlou l'execution lil middleware suivant wla lil route handler)
        next();

    } catch (error) {
        // si l'token non valide (expired wla non signé ), n3awdou n7ottou l'erreur w n3awdou n3aytou lil utilisateur bch ya3ml login men jdid
        return res.status(401).json({ message: "Token non valide, veuillez vous reconnecter" });
    }
};
//exporter le middleware 
module.exports = authMiddleware;