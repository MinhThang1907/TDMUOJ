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

const { Content } = Layout;

export default function Problem({
  currentTab,
  hiddenTag,
  setHiddenTag,
  setInfoProblem,
}) {
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
      sorter: (a, b) => a.difficulty - b.difficulty,
    },
    {
      title: "Số AC",
      key: "numberSolved",
      dataIndex: "numberSolved",
      sorter: (a, b) => a.numberSolved - b.numberSolved,
    },
  ];
  const [dataProblem, setDataProblem] = useState([]);
  const [dataTag, setDataTag] = useState([]);
  const fetchDataProblem = () => {
    axios
      .get(env.API_URL + "/problems", {})
      .then(function (responseProblem) {
        axios
          .get(env.API_URL + "/submission", {})
          .then(function (responseSubmission) {
            let arr = [];
            responseProblem.data.dataProblems.forEach((ele) => {
              arr.push({
                ...ele,
                key: ele.idProblem,
                numberSolved: responseSubmission.data.dataSubmissions.filter(
                  (x) =>
                    x.idProblem === ele.idProblem && x.status === "Accepted"
                ).length,
              });
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
    fetchDataProblem();
    fetchTagProblem();
  }, []);

  const [startDifficulty, setStartDifficulty] = useState(100);
  const [endDifficulty, setEndDifficulty] = useState(1000);
  const [tags, setTags] = useState([]);
  const [hiddenAcceptedProblem, setHiddenAcceptedProblem] = useState(false);

  const checkExist = ({ currentTags, tags }) => {
    let count = 0;
    tags.forEach((element) => {
      if (currentTags.includes(element)) {
        count++;
      }
    });
    return count === tags.length;
  };

  useEffect(() => {
    axios
      .get(env.API_URL + "/problems", {})
      .then(function (response) {
        setDataProblem(
          response.data.dataProblems
            .filter(
              (x) =>
                x.difficulty >= startDifficulty &&
                x.difficulty <= endDifficulty &&
                checkExist({ currentTags: x.tags, tags: tags }) &&
                (hiddenAcceptedProblem ? !x.solved.includes(user._id) : true)
            )
            .reverse()
        );
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [startDifficulty, endDifficulty, tags, hiddenAcceptedProblem]);

  const onChangeComplete = (value) => {
    setStartDifficulty(value[0]);
    setEndDifficulty(value[1]);
  };

  const onChangeTags = (value) => {
    setTags(value);
  };
  const changeStateHiddenTag = (e) => {
    setHiddenTag(e.target.checked);
  };
  const changeStatehiddenAccepted = (e) => {
    setHiddenAcceptedProblem(e.target.checked);
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
              <Table columns={columns} dataSource={dataProblem} />
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
                      <Checkbox onChange={changeStateHiddenTag}>
                        Ẩn thẻ tất cả bài tập
                      </Checkbox>
                    </div>
                    <div className="w-full px-3">
                      <Checkbox onChange={changeStatehiddenAccepted}>
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
