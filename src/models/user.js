const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task');

const userSchema = new mongoose.Schema ({
    name: {
        type: String,
        require: true,
        trim: true,
        validate(value) {
            if (value.trim().length < 3) {
                throw new Error ('Name must be at least 3 charcters');
            }
        }
    },
    age: {
        type: Number,
        defualt: 0,
        validate(value) {
            if (value < 0) {
                throw new Error ('Age must be positive');
            }
        }
        
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true,
        validate (value) {
            if (!validator.isEmail(value)) {
                throw new Error ('Email is invalid');
            }
        },
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate (value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error ('Password cannot contain the string "password"');
            }
        },
        minlength: 7
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
});

//const Task = require('../models/task')
userSchema.virtual('myTasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;

    return userObject;
}

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({_id: user._id.toString()}, 'thisissometext');
    user.tokens = user.tokens.concat({token: token});
    await user.save();
    return token;
}

userSchema.statics.findByUserNameAndPassword = async (userName, password) => {
    const user = await User.findOne({email: userName});
    if (!user) {
        throw new Error ('Unable to login1');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error ('Unable to login2'); 
    }
    return user;
}
//delete user tasks if user is deleted
userSchema.pre('remove', async function (next) {
    const user = this;
    await Task.deleteMany({owner: user._id});
    next();
})
//hash passqord it it was changed
userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
})

const User = mongoose.model('User', userSchema)

module.exports = User;
