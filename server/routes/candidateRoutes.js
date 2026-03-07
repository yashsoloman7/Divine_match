const express = require('express');
const router = express.Router();
const { getCandidates, getCandidateById, addCandidate, getCandidateByUserId, updateCandidate } = require('../controllers/candidateController');

router.route('/').get(getCandidates).post(addCandidate);
router.route('/user/:userId').get(getCandidateByUserId);
router.route('/:id').get(getCandidateById).put(updateCandidate);

module.exports = router;
