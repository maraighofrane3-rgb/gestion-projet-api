//importer les modules nécessaires
const express = require('express'); //express hiya il framework li ykhalina n3amlo serveur web bch n7otou fih les routes (URLs) mta3na et maintenir les requêtes HTTP
const mongoose = require('mongoose');//mongoose hiya il ODM (Object Data Modeling) li tkhallina nconnectiw MongoDB m3a Node.js w n3amlo les opérations CRUD (Create, Read, Update, Delete) bch n7otou fih les données mta3na
const dotenv = require('dotenv');//package dotenv li tkhallina n7otou les variables d'environnement fi fichier .env w n9rawhom fi code mta3na
const cors = require('cors');//cors hiya Cross-Origin Resource Sharing li tkhallina n7otou les règles mta3 l'accès li ykhalina nconnectiw frontend mta3na m3a backend mta3na bch n7otou fih les données mta3na

//lire le fichier .env
dotenv.config();

const app = express();

//middleware li ykhalina n7otou les données mta3na fi format JSON fil request body w n9rawhom fi code mta3na
app.use(express.json()); 
app.use(cors());

//nconnectiw MongoDB m3a Node.js bch n7otou fih les données mta3na
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected Successfully'))
    .catch(err => console.error('MongoDB Connection Error:', err));

//importer les routes mta3 l'authentification (register, login)
app.use('/api/auth', require('./routes/authRoutes'));


//demarrer le serveur sur le port spécifié dans le fichier .env ou sur le port 5000 par défaut
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
