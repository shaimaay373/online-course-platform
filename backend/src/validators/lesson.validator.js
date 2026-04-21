import {body} from 'express-validator';
export const LessonValidator =[
     body("title")
        .trim()
        .notEmpty()
        .withMessage("Lesson title is required")
        .isLength({ min: 5, max: 100 })
        .withMessage("Title must be between 5 and 100 characters"),

    body("content")
        .trim()
        .notEmpty().withMessage("Lesson content is required")
        .isLength({ min: 20, max: 500 })
        .withMessage("content must be between 20 and 500 characters"),

    body("duration")
        .notEmpty().withMessage("duration is required")
        .isFloat({ min: 0 }).withMessage("duration must be a positive number"),


   body("order")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Order must be a positive number"),
]
