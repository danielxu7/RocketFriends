const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// create user schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            // if (!validator.isEmail(value)) {
            //     throw new Error('Email is invalid');
            // }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 4,
        trim: true,
        validate(value) {
            // if (value.toLowerCase().includes('password')) {
            //     throw new Error('Password cannot contain "password"')
            // }
        }
    },
    age: {
        type: Number,
        required: true,
        validate(value) {
            // if (value < 0) {
            //     throw new Error('Age must be a postive number');
            // } else if (value < 13) {
            //     throw new Error('You must be at least 13 years old to make an account');
            // }
        }
    },
    region: {
        type: Number,
        required: true,
    },
    tier: {
        type: Number,
        required: true,
    },
    rank: {
        type: Number,
        required: true,
    },
    rocketid: {
        type: String,
        required: true,
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
}, {
    timestamps: true
});

// override toJSON method
// do not send back user's password and auth tokens
userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;
    return userObject;
}

// returns auth token for a user
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);

    // add the new token to a user's list of tokens
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
}

// returns a user if the correct credentials were given
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });

    // user does not exist
    if (!user) {
        throw new Error('Unable to login');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    // wrong password
    if (!isMatch) {
        throw new Error('Unable to login');
    }

    return user;
}

// hash the plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
})

const User = mongoose.model('User', userSchema);

module.exports = User;