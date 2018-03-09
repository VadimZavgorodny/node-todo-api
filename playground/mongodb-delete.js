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

    //deleteMany
    // db.collection('Todos').deleteMany({
    //     text: 'Eat lunch'
    // }).then((result) => {
    //     console.log(result);
    // });

    //deleteOne
    // db.collection('Todos').deleteOne({
    //     text: 'Eat lunch'
    // }).then((result) => {
    //     console.log(result);
    // })

    //findOneAndDelete
    // db.collection('Todos').findOneAndDelete({
    //     completed: false
    // }).then((result) => {
    //     console.log(result);
    // });

    db.collection('Users').deleteMany({
        name: 'Jen'
    });

    db.collection('Users').findOneAndDelete({
        _id: new ObjectID('5aa2a6a2fb0d05b2fb26a17e')
    }).then((result) => {
        console.log(result);
    });


    //db.close();
});