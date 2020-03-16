//CRUD create, read, update, delete
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectID;

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

const id = new ObjectID();
//console.log(id);

MongoClient.connect(connectionURL, { useUnifiedTopology: true }, (error, client) => {
    if (error) {
        return console.log('Unable to connect to database');
    }
    const db = client.db(databaseName);
    db.collection('users').insertOne({
        name: 'Liat',
        age: 40
    }, (error, result) => {
        if (error) {
            return console.log('Unable to insert user');
        }
        console.log(result.ops);
    })

    // db.collection('users').insertMany([{
    //     name: 'Popo',
    //     age: 33
    // }, {
    //     name: 'Xima',
    //     age: 44
    // }], (error, result) => {
    //     if (error) {
    //         return console.log('Unable to insert many');
    //     }
    //     console.log(result.ops);
    // })
    // db.collection('tasks').insertMany([{
    //     description: 'feed the fish',
    //     completed: true
    // } ,{
    //     description: 'water the plant',
    //     completed: true
    // }, {
    //     description: 'paint the house',
    //     completed: false
    // }], (error, result) => {
    //     if (error) {
    //         return console.log ('Unable to insert tasks');
    //     }
    //     console.log(result.ops);
    // })
})