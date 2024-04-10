import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";

function Test() {
  const chartRef = useRef(null);
  const [datas, setDatas] = useState([]);

  useEffect(() => {
    let myChart = echarts.init(chartRef.current, null, {
      renderer: "canvas",
      useDirtyRect: false,
    });

    let option;

    let nodes = [
      { id: "1", name: "1" },
      { id: "2", name: "2" },
      { id: "3", name: "3" },
      { id: "4", name: "4" },
    ];

    let edges = [
      ["1", "2", "1"],
      ["3", "1", "4"],
    ];

    let newData = [{ nodes, edges }];
    // console.log(nodes, edges);
    setDatas(newData);

    let symbolSize = 20;
    option = {
      series: newData.map((item, idx) => {
        console.log(item);
        return {
          smooth: true,
          symbolSize: symbolSize,
          type: "graph",
          layout: "force",
          animation: true,
          data: item.nodes.map((node) => {
            // Add draggable property to nodes
            node.draggable = true;
            return {
              id: node.id,
              name: node.name,
              x: null,
              y: null,
              draggable: true,
              symbolSize: symbolSize,
              itemStyle: {
                color: "rgba(255, 255, 255, 0.5)",
                borderColor: "#000",
                borderWidth: 2,
              },
              label: {
                show: true,
                position: "inside",
                fontSize: 20,
                fontWeight: "bold",
                color: "#000",
                backgroundColor: "#fff",
                borderColor: "#000",
                borderWidth: 1,
                padding: 5,
                width: 20,
                height: 20,
                borderRadius: 99999,
                formatter: (params) => {
                  return params.data.name;
                },
              },
            };
          }),
          width: "100%",
          height: "100%",
          edgeSymbol: ["none", "arrow"], // Specify arrow symbol for edges
          edgeSymbolSize: [0, 15], // Set arrow size
          force: {
            initLayout: "circular",
            gravity: 0,
            repulsion: 60,
            edgeLength: 150,
          },
          edges: item.edges.map((e) => {
            return {
              source: e[0] + "",
              target: e[1] + "",
              value: e[2] + "",
              lineStyle: {
                normal: {
                  color: "#000",
                },
              },
              label: {
                show: true, // Hiển thị trọng số
                formatter: "{c}", // Định dạng trọng số
                fontSize: 12, // Kích thước font
                color: "#000", // Màu của trọng số
                position: "middle", // Vị trí của trọng số trên đường nối ('start', 'middle', 'end')
              },
            };
          }),
        };
      }),
    };

    if (option && typeof option === "object") {
      myChart.setOption(option);

      // Update data variable name to datas
      myChart.setOption({
        graphic: echarts.util.map(newData, (item, dataIndex) => {
          return {
            type: "circle",
            position: myChart.convertToPixel("grid", item),
            shape: { r: symbolSize / 2 },
            invisible: true,
            draggable: true,
            ondrag: echarts.util.curry(onPointDragging, dataIndex),
            onmousemove: echarts.util.curry(showTooltip, dataIndex),
            onmouseout: echarts.util.curry(hideTooltip, dataIndex),
            z: 100,
          };
        }),
      });
    }

    window.addEventListener("resize", () => {
      myChart.setOption({
        graphic: echarts.util.map(newData, (item, dataIndex) => {
          return { position: myChart.convertToPixel("grid", item) };
        }),
      });
    });

    return () => {
      myChart.dispose();
    };
  }, []); // Remove datas from dependency array

  function showTooltip(dataIndex) {
    chartRef.current.dispatchAction({
      type: "showTip",
      seriesIndex: 0,
      dataIndex: dataIndex,
    });
  }

  function hideTooltip(dataIndex) {
    chartRef.current.dispatchAction({ type: "hideTip" });
  }

  function onPointDragging(dataIndex, dx, dy) {
    let updatedNodes = datas[0].nodes.map((node, index) => {
      if (index === dataIndex) {
        return { ...node, x: node.x + dx, y: node.y + dy };
      }
      return node;
    });
    setDatas([{ ...datas[0], nodes: updatedNodes }]);
  }

  return <div ref={chartRef} className="w-full h-screen"></div>;
}

export default Test;
