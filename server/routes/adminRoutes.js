const express = require('express');
const router = express.Router();
const { getAdmins, addAdmin, deleteAdmin, checkAdminByEmail } = require('../controllers/adminController');

router.route('/').get(getAdmins).post(addAdmin);
router.route('/:id').delete(deleteAdmin);
router.route('/email/:email').get(checkAdminByEmail);

module.exports = router;
