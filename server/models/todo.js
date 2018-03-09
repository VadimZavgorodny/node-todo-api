var mongoose = require('mongoose');

var Todo = mongoose.model('Todo', {
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    }
});
//
//
// var newTodoOne = new Todo({
//     text: 'Edit this video'
// });
//
// newTodoOne.save().then((res) => {
//     console.log(res);
// }, (err) => {
//     console.log('Unable to save', err);
// });
//
// var newTodoTwo = new Todo({
//     text: 'Some to do'
// });
//
// newTodoTwo.save().then((res) => {
//     console.log(res);
// }, (err) => {
//     console.log('Unable to save', err);
//});

module.exports = {Todo};