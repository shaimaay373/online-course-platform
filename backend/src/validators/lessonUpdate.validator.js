import { body } from "express-validator";

export const lessonUpdateValidator = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage("Title must be between 5 and 100 characters"),
  body("content")
    .optional()
    .trim()
    .isLength({ min: 20, max: 500 })
    .withMessage("content must be between 20 and 500 characters"),
  body("duration").optional().isFloat({ min: 0 }).withMessage("duration must be a positive number"),
  body("order").optional().isInt({ min: 1 }).withMessage("Order must be a positive number"),
  body("videoUrl").optional().trim(),
  body("thumbnail").optional().trim(),
];
