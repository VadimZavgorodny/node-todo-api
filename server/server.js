var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose.js');
var {ObjectID} = require('mongodb');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {

    var todo = Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        res.status(400).send(err);
    })
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({
            todos
        });
    }, (err) => {
        res.status(400).send(err);
    });
});


app.get('/todos/:id', (req, res) => {
    var todosID = req.params.id;

    if (!ObjectID.isValid(todosID)) {
        res.status(404).send();
    }

    Todo.findById(todosID).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }

        res.send({
            todo
        })
    }).catch((e) => {
        res.status(400).send();
    });
});

app.listen(port, () => {
    console.log(`Start on ${port}`);
});

module.exports = {app};




