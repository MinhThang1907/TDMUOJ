const courseModel = require("../models/courseModel");
const categoryModel = require("../models/categoryModel");

// Lấy tất cả khóa học
exports.getAllCourses = (req, res) => {
  courseModel
    .find()
    .then((data) => {
      res.status(200).json({
        success: true,
        courses: data,
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

// Lấy khóa học theo ID
exports.getCourseById = (req, res) => {
  courseModel
    .findById(req.params.id)
    .then((data) => {
      if (!data) {
        return res.status(404).json({
          success: false,
          message: "Course not found",
        });
      }
      res.status(200).json({
        success: true,
        course: data,
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

// Lấy khóa học theo danh mục
exports.getCoursesByCategory = (req, res) => {
  courseModel
    .find({ category: req.params.category })
    .then((data) => {
      res.status(200).json({
        success: true,
        courses: data,
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

// Thêm khóa học mới
exports.addCourse = (req, res) => {
  const { title, description, category, author, lessons } = req.body;

  // Kiểm tra xem danh mục có tồn tại không
  categoryModel
    .findOne({ _id: category })
    .then((categoryData) => {
      if (!categoryData) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }

      const course = new courseModel({
        title,
        description,
        category,
        author,
        lessons: lessons || [],
      });

      return course.save();
    })
    .then((data) => {
      return res.status(201).json({
        success: true,
        message: "Course created successfully",
        course: data,
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

// Cập nhật khóa học
exports.updateCourse = (req, res) => {
  const { title, description, category, lessons } = req.body;

  // Kiểm tra xem danh mục có tồn tại không
  categoryModel
    .findOne({ _id: category })
    .then((categoryData) => {
      if (!categoryData) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }

      return courseModel.findByIdAndUpdate(
        req.params.id,
        {
          title,
          description,
          category,
          lessons,
          updatedAt: Date.now(),
        },
        { new: true }
      );
    })
    .then((data) => {
      if (!data) {
        return res.status(404).json({
          success: false,
          message: "Course not found",
        });
      }
      return res.status(200).json({
        success: true,
        message: "Course updated successfully",
        course: data,
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

// Xóa khóa học
exports.deleteCourse = (req, res) => {
  courseModel
    .findByIdAndDelete(req.params.id)
    .then((data) => {
      if (!data) {
        return res.status(404).json({
          success: false,
          message: "Course not found",
        });
      }
      return res.status(200).json({
        success: true,
        message: "Course deleted successfully",
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

// Thêm bài học vào khóa học
exports.addLesson = (req, res) => {
  const { title, content, videoUrl, order } = req.body;

  courseModel
    .findById(req.params.id)
    .then((course) => {
      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Course not found",
        });
      }

      course.lessons.push({
        title,
        content,
        videoUrl,
        order: order || course.lessons.length,
      });

      course.updatedAt = Date.now();

      return course.save();
    })
    .then((updatedCourse) => {
      return res.status(200).json({
        success: true,
        message: "Lesson added successfully",
        course: updatedCourse,
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

// Cập nhật bài học
exports.updateLesson = (req, res) => {
  const { lessonId, title, content, videoUrl, order } = req.body;

  courseModel
    .findById(req.params.id)
    .then((course) => {
      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Course not found",
        });
      }

      const lessonIndex = course.lessons.findIndex(
        (lesson) => lesson._id.toString() === lessonId
      );

      if (lessonIndex === -1) {
        return res.status(404).json({
          success: false,
          message: "Lesson not found",
        });
      }

      if (title) course.lessons[lessonIndex].title = title;
      if (content) course.lessons[lessonIndex].content = content;
      if (videoUrl !== undefined)
        course.lessons[lessonIndex].videoUrl = videoUrl;
      if (order !== undefined) course.lessons[lessonIndex].order = order;

      course.updatedAt = Date.now();

      return course.save();
    })
    .then((updatedCourse) => {
      return res.status(200).json({
        success: true,
        message: "Lesson updated successfully",
        course: updatedCourse,
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

// Xóa bài học
exports.deleteLesson = (req, res) => {
  const { lessonId } = req.body;

  courseModel
    .findById(req.params.id)
    .then((course) => {
      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Course not found",
        });
      }

      const lessonIndex = course.lessons.findIndex(
        (lesson) => lesson._id.toString() === lessonId
      );

      if (lessonIndex === -1) {
        return res.status(404).json({
          success: false,
          message: "Lesson not found",
        });
      }

      course.lessons.splice(lessonIndex, 1);
      course.updatedAt = Date.now();

      return course.save();
    })
    .then((updatedCourse) => {
      return res.status(200).json({
        success: true,
        message: "Lesson deleted successfully",
        course: updatedCourse,
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

// Lấy tất cả các danh mục khóa học
exports.getAllCategories = (req, res) => {
  categoryModel
    .find()
    .sort({ order: 1, name: 1 })
    .then((categories) => {
      res.status(200).json({
        success: true,
        categories: categories,
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
