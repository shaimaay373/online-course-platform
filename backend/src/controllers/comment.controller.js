import Comment from '../models/Comment.model.js';
import Course from '../models/Course.model.js';
import HTTPError from '../utils/HttpError.js';

export const addComment = async(req, res, next) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId);
        if(!course) return next(new HTTPError(404, "Course not found"));

        const comment = await Comment.create({
            user: req.user._id,
            course: courseId,
            text: req.body.text
        });

        
        const populated = await comment.populate('user', 'name email');

        res.status(201).json({ message: "Comment added successfully", comment: populated });
    } catch(err) { next(err) }
};
export const updateComment = async(req, res, next) => {
    try {
        const { id } = req.params;
        const comment = await Comment.findById(id);
        if(!comment) return next(new HTTPError(404, "Comment not found"));
        if(comment.user.toString() !== req.user._id.toString())
            return next(new HTTPError(403, "Not authorized"));
        comment.text = req.body.text || comment.text;
        await comment.save();
        const updated = await comment.populate('user', 'name email');
        res.status(200).json({ message: "Comment updated successfully", comment: updated });
    } catch(err) { next(err) }
};
export const getCourseComments = async(req, res, next) => {
    try {
        const { courseId } = req.params;
        const comments = await Comment.find({ course: courseId })
            .populate("user", "name email");
        res.status(200).json({ comments, count: comments.length });
    } catch(err) { next(err) }
};

export const deleteComment = async(req, res, next) => {
    try {
        const { id } = req.params;
        const comment = await Comment.findById(id);
        if(!comment) return next(new HTTPError(404, "Comment not found"));
        const isAuthor = comment.user.toString() === req.user._id.toString();
        let isCourseInstructor = false;
        if (!isAuthor) {
            const course = await Course.findById(comment.course);
            isCourseInstructor =
                course &&
                course.instructor.toString() === req.user._id.toString();
        }
        if (!isAuthor && !isCourseInstructor) {
            return next(new HTTPError(403, "Not authorized"));
        }
        await Comment.findByIdAndDelete(id);
        res.status(200).json({ message: "Comment deleted successfully" });
    } catch(err) { next(err) }
};