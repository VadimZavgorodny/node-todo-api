require('./config/config');

const _ = require('lodash');
var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose.js');
var {ObjectID} = require('mongodb');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

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

app.delete('/todos/:id', (req, res) => {
    var todosID = req.params.id;

    if (!ObjectID.isValid(todosID)) {
        res.status(404).send();
    }

    Todo.findByIdAndRemove(todosID).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }
        res.send({
            todo
        });
    }).catch((err) => {
        res.status(400).send();
    });
});

app.patch('/todos/:id', (req, res) => {
    var todosID = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(todosID)) {
        res.status(404).send();
    }

    if (body.completed && _.isBoolean(body.completed)) {
        body.completedAt = new Date().getTime();
    } else {
        body.coompleted = false;
        body.coompletedAt = null;
    }

    Todo.findByIdAndUpdate(todosID, {
        $set: body
    }, {
        new: true
    }).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }
        res.send({
            todo
        });
    }, (err) => {
        res.status(400).send();
    })
});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password', 'tokens']);

    console.log(body);

    var user = User(body);

    //User.findByToken

    user.save().then(() => {
        return user.generateAuthToken()
    }).then((token)=>{
        res.header('x-auth', token).send(user);
    }).catch((err) => {
        res.status(400).send(err);
    })
});

app.listen(port, () => {
    console.log(`Start on ${port}`);
});

module.exports = {app};




