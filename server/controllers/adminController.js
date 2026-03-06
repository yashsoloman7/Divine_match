const Admin = require('../models/Admin');

const getAdmins = async (req, res) => {
    try {
        const admins = await Admin.find().sort({ createdAt: 1 });
        res.json(admins);
    } catch (error) {
        console.error('Error fetching admins:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const addAdmin = async (req, res) => {
    try {
        const admin = new Admin({
            name: req.body.name,
            email: req.body.email,
            role: req.body.role || 'host',
        });
        const createdAdmin = await admin.save();
        res.status(201).json(createdAdmin);
    } catch (error) {
        console.error('Error adding admin:', error);
        res.status(400).json({ message: 'Invalid admin data', error: error.message });
    }
};

const deleteAdmin = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id);
        if (admin) {
            await Admin.deleteOne({ _id: admin._id });
            res.json({ message: 'Admin removed' });
        } else {
            res.status(404).json({ message: 'Admin not found' });
        }
    } catch (error) {
        console.error('Error deleting admin:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const checkAdminByEmail = async (req, res) => {
    try {
        const admin = await Admin.findOne({ email: req.params.email });
        if (admin) {
            res.json(admin);
        } else {
            res.status(404).json({ message: 'Admin not found' });
        }
    } catch (error) {
        console.error('Error specific admin:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getAdmins,
    addAdmin,
    deleteAdmin,
    checkAdminByEmail
};
