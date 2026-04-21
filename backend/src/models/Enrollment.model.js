import mongoose from 'mongoose';
const EnrollmentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    status:{
        type: String,
       enum: ["pending","active","complete"],
       default:"pending"
    }
},{ timestamps: true });
EnrollmentSchema.index({ user: 1, course: 1 }, { unique: true });
export default mongoose.model("Enrollment",EnrollmentSchema);
