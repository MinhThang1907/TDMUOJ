import Highlighter from "react-highlight-words";
import React, { useRef, useState, useEffect } from "react";
import {
  SearchOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
  CopyOutlined,
  PlusSquareFilled,
} from "@ant-design/icons";
import {
  Input,
  Button,
  Space,
  Table,
  FloatButton,
  Modal,
  message,
  Select,
  Tag,
  Divider,
  notification,
} from "antd";
import axios from "axios";
import { Editor } from "primereact/editor";
import { CopyToClipboard } from "react-copy-to-clipboard";

import * as env from "../env.js";

export default function DetailProblem() {
  const shortid = require("shortid");

  // const user = localStorage.getItem("dataUser")
  //   ? JSON.parse(localStorage.getItem("dataUser"))
  //   : null;
  const [api, contextHolderSuccess] = notification.useNotification();
  const openNotificationWithIcon = (type) => {
    // console.log(type, api[type]);
    let placement = "bottomRight";
    api.success({
      message: "Đã copy",
      placement,
    });
  };
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

  const [currentKey, setCurrentKey] = useState("");
  const [currentNameProblem, setCurrentNameProblem] = useState("");
  const [currentContentProblem, setCurrentContentProblem] = useState("");
  const [currentDescription, setCurrentDescription] = useState("");
  const [currentExample, setCurrentExample] = useState([]);
  const [currentTimeLimit, setCurrentTimeLimit] = useState(0);
  const [currentMemoryLimit, setCurrentMemoryLimit] = useState(0);
  const [currentTags, setCurrentTags] = useState([]);
  const [currentDifficulty, setCurrentDifficulty] = useState(0);
  const [currentTestCase, setCurrentTestCase] = useState([]);

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
          placeholder={`Tìm kiếm`}
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
            Tìm
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Xóa
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
            Lọc
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Đóng
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
      title: "ID",
      dataIndex: "key",
      key: "key",
      width: "15%",
      ...getColumnSearchProps("idProblem"),
    },
    {
      title: "Tên bài tập",
      dataIndex: "nameProblem",
      key: "nameProblem",
      width: "20%",
      ...getColumnSearchProps("nameProblem"),
      ellipsis: true,
    },
    {
      title: "Dạng bài",
      dataIndex: "tags",
      key: "tags",
      width: "30%",
      render: (_, { tags }) => (
        <>
          {tags.map((tag) => {
            return <Tag color="cyan">{tag}</Tag>;
          })}
        </>
      ),
    },
    {
      title: "Số AC",
      key: "numberSolved",
      dataIndex: "numberSolved",
      width: "10%",
      sorter: (a, b) => a.numberSolved - b.numberSolved,
    },
    {
      title: "Hành động",
      key: "action",
      render: (item) => (
        <div className="max-w-full flex-wrap">
          <Button
            type="primary"
            danger
            onClick={() => deleteProblem({ item: item })}
          >
            Xóa
          </Button>
          <Button
            className="bg-sky-500	text-white hover:bg-sky-300 grow-0"
            onClick={() => {
              setCurrentKey(item.key);
              setCurrentNameProblem(item.nameProblem);
              setCurrentContentProblem(item.contentProblem);
              setCurrentDescription(item.description);
              setCurrentExample(item.example);
              setCurrentTimeLimit(item.timeLimit);
              setCurrentMemoryLimit(item.memoryLimit);
              setCurrentTags(item.tags);
              setCurrentDifficulty(item.difficulty);
              showModalEditProblem();
            }}
          >
            Chỉnh sửa
          </Button>
          <Button
            className=" grow-0"
            type="dashed"
            onClick={() => {
              setCurrentKey(item.key);
              setCurrentNameProblem(item.nameProblem);
              setCurrentContentProblem(item.contentProblem);
              setCurrentDescription(item.description);
              setCurrentExample(item.example);
              setCurrentTimeLimit(item.timeLimit);
              setCurrentMemoryLimit(item.memoryLimit);
              setCurrentTags(item.tags);
              setCurrentDifficulty(item.difficulty);
              showModalDetailProblem();
            }}
          >
            Chi tiết
          </Button>
          <Button
            className="bg-green-500	text-white hover:bg-green-300 grow-0"
            onClick={() => {
              setCurrentTestCase(item.testCase);
              setCurrentKey(item.key);
              setCurrentNameProblem(item.nameProblem);
              showModalAddTestCase();
            }}
          >
            Thêm test case
          </Button>
        </div>
      ),
    },
  ];

  const [dataProblem, setDataProblem] = useState([]);
  const [options, setOptions] = useState([]);
  const [difficulty, setDifficulty] = useState([]);
  const fetchDataProblems = () => {
    axios
      .get(env.API_URL + "/problems", {})
      .then(function (response) {
        let arr = [];
        response.data.dataProblems.forEach((ele) => {
          arr.push({
            key: ele.idProblem,
            nameProblem: ele.nameProblem,
            contentProblem: ele.contentProblem,
            example: ele.example,
            timeLimit: ele.timeLimit,
            memoryLimit: ele.memoryLimit,
            tags: ele.tags,
            numberSolved: ele.numberSolved,
            difficulty: ele.difficulty,
            description: ele.description,
            testCase: ele.testCase,
            idContest: ele.idContest,
          });
        });
        setDataProblem(arr.reverse());
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const fetchDataTagProblem = () => {
    axios
      .get(env.API_URL + "/tag", {})
      .then(function (response) {
        let arr = [];
        response.data.dataTagProblems.forEach((ele) => {
          arr.push({
            label: ele.nameTag,
            value: ele.nameTag,
          });
        });
        setOptions(arr);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const fetchDataDifficulty = () => {
    let arr = [];
    for (let i = 100; i <= 1000; i += 100) {
      arr.push({
        label: i.toString(),
        value: i.toString(),
      });
    }
    setDifficulty(arr);
  };

  useEffect(() => {
    fetchDataProblems();
    fetchDataTagProblem();
    fetchDataDifficulty();
  }, []);

  const resetCurrentProblem = () => {
    setCurrentKey("");
    setCurrentNameProblem("");
    setCurrentContentProblem("");
    setCurrentDescription("");
    setCurrentExample([]);
    setCurrentTimeLimit(1);
    setCurrentMemoryLimit(256);
    setCurrentTags([]);
    setCurrentDifficulty(100);
  };

  const [isModalAddProblem, setIsModalAddProblem] = useState(false);
  const showModalAddProblem = () => {
    resetCurrentProblem();
    setIsModalAddProblem(true);
  };
  const handleCancelModalAddProblem = () => {
    setIsModalAddProblem(false);
  };

  const [isModalEditProblem, setIsModalEditProblem] = useState(false);
  const showModalEditProblem = () => {
    setIsModalEditProblem(true);
  };
  const handleCancelModalEditProblem = () => {
    setIsModalEditProblem(false);
  };

  const [isModalDetailProblem, setIsModalDetailProblem] = useState(false);
  const showModalDetailProblem = () => {
    setIsModalDetailProblem(true);
  };
  const handleCancelModalDetailProblem = () => {
    setIsModalDetailProblem(false);
  };

  const [isModalAddTestCase, setIsModalAddTestCase] = useState(false);
  const showModalAddTestCase = () => {
    setIsModalAddTestCase(true);
  };
  const handleCancelModalAddTestCase = () => {
    setIsModalAddTestCase(false);
  };

  const [currentTag, setCurrentTag] = useState("");
  const [isModalAddTag, setIsModalAddTag] = useState(false);
  const showModalAddTag = () => {
    setIsModalAddTag(true);
  };
  const handleCancelModalAddTag = () => {
    setIsModalAddTag(false);
    setCurrentTag("");
  };

  const addProblem = () => {
    axios
      .post(env.API_URL + "/problems", {
        idProblem: shortid.generate(),
        nameProblem: currentNameProblem,
        contentProblem: currentContentProblem,
        example: currentExample,
        timeLimit: currentTimeLimit,
        memoryLimit: currentMemoryLimit,
        tags: currentTags,
        difficulty: currentDifficulty,
        description: currentDescription,
        idContest: "none",
      })
      .then(function (response) {
        fetchDataProblems();
        successMessage();
        handleCancelModalAddProblem();
      })
      .catch(function (error) {
        console.log(error);
        errorMessage();
      });
  };
  const [modal, warningDelete] = Modal.useModal();
  const deleteProblem = ({ item }) => {
    modal.confirm({
      title: "XÁC NHẬN",
      icon: <ExclamationCircleOutlined />,
      content: "Xác nhận xóa bài tập này",
      okText: "Xóa",
      cancelText: "Hủy",
      okType: "danger",
      onOk() {
        axios
          .put(env.API_URL + "/delete-problems", {
            id: item.key,
          })
          .then(function (response) {
            successMessage();
            fetchDataProblems();
          })
          .catch(function (error) {
            errorMessage();
            console.log(error);
          });
      },
    });
  };
  const editProblem = () => {
    axios
      .put(env.API_URL + "/update-problems", {
        id: currentKey,
        nameProblem: currentNameProblem,
        contentProblem: currentContentProblem,
        example: currentExample,
        timeLimit: currentTimeLimit,
        memoryLimit: currentMemoryLimit,
        tags: currentTags,
        difficulty: currentDifficulty,
        description: currentDescription,
      })
      .then(function (response) {
        successMessage();
        fetchDataProblems();
        handleCancelModalEditProblem();
      })
      .catch(function (error) {
        console.log(error);
        errorMessage();
      });
  };

  const addTag = () => {
    axios
      .post(env.API_URL + "/tag", {
        nameTag: currentTag,
      })
      .then(function (response) {
        successMessage();
        handleCancelModalAddTag();
        fetchDataTagProblem();
        fetchDataDifficulty();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const addExample = async () => {
    let arr = [];
    if (currentExample) {
      await currentExample.forEach((element) => {
        arr.push(element);
      });
    }
    arr.push({
      input: "",
      output: "",
    });
    setCurrentExample(arr);
  };

  const addTestCase = async () => {
    let arr = [];
    if (currentTestCase) {
      await currentTestCase.forEach((element) => {
        arr.push(element);
      });
    }
    arr.push({
      input: "",
      output: "",
    });
    setCurrentTestCase(arr);
  };
  const updateTestCase = () => {
    axios
      .put(env.API_URL + "/update-testcase-problems", {
        id: currentKey,
        testCase: currentTestCase,
      })
      .then(function (response) {
        successMessage();
        fetchDataProblems();
        handleCancelModalAddTestCase();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <>
      {contextHolder}
      {warningDelete}
      {contextHolderSuccess}
      <Modal
        closeIcon={null}
        open={isModalAddProblem}
        onCancel={handleCancelModalAddProblem}
        footer={null}
        className="justify-center w-[700px] flex"
      >
        <div className="w-[700px] max-w-4xl">
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-base font-bold mb-2">
                Tên vấn đề
              </label>
              <Input
                value={currentNameProblem}
                onChange={(e) => setCurrentNameProblem(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-base font-bold mb-2">
                Nội dung vấn đề
              </label>
              <div className="border-black">
                <Editor
                  value={currentContentProblem}
                  onTextChange={(e) => setCurrentContentProblem(e.htmlValue)}
                  style={{ height: "320px" }}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-base font-bold mb-2">
                Giải thích vấn đề
              </label>
              <div className="border-black">
                <Editor
                  value={currentDescription}
                  onTextChange={(e) => setCurrentDescription(e.htmlValue)}
                  style={{ height: "320px" }}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-base font-bold mb-2">
                Giới hạn thời gian (tính bằng giây):
              </label>
              <Input
                type="number"
                value={currentTimeLimit}
                onChange={(e) => setCurrentTimeLimit(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-base font-bold mb-2">
                Giới hạn bộ nhớ (tính bằng MB):
              </label>
              <Input
                type="number"
                value={currentMemoryLimit}
                onChange={(e) => setCurrentMemoryLimit(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-base font-bold mb-2">
                Thẻ:
              </label>
              <Select
                mode="multiple"
                style={{
                  width: "100%",
                }}
                placeholder="Chọn thẻ"
                onChange={(value) => setCurrentTags(value)}
                options={options}
                value={currentTags}
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-base font-bold mb-2">
                Độ khó:
              </label>
              <Select
                style={{
                  width: "100%",
                }}
                placeholder="Chọn độ khó"
                onChange={(value) => setCurrentDifficulty(Number(value))}
                options={difficulty}
                value={currentDifficulty}
              />
            </div>
          </div>
          {currentExample &&
            currentExample.map((item, index) => (
              <>
                <div className="flex flex-wrap -mx-3 mb-6">
                  <div className="w-full px-3">
                    <label className="block uppercase tracking-wide text-gray-700 text-base font-bold mb-2">
                      Ví dụ {index + 1}
                    </label>
                    <label className="block uppercase tracking-wide text-gray-700 text-base font-bold mb-2">
                      Đầu vào:
                    </label>
                    <Input.TextArea
                      autoSize
                      value={item.input}
                      onChange={(e) => {
                        let arr = [];
                        currentExample.forEach((element, id) => {
                          if (id !== index) {
                            arr.push(element);
                          } else {
                            arr.push({
                              input: e.target.value,
                              output: element.output,
                            });
                          }
                        });
                        setCurrentExample(arr);
                      }}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap -mx-3 mb-6">
                  <div className="w-full px-3">
                    <label className="block uppercase tracking-wide text-gray-700 text-base font-bold mb-2">
                      Đầu ra:
                    </label>
                    <Input.TextArea
                      autoSize
                      value={item.output}
                      onChange={(e) => {
                        let arr = [];
                        currentExample.forEach((element, id) => {
                          if (id !== index) {
                            arr.push(element);
                          } else {
                            arr.push({
                              input: element.input,
                              output: e.target.value,
                            });
                          }
                        });
                        setCurrentExample(arr);
                      }}
                    />
                  </div>
                </div>
              </>
            ))}
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <Button icon={<PlusOutlined />} onClick={addExample} />
            </div>
          </div>
          <div className="flex items-center">
            <Button size="large" onClick={addProblem}>
              Thêm
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        closeIcon={null}
        open={isModalEditProblem}
        onCancel={handleCancelModalEditProblem}
        footer={null}
        className="justify-center w-[700px] flex"
      >
        <div className="w-[700px] max-w-4xl">
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-base font-bold mb-2">
                Tên vấn đề
              </label>
              <Input
                value={currentNameProblem}
                onChange={(e) => setCurrentNameProblem(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-base font-bold mb-2">
                Nội dung vấn đề
              </label>
              <div className="border-black">
                <Editor
                  value={currentContentProblem}
                  onTextChange={(e) => setCurrentContentProblem(e.htmlValue)}
                  style={{ height: "320px" }}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-base font-bold mb-2">
                Giải thích vấn đề
              </label>
              <div className="border-black">
                <Editor
                  value={currentDescription}
                  onTextChange={(e) => setCurrentDescription(e.htmlValue)}
                  style={{ height: "320px" }}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-base font-bold mb-2">
                Giới hạn thời gian (tính bằng giây):
              </label>
              <Input
                type="number"
                value={currentTimeLimit}
                onChange={(e) => setCurrentTimeLimit(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-base font-bold mb-2">
                Giới hạn bộ nhớ (tính bằng MB):
              </label>
              <Input
                type="number"
                value={currentMemoryLimit}
                onChange={(e) => setCurrentMemoryLimit(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-base font-bold mb-2">
                Thẻ:
              </label>
              <Select
                mode="multiple"
                style={{
                  width: "100%",
                }}
                placeholder="Chọn thẻ"
                value={currentTags}
                onChange={(value) => setCurrentTags(value)}
                options={options}
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-base font-bold mb-2">
                Độ khó:
              </label>
              <Select
                showSearch
                style={{
                  width: "100%",
                }}
                placeholder="Chọn độ khó"
                value={currentDifficulty}
                onChange={(value) => setCurrentDifficulty(Number(value))}
                options={difficulty}
              />
            </div>
          </div>
          {currentExample &&
            currentExample.map((item, index) => (
              <>
                <div className="flex flex-wrap -mx-3 mb-6">
                  <div className="w-full px-3">
                    <label className="block uppercase tracking-wide text-gray-700 text-base font-bold mb-2">
                      Ví dụ {index + 1}
                    </label>
                    <label className="block uppercase tracking-wide text-gray-700 text-base font-bold mb-2">
                      Đầu vào:
                    </label>
                    <Input.TextArea
                      autoSize
                      value={item.input}
                      onChange={(e) => {
                        let arr = [];
                        currentExample.forEach((element, id) => {
                          if (id !== index) {
                            arr.push(element);
                          } else {
                            arr.push({
                              input: e.target.value,
                              output: element.output,
                            });
                          }
                        });
                        setCurrentExample(arr);
                      }}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap -mx-3 mb-6">
                  <div className="w-full px-3">
                    <label className="block uppercase tracking-wide text-gray-700 text-base font-bold mb-2">
                      Đầu ra:
                    </label>
                    <Input.TextArea
                      autoSize
                      value={item.output}
                      onChange={(e) => {
                        let arr = [];
                        currentExample.forEach((element, id) => {
                          if (id !== index) {
                            arr.push(element);
                          } else {
                            arr.push({
                              input: element.input,
                              output: e.target.value,
                            });
                          }
                        });
                        setCurrentExample(arr);
                      }}
                    />
                  </div>
                </div>
              </>
            ))}
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <Button icon={<PlusOutlined />} onClick={addExample} />
            </div>
          </div>
          <div className="flex items-center">
            <Button size="large" onClick={editProblem}>
              Cập nhật
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        closeIcon={null}
        open={isModalDetailProblem}
        onCancel={handleCancelModalDetailProblem}
        footer={null}
        className="justify-center w-[700px] flex"
      >
        <div className="w-[700px]">
          <div className="justify-center items-center flex flex-col">
            <div className="text-3xl mb-3">{currentNameProblem}</div>
            <div className="text-xl">
              <span className="font-bold">Giới hạn thời gian:</span>{" "}
              {currentTimeLimit} giây
            </div>
            <div className="text-xl">
              <span className="font-bold">Giới hạn bộ nhớ:</span>{" "}
              {currentMemoryLimit}MB
            </div>
            <div className="text-xl">
              <span className="font-bold">Độ khó:</span> {currentDifficulty}
            </div>
            <div className="text-xl">
              <span className="font-bold">Thẻ:</span>{" "}
              {currentTags &&
                currentTags.map((item, index) => (
                  <Tag color="cyan">{item}</Tag>
                ))}
            </div>
          </div>
          <Divider />
          <div
            dangerouslySetInnerHTML={{
              __html: currentContentProblem,
            }}
            className="mb-3"
          ></div>
          {currentExample &&
            currentExample.map((item, index) => (
              <>
                <div className="font-bold mb-3">Ví dụ {index + 1}</div>
                <div className="font-bold">Đầu vào:</div>
                <div className="relative">
                  <Input.TextArea
                    readOnly
                    autoSize
                    value={item.input}
                    className="mb-3 py-5"
                  ></Input.TextArea>
                  <CopyToClipboard text={item.input}>
                    <Button
                      icon={<CopyOutlined />}
                      type="dashed"
                      className="absolute top-0 right-0"
                      onClick={() =>
                        openNotificationWithIcon("success", "bottomRight")
                      }
                    >
                      Copy
                    </Button>
                  </CopyToClipboard>
                </div>
                <div className="font-bold mb-3">Đầu ra:</div>
                <div className="relative">
                  <Input.TextArea
                    readOnly
                    autoSize
                    value={item.output}
                    className="mb-3 py-5"
                  ></Input.TextArea>
                  <CopyToClipboard text={item.output}>
                    <Button
                      icon={<CopyOutlined />}
                      type="dashed"
                      className="absolute top-0 right-0"
                      onClick={() => openNotificationWithIcon("success")}
                    >
                      Copy
                    </Button>
                  </CopyToClipboard>
                </div>
              </>
            ))}
          {currentDescription && (
            <>
              <div className="font-bold mb-3">Giải thích:</div>
              <div
                dangerouslySetInnerHTML={{
                  __html: currentDescription,
                }}
                className="mb-3"
              ></div>
            </>
          )}
        </div>
      </Modal>
      <Modal
        closeIcon={null}
        open={isModalAddTag}
        onCancel={handleCancelModalAddTag}
        footer={null}
        className="justify-center w-full"
      >
        <div className="w-full max-w-4xl">
          <div className="w-full px-3">
            <label className="block uppercase tracking-wide text-gray-700 text-base font-bold mb-2">
              Tên dạng bài:
            </label>
            <Input
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
            />
            <div className="flex items-center justify-center mt-5">
              <Button size="large" onClick={addTag}>
                Thêm
              </Button>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        closeIcon={null}
        open={isModalAddTestCase}
        onCancel={handleCancelModalAddTestCase}
        footer={null}
        className="justify-center w-[700px] flex"
      >
        <div className="w-[700px] max-w-4xl">
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-base font-bold mb-2">
                Tên vấn đề
              </label>
              <Input readOnly value={currentNameProblem} />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-base font-bold mb-2">
                Các trường hợp thử nghiệm:
              </label>
            </div>
          </div>
          {currentTestCase &&
            currentTestCase.map((item, index) => (
              <>
                <div className="flex flex-wrap -mx-3 mb-6">
                  <div className="w-full px-3">
                    <label className="block uppercase tracking-wide text-gray-700 text-base font-bold mb-2">
                      Test case {index + 1}
                    </label>
                    <label className="block uppercase tracking-wide text-gray-700 text-base font-bold mb-2">
                      Đầu vào:
                    </label>
                    <Input.TextArea
                      autoSize
                      value={item.input}
                      onChange={(e) => {
                        let arr = [];
                        currentTestCase.forEach((element, id) => {
                          if (id !== index) {
                            arr.push(element);
                          } else {
                            arr.push({
                              input: e.target.value,
                              output: element.output,
                            });
                          }
                        });
                        setCurrentTestCase(arr);
                      }}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap -mx-3 mb-6">
                  <div className="w-full px-3">
                    <label className="block uppercase tracking-wide text-gray-700 text-base font-bold mb-2">
                      Đầu ra:
                    </label>
                    <Input.TextArea
                      autoSize
                      value={item.output}
                      onChange={(e) => {
                        let arr = [];
                        currentTestCase.forEach((element, id) => {
                          if (id !== index) {
                            arr.push(element);
                          } else {
                            arr.push({
                              input: element.input,
                              output: e.target.value,
                            });
                          }
                        });
                        setCurrentTestCase(arr);
                      }}
                    />
                  </div>
                </div>
              </>
            ))}
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <Button icon={<PlusOutlined />} onClick={addTestCase} />
            </div>
          </div>
          <div className="flex items-center justify-center">
            <Button size="large" onClick={updateTestCase}>
              Cập nhật
            </Button>
          </div>
        </div>
      </Modal>
      <FloatButton.Group>
        <FloatButton
          tooltip={<div>Thêm dạng bài mới</div>}
          icon={<PlusSquareFilled />}
          onClick={showModalAddTag}
        />
        <FloatButton
          tooltip={<div>Thêm bài tập mới</div>}
          icon={<PlusOutlined />}
          onClick={showModalAddProblem}
        />
        <FloatButton
          badge={{ count: 5 }}
          tooltip={<div>Bài tập chưa được duyệt</div>}
        />
      </FloatButton.Group>
      <Table columns={columns} dataSource={dataProblem} />
    </>
  );
}
