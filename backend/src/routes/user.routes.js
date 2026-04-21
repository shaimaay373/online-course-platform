import {Router} from 'express';
import { updateProfileValidator } from '../validators/updateProfile.js';
import {changePasswordValidator} from '../validators/changePassword.js'
import {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
  uploadProfileAvatar
} from "../controllers/user.controller.js";
import  {validate}  from '../middlewares/validate.middleware.js';
import {validateAuth} from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const router = Router();

router.post(
  "/profile/avatar",
  validateAuth,
  upload.single("avatar"),
  uploadProfileAvatar
);
router.get('/profile',validateAuth,getProfile);
router.patch(
    '/profile',
    validateAuth,
    updateProfileValidator,
    validate,
    updateProfile
);
router.patch(
    '/change-password',
    validateAuth,
    changePasswordValidator,
    validate,
    changePassword
);
router.delete('/profile', validateAuth,
  deleteAccount);

  export default router;


