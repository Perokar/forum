import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true,
        unigue:true
    },
    tags: {
        type: Array,
        default:[]
    },
    viewCount:{
        type:Number,
        default:0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    imgURL: String
}, { timestamps: true })

export default mongoose.model('PostModel', PostSchema)