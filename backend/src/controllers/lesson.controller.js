import Lesson from '../models/Lesson.model.js';
import Course from '../models/Course.model.js';

// Create Lesson
export const createLesson = async (req, res, next) => {
  try {
    const { title, content, duration, order, isPreview } = req.body;
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // check instructor
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const preview =
      isPreview === true || isPreview === "true" || isPreview === "1";

    const lesson = await Lesson.create({
      title,
      content,
      course: courseId,
      duration: Number(duration),
      order: order != null ? Number(order) : undefined,
      isPreview: preview,
    });

    res.status(201).json({
      message: "Lesson created successfully",
      lesson
    });

  } catch (err) {
    next(err);
  }
};

// Get All Lessons for Course
export const getAllLessons = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const lessons = await Lesson.find({ course: courseId });

    res.status(200).json({
      count: lessons.length,
      lessons
    });

  } catch (err) {
    next(err);
  }
};

// Get Lesson By ID
export const getLessonById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const lesson = await Lesson.findById(id);
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    res.status(200).json({ lesson });

  } catch (err) {
    next(err);
  }
};

// Update Lesson
export const updateLesson = async (req, res, next) => {
  try {
    const { id } = req.params;

    const lesson = await Lesson.findById(id);
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    const course = await Course.findById(lesson.course);

    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const patch = { ...req.body };
    if (patch.duration !== undefined) patch.duration = Number(patch.duration);
    if (patch.order !== undefined) patch.order = Number(patch.order);
    if (patch.isPreview !== undefined) {
      patch.isPreview =
        patch.isPreview === true ||
        patch.isPreview === "true" ||
        patch.isPreview === "1";
    }
    const updated = await Lesson.findByIdAndUpdate(id, patch, { new: true });

    res.status(200).json({
      message: "Lesson updated successfully",
      lesson: updated
    });

  } catch (err) {
    next(err);
  }
};

// Delete Lesson
export const deleteLesson = async (req, res, next) => {
  try {
    const { id } = req.params;

    const lesson = await Lesson.findById(id);
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    const course = await Course.findById(lesson.course);

    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Lesson.findByIdAndDelete(id);

    res.status(200).json({
      message: "Lesson deleted successfully"
    });

  } catch (err) {
    next(err);
  }
};