export const isInstructor = (req, res, next) => {
  try {
    if (req.user.role !== "instructor") {
      return res.status(403).json({
        message: "Access denied: instructors only"
      });
    }

    next();

  } catch (err) {
    next(err);
  }
};