const MongoClient = require('mongodb').MongoClient;

const mongoConfig = {
    "serverUrl": "mongodb://localhost:27017/",
    "database": "Vinnakota-Bapiraju-CS554-Lab1"
  };


let _connection = undefined;
let _db = undefined;
let dbObj = {};

module.exports = async () => {
  if (!_connection) {
    _connection = await MongoClient.connect(mongoConfig.serverUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    _db = await _connection.db(mongoConfig.database);

    dbObj["_db"] = _db;
    dbObj["_connection"] = _connection;
  }

  return dbObj;
};