const express = require('express');
require('./src/db/mongoose');
const Task = require('./src/models/task');
const User = require('./src/models/user');

const app = express();

// Task.findByIdAndDelete('5e60dc2da047bf26dcfcd888').then((task) => {
//     return Task.find({
//         completed: true
//     }).then((count) => {
//         console.log(count);
//     })
// }).catch( (e) => {
//     console.log(e);
// })

// const deleteAndCount = async (id) => {
//     await Task.findByIdAndDelete(id);
//     const count = await Task.countDocuments( { completed: false });
//     return count;
// }
// deleteAndCount('5e61124ab2e9a719e85beae5').then( (count) => {
//     console.log(count);
// }).catch( (e) => {
//     console.log(e);
// })

const updateAndCount = async (id, age) => {
    await User.findByIdAndUpdate(id, {
        age: age
    });
    const count = await User.countDocuments({age: 40});
    return count;
}

updateAndCount("5e628e63796e243a0cefbc44", 8).then( (count) => {
    console.log(count);
}).catch ( (e)=> {
    console.log(e);
})
