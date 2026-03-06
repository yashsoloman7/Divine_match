const express = require('express');
const router = express.Router();
const { getCandidates, getCandidateById, addCandidate } = require('../controllers/candidateController');

router.route('/').get(getCandidates).post(addCandidate);
router.route('/:id').get(getCandidateById);

module.exports = router;
