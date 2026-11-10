//middleware li ykhalina n7ottou l'roles mta3 l'utilisateurs w nverifyiw si houma mouch mawjoudin wla lee (pour les routes li 7abina n7otou fihom l'authentification wla lee)
//fonction li taccepti l'roles mta3 l'utilisateurs li 7abina nverifyiwhom w treturni middleware function li tverifyi l'role mta3 l'utilisateur li 3andou l'accès lil route
const roleMiddleware = (...allowedRoles) => { // Rest Prameter: ...allowedRoles (array) : permet de recevoir un nombre "unlimited " d'arguments et de les stocker dans un tableau (array) li fih les roles mta3 l'utilisateurs li 7abina nverifyiwhom"
    return (req, res, next) => {
        //verifier l'existence d'un user dans la request (req.user) w verifier si le role mta3ou mawjoud fi allowedRoles 
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "Vous n'avez pas l'autorisation requise pour accéder à cette ressource" });
        }
        next();
    };
};
//exporter le middleware
module.exports = roleMiddleware;