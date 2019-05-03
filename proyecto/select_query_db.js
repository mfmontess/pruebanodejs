var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url,{ useNewUrlParser: true }, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  var query = { username: 'prueba1', password: '123' };
  dbo.collection("users").find(query).toArray(function(err, result) {
    if (err){
		throw err;
	} else {
		if(result.length == 0)
			console.log("Usuario incorrecto o no existe");
		else{
			var x = result.shift();
			console.log(x.username + " " + x.password);
		}
		db.close();
	}
  });
});