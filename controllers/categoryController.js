const categoryModel = require("../models/categoryModel");
const courseModel = require("../models/courseModel");

// Lấy tất cả danh mục
exports.getAllCategories = (req, res) => {
  categoryModel
    .find()
    .sort({ order: 1, name: 1 })
    .then((data) => {
      res.status(200).json({
        success: true,
        categories: data,
      });
    })
    .catch((err) =>
      res.status(500).json({
        success: false,
        message: "Server error. Please try again.",
        error: err.message,
      })
    );
};

// Lấy danh mục theo ID
exports.getCategoryById = (req, res) => {
  categoryModel
    .findById(req.params.id)
    .then((data) => {
      if (!data) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }
      res.status(200).json({
        success: true,
        category: data,
      });
    })
    .catch((err) =>
      res.status(500).json({
        success: false,
        message: "Server error. Please try again.",
        error: err.message,
      })
    );
};

// Thêm danh mục mới
exports.addCategory = (req, res) => {
  const { name, description, order } = req.body;

  // Kiểm tra xem danh mục đã tồn tại chưa
  categoryModel
    .findOne({ name })
    .then((existingCategory) => {
      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: "Category already exists",
        });
      }

      const category = new categoryModel({
        name,
        description: description || "",
        order: order || 0,
      });

      return category.save();
    })
    .then((data) => {
      return res.status(201).json({
        success: true,
        message: "Category created successfully",
        category: data,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Server error. Please try again.",
        error: error.message,
      });
    });
};

// Cập nhật danh mục
exports.updateCategory = (req, res) => {
  const { name, description, order } = req.body;

  categoryModel
    .findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        order,
        updatedAt: Date.now(),
      },
      { new: true }
    )
    .then((data) => {
      if (!data) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }
      return res.status(200).json({
        success: true,
        message: "Category updated successfully",
        category: data,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Server error. Please try again.",
        error: error.message,
      });
    });
};

// Xóa danh mục
exports.deleteCategory = (req, res) => {
  // Kiểm tra xem có khóa học nào thuộc danh mục này không
  courseModel
    .find({ category: req.params.id })
    .then((courses) => {
      if (courses.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Cannot delete category with associated courses",
        });
      }

      return categoryModel.findByIdAndDelete(req.params.id);
    })
    .then((data) => {
      if (!data) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }
      return res.status(200).json({
        success: true,
        message: "Category deleted successfully",
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Server error. Please try again.",
        error: error.message,
      });
    });
};

// Lấy số lượng khóa học theo danh mục
exports.getCourseCountByCategory = (req, res) => {
  courseModel
    .aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ])
    .then((data) => {
      res.status(200).json({
        success: true,
        counts: data,
      });
    })
    .catch((err) =>
      res.status(500).json({
        success: false,
        message: "Server error. Please try again.",
        error: err.message,
      })
    );
};
