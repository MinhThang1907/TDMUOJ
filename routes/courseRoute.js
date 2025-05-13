const express = require("express");
const courseController = require("../controllers/courseController");
const router = express.Router();

// Lấy tất cả khóa học
router.get("/courses", courseController.getAllCourses);

// Lấy tất cả danh mục
router.get("/courses/categories", courseController.getAllCategories);

// Lấy khóa học theo ID
router.get("/courses/:id", courseController.getCourseById);

// Lấy khóa học theo danh mục
router.get(
  "/courses/category/:category",
  courseController.getCoursesByCategory
);

// Thêm khóa học mới
router.post("/courses", courseController.addCourse);

// Cập nhật khóa học
router.put("/courses/:id", courseController.updateCourse);

// Xóa khóa học
router.delete("/courses/:id", courseController.deleteCourse);

// Thêm bài học vào khóa học
router.post("/courses/:id/lessons", courseController.addLesson);

// Cập nhật bài học
router.put("/courses/:id/lessons", courseController.updateLesson);

// Xóa bài học
router.delete("/courses/:id/lessons", courseController.deleteLesson);

module.exports = router;
