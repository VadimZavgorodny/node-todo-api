const {ObjectId} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

//
// Todo.remove({}).then((result) => {
//     console.log(result);
// });

// Todo.findOneAndRemove({_id: '5aa55793fb0d05b2fb288742'}).then(() => {
//
// });

Todo.findByIdAndRemove('5aa55793fb0d05b2fb288742').then((doc) => {
    console.log(doc);
});