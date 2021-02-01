const mysql = require('mysql');
console.log('Connexion à la base de données...');
let connectdb = mysql.createConnection({ 
    host: 'localhost', 
    user: 'root', 
    password: 'sbteam', 
    database: 'bddgroupop7', 
});
connectdb.connect(function(err) { 
    if (err) throw err;
    console.log('Connecté!')
});

module.exports = connectdb;
