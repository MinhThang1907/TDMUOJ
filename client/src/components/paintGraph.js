import React, { useState, useRef, useEffect } from "react";
import { Input, Button, Radio, Select, Space } from "antd";
import Editor from "@monaco-editor/react";
import * as echarts from "echarts";

export default function PaintGraph() {
  const [data, setData] = useState(
    "1 2\r\n1 3\r\n1 4\r\n1 14\r\n1 15\r\n2 5\r\n"
  );
  const [edgeSymbol, setEdgeSymbol] = useState([]);
  const [nodes, setNodes] = useState([
    { id: "1", name: "1" },
    { id: "2", name: "2" },
    { id: "3", name: "3" },
    { id: "4", name: "4" },
    { id: "5", name: "5" },
    { id: "14", name: "14" },
    { id: "15", name: "15" },
  ]);
  const [edges, setEdges] = useState([
    [1, 2, ""],
    [1, 3, ""],
    [1, 4, ""],
    [1, 14, ""],
    [1, 15, ""],
    [2, 5, ""],
  ]);
  const [choiceRunType, setChoiceRunType] = useState("");
  const [adj, setAdj] = useState({});
  const [startNode, setStartNode] = useState("");
  let nodeColors = {};

  const chartRef = useRef(null);
  const [datas, setDatas] = useState([]);
  let myChart;

  useEffect(() => {
    paintGraph({ checkRunDfsAndSimilar: true });
  }, [edgeSymbol]);

  const paintGraph = async ({ checkRunDfsAndSimilar }) => {
    let a = document.getElementById("framePaint");
    while (a.firstChild) {
      a.removeChild(a.firstChild);
    }
    let div = document.createElement("div");
    div.classList.add("w-full", "h-full");
    div.id = "graph";
    a.appendChild(div);
    myChart = echarts.init(div, null, {
      renderer: "canvas",
      useDirtyRect: true,
    });

    let option;

    let newData = [{ nodes, edges }];
    setDatas(newData);

    let symbolSize = 20;
    option = {
      animation: false,
      series: newData.map((item, idx) => {
        return {
          smooth: true,
          symbolSize: symbolSize,
          type: "graph",
          layout: "force",
          data: item.nodes.map((node) => {
            // Add draggable property to nodes
            node.draggable = true;
            return {
              id: node.id,
              name: node.name,
              x: null,
              y: null,
              animation: false,
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
                backgroundColor: nodeColors[node.id] || "#fff",
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
          edgeSymbol: edgeSymbol, // Specify arrow symbol for edges
          edgeSymbolSize: [0, 15], // Set arrow size
          force: {
            initLayout: "circular",
            gravity: 0,
            repulsion: 500,
            edgeLength: 150,
            layoutAnimation: checkRunDfsAndSimilar,
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
            draggable: false,
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
  };

  function showTooltip(dataIndex) {
    let graph = document.getElementById("graph");
    graph.dispatchAction &&
      graph.dispatchAction({
        type: "showTip",
        seriesIndex: 0,
        dataIndex: dataIndex,
      });
  }

  function hideTooltip(dataIndex) {
    let graph = document.getElementById("graph");
    graph.dispatchAction && graph.dispatchAction({ type: "hideTip" });
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

  function Standardize(str) {
    let arr = str.split(" ");
    let newArr = [];
    arr.forEach((item) => {
      if (item !== "") {
        newArr.push(item);
      }
    });
    if (newArr.length < 2) {
      return [];
    } else if (newArr.length === 2) {
      return [...newArr, ""];
    } else {
      return newArr.slice(0, 3);
    }
  }

  const dfs = async (graph, start) => {
    // console.log(nodes, edges);
    const visited = new Set();

    const explore = async (node) => {
      if (visited.has(node)) {
        return;
      }

      visited.add(node);
      let a = document.getElementById("framePaint");
      while (a.firstChild) {
        a.removeChild(a.firstChild);
      }
      nodeColors[node.toString()] = `#5E7AFF`; // Tạo màu mới dựa trên chỉ số của nút trong kết quả DFS
      paintGraph({ checkRunDfsAndSimilar: false });
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const neighbors = graph[node] || [];

      for (const neighbor of neighbors) {
        await explore(neighbor.to);
      }
    };
    await explore(start);
    nodeColors = {};
    paintGraph({ checkRunDfsAndSimilar: true });
    setChoiceRunType("");
  };

  const bfs = async (graph, start) => {
    // console.log(nodes, edges);
    const visited = new Set();
    let queue = [start];
    visited.add(start);

    while (queue.length > 0) {
      let node = queue[0];
      queue.shift();
      // console.log(queue);

      let a = document.getElementById("framePaint");
      while (a.firstChild) {
        a.removeChild(a.firstChild);
      }
      nodeColors[node.toString()] = `#5E7AFF`; // Tạo màu mới dựa trên chỉ số của nút trong kết quả DFS
      paintGraph({ checkRunDfsAndSimilar: false });
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const neighbors = graph[node] || [];

      for (const neighbor of neighbors) {
        if (!visited.has(neighbor.to)) {
          queue.push(neighbor.to);
          visited.add(neighbor.to);
        }
      }
    }
    nodeColors = {};
    paintGraph({ checkRunDfsAndSimilar: true });
    setChoiceRunType("");
  };

  const runDFS = async () => {
    if (startNode === "") {
      return;
    }
    let arr = data.split("\r\n");
    let newAdj = {};
    for (let i = 0; i < arr.length; i++) {
      let temp = Standardize(arr[i]);
      if (temp.length > 0) {
        if (edgeSymbol.length === 0) {
          if (newAdj[temp[0]]) {
            newAdj[temp[0]].push({
              to: temp[1],
              w: temp[2],
            });
          } else {
            newAdj[temp[0]] = [
              {
                to: temp[1],
                w: temp[2],
              },
            ];
          }
          if (newAdj[temp[1]]) {
            newAdj[temp[1]].push({
              to: temp[0],
              w: temp[2],
            });
          } else {
            newAdj[temp[1]] = [
              {
                to: temp[0],
                w: temp[2],
              },
            ];
          }
        } else {
          if (newAdj[temp[0]]) {
            newAdj[temp[0]].push({
              to: temp[1],
              w: temp[2],
            });
          } else {
            newAdj[temp[0]] = [
              {
                to: temp[1],
                w: temp[2],
              },
            ];
          }
        }
      }
    }
    dfs(newAdj, startNode);
  };

  const runBFS = async () => {
    if (startNode === "") {
      return;
    }
    let arr = data.split("\r\n");
    let newAdj = {};
    for (let i = 0; i < arr.length; i++) {
      let temp = Standardize(arr[i]);
      if (temp.length > 0) {
        if (edgeSymbol.length === 0) {
          if (newAdj[temp[0]]) {
            newAdj[temp[0]].push({
              to: temp[1],
              w: temp[2],
            });
          } else {
            newAdj[temp[0]] = [
              {
                to: temp[1],
                w: temp[2],
              },
            ];
          }
          if (newAdj[temp[1]]) {
            newAdj[temp[1]].push({
              to: temp[0],
              w: temp[2],
            });
          } else {
            newAdj[temp[1]] = [
              {
                to: temp[0],
                w: temp[2],
              },
            ];
          }
        } else {
          if (newAdj[temp[0]]) {
            newAdj[temp[0]].push({
              to: temp[1],
              w: temp[2],
            });
          } else {
            newAdj[temp[0]] = [
              {
                to: temp[1],
                w: temp[2],
              },
            ];
          }
        }
      }
    }
    bfs(newAdj, startNode);
  };

  return (
    <div className="w-full flex">
      <div className="w-1/4 h-screen">
        <Space style={{ height: "5%" }}>
          <Radio.Group
            className="mb-5"
            defaultValue="undirected"
            onChange={(e) => {
              if (e.target.value === "undirected") {
                setEdgeSymbol([]);
              } else {
                setEdgeSymbol(["none", "arrow"]);
              }
            }}
          >
            <Radio.Button value="undirected">Vô hướng</Radio.Button>
            <Radio.Button value="directed">Có hướng</Radio.Button>
          </Radio.Group>
          <Radio.Group
            className="mb-5"
            value={choiceRunType}
            onChange={(e) => setChoiceRunType(e.target.value)}
          >
            <Radio.Button value="dfs" type="primary" onClick={runDFS}>
              DFS
            </Radio.Button>
            <Radio.Button value="bfs" onClick={runBFS}>
              BFS
            </Radio.Button>
          </Radio.Group>
        </Space>
        <div style={{ height: "5%" }}>
          <Select
            value={startNode ? startNode : "Chọn đỉnh bắt đầu"}
            options={nodes}
            onChange={(e) => setStartNode(e)}
          ></Select>
        </div>
        <Editor
          height="90%"
          theme="vs-light"
          loading
          value={data}
          onChange={(value) => {
            nodeColors = {};
            setData(value);
            let arr = value.split("\r\n");
            let newObj = {};
            let newNodes = [];
            let newEdges = [];
            let newAdj = {};
            for (let i = 0; i < arr.length; i++) {
              let temp = Standardize(arr[i]);
              if (temp.length > 0) {
                if (edgeSymbol.length === 0) {
                  if (newAdj[temp[0]]) {
                    newAdj[temp[0]].push({
                      to: temp[1],
                      w: temp[2],
                    });
                  } else {
                    newAdj[temp[0]] = [
                      {
                        to: temp[1],
                        w: temp[2],
                      },
                    ];
                  }
                  if (newAdj[temp[1]]) {
                    newAdj[temp[1]].push({
                      to: temp[0],
                      w: temp[2],
                    });
                  } else {
                    newAdj[temp[1]] = [
                      {
                        to: temp[0],
                        w: temp[2],
                      },
                    ];
                  }
                } else {
                  if (newAdj[temp[0]]) {
                    newAdj[temp[0]].push({
                      to: temp[1],
                      w: temp[2],
                    });
                  } else {
                    newAdj[temp[0]] = [
                      {
                        to: temp[1],
                        w: temp[2],
                      },
                    ];
                  }
                }
                newEdges.push(temp);
                for (let j = 0; j < 2; j++) {
                  if (temp[j] !== "") {
                    newObj[temp[j]] = true;
                  }
                }
              }
            }
            Object.keys(newObj).forEach((key, index) => {
              newNodes.push({ id: key, name: key, value: key, label: key });
            });
            // console.log(newAdj);
            setNodes(newNodes);
            setEdges(newEdges);
            setAdj(newAdj);
            paintGraph({ checkRunDfsAndSimilar: true });
          }}
        />
      </div>
      <div id="framePaint" className="w-3/4 h-screen">
        {/* <div ref={chartRef} className="w-full h-full"></div> */}
      </div>
    </div>
  );
}
