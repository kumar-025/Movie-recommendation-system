const express = require("express");
const app = express();
const bodyParser = require("body-parser");
var multer = require('multer');
var upload = multer();
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(upload.array()); 
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://127.0.0.1:27017";
const dbName = 'movierecommendation';
let db;
app.set('view engine', 'ejs'); 
app.use(express.static(__dirname + '/views'));
MongoClient.connect(url, { useUnifiedTopology: true ,useNewUrlParser: true}, (err, client) => {
    if (err) return console.log(err);
    db = client.db(dbName);
    console.log(`Connected Database: ${url}`);
    console.log(`Database : ${dbName}`);
});

//Search a movie
app.get('/home',(req,res)=>{
  res.render('search_home');
})
app.get('/search',function(req,res){
  db.collection("movies").find().toArray().then(result=> res.render('search',{records:result}));
})
app.post('/search',function(req,res){
  var title = req.body.title;
  var query = {"title":title};
console.log(query);
var genre;
db.collection("movies").find(query).toArray((err,result)=>{
  if(!result.length){
    res.send("notfound")
    
  }
  else{
  genre=result;
  //console.log(genre[0]);
  var output = JSON.stringify(genre[0])
  output = JSON.parse(output)
  console.log(output.genres)
  db.collection('movies').find({"genres":output.genres}).toArray().then(result1=>res.render('search',{records:result1}));
  }
})
});


app.listen(8080);