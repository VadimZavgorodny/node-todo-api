const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

var data = {
    id: 10
};

var token = jwt.sign(data, process.env.JWT_SECRET);

console.log(JSON.stringify(token, undefined, 2));

var decoded = jwt.verify(token, process.env.JWT_SECRET);
console.log(JSON.stringify(decoded, undefined, 2));

//
// var message = 'I am user number 3';
//
// var hash = SHA256(message).toString();
//
// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);