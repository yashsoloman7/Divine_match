const express = require('express');
const router = express.Router();
const { getEvents, addEvent, deleteEvent } = require('../controllers/eventController');

router.route('/').get(getEvents).post(addEvent);
router.route('/:id').delete(deleteEvent);

module.exports = router;
