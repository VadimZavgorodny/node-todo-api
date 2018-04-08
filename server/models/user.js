const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
var bcrypt = require('bcryptjs');

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

UserSchema.pre('save', function(next) {
    var user = this;

    if (user.isModified('password')) {
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(user.password, salt, function (err, hash) {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

UserSchema.statics.findByToken = function (token) {
    var User = this;
    var decoded;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
        return Promise.reject();
    }

    return User.findOne({
        _id: decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

UserSchema.statics.findByCredentials = function (email, password) {
    var User = this;

    return User.findOne({email: email}).then((user) => {
        if(!user) {
            return Promise.reject();
        }

        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, function(err, res) {
                if(!res) {
                    reject();
                }

                resolve(user);
            });
        });
    });
    // var User = this;
    // var decoded;
    //
    // try {
    //     decoded = jwt.verify(token, 'abc123');
    // } catch (e) {
    //     return Promise.reject();
    // }
    //
    // return User.findOne({
    //     _id: decoded._id,
    //     'tokens.token': token,
    //     'tokens.access': 'auth'
    // });
};

UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();

    user.tokens = [{access, token}];

    return user.save().then(()=>{
        return token;
    });
};

UserSchema.methods.removeToken = function (token) {
    var user = this;
    return user.update({
        $pull: {
            tokens: {
                token
            }
        }
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