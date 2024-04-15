import React, { useEffect, useState } from "react";
import { Layout, theme, Table } from "antd";

import axios from "axios";

import * as env from "../env.js";

import HeaderPage from "../components/header.js";
import FooterPage from "../components/footer.js";

const { Content } = Layout;

export default function RankingUser({ currentTab }) {
  const user = localStorage.getItem("dataUser")
    ? JSON.parse(localStorage.getItem("dataUser"))
    : null;
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const columns = [
    {
      title: "Hạng",
      key: "rank",
      align: "center",
      width: "10%",
      render: (item) => {
        return <div>{item.rank}</div>;
      },
    },
    {
      title: "Điểm xếp hạng",
      key: "rating",
      align: "center",
      width: "10%",
      render: (item) => {
        return (
          <div className="font-bold">
            {item.rating < 1200 ? (
              <span className="text-stone-400">{item.rating}</span>
            ) : item.rating < 1400 ? (
              <span className="text-green-500">{item.rating}</span>
            ) : item.rating < 1600 ? (
              <span className="text-cyan-300">{item.rating}</span>
            ) : item.rating < 1900 ? (
              <span className="text-blue-600">{item.rating}</span>
            ) : item.rating < 2100 ? (
              <span className="text-purple-500">{item.rating}</span>
            ) : item.rating < 2400 ? (
              <span className="text-amber-500">{item.rating}</span>
            ) : item.rating < 2600 ? (
              <span className="text-pink-600">{item.rating}</span>
            ) : (
              <span className="text-red-600">{item.rating}</span>
            )}
          </div>
        );
      },
    },
    {
      title: <div className="text-center">Tên truy cập</div>,
      key: "username",
      render: (item) => {
        return (
          <div>
            <a href={`/profile/${item._id}`} className="font-bold">
              {item.rating < 1200 ? (
                <span className="text-stone-400">
                  {item.username.split("@")[0]}
                </span>
              ) : item.rating < 1400 ? (
                <span className="text-green-500">
                  {item.username.split("@")[0]}
                </span>
              ) : item.rating < 1600 ? (
                <span className="text-cyan-300">
                  {item.username.split("@")[0]}
                </span>
              ) : item.rating < 1900 ? (
                <span className="text-blue-600">
                  {item.username.split("@")[0]}
                </span>
              ) : item.rating < 2100 ? (
                <span className="text-purple-500">
                  {item.username.split("@")[0]}
                </span>
              ) : item.rating < 2400 ? (
                <span className="text-amber-500">
                  {item.username.split("@")[0]}
                </span>
              ) : item.rating < 2600 ? (
                <span className="text-pink-600">
                  {item.username.split("@")[0]}
                </span>
              ) : (
                <span className="text-red-600">
                  {item.username.split("@")[0]}
                </span>
              )}
            </a>
            <br />
            <a href={`/profile/${item._id}`} className="font-bold text-xs">
              {item.rating < 1200 ? (
                <span className="text-stone-400">
                  {item.name !== "" && item.name}
                </span>
              ) : item.rating < 1400 ? (
                <span className="text-green-500">
                  {item.name !== "" && item.name}
                </span>
              ) : item.rating < 1600 ? (
                <span className="text-cyan-300">
                  {item.name !== "" && item.name}
                </span>
              ) : item.rating < 1900 ? (
                <span className="text-blue-600">
                  {item.name !== "" && item.name}
                </span>
              ) : item.rating < 2100 ? (
                <span className="text-purple-500">
                  {item.name !== "" && item.name}
                </span>
              ) : item.rating < 2400 ? (
                <span className="text-amber-500">
                  {item.name !== "" && item.name}
                </span>
              ) : item.rating < 2600 ? (
                <span className="text-pink-600">
                  {item.name !== "" && item.name}
                </span>
              ) : (
                <span className="text-red-600">
                  {item.name !== "" && item.name}
                </span>
              )}
            </a>
          </div>
        );
      },
    },
    {
      title: "Số bài",
      key: "numberOfProblemSolved",
      align: "center",
      width: "10%",
      render: (item) => {
        return <div>{item.numberOfProblemSolved}</div>;
      },
    },
  ];
  const [rankingUser, setRankingUser] = useState([]);
  const fetchDataUser = async () => {
    axios
      .get(env.API_URL + "/account", {})
      .then(async function (responseAccount) {
        axios
          .get(env.API_URL + "/problems", {})
          .then(async function (responseProblems) {
            let users = await responseAccount.data.dataAccounts.sort((a, b) => {
              if (a.rating === b.rating) {
                let numberOfProblemSolvedA =
                  responseProblems.data.dataProblems.filter((x) =>
                    x.solved.includes(a._id)
                  ).length;
                let numberOfProblemSolvedB =
                  responseProblems.data.dataProblems.filter((x) =>
                    x.solved.includes(b._id)
                  ).length;
                // console.log(
                //   "a: ",
                //   numberOfProblemSolvedA,
                //   a.username,
                //   "b: ",
                //   numberOfProblemSolvedB,
                //   b.username
                // );
                return numberOfProblemSolvedB - numberOfProblemSolvedA;
              } else {
                return b.rating - a.rating;
              }
            });
            // console.log(users);
            let ranking = [];
            let rank = 0;
            for (let i = 0; i < users.length; i++) {
              if (i > 0 && users[i].rating === users[i - 1].rating) {
                let numberOfProblemSolvedCurrent =
                  await responseProblems.data.dataProblems.filter((x) =>
                    x.solved.includes(users[i]._id)
                  ).length;
                let numberOfProblemSolvedPrevious =
                  await responseProblems.data.dataProblems.filter((x) =>
                    x.solved.includes(users[i - 1]._id)
                  ).length;
                if (
                  numberOfProblemSolvedCurrent === numberOfProblemSolvedPrevious
                ) {
                  ranking.push({
                    ...users[i],
                    rank: rank,
                    numberOfProblemSolved: numberOfProblemSolvedCurrent,
                  });
                } else {
                  rank = i + 1;
                  ranking.push({
                    ...users[i],
                    rank: i + 1,
                    numberOfProblemSolved: numberOfProblemSolvedCurrent,
                  });
                }
              } else {
                rank = i + 1;
                ranking.push({
                  ...users[i],
                  rank: i + 1,
                  numberOfProblemSolved:
                    await responseProblems.data.dataProblems.filter((x) =>
                      x.solved.includes(users[i]._id)
                    ).length,
                });
              }
            }
            // console.log(ranking);
            setRankingUser(ranking);
          })
          .catch(function (error) {
            console.log(error);
          });
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  useEffect(() => {
    fetchDataUser();
  }, []);
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
          <Table
            columns={columns}
            dataSource={rankingUser}
            pagination={false}
          ></Table>
        </div>
      </Content>
      <FooterPage />
    </Layout>
  );
}
