const express = require('express');

const reportController = require('../controllers/reports-controllers');
const router = express.Router(); //Export the Router
const checkAuth = require('../middleware/auth')

router.get('/:uid/:pid', reportController.getReport)
router.post('/:uid/:pid', reportController.createReport)
router.patch('/:rid', reportController.ignoreSet)
router.delete('/:rid', reportController.deleteReport)

module.exports = router; //Export the Router