import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    text: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 500
    }
}, { timestamps: true });

export default mongoose.model("Comment", CommentSchema);