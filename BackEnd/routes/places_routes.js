const express = require('express');

const placesController = require('../controllers/places-controllers')
const router = express.Router(); //Here this is just a way to export our router
const checkAuth = require('../middleware/auth')

router.get('/:pid', placesController.getPlaceByPid)
router.get('/users/:uid', placesController.getPlaceByUid)
router.get('/users/:uid/my', placesController.getSpecificPlaceByUid)

router.use(checkAuth) //This is a middleware that will be executed for all the routes below
router.post('/', placesController.createPlace)
router.patch('/:pid', placesController.UpdatePlace)
router.delete('/:pid', placesController.DeletePlace)
router.patch('/request/:pid', placesController.requestPlace)
router.patch('/leave/:pid', placesController.leavePlace)
router.patch('/accept/:pid', placesController.acceptRequest)
router.patch('/reject/:pid', placesController.rejectRequest)
//When you try to enter this -> There is no way to access because all browser requests are GET requests
//Use API's -> Postman

module.exports = router; //Here we export our router