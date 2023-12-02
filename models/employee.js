const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const empSchema = new Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    is_admin:{
        type: Boolean,
        required:true,
        default:false
    },
    reviewer_for:[
        {
            type: Schema.Types.ObjectId,
            ref:"employee"
        }
    ],
    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref:"review"
        }
    ],
},{
    timestamps:true
});

const empModel = mongoose.model('employee', empSchema);
module.exports = empModel;