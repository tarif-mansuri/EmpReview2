const reviewModel = require('../models/review');

module.exports.addReview = async (req, res)=>{
    const {message, review_for} = req.body;
    const review_by = req.headers.cookie?.split('=')[1];
    if(review_by == null || review_by == undefined || review_by == -1){
        res.status(403);
        res.json({
            "message":"Please Login first"
        });
        return res;
    }
    const review = await reviewModel.create({
        "message": message,
        "review_for" : review_for,
        "review_by" : review_by
    });
    res.status(201);
    res.json({
        "message":"Review added successfully",
        "review": review
    });
    return res;
}