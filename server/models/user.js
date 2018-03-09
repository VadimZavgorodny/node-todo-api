var mongoose = require('mongoose');

var User = mongoose.model('Users', {
    email: {
        required: true,
        trim: true,
        type: String,
        minlength: 10
    }
});

// var newUser = new User({
//     email: 'Vadim_Zav@bk.ru',
// });
//
// newUser.save().then((res) => {
//     console.log('Res: ', res);
// }, (err) => {
//     console.log('Err: ', err);
// });
//
module.exports = {
    User
};