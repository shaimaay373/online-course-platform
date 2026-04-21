import {body} from 'express-validator';


export const registerValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ max: 50, min: 3 })
    .withMessage("name must be between 3 to 50 char"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Not valid email")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("password should be at least 8 char")
];
export const loginValidator = [
body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Not valid email")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),
]
   

