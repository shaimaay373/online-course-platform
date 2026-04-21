import { Router } from 'express';

import {
  createLesson,
  getAllLessons,
  getLessonById,
  updateLesson,
  deleteLesson
} from '../controllers/lesson.controller.js';

import { validate } from '../middlewares/validate.middleware.js';
import { LessonValidator } from '../validators/lesson.validator.js';
import { lessonUpdateValidator } from '../validators/lessonUpdate.validator.js';
import { validateAuth } from "../middlewares/auth.middleware.js";
import { isInstructor } from '../middlewares/role.middleware.js';

const router = Router();

router.post('/:courseId/lessons',
  validateAuth,
  isInstructor,
  LessonValidator,
  validate,
  createLesson
);

router.get('/:courseId/lessons', getAllLessons);


router.get('/lessons/:id', getLessonById);

router.patch('/lessons/:id',
  validateAuth,
  isInstructor,
  lessonUpdateValidator,
  validate,
  updateLesson
);

router.delete('/lessons/:id',
  validateAuth,
  isInstructor,
  deleteLesson
);

export default router;