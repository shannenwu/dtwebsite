const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const BCRYPT_SALT_ROUNDS = 12;

var userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        trim: true,
        required: 'first name is required'
    },
    lastName: {
        type: String,
        trim: true,
        required: 'last name is required'
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        required: 'email is required'
    },
    password: {
        type: String,
        required: 'password is required'
    },
    gender: {
        type: String,
        trim: true,
    },
    year: {
        type: Number
    },
    affiliation: {
        type: String,
        trim: true,
    },
    livingGroup: {
        type: String,
        trim: true,
    },
    experience: {
        type: String,
        trim: true,
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    },
    isAdmin: {
        type: Boolean
    }
});

userSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password')) {
        // hash password with salt
        bcrypt.hash(user.password, BCRYPT_SALT_ROUNDS, function (err, hash) {
            if (err) return next(err);
            // rewrite password as hashed password
            user.password = hash;
            next();
        })
    } else {
        next();
    }
});

userSchema.methods.validPassword = function (password, cb) {
    bcrypt.compare(password, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    })
}

userSchema.statics.authenticate = (email, password, cb) => {
    User.findOne({
        email: email
    }, (err, user) => {
        if (err) {
            console.log(err.message);
            err = new Error('An unknown error has occured.')
            return cb(err);
        }
        if (!user) {
            var err = new Error('There is no account with that email address.');
            err.status = 401;
            return cb(err);
        }
        bcrypt.compare(password, user.password, function (err, result) {
            if (result === true) {
                return cb(null, user);
            } else {
                var err = new Error('Incorrect password.')
                err.status = 401;
                return cb(err);
                    
            }
        })
    })
}

userSchema.statics.validPassword = (user, password, cb) => {
    bcrypt.compare(password, user.password, function (err, result) {
        if (result === true) {
            return cb(null, user);
        } else {
            var err = new Error('Incorrect password.')
            err.status = 401;
            return cb(err);

        }
    })
};

var User = mongoose.model('User', userSchema)
module.exports = User;