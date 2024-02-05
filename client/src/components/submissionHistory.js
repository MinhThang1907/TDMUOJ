import React, { useEffect, useState } from "react";

import CalHeatmap from "cal-heatmap";
import "cal-heatmap/cal-heatmap.css";
import Tooltip from "cal-heatmap/plugins/Tooltip";
import LegendLite from "cal-heatmap/plugins/LegendLite";
import CalendarLabel from "cal-heatmap/plugins/CalendarLabel";
import { Button, Space } from "antd";

export default function SubmissionHistory({ year }) {
  const [data, setData] = useState([]);
  const cal = new CalHeatmap();
  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();
    return `${year}/${month}/${day}`;
  };
  const getDates = ({ year }) => {
    const start = new Date(year.concat("/01/01"));
    const end = new Date(year.concat("/12/31"));
    const days = Math.floor((end - start) / (1000 * 60 * 60 * 24));
    let dates = [];
    for (let i = 0; i <= days; i++) {
      const currentDate = new Date(start.getTime() + i * 24 * 60 * 60 * 1000);
      dates.push({
        date: formatDate(currentDate),
        value: 10,
      });
    }
    setData(dates);
  };

  useEffect(() => {
    getDates({ year: new Date().getFullYear().toString() });
    cal.paint(
      {
        data: {
          source: data,
          x: "date",
          y: (d) => +d["temp_max"],
          groupY: "max",
        },
        date: { start: new Date(year.concat("/01/01")) },
        range: 12,
        scale: {
          color: {
            type: "threshold",
            range: ["#14432a", "#166b34", "#37a446", "#4dd05a"],
            domain: [10, 20, 30],
          },
        },
        domain: {
          type: "month",
          gutter: 4,
          label: { text: "MM", textAlign: "start", position: "top" },
        },
        subDomain: {
          type: "ghDay",
          radius: 2,
          width: 11,
          height: 11,
          gutter: 4,
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
            text: () => ["", "Thứ 3", "", "Thứ 5", "", "Thứ 7", ""],
            padding: [25, 0, 0, 0],
          },
        ],
      ]
    );
  }, []);

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
}
