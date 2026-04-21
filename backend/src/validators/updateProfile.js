import {body} from 'express-validator';

export const updateProfileValidator=[

  body("name")
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("name must be between 3 and 50 chars"),

  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Invalid email"),

  body("headline")
    .optional()
    .trim()
    .isLength({ max: 120 })
    .withMessage("headline must be at most 120 characters"),

  body("bio")
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage("bio must be at most 2000 characters")

];

