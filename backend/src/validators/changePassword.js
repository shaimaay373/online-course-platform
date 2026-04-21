import {body} from 'express-validator'

export const  changePasswordValidator=[
    body("currentPassword")
    .trim()
    .notEmpty()
    .withMessage("currentPassword is required"),
     body("newPassword")
    .isLength({ min: 8 })
    .withMessage("New password must be at least 8 chars")
]