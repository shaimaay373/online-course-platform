import {courseValidator} from '../validators/course.validator.js'
import {Router} from 'express';
import {validateAuth,allowedTo} from '../middlewares/auth.middleware.js'
import {isInstructor} from '../middlewares/role.middleware.js'
import {validate} from '../middlewares/validate.middleware.js'
import upload from '../middlewares/multer.middleware.js'
import{
    createCourse,
    getAllCoures,
    getCourseById,
    updateCourse,
    deleteCourse,
    getMyCourses,
    getInstructorStats
} from '../controllers/course.controller.js'

const router = Router();

router.get('/my', validateAuth, allowedTo('instructor'), getMyCourses);
router.get('/my/stats', validateAuth, allowedTo('instructor'), getInstructorStats);
router.get('/', getAllCoures)
router.get('/:id', getCourseById)
router.post(
  "/",
  validateAuth,        
  allowedTo("instructor"), 
  upload.single("image"),  
  courseValidator,       
  validate,
  createCourse             
);
router.patch('/:id', validateAuth, isInstructor, upload.single('image'), courseValidator, validate, updateCourse)
router.delete('/:id', validateAuth, isInstructor, deleteCourse)

export default router;