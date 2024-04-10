import React, { useEffect } from "react";
import { Button, Space } from "antd";
import CalHeatmap from "cal-heatmap";
import "cal-heatmap/cal-heatmap.css";
import Tooltip from "cal-heatmap/plugins/Tooltip";
import LegendLite from "cal-heatmap/plugins/LegendLite";
import CalendarLabel from "cal-heatmap/plugins/CalendarLabel";
import { registerables, Chart } from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";

import * as env from "../env.js";
import moment from "moment";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function InfoProfile({ profile, numberOfAccepted, data }) {
  Chart.register(...registerables);
  Chart.register(annotationPlugin);

  const { idUser } = useParams();

  const fetchSubmissionHistory = ({ year }) => {
    const cal = new CalHeatmap();
    let calendar = document.querySelector("#ex-ghDay");
    let child = calendar?.lastElementChild;
    if (child) {
      calendar.removeChild(child);
    }
    cal.paint(
      {
        data: {
          source: data,
          type: "json",
          x: "date",
          y: (d) => +d["value"],
          groupY: "max",
        },
        range: 12,
        scale: {
          color: {
            type: "threshold",
            range: ["#4dd05a", "#37a446", "#166b34", "#14432a"],
            domain: [3, 5, 10],
          },
        },
        domain: {
          type: "month",
          gutter: 4,
          label: { text: "MM/YYYY", textAlign: "start", position: "top" },
        },
        subDomain: {
          type: "ghDay",
          radius: 2,
          width: 11,
          height: 11,
          gutter: 4,
        },
        date: {
          highlight: [
            new Date(), // Highlight today
          ],
        },
        itemSelector: "#ex-ghDay",
      },
      [
        [
          Tooltip,
          {
            text: function (date, value, dayjsDate) {
              return (
                (value ? value : "Không có") +
                " vấn đề trong ngày " +
                dayjsDate.format("DD/MM/YYYY")
              );
            },
          },
        ],
        [
          LegendLite,
          {
            includeBlank: true,
            itemSelector: "#ex-ghDay-legend",
            radius: 2,
            width: 11,
            height: 11,
            gutter: 4,
          },
        ],
        [
          CalendarLabel,
          {
            width: 30,
            textAlign: "start",
            text: () => ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
            padding: [25, 0, 0, 0],
          },
        ],
      ]
    );
    return (
      <div
        style={{
          color: "#adbac7",
          borderRadius: "3px",
          padding: "1rem",
          overflow: "hidden",
        }}
      >
        <div id="ex-ghDay" className="mb-5"></div>
        <Space>
          <Button
            onClick={(e) => {
              e.preventDefault();
              cal.previous();
            }}
          >
            ← Trước
          </Button>
          <Button
            onClick={(e) => {
              e.preventDefault();
              cal.next();
            }}
          >
            Sau →
          </Button>
        </Space>
        <div style={{ float: "right", fontSize: 12 }}>
          <span style={{ color: "#768390" }}>Ít</span>
          <div
            id="ex-ghDay-legend"
            style={{ display: "inline-block", margin: "0 4px" }}
          ></div>
          <span style={{ color: "#768390", fontSize: 12 }}>Nhiều</span>
        </div>
      </div>
    );
  };
  const fetchChartRating = () => {
    axios
      .get(env.API_URL + "/contest", {})
      .then(async function (responseContest) {
        let contests = await responseContest.data.dataContests
          .filter((x) => x.ratingChange === true)
          .sort((a, b) => {
            if (
              moment(a.timeStart, "DD/MM/YYYY HH:mm").isBefore(
                moment(b.timeStart, "DD/MM/YYYY HH:mm")
              )
            ) {
              return -1;
            } else {
              return 1;
            }
          });
        axios
          .get(env.API_URL + "/account", {})
          .then(async function (responseAccount) {
            let labels = [];
            let data = [];
            await contests.forEach(async (contest, index) => {
              let account = await responseAccount.data.dataAccounts.find(
                (x) => x._id === idUser
              );
              if (account) {
                let currentContest =
                  await responseContest.data.dataContests.find(
                    (x) => x.idContest === contest.idContest
                  );
                if (currentContest) {
                  let currentUser = await currentContest.participants.find(
                    (x) => x.idUser === account._id
                  );
                  if (currentUser) {
                    console.log(contest);
                    labels.push(contest.nameContest);
                    data.push(
                      currentUser.currentRating + currentUser.ratingChange
                    );
                  }
                }
              }
            });
            new Chart("myChart", {
              type: "line",
              data: {
                labels: labels,
                datasets: [
                  {
                    label: "Điểm xếp hạng",
                    data: data,
                    backgroundColor: "rgba(255, 255, 255, 0.5)",
                    borderColor: "rgb(211, 43, 47)",
                    borderWidth: 3,
                    fill: false,
                  },
                ],
              },
              options: {
                scales: {
                  y: {
                    min: 0,
                    max: 3000,
                    ticks: {
                      stepSize: 100,
                    },
                  },
                },
                plugins: {
                  annotation: {
                    annotations: [
                      {
                        type: "box",
                        yMin: 0,
                        yMax: 1200,
                        borderColor: "rgba(168, 162, 158, 0.25)",
                        borderWidth: 0,
                        backgroundColor: "rgba(168, 162, 158, 0.25)",
                      },
                      {
                        type: "box",
                        yMin: 1200,
                        yMax: 1400,
                        borderColor: "rgba(34, 197, 94, 0.25)",
                        borderWidth: 0,
                        backgroundColor: "rgba(34, 197, 94, 0.25)",
                      },
                      {
                        type: "box",
                        yMin: 1400,
                        yMax: 1600,
                        borderColor: "rgba(103, 232, 249, 0.25)",
                        borderWidth: 0,
                        backgroundColor: "rgba(103, 232, 249, 0.25)",
                      },
                      {
                        type: "box",
                        yMin: 1600,
                        yMax: 1900,
                        borderColor: "rgba(37, 99, 235, 0.25)",
                        borderWidth: 0,
                        backgroundColor: "rgba(37, 99, 235, 0.25)",
                      },
                      {
                        type: "box",
                        yMin: 1900,
                        yMax: 2100,
                        borderColor: "rgba(168, 85, 247, 0.25)",
                        borderWidth: 0,
                        backgroundColor: "rgba(168, 85, 247, 0.25)",
                      },
                      {
                        type: "box",
                        yMin: 2100,
                        yMax: 2400,
                        borderColor: "rgba(245, 158, 11, 0.25)",
                        borderWidth: 0,
                        backgroundColor: "rgba(245, 158, 11, 0.25)",
                      },
                      {
                        type: "box",
                        yMin: 2400,
                        yMax: 2600,
                        borderColor: "rgba(219, 39, 119, 0.25)",
                        borderWidth: 0,
                        backgroundColor: "rgba(219, 39, 119, 0.25)",
                      },
                      {
                        type: "box",
                        yMin: 2600,
                        yMax: 3000,
                        borderColor: "rgba(220, 38, 38, 0.25)",
                        borderWidth: 0,
                        backgroundColor: "rgba(220, 38, 38, 0.25)",
                      },
                    ],
                  },
                },
              },
            });
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
    fetchChartRating();
  }, []);
  return (
    <div className="col-span-4 sm:col-span-9">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Đạt được hiện tại</h2>
        <div>
          <div className="text-base font-semibold mb-4">
            Điểm xếp hạng hiện tại:{" "}
            {profile.rating < 1200 ? (
              <span className="text-stone-400 font-bold">{profile.rating}</span>
            ) : profile.rating < 1400 ? (
              <span className="text-green-500 font-bold">{profile.rating}</span>
            ) : profile.rating < 1600 ? (
              <span className="text-cyan-300 font-bold">{profile.rating}</span>
            ) : profile.rating < 1900 ? (
              <span className="text-blue-600 font-bold">{profile.rating}</span>
            ) : profile.rating < 2100 ? (
              <span className="text-purple-500 font-bold">
                {profile.rating}
              </span>
            ) : profile.rating < 2400 ? (
              <span className="text-amber-500 font-bold">{profile.rating}</span>
            ) : profile.rating < 2600 ? (
              <span className="text-pink-600 font-bold">{profile.rating}</span>
            ) : (
              <span className="text-red-600 font-bold">{profile.rating}</span>
            )}
          </div>
          <div className="text-base font-semibold mb-4">
            Điểm xếp hạng cao nhất:{" "}
            {profile.maxRating < 1200 ? (
              <span className="text-stone-400 font-bold">
                {profile.maxRating}
              </span>
            ) : profile.maxRating < 1400 ? (
              <span className="text-green-500 font-bold">
                {profile.maxRating}
              </span>
            ) : profile.maxRating < 1600 ? (
              <span className="text-cyan-300 font-bold">
                {profile.maxRating}
              </span>
            ) : profile.maxRating < 1900 ? (
              <span className="text-blue-600 font-bold">
                {profile.maxRating}
              </span>
            ) : profile.maxRating < 2100 ? (
              <span className="text-purple-500 font-bold">
                {profile.maxRating}
              </span>
            ) : profile.maxRating < 2400 ? (
              <span className="text-amber-500 font-bold">
                {profile.maxRating}
              </span>
            ) : profile.maxRating < 2600 ? (
              <span className="text-pink-600 font-bold">
                {profile.maxRating}
              </span>
            ) : (
              <span className="text-red-600 font-bold">
                {profile.maxRating}
              </span>
            )}
          </div>
          <div className="text-base font-semibold mb-4">
            Số vấn đề đã giải quyết:{" "}
            <span className="font-bold">{numberOfAccepted}</span>
          </div>
        </div>
      </div>
      <div className="bg-white shadow rounded-lg p-6 mt-5">
        <h2 className="text-xl font-bold mb-4">Lịch sử bài nộp</h2>
        {fetchSubmissionHistory({
          year: new Date().getFullYear().toString(),
        })}
      </div>
      <div className="bg-white shadow rounded-lg p-6 mt-5">
        <h2 className="text-xl font-bold mb-4">Lịch sử điểm xếp hạng</h2>
        <div>
          <canvas id="myChart"></canvas>
        </div>
      </div>
    </div>
  );
}
