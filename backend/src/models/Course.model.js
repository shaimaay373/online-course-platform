import mongoose from 'mongoose';
const CourseSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    instructor:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",   
        required: true
    },
    price:{
        type: Number,
        required: true,
        min: 0  
    },
    category: {
        type: String,
        required: true
    },
    level: {
        type: String,
        enum: ["beginner", "intermediate", "advanced"],
        default: "beginner"
    },
    thumbnail: {
        type: String  
    },
    isPublished: {
        type: Boolean,
        default: false
    }
}, { timestamps: true }); 
export default mongoose.model("Course", CourseSchema);