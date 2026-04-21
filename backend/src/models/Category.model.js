import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        enum: ["Web Development", "Design", "Business", "Marketing"]
    }
}, { timestamps: true });

export default mongoose.model("Category", CategorySchema);