import mongoose from 'mongoose';

const LessonSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    content:{
        type: String,
        required: true
    },
    course:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Course",
        required: true
    },
    duration:{
        type: Number,
        required: true
    },
    order: {
  type: Number
},
videoUrl: {
    type: String,  
},
thumbnail: {
    type: String,  
},
isPreview: {
    type: Boolean,  
    default: false
}
},{ timestamps: true }); 

export default mongoose.model("Lesson", LessonSchema);