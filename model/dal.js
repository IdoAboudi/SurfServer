
const MongoClient = require('mongodb').MongoClient;
var db;

function connect(){
    MongoClient.connect('mongodb://localhost:27017',function(err,client){
        if(err) console.error(err);
        else {
            console.log(`connected to db`);
            db = client.db("SurfServerDB");
            client.close();
        }
    });
}

exports.connect = connect();
