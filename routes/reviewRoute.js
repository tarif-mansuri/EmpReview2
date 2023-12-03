const express = require('express');
const reviewCtrl = require('../controllers/reviewCtrl');
const reviewRoute = express.Router();

reviewRoute.post('/add', reviewCtrl.addReview);
reviewRoute.get('/', reviewCtrl.allReviews);
reviewRoute.delete('/delete/:id', reviewCtrl.deleteReview);
reviewRoute.delete('/update/:id', reviewCtrl.updateReview);

module.exports = reviewRoute;