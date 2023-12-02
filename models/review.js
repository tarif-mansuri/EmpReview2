const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    message:{
        type: String,
        required: true
    },

    review_for:{
        type: Schema.Types.ObjectId,
        ref:"employee",
    },
    review_by:{
        type: Schema.Types.ObjectId,
        ref:"employee"
    } 
},{
    timestamps:true
});

const reviewModel = mongoose.model('review', reviewSchema);
module.exports = reviewModel;