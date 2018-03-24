const {ObjectID} = require('mongodb');
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');
const jwt = require('jsonwebtoken');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [
    {
        _id: userOneId,
        email: 'Vadim@example.com',
        password: '12345678',
        tokens: [{
            access: 'auth',
            token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
        }]
    }, {
        _id: userTwoId,
        email: 'Jen@example.com',
        password: '12345678',
    }
];

const todos = [{
    _id: new ObjectID(),
    text: 'First test todo',
    completed: true,
    completedAt: 333
}, {
    _id: new ObjectID(),
    text: 'Second test todo'
}];

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => {
        done();
    });
};

const populateUsers = (done) => {
    User.remove({}).then(() => {
        //console.log(users[0]._id.toString());
        //console.log(users[0]._id.toHexString());
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();

        return Promise.all([userOne, userTwo]).then(() => done());
    });
};

module.exports = {
    todos,
    populateTodos,
    users,
    populateUsers
}