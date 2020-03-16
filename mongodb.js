//CRUD create, read, update, delete
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectID;

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

const id = new ObjectID(); //can generate random id or get a string parameter and convert it to id object
//console.log(id);

MongoClient.connect(connectionURL, { useUnifiedTopology: true }, (error, client) => {
    if (error) {
        return console.log('Unable to connect to database');
    }
    const db = client.db(databaseName);

    db.collection('tasks').deleteOne({
        description: "paint the house"
    }).then( (result) => {
        console.log(result);
    }).catch( (error) => {
        console.log(error);
    })

    // db.collection('tasks').updateMany({
    //     completed: false
    // }, {
    //     $set: {
    //         completed: true
    //     }
    // }).then ((resolve) => {
    //     console.log(resolve.modifiedCount);
    // }).catch( (error) => {
    //     console.log(error);
    // })

    // db.collection('users').deleteMany({
    //     age: 33
    // }).then((result) => {
    //     console.log(result);
    // }).catch ((error) => {
    //     console.log(error);
    // })

    // db.collection('users').updateOne({
    //     _id: new ObjectID("5e5e612e3196b537e016c73d")
    // }, {
    //     $inc: {
    //         age: 1
    //     }
    // }).then( (result) => {
    //     console.log(result);
    // }).catch((error) => {
    //     console.log(error);
    // })


    // db.collection('users').findOne({_id: new ObjectID("5e5e612e3196b537e016c73d")}, (error, user) => {
    //     if (error) {
    //         return console.log('Unable to fetch data');
    //     }
    //     console.log(user);
    // })

    // db.collection('users').find({age: 43}).toArray((error, users)=>{
    //     console.log(users);
    // });
    // db.collection('users').find({age: 43}).count((error, count)=>{
    //     console.log(count);
    // })

    // db.collection('tasks').findOne({_id: new ObjectID("5e5e65984fbd5b3bb8ff1ed9")}, (error, task) => {
    //     if (error) {
    //         return console.log('Unable to find');
    //     }
    //     console.log(task);
    // })
    // db.collection('tasks').find({completed: true}).toArray((error, tasks) => {
    //     console.log(tasks);
    // })
   
})