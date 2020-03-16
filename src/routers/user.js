const express = require('express');
const User = require ('../models/user');
const multer = require('multer');
const auth = require ('../middleware/auth');
const router = new express.Router();


//public routers
//log in
router.post('/users/login', async (req, res) => {
    try{
        const user = await User.findByUserNameAndPassword (req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        if (!user) {
            res.status(404).send();
        }
        res.send({user, token});
    } catch (e) {
        res.status(400).send(e);
    }
})

//sign up
router.post('/users', async (req, res) => {
    const user = new User(req.body);   
    
    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({user, token});
    } catch (e) {
        res.status(400).send(e);
    }
})


//user-password protected routers
//get all users
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user);
});

//update user 
router.patch('/users/me', auth, async (req, res) => {
    const allowedUpdates = Object.keys(User.schema.paths);
    const requestedUpdates = Object.keys(req.body);
    const isValidRequest = requestedUpdates.every( (requestedUpdate) => {
        return allowedUpdates.includes(requestedUpdate);
    })

    if (!isValidRequest) {
        return res.status(401).send('Invalid update request');
    }
    try {
        requestedUpdates.forEach((update) => req.user[update] = req.body[update]);
        await req.user.save();
        res.send(req.user);

    } catch (e) {
        res.status(400).send(e);
    }
})
//log out single device (wipe single token)
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        })
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send();
    }
})
//log out from all devices (wipe all tokens)
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.status(200).send();
    } catch (e) {
        res.status(500).send();
    }
})
//delete user
router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user);
    } catch (e) {
        res.status(500).send(e);
    }
})

const upload = multer({
    dest: 'avatars',
    limits: {
        fileSize: 5000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.toLowerCase().match(/\.(jpg|png|jpeg)$/)) {
            return cb(new Error('Please upload a picture type'));
        }

        cb(undefined, true);  //means everything went well
    }
})


router.post('/users/me/avatar',upload.single('avatar'), async (req, res) => {
    res.send();
}, (error, req, res, next) => {
    res.status(400).send({error: error.message});
})

module.exports = router;