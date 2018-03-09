const {MongoClient, ObjectID} = require('mongodb');

// var user = {name: 'andrew', age: 25};
//
// var {name} = user;
//
// console.log(name);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');

    // db.collection('Todos').find({
    //     _id: new ObjectID('5aa28372a6a493283456d46f')
    // }).count().then((count) => {
    //     console.log('Todos count');
    //     console.log(JSON.stringify(count, undefined, 2));
    // }, (err) => {
    //     console.log('Unable to get Todos', err);
    // });

    db.collection('Users').find({
        name: 'Vadim'
    }).toArray().then((users) => {
        console.log(JSON.stringify(users, undefined, 2));
    }, (err) => {
        console.log('Unable to get Users');
    });

    //db.close();
});