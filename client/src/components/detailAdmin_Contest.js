import Highlighter from "react-highlight-words";
import React, { useRef, useState, useEffect } from "react";
import {
  SearchOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
  ExceptionOutlined,
} from "@ant-design/icons";
import {
  Input,
  Button,
  Space,
  Table,
  FloatButton,
  Modal,
  message,
  Tag,
  Select,
  InputNumber,
  DatePicker,
} from "antd";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import { Editor } from "primereact/editor";

import axios from "axios";

import * as env from "../env.js";
import shortid from "shortid";
import moment from "moment";

export default function DetailContest() {
  dayjs.extend(customParseFormat);
  // const user = localStorage.getItem("dataUser")
  //   ? JSON.parse(localStorage.getItem("dataUser"))
  //   : null;
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

  const Row = (props) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({
      id: props["data-row-key"],
    });
    const style = {
      ...props.style,
      transform: CSS.Transform.toString(
        transform && {
          ...transform,
          scaleY: 1,
        }
      ),
      transition,
      cursor: "move",
      ...(isDragging
        ? {
            position: "relative",
            zIndex: 9999,
          }
        : {}),
    };
    return (
      <tr
        {...props}
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
      />
    );
  };
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        // https://docs.dndkit.com/api-documentation/sensors/pointer#activation-constraints
        distance: 1,
      },
    })
  );
  const onDragEnd = ({ active, over }) => {
    if (active.id !== over?.id) {
      setProblems((prev) => {
        const activeIndex = prev.findIndex((i) => i.idProblem === active.id);
        const overIndex = prev.findIndex((i) => i.idProblem === over?.id);
        return arrayMove(prev, activeIndex, overIndex);
      });
    }
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
          placeholder={`TÌm kiếm`}
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
      dataIndex: "idContest",
      key: "idContest",
      width: "10%",
      align: "center",
      ...getColumnSearchProps("idContest"),
    },
    {
      title: "Tên cuộc thi",
      dataIndex: "nameContest",
      key: "nameContest",
      width: "20%",
      align: "center",
      ...getColumnSearchProps("nameContest"),
    },
    {
      title: "Người viết đề",
      dataIndex: "writer",
      key: "writer",
      width: "20%",
      align: "center",
      render: (_, { writer }) => (
        <>
          {writer &&
            writer.map((writer) => {
              return <Tag color="purple">{writer}</Tag>;
            })}
        </>
      ),
    },
    {
      title: "Bắt đầu",
      dataIndex: "timeStart",
      key: "timeStart",
      width: "13%",
      align: "center",
      ...getColumnSearchProps("timeStart"),
    },
    {
      title: "Thời gian",
      dataIndex: "lengthTime",
      key: "lengthTime",
      width: "12%",
      align: "center",
      render: (_, { lengthTime }) => (
        <>
          {parseInt(lengthTime / 1440) !== 0 && (
            <span>
              {parseInt(parseInt(lengthTime / 1440) / 10) !== 0
                ? parseInt(lengthTime / 1440)
                : "0".concat(parseInt(lengthTime / 1440))}
              :
            </span>
          )}
          <span>
            {parseInt(parseInt((lengthTime % 1440) / 60) / 10) !== 0
              ? parseInt((lengthTime % 1440) / 60)
              : "0".concat(parseInt((lengthTime % 1440) / 60))}
            :
            {parseInt(parseInt((lengthTime % 1440) % 60) / 10) !== 0
              ? parseInt((lengthTime % 1440) % 60)
              : "0".concat(parseInt((lengthTime % 1440) % 60))}
          </span>
        </>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      render: (item) => (
        <Select
          value="Chọn hành động"
          style={{ width: "70%" }}
          options={[
            {
              value: "Delete",
              label: (
                <Button
                  type="primary"
                  danger
                  onClick={() => deleteContest({ item: item })}
                  className="w-full"
                >
                  Xóa
                </Button>
              ),
            },
            {
              value: "Edit",
              label: (
                <Button
                  className="bg-sky-500	text-white hover:bg-sky-300 w-full"
                  onClick={() => {
                    setIdContest(item.idContest);
                    setNameContest(item.nameContest);
                    setWriter(item.writer);
                    setTimeStart(item.timeStart);
                    setLengthTime(item.lengthTime);
                    setProblems(item.problems);
                    setSearchProblem("");
                    showModalEditContest();
                  }}
                >
                  Chỉnh sửa
                </Button>
              ),
            },
            {
              value: "Detail",
              label: (
                <Button
                  className="w-full"
                  type="dashed"
                  onClick={() => {
                    setNameContest(item.nameContest);
                    setWriter(item.writer);
                    setTimeStart(item.timeStart);
                    setLengthTime(item.lengthTime);
                    setProblems(item.problems);
                    showModalDetailContest();
                  }}
                >
                  Chi tiết
                </Button>
              ),
            },
          ]}
        ></Select>
      ),
    },
  ];
  const columnProblems = [
    {
      title: "#",
      dataIndex: "typeProblem",
      key: "typeProblem",
      align: "center",
      width: "5%",
      render: (_, __, index) => <>{String.fromCharCode(index + 65)}</>,
    },
    {
      title: "ID",
      dataIndex: "idProblem",
      key: "idProblem",
      align: "center",
      width: "15%",
    },
    {
      title: "Tên bài tập",
      dataIndex: "nameProblem",
      key: "nameProblem",
      align: "center",
      width: "30%",
      ellipsis: true,
    },
    {
      title: "Dạng bài",
      dataIndex: "tags",
      key: "tags",
      align: "center",
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
      title: "Độ khó",
      key: "difficulty",
      dataIndex: "difficulty",
      align: "center",
      width: "10%",
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      render: (_, __, index) => (
        <Button
          type="primary"
          danger
          onClick={() => deleteProblem({ index: index })}
          className="w-full justify-center items-center flex"
        >
          Xóa
        </Button>
      ),
    },
  ];
  const columnRulesTemplate = [
    {
      title: "Nội dung",
      key: "content",
      width: "80%",
      render: (item, _, index) => {
        if (item.edit) {
          return (
            <Editor
              value={item.content}
              onTextChange={async (e) => {
                let arr = [];
                await dataRulesContestCopy.forEach((element, id) => {
                  if (id === index) {
                    arr.push({
                      ...element,
                      content: e.htmlValue,
                    });
                  } else {
                    arr.push(element);
                  }
                });
                setDataRulesContestCopy(arr);
              }}
              style={{ height: "200px" }}
            />
          );
        } else {
          return <div dangerouslySetInnerHTML={{ __html: item.content }}></div>;
        }
      },
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      render: (_, __, index) => (
        <Space>
          {!_.edit && (
            <Button
              type="primary"
              danger
              onClick={() => deleteRulesContest({ id: index })}
              className="w-full justify-center items-center flex"
            >
              Xóa
            </Button>
          )}
          {_.edit ? (
            <Button
              type="dashed"
              onClick={() => disableEditRulesContest({ id: index })}
              className="w-full justify-center items-center flex"
            >
              Xong
            </Button>
          ) : (
            <Button
              type="dashed"
              onClick={() => enableEditRulesContest({ id: index })}
              className="w-full justify-center items-center flex"
            >
              Chỉnh sửa
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const [dataContests, setDataContests] = useState([]);
  const [dataProblems, setDataProblems] = useState([]);
  const [dataRulesContest, setDataRulesContest] = useState([]);
  const [dataRulesContestCopy, setDataRulesContestCopy] = useState([]);
  const [allUser, setAllUser] = useState([]);

  const [idContest, setIdContest] = useState("");
  const [nameContest, setNameContest] = useState("");
  const [writer, setWriter] = useState([]);
  const [timeStart, setTimeStart] = useState("");
  const [lengthTime, setLengthTime] = useState(0);
  const [problems, setProblems] = useState([]);
  const [rules, setRules] = useState("");
  const [optionsProblems, setOptionsProblems] = useState([]);
  const [searchProblem, setSearchProblem] = useState("");
  const [valueAddRulesContest, setValueAddRulesContest] = useState("");
  const [optionsRulesContest, setOptionsRulesContest] = useState([]);

  const clearData = () => {
    setNameContest("");
    setWriter([]);
    setTimeStart(dayjs().format("DD/MM/YYYY HH:mm"));
    setLengthTime(0);
    setProblems([]);
    setRules("");
    setSearchProblem("");
  };

  const deleteProblem = async ({ index }) => {
    let arr = [];
    await problems.forEach((element, id) => {
      if (id !== index) {
        arr.push(element);
      }
    });
    setProblems(arr);
  };

  const fetchDataContests = () => {
    axios
      .get(env.API_URL + "/contest", {})
      .then(function (response) {
        setDataContests(
          response.data.dataContests.sort(function (a, b) {
            if (
              moment(a.timeStart, "DD/MM/YYYY HH:mm").isBefore(
                moment(b.timeStart, "DD/MM/YYYY HH:mm")
              )
            ) {
              return -1;
            } else if (
              moment(a.timeStart, "DD/MM/YYYY HH:mm").isAfter(
                moment(b.timeStart, "DD/MM/YYYY HH:mm")
              )
            ) {
              return 1;
            } else {
              return 0;
            }
          })
        );
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const fetchDataProblems = () => {
    axios
      .get(env.API_URL + "/problems", {})
      .then(async (response) => {
        setDataProblems(response.data.dataProblems);
        let arr = [];
        await response.data.dataProblems.forEach((element, index) => {
          arr.push({
            value: element.idProblem,
            label: element.idProblem + " - " + element.nameProblem,
          });
        });
        setOptionsProblems(arr);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const fetchRulesContest = () => {
    axios
      .get(env.API_URL + "/rulesContest", {})
      .then(async (response) => {
        let arr = [];
        await response.data.dataRulesContests.forEach((element) => {
          arr.push({
            ...element,
            edit: false,
          });
        });
        setDataRulesContest(arr.reverse());
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const getAllUser = () => {
    axios
      .get(env.API_URL + "/account", {})
      .then(async (response) => {
        let arr = [];
        await response.data.dataAccounts.forEach((element) => {
          arr.push({
            label: element.username,
            value: element.username,
          });
        });
        setAllUser(arr);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const addProblem = async () => {
    if (searchProblem) {
      let currentProblems = [];
      await problems.forEach((element) => {
        currentProblems.push(element);
      });
      let problem = await dataProblems.filter(
        (x) => x.idProblem === searchProblem
      )[0];
      await currentProblems.push(problem);
      setProblems(currentProblems);
    }
  };

  useEffect(() => {
    fetchDataContests();
    fetchDataProblems();
    fetchRulesContest();
    getAllUser();
  }, []);

  const [isModalAddContest, setIsModalAddContest] = useState(false);
  const showModalAddContest = async () => {
    clearData();
    let arr = [];
    await dataRulesContest.forEach((element) => {
      arr.push({
        label: (
          <div dangerouslySetInnerHTML={{ __html: element.content }}></div>
        ),
        value: element.content,
      });
    });
    setOptionsRulesContest(arr);
    setIsModalAddContest(true);
  };
  const handleCancelModalAddContest = () => {
    clearData();
    setIsModalAddContest(false);
  };

  const [isModalEditContest, setIsModalEditContest] = useState(false);
  const showModalEditContest = () => {
    setIsModalEditContest(true);
  };
  const handleCancelModalEditContest = () => {
    clearData();
    setIsModalEditContest(false);
  };

  const [isModalDetailContest, setIsModalDetailContest] = useState(false);
  const showModalDetailContest = () => {
    setIsModalDetailContest(true);
  };
  const handleCancelModalDetailContest = () => {
    setIsModalDetailContest(false);
  };

  const [isModalRulesTemplate, setIsModalRulesTemplate] = useState(false);
  const showModalRulesTemplate = () => {
    setDataRulesContestCopy(dataRulesContest);
    setIsModalRulesTemplate(true);
  };
  const handleCancelModalRulesTemplate = async () => {
    await fetchRulesContest();
    setDataRulesContestCopy([]);
    setValueAddRulesContest("");
    setIsModalRulesTemplate(false);
  };

  const addContest = () => {
    axios
      .post(env.API_URL + "/contest", {
        idContest: shortid.generate(),
        nameContest: nameContest,
        writer: writer,
        timeStart: timeStart,
        lengthTime: lengthTime,
        problems: problems,
      })
      .then(function (response) {
        fetchDataContests();
        successMessage();
        handleCancelModalAddContest();
      })
      .catch(function (error) {
        console.log(error);
        errorMessage();
      });
  };
  const [modal, warningDelete] = Modal.useModal();
  const deleteContest = ({ item }) => {
    modal.confirm({
      title: "XÁC NHẬN",
      icon: <ExclamationCircleOutlined />,
      content: "Xác nhận xóa cuộc thi này",
      okText: "Xóa",
      cancelText: "Hủy",
      okType: "danger",
      onOk() {
        axios
          .put(env.API_URL + "/delete-contest", {
            id: item.idContest,
          })
          .then(function (response) {
            successMessage();
            fetchDataContests();
          })
          .catch(function (error) {
            errorMessage();
            console.log(error);
          });
      },
    });
  };
  const editContest = () => {
    axios
      .put(env.API_URL + "/update-contest", {
        id: idContest,
        nameContest: nameContest,
        writer: writer,
        timeStart: timeStart,
        lengthTime: lengthTime,
        problems: problems,
      })
      .then(function (response) {
        successMessage();
        fetchDataContests();
        handleCancelModalEditContest();
      })
      .catch(function (error) {
        console.log(error);
        errorMessage();
      });
  };

  const addRulesContest = async () => {
    let arr = [];
    await dataRulesContestCopy.forEach((element) => {
      arr.push(element);
    });
    arr.push({
      _id: shortid.generate(),
      content: valueAddRulesContest,
    });
    setDataRulesContestCopy(arr);
    setValueAddRulesContest("");
  };

  const deleteRulesContest = async ({ id }) => {
    modal.confirm({
      title: "XÁC NHẬN",
      icon: <ExclamationCircleOutlined />,
      content: "Xác nhận xóa mẫu này",
      okText: "Xóa",
      cancelText: "Hủy",
      okType: "danger",
      onOk: async () => {
        let arr = [];
        await dataRulesContestCopy.forEach((element, index) => {
          if (id !== index) {
            arr.push(element);
          }
        });
        setDataRulesContestCopy(arr);
      },
    });
  };
  const enableEditRulesContest = async ({ id }) => {
    let arr = [];
    await dataRulesContestCopy.forEach((element, index) => {
      if (id !== index) {
        arr.push(element);
      } else {
        arr.push({
          ...element,
          edit: true,
        });
      }
    });
    setDataRulesContestCopy(arr);
  };
  const disableEditRulesContest = async ({ id }) => {
    let arr = [];
    await dataRulesContestCopy.forEach((element, index) => {
      if (id !== index) {
        arr.push(element);
      } else {
        arr.push({
          ...element,
          edit: false,
        });
      }
    });
    setDataRulesContestCopy(arr);
  };

  const filterUpdateRules = async () => {
    await dataRulesContestCopy.forEach(async (element) => {
      if (dataRulesContest.filter((x) => x._id === element._id).length > 0) {
        await axios
          .put(env.API_URL + "/update-rulesContest", {
            id: element._id,
            content: element.content,
          })
          .then(function (response) {})
          .catch(function (error) {
            console.log(error);
          });
      } else {
        await axios
          .post(env.API_URL + "/rulesContest", {
            content: element.content,
          })
          .then(function (response) {})
          .catch(function (error) {
            console.log(error);
          });
      }
    });
    await dataRulesContest.forEach(async (element) => {
      if (
        dataRulesContestCopy.filter((x) => x._id === element._id).length === 0
      ) {
        await axios
          .put(env.API_URL + "/delete-rulesContest", {
            id: element._id,
          })
          .then(function (response) {})
          .catch(function (error) {
            console.log(error);
          });
      }
    });
    successMessage();
    handleCancelModalRulesTemplate();
  };
  const updateRulesContest = () => {
    modal.confirm({
      title: "XÁC NHẬN",
      icon: <ExclamationCircleOutlined />,
      content: "Xác nhận cập nhật các mẫu hiện tại",
      okText: "Xác nhận",
      cancelText: "Hủy",
      okType: "dashed",
      onOk() {
        filterUpdateRules();
      },
    });
  };

  return (
    <>
      {contextHolder}
      {warningDelete}
      <Modal
        closeIcon={null}
        open={isModalAddContest}
        onCancel={handleCancelModalAddContest}
        footer={null}
        className="justify-center w-[800px] flex"
      >
        <div className="w-[800px]">
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-base font-bold mb-2">
                Tên cuộc thi
              </label>
              <Input
                value={nameContest}
                onChange={(e) => setNameContest(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-base font-bold mb-2">
                Các tác giả
              </label>
              <Select
                mode="multiple"
                style={{
                  width: "100%",
                }}
                placeholder="Chọn tác giả"
                value={writer}
                onChange={(e) => setWriter(e)}
                options={allUser}
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-base font-bold mb-2">
                Bắt đầu cuộc thi{" "}
              </label>
              <DatePicker
                showNow={false}
                placeholder="Chọn thời gian"
                className="w-full"
                showTime={{
                  format: "HH:mm",
                }}
                format="DD/MM/YYYY HH:mm"
                value={dayjs(timeStart, "DD/MM/YYYY HH:mm")}
                onChange={(value, dateString) => {
                  setTimeStart(dateString);
                }}
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-base font-bold mb-2">
                Thời lượng cuộc thi{" "}
                <span className="text-red-500">(Chỉ nhập số phút)</span>
              </label>
              <InputNumber
                className="w-full"
                value={lengthTime}
                onChange={(e) => setLengthTime(Number(e))}
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-base font-bold mb-2">
                Thể lệ cuộc thi
              </label>
              <label className="block tracking-wide text-gray-700 text-base font-bold mb-2">
                Chọn mẫu hoặc tự viết
              </label>
              <Select
                className="w-full mb-2"
                placeholder="Chọn mẫu"
                options={optionsRulesContest}
                value={"Chọn mẫu"}
                onChange={(e) => setRules(e)}
              />
              <Editor
                value={rules}
                onTextChange={(e) => setRules(e.htmlValue)}
                style={{ height: "320px" }}
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-base font-bold mb-2">
                Các vấn đề
              </label>
              {problems.length > 0 ? (
                <DndContext
                  sensors={sensors}
                  modifiers={[restrictToVerticalAxis]}
                  onDragEnd={onDragEnd}
                >
                  <SortableContext
                    // rowKey array
                    items={problems.map((i) => i.idProblem)}
                    strategy={verticalListSortingStrategy}
                  >
                    <Table
                      components={{
                        body: {
                          row: Row,
                        },
                      }}
                      rowKey="idProblem"
                      pagination={false}
                      columns={columnProblems}
                      dataSource={problems}
                      footer={() => (
                        <>
                          {problems.length < 26 && (
                            <Space>
                              <div className="flex flex-wrap -mx-3">
                                <div className="w-full px-3">
                                  <Button
                                    icon={<PlusOutlined />}
                                    onClick={addProblem}
                                  />
                                </div>
                              </div>
                              <Select
                                className="w-[500px]"
                                showSearch
                                placeholder="Tìm kiếm vấn đề"
                                filterOption={(input, option) =>
                                  (option?.label ?? "").includes(input)
                                }
                                value={searchProblem}
                                onChange={(e) => setSearchProblem(e)}
                                options={optionsProblems}
                              />
                            </Space>
                          )}
                        </>
                      )}
                    />
                  </SortableContext>
                </DndContext>
              ) : (
                <Table
                  components={{
                    body: {
                      row: () => {
                        return;
                      },
                    },
                  }}
                  columns={columnProblems}
                  footer={() => (
                    <>
                      <Space>
                        <div className="flex flex-wrap -mx-3">
                          <div className="w-full px-3">
                            <Button
                              icon={<PlusOutlined />}
                              onClick={addProblem}
                            />
                          </div>
                        </div>
                        <Select
                          className="w-[500px]"
                          showSearch
                          placeholder="Tìm kiếm vấn đề"
                          filterOption={(input, option) =>
                            (option?.label ?? "").includes(input)
                          }
                          value={searchProblem}
                          onChange={(e) => setSearchProblem(e)}
                          options={optionsProblems}
                        />
                      </Space>
                    </>
                  )}
                />
              )}
            </div>
          </div>
          <div className="flex items-center justify-center">
            <Button size="large" onClick={addContest}>
              Thêm
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        closeIcon={null}
        open={isModalEditContest}
        onCancel={handleCancelModalEditContest}
        footer={null}
        className="justify-center w-[800px] flex"
      >
        <div className="w-[800px]">
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-base font-bold mb-2">
                Tên cuộc thi
              </label>
              <Input
                value={nameContest}
                onChange={(e) => setNameContest(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-base font-bold mb-2">
                Các tác giả
              </label>
              <Select
                mode="multiple"
                style={{
                  width: "100%",
                }}
                placeholder="Chọn tác giả"
                value={writer}
                onChange={(e) => setWriter(e)}
                options={allUser}
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-base font-bold mb-2">
                Bắt đầu cuộc thi{" "}
              </label>
              <DatePicker
                placeholder="Chọn thời gian"
                className="w-full"
                showTime={{
                  format: "HH:mm",
                }}
                format="DD/MM/YYYY HH:mm"
                value={dayjs(timeStart, "DD/MM/YYYY HH:mm")}
                onChange={(value, dateString) => {
                  setTimeStart(dateString);
                }}
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-base font-bold mb-2">
                Thời lượng cuộc thi{" "}
                <span className="text-red-500">(Chỉ nhập số phút)</span>
              </label>
              <InputNumber
                className="w-full"
                value={lengthTime}
                onChange={(e) => setLengthTime(Number(e))}
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-base font-bold mb-2">
                Các vấn đề
              </label>
              {problems.length > 0 ? (
                <DndContext
                  sensors={sensors}
                  modifiers={[restrictToVerticalAxis]}
                  onDragEnd={onDragEnd}
                >
                  <SortableContext
                    // rowKey array
                    items={problems.map((i) => i.idProblem)}
                    strategy={verticalListSortingStrategy}
                  >
                    <Table
                      components={{
                        body: {
                          row: Row,
                        },
                      }}
                      rowKey="idProblem"
                      columns={columnProblems}
                      dataSource={problems}
                      footer={() => (
                        <>
                          {problems.length < 26 && (
                            <Space>
                              <div className="flex flex-wrap -mx-3">
                                <div className="w-full px-3">
                                  <Button
                                    icon={<PlusOutlined />}
                                    onClick={addProblem}
                                  />
                                </div>
                              </div>
                              <Select
                                className="w-[500px]"
                                showSearch
                                placeholder="Tìm kiếm vấn đề"
                                filterOption={(input, option) =>
                                  (option?.label ?? "").includes(input)
                                }
                                value={searchProblem}
                                onChange={(e) => setSearchProblem(e)}
                                options={optionsProblems}
                              />
                            </Space>
                          )}
                        </>
                      )}
                    />
                  </SortableContext>
                </DndContext>
              ) : (
                <Table
                  components={{
                    body: {
                      row: () => {
                        return;
                      },
                    },
                  }}
                  columns={columnProblems}
                  footer={() => (
                    <>
                      <Space>
                        <div className="flex flex-wrap -mx-3">
                          <div className="w-full px-3">
                            <Button
                              icon={<PlusOutlined />}
                              onClick={addProblem}
                            />
                          </div>
                        </div>
                        <Select
                          className="w-[500px]"
                          showSearch
                          placeholder="Tìm kiếm vấn đề"
                          filterOption={(input, option) =>
                            (option?.label ?? "").includes(input)
                          }
                          value={searchProblem}
                          onChange={(e) => setSearchProblem(e)}
                          options={optionsProblems}
                        />
                      </Space>
                    </>
                  )}
                />
              )}
            </div>
          </div>
          <div className="flex items-center justify-center">
            <Button size="large" onClick={editContest}>
              Cập nhật
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        closeIcon={null}
        open={isModalDetailContest}
        onCancel={handleCancelModalDetailContest}
        footer={null}
        className="justify-center w-full"
      ></Modal>
      <Modal
        closeIcon={null}
        open={isModalRulesTemplate}
        onCancel={handleCancelModalRulesTemplate}
        footer={null}
        className="justify-center w-[800px] flex"
      >
        <div className="w-[800px]">
          <Table
            columns={columnRulesTemplate}
            dataSource={dataRulesContestCopy}
            footer={(data) => (
              <>
                <Space>
                  <div className="flex flex-wrap -mx-3">
                    <div className="w-full px-3">
                      <Button
                        icon={<PlusOutlined />}
                        onClick={addRulesContest}
                        title="Thêm mẫu"
                      />
                    </div>
                  </div>
                  <Editor
                    value={valueAddRulesContest}
                    onTextChange={(e) => setValueAddRulesContest(e.htmlValue)}
                    style={{ height: "200px" }}
                  />
                </Space>
              </>
            )}
          />
          <div className="flex items-center justify-center">
            <Button size="large" onClick={updateRulesContest}>
              Cập nhật
            </Button>
          </div>
        </div>
      </Modal>
      <FloatButton.Group>
        <FloatButton
          tooltip={<div>Mẫu thể lệ</div>}
          icon={<ExceptionOutlined />}
          onClick={showModalRulesTemplate}
        />
        <FloatButton
          tooltip={<div>Thêm cuộc thi mới</div>}
          icon={<PlusOutlined />}
          onClick={showModalAddContest}
        />
        <FloatButton
          badge={{ count: 5 }}
          tooltip={<div>Cuộc thi chưa được duyệt</div>}
        />
      </FloatButton.Group>
      <Table columns={columns} dataSource={dataContests} />
    </>
  );
}
