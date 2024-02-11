import { React, useState, useEffect } from "react";
import { Layout, theme, Table } from "antd";
import axios from "axios";
import moment from "moment";

import * as env from "../env.js";

import HeaderPage from "../components/header.js";
import FooterPage from "../components/footer.js";

const { Content } = Layout;

export default function Contest({ currentTab }) {
  //   const user = localStorage.getItem("dataUser")
  //     ? JSON.parse(localStorage.getItem("dataUser"))
  //     : null;
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [contestsAreGoingOn, setContestsAreGoingOn] = useState([]);
  const [contestsInTheFuture, setContestsInTheFuture] = useState([]);
  const [contestsHavePassed, setContestsHavePassed] = useState([]);
  useEffect(() => {
    axios
      .get(env.API_URL + "/contest", {})
      .then(function (responseContest) {
        setContestsHavePassed(
          responseContest.data.dataContests.filter(async (x) => {
            let timeStart = await moment(x.timeStart, "DD/MM/YYYY HH:mm");
            let timeEnd = await moment(x.timeStart, "DD/MM/YYYY HH:mm").add(
              x.lengthTime,
              "minutes"
            );
            if (moment().isAfter(timeEnd)) {
              return true;
            } else {
              return false;
            }
          })
        );
        setContestsInTheFuture(
          responseContest.data.dataContests.filter(async (x) => {
            let timeStart = await moment(x.timeStart, "DD/MM/YYYY HH:mm");
            let timeEnd = await moment(x.timeStart, "DD/MM/YYYY HH:mm").add(
              x.lengthTime,
              "minutes"
            );
            if (moment().isBefore(timeStart)) {
              return true;
            } else {
              return false;
            }
          })
        );
        setContestsAreGoingOn(
          responseContest.data.dataContests.filter(async (x) => {
            let timeStart = await moment(x.timeStart, "DD/MM/YYYY HH:mm");
            let timeEnd = await moment(x.timeStart, "DD/MM/YYYY HH:mm").add(
              x.lengthTime,
              "minutes"
            );
            if (moment().isAfter(timeEnd) || moment().isBefore(timeStart)) {
              return false;
            } else {
              return true;
            }
          })
        );
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  const columns = [
    {
      title: "Thông tin kỳ thi",
      key: "infoContest",
      width: "75%",
    },
    {
      title: "Thành viên",
      key: "participant",
      width: "10%",
    },
    {
      title: "",
      key: "virtual_participant",
    },
  ];

  const abc = () => {
    console.log(contestsAreGoingOn, contestsInTheFuture, contestsHavePassed);
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
            <button onClick={abc}>dwdw</button>
            <Table columns={columns} />
          </div>
        </div>
      </Content>
      <FooterPage />
    </Layout>
  );
}
