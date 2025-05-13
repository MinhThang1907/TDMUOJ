"use client";

import { useEffect, useState } from "react";
import {
  Layout,
  theme,
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Typography,
  Space,
  Card,
  Statistic,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  BookOutlined,
} from "@ant-design/icons";
import axios from "axios";

import HeaderPage from "../components/header.js";
import FooterPage from "../components/footer.js";
import { API_URL } from "../env.js";

const { Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;

export default function CategoryManagement({ currentTab }) {
  const user = localStorage.getItem("dataUser")
    ? JSON.parse(localStorage.getItem("dataUser"))
    : null;
  const isAdmin = user && user.role === "admin";

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // State cho danh sách danh mục
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryStats, setCategoryStats] = useState({});

  // State cho modal
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [modalMode, setModalMode] = useState("add"); // 'add' hoặc 'edit'
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Fetch dữ liệu danh mục
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/categories`);
      if (response.data.success) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      message.error("Không thể tải danh mục");
    } finally {
      setLoading(false);
    }
  };

  // Fetch thống kê danh mục
  const fetchCategoryStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/categories/stats/count`);
      if (response.data.success) {
        const statsMap = {};
        response.data.counts.forEach((item) => {
          statsMap[item._id] = item.count;
        });
        setCategoryStats(statsMap);
      }
    } catch (error) {
      console.error("Error fetching category stats:", error);
    }
  };

  // Xử lý thêm/sửa danh mục
  const handleAddEditCategory = async (values) => {
    try {
      if (modalMode === "add") {
        const response = await axios.post(`${API_URL}/categories`, values);
        if (response.data.success) {
          message.success("Thêm danh mục thành công");
          fetchCategories();
        }
      } else {
        const response = await axios.put(
          `${API_URL}/categories/${selectedCategory._id}`,
          values
        );
        if (response.data.success) {
          message.success("Cập nhật danh mục thành công");
          fetchCategories();
        }
      }
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error("Error saving category:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        message.error(error.response.data.message);
      } else {
        message.error("Không thể lưu danh mục");
      }
    }
  };

  // Xử lý xóa danh mục
  const handleDeleteCategory = async (categoryId) => {
    try {
      const response = await axios.delete(
        `${API_URL}/categories/${categoryId}`
      );
      if (response.data.success) {
        message.success("Xóa danh mục thành công");
        fetchCategories();
        fetchCategoryStats();
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        message.error(error.response.data.message);
      } else {
        message.error("Không thể xóa danh mục");
      }
    }
  };

  // Hiển thị modal thêm danh mục
  const showAddModal = () => {
    setModalMode("add");
    form.resetFields();
    setModalVisible(true);
  };

  // Hiển thị modal sửa danh mục
  const showEditModal = (category) => {
    setModalMode("edit");
    setSelectedCategory(category);
    form.setFieldsValue({
      name: category.name,
      description: category.description,
      order: category.order,
    });
    setModalVisible(true);
  };

  // Tạo cột cho bảng danh mục
  const columns = [
    {
      title: "Thứ tự",
      dataIndex: "order",
      key: "order",
      sorter: (a, b) => a.order - b.order,
    },
    {
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Số khóa học",
      key: "courseCount",
      render: (_, record) => categoryStats[record._id] || 0,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) =>
        isAdmin && (
          <Space>
            <Button
              icon={<EditOutlined />}
              onClick={() => showEditModal(record)}
            />
            <Popconfirm
              title="Bạn có chắc muốn xóa danh mục này?"
              description={
                categoryStats[record._id] > 0
                  ? "Danh mục này có khóa học liên kết. Bạn cần xóa hoặc chuyển các khóa học trước."
                  : "Hành động này không thể hoàn tác."
              }
              onConfirm={() => handleDeleteCategory(record._id)}
              okText="Có"
              cancelText="Không"
              disabled={categoryStats[record._id] > 0}
            >
              <Button
                icon={<DeleteOutlined />}
                danger
                disabled={categoryStats[record._id] > 0}
                title={
                  categoryStats[record._id] > 0
                    ? "Không thể xóa danh mục có khóa học liên kết"
                    : "Xóa danh mục"
                }
              />
            </Popconfirm>
          </Space>
        ),
    },
  ];

  // Effect hooks
  useEffect(() => {
    if (!isAdmin) {
      // Redirect nếu không phải admin
      window.location.href = "/";
      return;
    }

    fetchCategories();
    fetchCategoryStats();
  }, [isAdmin]);

  if (!isAdmin) {
    return null; // Không hiển thị gì nếu không phải admin
  }

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
          <div className="flex justify-between items-center mb-6">
            <Title level={2}>Quản lý danh mục khóa học</Title>
            <Button
              type="default"
              icon={<PlusOutlined />}
              onClick={showAddModal}
            >
              Thêm danh mục
            </Button>
          </div>

          <div className="mb-6">
            <Card>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Statistic
                  title="Tổng số danh mục"
                  value={categories.length}
                  prefix={<BookOutlined />}
                />
                <Statistic
                  title="Danh mục có khóa học"
                  value={Object.keys(categoryStats).length}
                />
                <Statistic
                  title="Tổng số khóa học"
                  value={Object.values(categoryStats).reduce(
                    (sum, count) => sum + count,
                    0
                  )}
                />
              </div>
            </Card>
          </div>

          <Table
            dataSource={categories}
            columns={columns}
            rowKey="_id"
            loading={loading}
            pagination={{ pageSize: 10 }}
          />

          {/* Modal thêm/sửa danh mục */}
          <Modal
            title={
              modalMode === "add" ? "Thêm danh mục mới" : "Chỉnh sửa danh mục"
            }
            open={modalVisible}
            onCancel={() => setModalVisible(false)}
            footer={null}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleAddEditCategory}
            >
              <Form.Item
                name="name"
                label="Tên danh mục"
                rules={[
                  { required: true, message: "Vui lòng nhập tên danh mục" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item name="description" label="Mô tả">
                <TextArea rows={4} />
              </Form.Item>

              <Form.Item name="order" label="Thứ tự hiển thị" initialValue={0}>
                <InputNumber min={0} />
              </Form.Item>

              <Form.Item className="text-right">
                <Button
                type="text"
                  onClick={() => setModalVisible(false)}
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
