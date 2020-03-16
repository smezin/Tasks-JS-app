const express = require('express');
const multer = require('multer')
const Task = require('../models/task');
const auth = require('../middleware/auth')
const router = new express.Router()

//get list of tasks. the only router that send back AN ARRAY of results
//GET/tasks?completed=true              get only the completed/uncompleted tasks
//GET/tasks?limit=10&skip=10            (skip skips the n first results)
//GET/tasks?sortBy=createdAt:desc       the seperator : is arbitrary
router.get('/tasks', auth, async (req, res) => {
    const match = {};
    const sort = {};
    if (req.query.completed) {
        match.completed = req.query.completed === 'true';
    }
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }
    
    try {
        await req.user.populate({
            path: 'myTasks',
            match: match,
            options: {
                limit: parseInt(req.query.limit),       //limit number of results
                skip: parseInt(req.query.skip),         //skip certain number of n first results (to get next page)
                sort
            }
        }).execPopulate();
        res.send(req.user.myTasks);
    } catch (e) {
        res.status(500).send();
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    
    const _id = req.params.id;
    try {
        const task = await Task.findOne({_id: _id, owner: req.user._id})
        if (!task) {
            return res.status(404).send();      
        }
        res.send(task);
    } catch (e) {
        res.status(500).send();
    }
})

router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save();
        res.status(201).send(task);
    } catch (e) {
        res.status(400).send(e);
    }
})

router.patch ('/tasks/:id', auth, async (req, res) => {
    const allowedUpdates = Object.keys(Task.schema.paths);  
    const requestedUpdates = Object.keys(req.body);
    const isValidRequest = requestedUpdates.every( (requestedUpdate) =>  allowedUpdates.includes(requestedUpdate));

    if (!isValidRequest) {
        res.status(401).send('Invalid update request');
    }
    try {
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id});

        if (!task) {
            return res.status(404).send();
        }
        requestedUpdates.forEach( (update) => task[update] = req.body[update]);
        await task.save();
        res.send(task);
    } catch (e) {
        res.status(400).send(e);
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {

    try {
        const task = await Task.findOneAndRemove({_id: req.params.id, owner: req.user._id});
        if (!task) {
            return res.status(404).send('task not found');
        }
        res.send(task);
    } catch (e) {
        res.status(500).send(e);
    }
})


module.exports = router;
