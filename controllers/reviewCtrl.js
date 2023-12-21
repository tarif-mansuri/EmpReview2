const reviewModel = require('../models/review');
const empModel = require('../models/employee');

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
    //push data into review collection
    const review = await reviewModel.create({
        "message": message,
        "review_for" : review_for,
        "review_by" : review_by
    });

    //update employee(with review id) for whom review has been given
    let empObj =await empModel.findById(review_for);
    empObj.reviews.push(review._id.toString());
    await empObj.save();
    res.json({
        'status_code':201,
        "message":"Review added successfully",
        "review": review
    });
    return res;
}

module.exports.allReviews = async(req, res)=>{
    const reviewArray =await reviewModel.find();
    res.status(200);
    res.json({
        "message":"Reviews fetched successfully",
        'reviews':reviewArray
    });
    return res;
}

module.exports.deleteReview = async (req, res)=>{
    const reviewId = req.params.id;
    const review_by = req.headers.cookie?.split('=')[1];
    if(review_by == null || review_by == undefined || review_by == -1){
        res.status(403);
        res.json({
            "message":"Please Login first"
        });
        return res;
    }
    if(reviewId!=null){
        const deletedReview = await reviewModel.findByIdAndDelete(reviewId);
        // if(updated==null){
        //     return res.json({
        //         'status_code':'404',
        //         "message":"Review does not exists"
        //     })
        // }
        const review_for = deletedReview.review_for;
        let empObj = await empModel.findById(review_for);
        let i=0;
        for(;i<empObj.reviews.length;i++){
            if(empObj.reviews[i]==reviewId){
                empObj.reviews.splice(i,1);
                break;
            }
        }
        //either i is pointing to the element which we want to remove
        //or element was not found
        await empObj.save();
        res.json({
            'status_code':204,
            "message":"Review was deleted successfully",
            'review':deletedReview
        });
        return res;
    }
}

module.exports.updateReview = async (req, res)=>{
    const reviewId = req.params.id;
    const review_by = req.headers.cookie?.split('=')[1];
    if(review_by == null || review_by == undefined || review_by == -1){
        res.status(403);
        res.json({
            "message":"Please Login first"
        });
        return res;
    }
    if(reviewId!=null){
        const message = req.body.message;
        //update call updates the entry in db but returns the old object
        const review = await reviewModel.findByIdAndUpdate(reviewId,{"message": message});
        const updatedReview = await reviewModel.findById(review._id.toString());
        res.json({
            'status_code':'200',
            "message":"Review has been updated successfully",
            'review':updatedReview
        });
        return res;
    }
}