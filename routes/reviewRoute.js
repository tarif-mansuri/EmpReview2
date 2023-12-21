const express = require('express');
const reviewCtrl = require('../controllers/reviewCtrl');
const reviewRoute = express.Router();

reviewRoute.post('/add', reviewCtrl.addReview);
reviewRoute.get('/', reviewCtrl.allReviews);
reviewRoute.delete('/delete/:id', reviewCtrl.deleteReview);
//put call updates the entry in db but returns the old object
reviewRoute.put('/update/:id', reviewCtrl.updateReview);

module.exports = reviewRoute;