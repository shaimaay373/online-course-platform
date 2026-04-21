import {Router} from 'express';
import { validateAuth, allowedTo } from '../middlewares/auth.middleware.js';
import{
    enrollCourse,
    getAllEnrollments,
    cancelEnrollment,
    getInstructorEnrollments,
} from '../controllers/enrollment.controller.js'

const router = Router();

router.get('/instructor', validateAuth, allowedTo('instructor'), getInstructorEnrollments);
router.post('/:courseId/enroll',validateAuth,enrollCourse);
router.get("/my",validateAuth,getAllEnrollments);
router.delete('/:id',validateAuth,cancelEnrollment)

  export default router;