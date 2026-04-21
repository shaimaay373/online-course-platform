import express from 'express'
import cors from "cors";
import morgan from "morgan"
import { fileURLToPath } from "url";
import { dirname, join } from "path";;
import NotFoundMw from './middlewares/notFoundMW.js'
import errorHandler from './middlewares/errorHandlingMW.js'
import authRoutes from './routes/auth.routes.js';
import categoryRouter from './routes/category.routes.js'
import coursesRoutes from './routes/course.routes.js'
import instructorRoutes from './routes/instructor.routes.js'
import usersRoutes from './routes/user.routes.js'
import lessonsRoutes from './routes/lesson.routes.js';
import enrollmentRoutes from './routes/enrollment.routes.js';
import commentRoutes from './routes/comment.routes.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename); 

function corsOrigin() {
  const raw = process.env.FRONTEND_URL?.trim();
  if (!raw) return true;
  const list = raw.split(",").map((s) => s.trim()).filter(Boolean);
  return list.length === 1 ? list[0] : list;
}

app.use(
  cors({
    origin: corsOrigin(),
    credentials: true,
  })
);
// atatch middleware
app.use(morgan("dev")); 
app.use(express.json());

// define routes

app.use("/api/auth",authRoutes);
app.use('/api/categories', categoryRouter);
app.use("/api/courses", coursesRoutes);
app.use("/api/instructor", instructorRoutes);
app.use("/api/users",usersRoutes);
app.use("/api/courses",lessonsRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/comments", commentRoutes);


app.use("/uploads", express.static(join(process.cwd(), "uploads")));
app.get("/test-image", (req, res) => {
  res.sendFile(join(__dirname, "uploads", "1776472075117-462221616.jpg"));
});
//not found middleware
app.use(NotFoundMw);

// global error handle middleware
app.use(errorHandler);
export default app;
