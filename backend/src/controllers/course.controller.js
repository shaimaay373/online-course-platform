import mongoose from "mongoose";
import Course from '../models/Course.model.js';
import Lesson from '../models/Lesson.model.js';
import Enrollment from '../models/Enrollment.model.js';
export const createCourse = async (req, res, next) => {
    try {
        const { title, description, price, category, level, isPublished } = req.body;
        const instructor = req.user._id;
        const thumbnail = req.file
            ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
            : null;

        const published =
            isPublished === true ||
            isPublished === 'true' ||
            isPublished === '1';

        const course = await Course.create({
            title,
            description,
            price: Number(price),
            category,
            level,
            thumbnail,
            isPublished: published,
            instructor,
        });

        return res.status(201).json({ message: "Course created successfully", course });
    } catch (err) {
        next(err);
    }
};
export const getMyCourses = async (req, res, next) => {
    try {
        const {
            page = 1,
            limit = 12,
            category,
            search,
        } = req.query;
        const filter = { instructor: req.user._id };
        if (category) filter.category = category;
        if (search) {
            filter.title = { $regex: search, $options: 'i' };
        }
        const skip = (Number(page) - 1) * Number(limit);
        const total = await Course.countDocuments(filter);
        const totalPages = Math.ceil(total / Number(limit)) || 1;
        const courses = await Course.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit))
            .lean();
        const ids = courses.map((c) => c._id);
        let countMap = {};
        if (ids.length) {
            const agg = await Enrollment.aggregate([
                { $match: { course: { $in: ids } } },
                { $group: { _id: '$course', studentsCount: { $sum: 1 } } },
            ]);
            countMap = Object.fromEntries(
                agg.map((r) => [r._id.toString(), r.studentsCount])
            );
        }
        const enriched = courses.map((c) => ({
            ...c,
            studentsCount: countMap[c._id.toString()] || 0,
            rating: null,
        }));
        res.status(200).json({
            courses: enriched,
            pagination: {
                total,
                totalPages,
                currentPage: Number(page),
                limit: Number(limit),
                hasNextPage: Number(page) < totalPages,
                hasPrevPage: Number(page) > 1,
            },
        });
    } catch (err) {
        next(err);
    }
};

export const getInstructorStats = async (req, res, next) => {
    try {
        const instructorId = req.user._id;
        const myCourses = await Course.find({ instructor: instructorId }).lean();
        const courseIds = myCourses.map((c) => c._id);
        const publishedCount = myCourses.filter((c) => c.isPublished).length;

        let totalStudents = 0;
        let totalRevenue = 0;
        let recentEnrollments = [];

        if (courseIds.length) {
            const distinctUsers = await Enrollment.distinct('user', {
                course: { $in: courseIds },
            });
            totalStudents = distinctUsers.length;

            const revAgg = await Enrollment.aggregate([
                { $match: { course: { $in: courseIds } } },
                {
                    $lookup: {
                        from: 'courses',
                        localField: 'course',
                        foreignField: '_id',
                        as: 'c',
                    },
                },
                { $unwind: '$c' },
                { $group: { _id: null, total: { $sum: '$c.price' } } },
            ]);
            totalRevenue = revAgg[0]?.total || 0;

            recentEnrollments = await Enrollment.find({
                course: { $in: courseIds },
            })
                .sort({ createdAt: -1 })
                .limit(8)
                .populate('user', 'name email')
                .populate('course', 'title thumbnail')
                .lean();
        }

        res.status(200).json({
            stats: {
                totalStudents,
                totalRevenue,
                activeCourses: publishedCount,
                totalCourses: myCourses.length,
                averageRating: null,
            },
            recentEnrollments,
        });
    } catch (err) {
        next(err);
    }
};

export const getAllCoures = async (req, res, next) => {
    try {
        const {
            page     = 1,
            limit    = 6,
            category,
            level,
            search,
            minPrice,
            maxPrice,
        } = req.query;
        const filter = {};

        if (category) filter.category = category;
        if (level)    filter.level    = level;
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }
        if (search) {
            filter.title = { $regex: search, $options: 'i' }; 
        }

     
        const skip       = (Number(page) - 1) * Number(limit);
        const total      = await Course.countDocuments(filter);
        const totalPages = Math.ceil(total / Number(limit));

        const courses = await Course.find(filter)
            .populate('instructor', 'name email')
            .skip(skip)
            .limit(Number(limit))
            .sort({ createdAt: -1 });

        res.status(200).json({
            courses,
            pagination: {
                total,
                totalPages,
                currentPage : Number(page),
                limit       : Number(limit),
                hasNextPage : Number(page) < totalPages,
                hasPrevPage : Number(page) > 1,
            }
        });
    } catch (err) {
        next(err);
    }
};
export const getCourseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Course not found" });
    }
    const course = await Course.findById(id)
      .populate("instructor", "name email");

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    const lessons = await Lesson.find({ course: id });


    const totalDuration = lessons.reduce(
      (sum, l) => sum + (l.duration || 0),
      0
    );

   
    return res.status(200).json({
      course,
      lessons,
      totalDuration,
    });

  } catch (err) {
      console.error('getCourseById error:', err)
    next(err);
  }
};
export const updateCourse = async(req, res, next) => {
    try {
        const { id } = req.params;
        const course = await Course.findById(id)
        if(!course) return res.status(404).json({ message: "Course not found" })
        
        if(course.instructor.toString() !== req.user._id.toString())
            return res.status(403).json({ message: "Not authorized" })

        const allowed = ['title', 'description', 'price', 'category', 'level', 'thumbnail'];
        const update = {};
        for (const key of allowed) {
            if (req.body[key] !== undefined && req.body[key] !== '') {
                update[key] = req.body[key];
            }
        }
        if (req.body.price !== undefined && req.body.price !== '') {
            update.price = Number(req.body.price);
        }
        if (req.body.isPublished !== undefined) {
            const v = req.body.isPublished;
            update.isPublished = v === true || v === 'true' || v === '1';
        }
        if (req.file) {
            update.thumbnail = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
        }

        const updated = await Course.findByIdAndUpdate(id, update, { new: true })
        return res.status(200).json({ message: "Course updated successfully", updated })
    } catch(err) {
        next(err)
    }
}
export const deleteCourse= async(req,res,next)=>{
    try{
        const {id} = req.params;
        const course = await Course.findById(id)
        if(!course) return res.status(404).json({ message: "Course not found" })
            if(course.instructor.toString() !== req.user._id.toString())
    return res.status(403).json({ message: "Not authorized" })
            const deleted = await Course.findByIdAndDelete(id)
        return res.status(200).json({ message: "Course deleted successfully", deleted })
    }catch(err){
        next(err)
    }
}