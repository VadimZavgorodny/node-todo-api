const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
        email: {
            required: true,
            trim: true,
            type: String,
            minlength: 10,
            unique: true,
            validate: {
                validator: validator.isEmail,
                message: '{VALUE} is not a valid email'
            }
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
        },
        tokens: [{
            access: {
                type: String,
                required: true,
            },
            token: {
                type: String,
                required: true,
            }
        }]
    },
    {
        usePushEach: true
    });


UserSchema.methods.toJSON = function() {
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
};

UserSchema.statics.findByToken = function (token) {
    var User = this;
    var decoded;

    try {
        decoded = jwt.verify(token, 'abc123');
    } catch (e) {
        return Promise.reject();
    }

    return User.findOne({
        _id: decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

    user.tokens = [{access, token}];

    return user.save().then(()=>{
        return token;
    });
};



var User = mongoose.model('Users', UserSchema);

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