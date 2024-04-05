import React, { useState, useRef } from "react";
import {
  Layout,
  theme,
  Space,
  Table,
  Tag,
  Button,
  Input,
  Slider,
  Select,
  Checkbox,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import axios from "axios";

import * as env from "../env.js";

import HeaderPage from "../components/header.js";
import FooterPage from "../components/footer.js";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import moment from "moment";

const { Content } = Layout;

export default function Problem({ currentTab, setInfoProblem }) {
  const [hiddenTag, setHiddenTag] = useState(
    localStorage.getItem("hiddenTagProblem")
      ? JSON.parse(localStorage.getItem("hiddenTagProblem"))
      : null
  );
  const [hiddenAcceptedProblem, setHiddenAcceptedProblem] = useState(
    localStorage.getItem("hiddenAcceptedProblem")
      ? JSON.parse(localStorage.getItem("hiddenAcceptedProblem"))
      : null
  );
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
  const user = localStorage.getItem("dataUser")
    ? JSON.parse(localStorage.getItem("dataUser"))
    : null;
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const columns = [
    {
      title: "ID",
      dataIndex: "idProblem",
      key: "idProblem",
      width: "15%",
      align: "center",
      ...getColumnSearchProps("idProblem"),
      render: (_, text) => (
        <Link
          to={"/problems/".concat(text.idProblem)}
          onClick={() => setInfoProblem(text)}
        >
          {text.idProblem}
        </Link>
      ),
    },
    {
      title: "Tên bài tập",
      dataIndex: "nameProblem",
      key: "nameProblem",
      width: "25%",
      ...getColumnSearchProps("nameProblem"),
      ellipsis: true,
      render: (_, text) => (
        <Link
          to={"/problems/".concat(text.idProblem)}
          onClick={() => setInfoProblem(text)}
        >
          {text.nameProblem}
        </Link>
      ),
    },
    {
      title: "Dạng bài",
      dataIndex: "tags",
      key: "tags",
      width: "40%",
      render: (_, { tags }) => (
        <>
          {!hiddenTag &&
            tags.map((tag) => {
              return <Tag color="cyan">{tag}</Tag>;
            })}
        </>
      ),
    },
    {
      title: "Độ khó",
      key: "difficulty",
      dataIndex: "difficulty",
      width: "10%",
      align: "center",
      sorter: (a, b) => a.difficulty - b.difficulty,
    },
    {
      title: "Số AC",
      key: "numberSolved",
      dataIndex: "numberSolved",
      align: "center",
      sorter: (a, b) => a.numberSolved - b.numberSolved,
    },
  ];
  const [dataProblem, setDataProblem] = useState([]);
  const [dataTag, setDataTag] = useState([]);
  const fetchDataProblem = ({ state }) => {
    axios
      .get(env.API_URL + "/problems", {})
      .then(function (responseProblem) {
        axios
          .get(env.API_URL + "/submission", {})
          .then(function (responseSubmission) {
            let arr = [];
            responseProblem.data.dataProblems.forEach((ele) => {
              if (state) {
                if (
                  ele.solved.filter((x) => x === user._id).length === 0 &&
                  ele.public
                ) {
                  arr.push({
                    _id: ele._id,
                    idProblem: ele.idProblem,
                    nameProblem: ele.nameProblem,
                    contentProblem: ele.contentProblem,
                    tags: ele.tags,
                    example: ele.example,
                    difficulty: ele.difficulty,
                    solved: ele.solved,
                    numberSolved: ele.solved.filter(
                      (x, index) => ele.solved.indexOf(x) === index
                    ).length,
                    timeLimit: ele.timeLimit,
                    memoryLimit: ele.memoryLimit,
                    description: ele.description,
                    testCase: ele.testCase,
                    idContest: ele.idContest,
                  });
                }
              } else if (ele.public) {
                arr.push({
                  _id: ele._id,
                  idProblem: ele.idProblem,
                  nameProblem: ele.nameProblem,
                  contentProblem: ele.contentProblem,
                  tags: ele.tags,
                  example: ele.example,
                  difficulty: ele.difficulty,
                  solved: ele.solved,
                  numberSolved: ele.solved.filter(
                    (x, index) => ele.solved.indexOf(x) === index
                  ).length,
                  timeLimit: ele.timeLimit,
                  memoryLimit: ele.memoryLimit,
                  description: ele.description,
                  testCase: ele.testCase,
                  idContest: ele.idContest,
                });
              }
            });
            setDataProblem(arr.reverse());
          })
          .catch(function (error) {
            console.log(error);
          });
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const fetchTagProblem = () => {
    axios
      .get(env.API_URL + "/tag", {})
      .then(function (response) {
        let arr = [];
        response.data.dataTagProblems.forEach((element) => {
          arr.push({
            label: element.nameTag,
            value: element.nameTag,
          });
        });
        setDataTag(arr);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  useEffect(() => {
    axios
      .get(env.API_URL + "/contest", {})
      .then(function (responseContest) {
        axios
          .get(env.API_URL + "/problems", {})
          .then(async (responseProblem) => {
            let arr = await responseProblem.data.dataProblems.filter(
              (x) => x.public === false
            );
            await arr.forEach(async (element, index) => {
              let contest = await responseContest.data.dataContests.filter(
                (x) =>
                  element.idContest.includes(x.idContest) &&
                  moment().isAfter(
                    moment(x.timeStart, "DD/MM/YYYY HH:mm").add(
                      x.lengthTime,
                      "minutes"
                    )
                  )
              );
              if (
                contest.length > 0 &&
                moment(contest[0].timeStart, "DD/MM/YYYY HH:mm")
                  .add(contest[0].lengthTime, "minutes")
                  .isBefore(moment())
              ) {
                await axios
                  .put(env.API_URL + "/update-status-problems", {
                    id: element.idProblem,
                    public: true,
                  })
                  .then(function (response) {
                    console.log("success");
                    if (index === arr.length - 1) {
                      fetchDataProblem({ state: false });
                    }
                  })
                  .catch(function (error) {
                    console.log(error);
                  });
              }
            });
            fetchDataProblem({ state: false });
          })
          .catch(function (error) {
            console.log(error);
          });
      })
      .catch(function (error) {
        console.log(error);
      });
    fetchTagProblem();
  }, []);

  const [startDifficulty, setStartDifficulty] = useState(100);
  const [endDifficulty, setEndDifficulty] = useState(1000);
  const [tags, setTags] = useState([]);

  const checkExist = ({ currentTags, tags }) => {
    let count = 0;
    tags.forEach((element) => {
      if (currentTags.filter((x) => x === element).length > 0) {
        count++;
      }
    });
    return count === tags.length;
  };
  const fetchFilter = ({
    startDifficulty,
    endDifficulty,
    tags,
    hiddenAccepted,
  }) => {
    axios
      .get(env.API_URL + "/problems", {})
      .then(async (responseProblem) => {
        axios
          .get(env.API_URL + "/submission", {})
          .then(async (responseSubmission) => {
            let filterArray = await responseProblem.data.dataProblems
              .filter(
                (x) =>
                  x.public &&
                  x.difficulty >= startDifficulty &&
                  x.difficulty <= endDifficulty &&
                  checkExist({ currentTags: x.tags, tags: tags }) &&
                  (hiddenAccepted
                    ? x.solved.filter((userAC) => userAC === user._id).length >
                      0
                      ? false
                      : true
                    : true)
              )
              .reverse();
            let arr = [];
            await filterArray.forEach((element) => {
              arr.push({
                _id: element._id,
                idProblem: element.idProblem,
                nameProblem: element.nameProblem,
                contentProblem: element.contentProblem,
                tags: element.tags,
                example: element.example,
                difficulty: element.difficulty,
                solved: element.solved,
                numberSolved: element.solved.filter(
                  (x, index) => element.solved.indexOf(x) === index
                ).length,
                timeLimit: element.timeLimit,
                memoryLimit: element.memoryLimit,
                description: element.description,
                testCase: element.testCase,
                idContest: element.idContest,
              });
            });
            setDataProblem(arr);
          })
          .catch(function (error) {
            console.log(error);
          });
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const onChangeComplete = (value) => {
    setStartDifficulty(value[0]);
    setEndDifficulty(value[1]);
    fetchFilter({
      startDifficulty: value[0],
      endDifficulty: value[1],
      tags: tags,
      hiddenAccepted: hiddenAcceptedProblem,
    });
  };

  const onChangeTags = (value) => {
    setTags(value);
    fetchFilter({
      startDifficulty: startDifficulty,
      endDifficulty: endDifficulty,
      tags: value,
      hiddenAccepted: hiddenAcceptedProblem,
    });
  };
  const changeStateHiddenTag = (e) => {
    localStorage.setItem("hiddenTagProblem", e.target.checked);
    setHiddenTag(e.target.checked);
  };
  const changeStatehiddenAccepted = (e) => {
    localStorage.setItem("hiddenAcceptedProblem", e.target.checked);
    setHiddenAcceptedProblem(e.target.checked);
    fetchFilter({
      startDifficulty: startDifficulty,
      endDifficulty: endDifficulty,
      tags: tags,
      hiddenAccepted: e.target.checked,
    });
  };

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
          <div className="w-full flex mt-10">
            <div className="w-3/4">
              <Table
                columns={columns}
                dataSource={dataProblem}
                rowClassName={(record, index) => {
                  if (record.solved.filter((x) => x === user?._id).length > 0) {
                    return "bg-green-300";
                  }
                }}
              />
            </div>
            <div className="w-1/4 justify-end">
              <div className="flex flex-col justify-center items-end">
                <div className="relative flex w-11/12 h-[430px] flex-col rounded-[10px] border-[1px] border-gray-200 bg-white bg-clip-border shadow-md shadow-[#F3F3F3]">
                  <div className="flex h-fit w-full items-center justify-between rounded-t-2xl bg-white px-4 pb-[20px] pt-4 shadow-2xl shadow-gray-100">
                    <h4 className="text-lg font-bold text-navy-700">
                      Tìm kiếm bài tập
                    </h4>
                  </div>
                  <div className="flex flex-wrap mb-6 mt-3">
                    <div className="w-full px-3">
                      <label className="block uppercase tracking-wide text-gray-700 text-base font-bold mb-2">
                        Độ khó:
                      </label>
                      <Slider
                        range
                        max={1000}
                        min={100}
                        step={100}
                        defaultValue={[100, 1000]}
                        onChangeComplete={onChangeComplete}
                      />
                    </div>
                    <div className="w-full px-3">
                      <label className="block uppercase tracking-wide text-gray-700 text-base font-bold mb-2">
                        Dạng bài:
                      </label>
                      <Select
                        className="w-full"
                        mode="multiple"
                        allowClear
                        placeholder="Tìm kiếm theo dạng..."
                        options={dataTag}
                        onChange={onChangeTags}
                      />
                    </div>
                    <div className="w-full px-3 pt-3">
                      <Checkbox
                        onChange={changeStateHiddenTag}
                        checked={hiddenTag}
                      >
                        Ẩn thẻ tất cả bài tập
                      </Checkbox>
                    </div>
                    <div className="w-full px-3">
                      <Checkbox
                        onChange={changeStatehiddenAccepted}
                        checked={hiddenAcceptedProblem}
                      >
                        Ẩn những bài đã AC
                      </Checkbox>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Content>
      <FooterPage />
    </Layout>
  );
}
