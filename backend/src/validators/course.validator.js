import { body } from 'express-validator';

export const courseValidator = [
    body("title")
        .optional()
        .trim()
        .notEmpty().withMessage("Course title is required")
        .isLength({ min: 5, max: 100 })
        .withMessage("Title must be between 5 and 100 characters"),

    body("description")
         .optional()
        .trim()
        .notEmpty().withMessage("Course description is required")
        .isLength({ min: 20, max: 500 })
        .withMessage("Description must be between 20 and 500 characters"),

    body("price")
    .optional()
        .notEmpty().withMessage("Price is required")
        .isFloat({ min: 0 }).withMessage("Price must be a positive number"),

    body("category")
    .optional()
        .trim()
        .notEmpty().withMessage("Category is required"),

    body("level")
    .optional()
        .optional()
        .isIn(["beginner", "intermediate", "advanced"])
        .withMessage("Level must be beginner, intermediate, or advanced"),
];
