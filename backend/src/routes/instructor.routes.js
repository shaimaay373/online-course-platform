import { Router } from "express";
import { validateAuth, allowedTo } from "../middlewares/auth.middleware.js";
import { getMyCourses, getInstructorStats } from "../controllers/course.controller.js";

const router = Router();

router.get("/courses", validateAuth, allowedTo("instructor"), getMyCourses);
router.get("/stats", validateAuth, allowedTo("instructor"), getInstructorStats);

export default router;
