import Highlighter from "react-highlight-words";
import React, { useRef, useState, useEffect } from "react";
import {
  SearchOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Input, Button, Space, Table, FloatButton, Modal, message } from "antd";
import axios from "axios";

import * as env from "../env.js";

export default function DetailNews() {
  const user = localStorage.getItem("dataUser")
    ? JSON.parse(localStorage.getItem("dataUser"))
    : null;
  const [messageApi, contextHolder] = message.useMessage();
  const successMessage = () => {
    messageApi.open({
      type: "success",
      content: "Thao tác thành công",
    });
  };
  const errorMessage = () => {
    messageApi.open({
      type: "error",
      content: "Thao tác thất bại",
    });
  };

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });
  const columns = [
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      width: "25%",
      ellipsis: true,
      ...getColumnSearchProps("title"),
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      key: "content",
      width: "50%",
      ellipsis: true,
      ...getColumnSearchProps("content"),
    },
    {
      title: "Hành động",
      key: "action",
      render: (item) => (
        <Space size="middle">
          <Button
            type="primary"
            danger
            onClick={() => deleteNews({ item: item })}
          >
            Xóa
          </Button>
          <Button
            className="bg-sky-500	text-white hover:bg-sky-300"
            onClick={() => showModalEditNews({ item: item })}
          >
            Chỉnh sửa
          </Button>
          <Button
            type="dashed"
            onClick={() => showModalDetailNews({ item: item })}
          >
            Chi tiết
          </Button>
        </Space>
      ),
    },
  ];

  const [dataNews, setDataNews] = useState([]);
  const fetchDataNews = () => {
    axios
      .get(env.API_URL + "/news", {})
      .then(function (response) {
        let arr = [];
        response.data.dataNews.forEach((ele) => {
          arr.push({
            key: ele._id,
            title: ele.title,
            content: ele.content,
            image: ele.image,
            idUser: ele.idUser,
          });
        });
        setDataNews(arr.reverse());
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchDataNews();
  }, []);

  const [isModalAddNews, setIsModalAddNews] = useState(false);
  const showModalAddNews = () => {
    setIdNews("");
    setTitle("");
    setContent("");
    setImage("");
    setIsModalAddNews(true);
  };
  const handleCancelModalAddNews = () => {
    setIsModalAddNews(false);
  };

  const [isModalEditNews, setIsModalEditNews] = useState(false);
  const showModalEditNews = ({ item }) => {
    setIdNews(item.key);
    setTitle(item.title);
    setContent(item.content);
    setImage(item.image);
    setIsModalEditNews(true);
  };
  const handleCancelModalEditNews = () => {
    setIsModalEditNews(false);
  };

  const [isModalDetailNews, setIsModalDetailNews] = useState(false);
  const showModalDetailNews = ({ item }) => {
    setIdNews(item.key);
    setTitle(item.title);
    setContent(item.content);
    setImage(item.image);
    setIsModalDetailNews(true);
  };
  const handleCancelModalDetailNews = () => {
    setIsModalDetailNews(false);
  };

  const addNews = () => {
    axios
      .post(env.API_URL + "/news", {
        title: title,
        content: content,
        image: image,
        idUser: user._id,
      })
      .then(function (response) {
        fetchDataNews();
        successMessage();
        handleCancelModalAddNews();
        setIdNews("");
        setTitle("");
        setContent("");
        setImage("");
      })
      .catch(function (error) {
        console.log(error);
        errorMessage();
      });
  };
  const [modal, warningDelete] = Modal.useModal();
  const deleteNews = ({ item }) => {
    modal.confirm({
      title: "XÁC NHẬN",
      icon: <ExclamationCircleOutlined />,
      content: "Xác nhận xóa tin này",
      okText: "Xóa",
      cancelText: "Hủy",
      okType: "danger",
      onOk() {
        axios
          .put(env.API_URL + "/delete-news", {
            id: item.key,
          })
          .then(function (response) {
            successMessage();
            fetchDataNews();
            setTitle("");
            setContent("");
            setImage("");
          })
          .catch(function (error) {
            errorMessage();
            console.log(error);
          });
      },
    });
  };
  const editNews = () => {
    axios
      .put(env.API_URL + "/update-news", {
        id: idNews,
        title: title,
        content: content,
        image: image,
      })
      .then(function (response) {
        successMessage();
        fetchDataNews();
        handleCancelModalEditNews();
        setIdNews("");
        setTitle("");
        setContent("");
        setImage("");
      })
      .catch(function (error) {
        console.log(error);
        errorMessage();
      });
  };

  const [idNews, setIdNews] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");

  const imagebase64 = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    const data = new Promise((resolve, reject) => {
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });
    return data;
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    const img = await imagebase64(file);
    setImage(img);
  };

  return (
    <>
      {contextHolder}
      {warningDelete}
      <Modal
        closeIcon={null}
        open={isModalAddNews}
        onCancel={handleCancelModalAddNews}
        footer={null}
        className="justify-center w-full"
      >
        <div className="w-full max-w-lg">
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-base font-bold mb-2">
                Tiêu đề
              </label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-base font-bold mb-2">
                Nội dung
              </label>
              <Input.TextArea
                autoSize
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-base font-bold mb-2">
                Hình ảnh (Nếu có)
              </label>
              <Input type="file" onChange={handleUploadImage} />
              {image !== "" && <img src={image} className="mt-5" alt="" />}
            </div>
          </div>
          <div className="flex items-center">
            <Button size="large" onClick={addNews}>
              Đăng
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        closeIcon={null}
        open={isModalEditNews}
        onCancel={handleCancelModalEditNews}
        footer={null}
        className="justify-center w-full"
      >
        <div className="w-full max-w-lg">
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-base font-bold mb-2">
                Tiêu đề
              </label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-base font-bold mb-2">
                Nội dung
              </label>
              <Input.TextArea
                autoSize
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-base font-bold mb-2">
                Hình ảnh (Nếu có)
              </label>
              <Input type="file" onChange={handleUploadImage} />
              {image !== "" && <img src={image} className="mt-5" alt="" />}
            </div>
          </div>
          <div className="flex items-center">
            <Button size="large" onClick={editNews}>
              Cập nhật
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        closeIcon={null}
        open={isModalDetailNews}
        onCancel={handleCancelModalDetailNews}
        footer={null}
        className="justify-center w-full"
      >
        <div className="bg-white">
          <div className="container px-6 py-10 mx-auto">
            <h1 className="text-3xl font-semibold text-gray-800 capitalize lg:text-4xl">
              {title}
            </h1>

            <div className="mt-8 lg:-mx-6 lg:items-center">
              <div className="mt-6 lg:w-full lg:mt-0 lg:mx-6 ">
                <p className="mt-3 text-sm text-gray-500 md:text-sm">
                  {content}
                </p>
              </div>
            </div>
            <img
              className="object-cover w-full rounded-xl mt-5"
              src={image}
              alt=""
            />
          </div>
        </div>
      </Modal>
      <FloatButton.Group>
        <FloatButton
          tooltip={<div>Thêm tin tức mới</div>}
          icon={<PlusOutlined />}
          onClick={showModalAddNews}
        />
        <FloatButton
          badge={{ count: 5 }}
          tooltip={<div>Tin tức chưa được duyệt</div>}
        />
      </FloatButton.Group>
      <Table columns={columns} dataSource={dataNews} />
    </>
  );
}
