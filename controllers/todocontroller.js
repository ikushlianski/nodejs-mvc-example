// manipulate data, routes and so on
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// connect to DB
mongoose.connect('mongodb://ilyanice:kalmar12@ds151004.mlab.com:51004/nodejs-playlist');

// create a schema - like a blueprint
var todoSchema = new mongoose.Schema({
  item: String
});

// create model
var Todo = mongoose.model('Todo', todoSchema);


// var data = [{item: 'get milk'}, {item: 'walk dog'}, {item: 'play pes'}];
var urlencodedParser = bodyParser.urlencoded({extended: false});

module.exports = function(app){
  // set up all our request handlers
  app.get('/todo', function(req, res){
    // get data from mongodb and pass it to the view
    Todo.find({}, function(err, data){
      if (err) throw err;
      res.render('todo', {todos: data});
    });
  });

  app.post('/todo', urlencodedParser, function(req, res){
    // get data from the view and add it to Mongo
    var newTodo = Todo(req.body, todoSchema).save(function(err,data){
      if (err) throw err;
      res.json(data);
    });
  });

  app.delete('/todo/:item', function(req, res){
    // delete the requested item from mongodb
    Todo.find({item: req.params.item.replace(/\-/g, " ")}).remove(function(err,data){
      if (err) throw err;
      res.json(data);
    });
  });
};
