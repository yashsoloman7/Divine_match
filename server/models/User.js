const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        googleId: {
            type: String,
            unique: true,
            sparse: true, // Allows null/undefined values to be unique
        },
        password: {
            type: String, // Hashed password
        },
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        avatar: {
            type: String,
        },
        role: {
            type: String,
            enum: ['admin', 'host', 'candidate', 'user'],
            default: 'user',
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
