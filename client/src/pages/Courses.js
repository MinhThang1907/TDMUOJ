"use client";

import { useEffect, useState } from "react";
import {
  Layout,
  theme,
  Menu,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Table,
  Tabs,
  Empty,
  Spin,
  message,
  Popconfirm,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  BookOutlined,
} from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import axios from "axios";

import HeaderPage from "../components/header.js";
import FooterPage from "../components/footer.js";
import { API_URL } from "../env.js";

const { Content } = Layout;
const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

export default function Courses({ currentTab }) {
  const user = localStorage.getItem("dataUser")
    ? JSON.parse(localStorage.getItem("dataUser"))
    : null;
  const isAdmin = user && user.role === "admin";

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // State cho danh sách khóa học và danh mục
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  // State cho modal
  const [courseModalVisible, setCourseModalVisible] = useState(false);
  const [lessonModalVisible, setLessonModalVisible] = useState(false);
  const [courseForm] = Form.useForm();
  const [lessonForm] = Form.useForm();
  const [modalMode, setModalMode] = useState("add"); // 'add' hoặc 'edit'

  // Fetch dữ liệu danh mục và khóa học
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      if (response.data.success) {
        setCategories(response.data.categories);
        if (response.data.categories.length > 0 && !selectedCategory) {
          setSelectedCategory(response.data.categories[0]._id);
        }
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      message.error("Không thể tải danh mục khóa học");
    }
  };

  const fetchCourses = async (categoryId) => {
    setLoading(true);
    try {
      const response = await axios.get(
        categoryId
          ? `${API_URL}/courses/category/${categoryId}`
          : `${API_URL}/courses`
      );
      if (response.data.success) {
        setCourses(response.data.courses);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      message.error("Không thể tải khóa học");
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseDetails = async (courseId) => {
    try {
      const response = await axios.get(`${API_URL}/courses/${courseId}`);
      if (response.data.success) {
        setSelectedCourse(response.data.course);
        if (
          response.data.course.lessons &&
          response.data.course.lessons.length > 0
        ) {
          setSelectedLesson(response.data.course.lessons[0]);
        } else {
          setSelectedLesson(null);
        }
      }
    } catch (error) {
      console.error("Error fetching course details:", error);
      message.error("Không thể tải chi tiết khóa học");
    }
  };

  // Xử lý thêm/sửa khóa học
  const handleAddEditCourse = async (values) => {
    try {
      if (modalMode === "add") {
        const response = await axios.post(`${API_URL}/courses`, {
          ...values,
          author: user.username,
        });
        if (response.data.success) {
          message.success("Thêm khóa học thành công");
          fetchCourses(selectedCategory);
        }
      } else {
        const response = await axios.put(
          `${API_URL}/courses/${selectedCourse._id}`,
          values
        );
        if (response.data.success) {
          message.success("Cập nhật khóa học thành công");
          fetchCourses(selectedCategory);
          if (selectedCourse._id === response.data.course._id) {
            setSelectedCourse(response.data.course);
          }
        }
      }
      setCourseModalVisible(false);
      courseForm.resetFields();
    } catch (error) {
      console.error("Error saving course:", error);
      message.error("Không thể lưu khóa học");
    }
  };

  // Xử lý xóa khóa học
  const handleDeleteCourse = async (courseId) => {
    try {
      const response = await axios.delete(`${API_URL}/courses/${courseId}`);
      if (response.data.success) {
        message.success("Xóa khóa học thành công");
        fetchCourses(selectedCategory);
        if (selectedCourse && selectedCourse._id === courseId) {
          setSelectedCourse(null);
          setSelectedLesson(null);
        }
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      message.error("Không thể xóa khóa học");
    }
  };

  // Xử lý thêm/sửa bài học
  const handleAddEditLesson = async (values) => {
    try {
      if (modalMode === "add") {
        const response = await axios.post(
          `${API_URL}/courses/${selectedCourse._id}/lessons`,
          values
        );
        if (response.data.success) {
          message.success("Thêm bài học thành công");
          setSelectedCourse(response.data.course);
          setSelectedLesson(
            response.data.course.lessons[
              response.data.course.lessons.length - 1
            ]
          );
        }
      } else {
        const response = await axios.put(
          `${API_URL}/courses/${selectedCourse._id}/lessons`,
          {
            ...values,
            lessonId: selectedLesson._id,
          }
        );
        if (response.data.success) {
          message.success("Cập nhật bài học thành công");
          setSelectedCourse(response.data.course);
          const updatedLesson = response.data.course.lessons.find(
            (lesson) => lesson._id === selectedLesson._id
          );
          setSelectedLesson(updatedLesson || null);
        }
      }
      setLessonModalVisible(false);
      lessonForm.resetFields();
    } catch (error) {
      console.error("Error saving lesson:", error);
      message.error("Không thể lưu bài học");
    }
  };

  // Xử lý xóa bài học
  const handleDeleteLesson = async (lessonId) => {
    try {
      const response = await axios.delete(
        `${API_URL}/courses/${selectedCourse._id}/lessons`,
        {
          data: { lessonId },
        }
      );
      if (response.data.success) {
        message.success("Xóa bài học thành công");
        setSelectedCourse(response.data.course);
        if (selectedLesson && selectedLesson._id === lessonId) {
          setSelectedLesson(response.data.course.lessons[0] || null);
        }
      }
    } catch (error) {
      console.error("Error deleting lesson:", error);
      message.error("Không thể xóa bài học");
    }
  };

  // Hiển thị modal thêm/sửa khóa học
  const showAddCourseModal = () => {
    setModalMode("add");
    courseForm.resetFields();
    setCourseModalVisible(true);
  };

  const showEditCourseModal = (course) => {
    setModalMode("edit");
    courseForm.setFieldsValue({
      title: course.title,
      description: course.description,
      category: course.category,
    });
    setCourseModalVisible(true);
  };

  // Hiển thị modal thêm/sửa bài học
  const showAddLessonModal = () => {
    setModalMode("add");
    lessonForm.resetFields();
    setLessonModalVisible(true);
  };

  const showEditLessonModal = (lesson) => {
    setModalMode("edit");
    lessonForm.setFieldsValue({
      title: lesson.title,
      content: lesson.content,
      videoUrl: lesson.videoUrl,
    });
    setLessonModalVisible(true);
  };

  // Xử lý chọn danh mục
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedCourse(null);
    setSelectedLesson(null);
    fetchCourses(categoryId);
  };

  // Xử lý chọn khóa học
  const handleCourseSelect = (courseId) => {
    fetchCourseDetails(courseId);
  };

  // Xử lý chọn bài học
  const handleLessonSelect = (lesson) => {
    setSelectedLesson(lesson);
  };

  // Chuyển đến trang quản lý danh mục
  const goToCategoryManagement = () => {
    window.location.href = "/category-management";
  };

  // Tạo menu danh mục
  const categoryItems = categories.map((category) => ({
    key: category._id,
    label: category.name,
    icon: <BookOutlined />,
  }));

  // Tạo danh sách khóa học
  const courseColumns = [
    {
      title: "Tên khóa học",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Tác giả",
      dataIndex: "author",
      key: "author",
    },
    {
      title: "Số bài học",
      key: "lessonCount",
      render: (_, record) => (record.lessons ? record.lessons.length : 0),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) =>
        isAdmin && (
          <div className="flex space-x-2">
            <Button
              icon={<EditOutlined />}
              onClick={() => showEditCourseModal(record)}
              size="small"
            />
            <Popconfirm
              title="Bạn có chắc muốn xóa khóa học này?"
              onConfirm={() => handleDeleteCourse(record._id)}
              okText="Có"
              cancelText="Không"
            >
              <Button icon={<DeleteOutlined />} danger size="small" />
            </Popconfirm>
          </div>
        ),
    },
  ];

  // Tạo danh sách bài học
  const renderLessonList = () => {
    if (
      !selectedCourse ||
      !selectedCourse.lessons ||
      selectedCourse.lessons.length === 0
    ) {
      return <Empty description="Chưa có bài học nào" />;
    }

    return (
      <Menu
        mode="inline"
        selectedKeys={[selectedLesson ? selectedLesson._id : ""]}
        items={selectedCourse.lessons.map((lesson, index) => ({
          key: lesson._id,
          label: (
            <div className="flex justify-between items-center">
              <span>{`${index + 1}. ${lesson.title}`}</span>
              {isAdmin && (
                <div className="flex space-x-1">
                  <Button
                    icon={<EditOutlined />}
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      showEditLessonModal(lesson);
                    }}
                  />
                  <Popconfirm
                    title="Bạn có chắc muốn xóa bài học này?"
                    onConfirm={(e) => {
                      e.stopPropagation();
                      handleDeleteLesson(lesson._id);
                    }}
                    okText="Có"
                    cancelText="Không"
                  >
                    <Button
                      icon={<DeleteOutlined />}
                      danger
                      size="small"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </Popconfirm>
                </div>
              )}
            </div>
          ),
          onClick: () => handleLessonSelect(lesson),
        }))}
      />
    );
  };

  // Hiển thị nội dung bài học
  const renderLessonContent = () => {
    if (!selectedLesson) {
      return <Empty description="Chọn một bài học để xem nội dung" />;
    }

    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">{selectedLesson.title}</h2>

        <Tabs defaultActiveKey="content">
          <TabPane tab="Nội dung" key="content">
            <div className="prose max-w-none">
              <ReactMarkdown>{selectedLesson.content}</ReactMarkdown>
            </div>
          </TabPane>
          {selectedLesson.videoUrl && (
            <TabPane tab="Video" key="video">
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  src={
                    selectedLesson.videoUrl.includes("youtube.com")
                      ? selectedLesson.videoUrl.replace("watch?v=", "embed/")
                      : selectedLesson.videoUrl
                  }
                  className="w-full h-96"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </TabPane>
          )}
        </Tabs>
      </div>
    );
  };

  // Effect hooks
  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchCourses(selectedCategory);
    }
  }, [selectedCategory]);

  return (
    <Layout>
      <HeaderPage currentTab={currentTab} />
      <Content
        style={{
          padding: "0 48px",
        }}
      >
        <div
          style={{
            padding: 24,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            marginTop: "20px",
          }}
          className="min-h-screen"
        >
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Khóa học</h1>
            {isAdmin && (
              <div className="space-x-2">
                <Button
                  type="default"
                  icon={<PlusOutlined />}
                  onClick={showAddCourseModal}
                >
                  Thêm khóa học
                </Button>
                <Button onClick={goToCategoryManagement}>
                  Quản lý danh mục
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-12 gap-4">
            {/* Danh mục */}
            <div className="col-span-2 border-r">
              <h3 className="font-bold mb-2">Danh mục</h3>
              {categories.length > 0 ? (
                <Menu
                  mode="inline"
                  selectedKeys={[selectedCategory]}
                  items={categoryItems}
                  onClick={({ key }) => handleCategorySelect(key)}
                />
              ) : (
                <Empty description="Chưa có danh mục nào" />
              )}
            </div>

            {/* Danh sách khóa học */}
            <div className="col-span-4 border-r">
              <h3 className="font-bold mb-2">Khóa học</h3>
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <Spin />
                </div>
              ) : (
                <Table
                  dataSource={courses}
                  columns={courseColumns}
                  rowKey="_id"
                  pagination={{ pageSize: 10 }}
                  size="small"
                  onRow={(record) => ({
                    onClick: () => handleCourseSelect(record._id),
                    className:
                      selectedCourse && selectedCourse._id === record._id
                        ? "bg-blue-50"
                        : "",
                  })}
                />
              )}
            </div>

            {/* Chi tiết khóa học */}
            <div className="col-span-6">
              {selectedCourse ? (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">
                      {selectedCourse.title}
                    </h2>
                    {isAdmin && (
                      <Button
                        type="default"
                        icon={<PlusOutlined />}
                        onClick={showAddLessonModal}
                      >
                        Thêm bài học
                      </Button>
                    )}
                  </div>

                  <p className="mb-4">{selectedCourse.description}</p>

                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-4 border-r">
                      <h3 className="font-bold mb-2">Danh sách bài học</h3>
                      {renderLessonList()}
                    </div>

                    <div className="col-span-8">{renderLessonContent()}</div>
                  </div>
                </div>
              ) : (
                <Empty description="Chọn một khóa học để xem chi tiết" />
              )}
            </div>
          </div>

          {/* Modal thêm/sửa khóa học */}
          <Modal
            title={
              modalMode === "add" ? "Thêm khóa học mới" : "Chỉnh sửa khóa học"
            }
            open={courseModalVisible}
            onCancel={() => setCourseModalVisible(false)}
            footer={null}
          >
            <Form
              form={courseForm}
              layout="vertical"
              onFinish={handleAddEditCourse}
            >
              <Form.Item
                name="title"
                label="Tên khóa học"
                rules={[
                  { required: true, message: "Vui lòng nhập tên khóa học" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="description"
                label="Mô tả"
                rules={[
                  { required: true, message: "Vui lòng nhập mô tả khóa học" },
                ]}
              >
                <TextArea rows={4} />
              </Form.Item>

              <Form.Item
                name="category"
                label="Danh mục"
                rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
              >
                <Select placeholder="Chọn danh mục" allowClear showSearch>
                  {categories.map((category) => (
                    <Option key={category._id} value={category._id}>
                      {category.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item className="text-right">
                <Button
                  onClick={() => setCourseModalVisible(false)}
                  style={{ marginRight: 8 }}
                >
                  Hủy
                </Button>
                <Button type="default" htmlType="submit">
                  {modalMode === "add" ? "Thêm" : "Cập nhật"}
                </Button>
              </Form.Item>
            </Form>
          </Modal>

          {/* Modal thêm/sửa bài học */}
          <Modal
            title={
              modalMode === "add" ? "Thêm bài học mới" : "Chỉnh sửa bài học"
            }
            open={lessonModalVisible}
            onCancel={() => setLessonModalVisible(false)}
            footer={null}
            width={800}
          >
            <Form
              form={lessonForm}
              layout="vertical"
              onFinish={handleAddEditLesson}
            >
              <Form.Item
                name="title"
                label="Tiêu đề bài học"
                rules={[
                  { required: true, message: "Vui lòng nhập tiêu đề bài học" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="content"
                label="Nội dung (Markdown)"
                rules={[
                  { required: true, message: "Vui lòng nhập nội dung bài học" },
                ]}
              >
                <TextArea rows={10} />
              </Form.Item>

              <Form.Item
                name="videoUrl"
                label="URL Video (YouTube hoặc URL khác)"
              >
                <Input placeholder="https://www.youtube.com/watch?v=..." />
              </Form.Item>

              <Form.Item className="text-right">
                <Button
                  onClick={() => setLessonModalVisible(false)}
                  style={{ marginRight: 8 }}
                >
                  Hủy
                </Button>
                <Button type="default" htmlType="submit">
                  {modalMode === "add" ? "Thêm" : "Cập nhật"}
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </Content>
      <FooterPage />
    </Layout>
  );
}
