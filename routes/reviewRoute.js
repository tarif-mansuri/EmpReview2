const express = require('express');
const reviewCtrl = require('../controllers/reviewCtrl');
const reviewRoute = express.Router();

reviewRoute.post('/add', reviewCtrl.addReview);

module.exports = reviewRoute;