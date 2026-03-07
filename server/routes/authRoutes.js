const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Admin = require('../models/Admin');

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/google', async (req, res) => {
    try {
        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({ message: 'Missing credential' });
        }

        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { sub, email, name, picture } = payload;

        let isGrandAdmin = email === 'ccchurchbhilai2020@gmail.com';

        // Check if user exists in the general User collection
        let user = await User.findOne({ email });

        if (!user) {
            // Check if this user is designated as an Admin in the Admin collection
            let userRole = 'user';
            if (isGrandAdmin) {
                userRole = 'admin';
            } else {
                const adminRecord = await Admin.findOne({ email });
                userRole = adminRecord ? adminRecord.role : 'user';
            }

            user = await User.create({
                googleId: sub,
                email,
                name,
                avatar: picture,
                role: userRole,
            });
        } else if (isGrandAdmin && user.role !== 'admin') {
            user.role = 'admin';
            await user.save();
        }

        // Create JWT for local session
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '30d' }
        );

        res.status(200).json({
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                avatar: user.avatar,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Google Auth Error:', error);
        res.status(500).json({ message: 'Authentication failed', error: error.message });
    }
});

// Email/Password Registration
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Check if this user is designated as an Admin in the Admin collection
        let isGrandAdmin = email === 'ccchurchbhilai2020@gmail.com';
        let userRole = role;

        if (isGrandAdmin) {
            userRole = 'admin';
        } else {
            const adminRecord = await Admin.findOne({ email });
            userRole = adminRecord ? adminRecord.role : role;
        }

        user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: userRole,
        });

        // Create JWT
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '30d' }
        );

        res.status(201).json({
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: 'Registration failed', error: error.message });
    }
});

// Email/Password Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email });
        if (!user || !user.password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (email === 'ccchurchbhilai2020@gmail.com' && user.role !== 'admin') {
            user.role = 'admin';
            await user.save();
        }

        // Create JWT
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '30d' }
        );

        res.status(200).json({
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                avatar: user.avatar,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
});

module.exports = router;
