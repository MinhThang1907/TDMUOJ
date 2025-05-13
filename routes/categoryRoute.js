const express = require("express");
const categoryController = require("../controllers/categoryController");
const router = express.Router();

// Lấy tất cả danh mục
router.get("/categories", categoryController.getAllCategories);

// Lấy danh mục theo ID
router.get("/categories/:id", categoryController.getCategoryById);

// Thêm danh mục mới
router.post("/categories", categoryController.addCategory);

// Cập nhật danh mục
router.put("/categories/:id", categoryController.updateCategory);

// Xóa danh mục
router.delete("/categories/:id", categoryController.deleteCategory);

// Lấy số lượng khóa học theo danh mục
router.get(
  "/categories/stats/count",
  categoryController.getCourseCountByCategory
);

module.exports = router;
