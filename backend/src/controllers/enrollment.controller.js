import Enrollment from '../models/Enrollment.model.js'
import User from '../models/User.model.js'
import Course from '../models/Course.model.js';
import HTTPError from '../utils/HttpError.js';
//enroll course 
export const enrollCourse = async(req,res,next)=>{
    try{
        const {courseId} = req.params;
        const course = await Course.findById(courseId)
        if(!course) return next(new HTTPError(404, "Course not found"));
        const student = req.user._id;
        const existingEnrollment = await Enrollment.findOne({
            user: student,
            course: courseId
        })
        if(existingEnrollment) return next(new HTTPError(400, "Already Enrollent"));

     const enroll= await Enrollment.create({
            user: student,
            course: courseId
        });
        res.status(201).json({
            message:" Enrollment sussecfully",
            enroll
        })
    }catch(err){next(err)}
}
export const getInstructorEnrollments = async (req, res, next) => {
    try {
        const courses = await Course.find({ instructor: req.user._id }).select('_id');
        const courseIds = courses.map(c => c._id);
        
        const enrollments = await Enrollment.find({ course: { $in: courseIds } })
            .populate('user', 'name email')
            .populate('course', 'title thumbnail')
            .sort({ createdAt: -1 });

        res.status(200).json({ enrollments });
    } catch (err) { next(err); }
};

// getAll Enrollment
export const getAllEnrollments = async(req,res,next)=>{
   try{
     const enroll = await Enrollment.find({user:req.user._id}).populate("course", "title description price thumbnail")
     res.status(200).json({
            message:"This All Enrollments",
            enroll
        })
   }catch(err){next(err)}
   
}
// cancel Enrollment
export const cancelEnrollment = async(req,res,next)=>{
    try{
        const {id} = req.params;
    const enroll = await Enrollment.findById(id);
    if(!enroll) return next(new HTTPError(404, "Enrollment not found"));
    if(enroll.user.toString() !== req.user._id.toString())
    return next(new HTTPError(403, "Not authorized"));
    const deleted= await Enrollment.findByIdAndDelete(id);
    res.status(200).json(
        { message:"cancel Enrollment suscessfully",deleted})
    }catch(err){next(err)}

}
