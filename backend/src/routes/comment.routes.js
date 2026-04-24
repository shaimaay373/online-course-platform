import { Router } from 'express';
import { validateAuth } from '../middlewares/auth.middleware.js';
import { addComment, getCourseComments,updateComment ,deleteComment } from '../controllers/comment.controller.js';

const router = Router();

router.get('/:courseId', getCourseComments);
router.post('/:courseId', validateAuth, addComment);
router.put('/:id', validateAuth, updateComment);
router.delete('/:id', validateAuth, deleteComment);

export default router;