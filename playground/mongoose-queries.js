const {ObjectId} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// var id = '5aa431ded6d592ac3f570b9b11';
// if (!ObjectId.isValid(id)) {
//     console.log('Id not valid');
// }
// Todo.find({
//     _id: id
// }).then((todos) => {
//     if (!todo) {
//         return console.log('Todos not found');
//     }
//     console.log('Todos: ', todos);
// });
//
// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     if (!todo) {
//         return console.log('Todo not found');
//     }
//     console.log('Todo: ', todo);
// });

// Todo.findById(id).then((todo) => {
//     if (!todo) {
//         return console.log('Id not found');
//     }
//     console.log('Todo by ID: ', todo);
// }).catch((e) => {
//     console.log(e);
// });

var userID = '5aa2f246980d4db83fd2512e';

User.findById(userID).then((user) => {
    if (!user) {
        console.log('Users not found');
    }

    console.log(user);
}).catch((e) => {
    console.log(e);
});


