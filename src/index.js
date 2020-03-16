const express = require('express');
require('./db/mongoose.js');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');
// const User = require('./models/user');
// const Task = require('./models/task');

const app = express();
const port = process.env.PORT || 3000;

const multer = require('multer');
const upload = multer({
    dest: 'images'
})
app.post('/upload', upload.single('upload'), (req, res) => {
    res.send();
})


app.use(express.json()); //for auto parsing the incoming jsons to objects
app.use(userRouter);
app.use(taskRouter);


app.listen(port, () => {
    console.log('Server is up on', port);
})

