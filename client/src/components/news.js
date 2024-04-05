import React from "react";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { Divider, Pagination } from "antd";
import { Link } from "react-router-dom";

import * as env from "../env.js";

const News = () => {
  const [dataNews, setDataNews] = useState([]);
  const [news, setNews] = useState([]);

  const fetchDataNews = () => {
    axios
      .get(env.API_URL + "/account", {})
      .then(function (res) {
        axios
          .get(env.API_URL + "/news", {})
          .then(function (response) {
            let arr = [];
            let newsBegin = [];
            response.data.dataNews.forEach((ele, index) => {
              let check = res.data.dataAccounts.filter(
                (x) => x._id === ele.idUser
              );
              if (check.length > 0) {
                arr.push({
                  key: ele._id,
                  title: ele.title,
                  content: ele.content,
                  image: ele.image,
                  idUser: ele.idUser,
                  username: check[0].username,
                  avatar: check[0].avatar,
                  name: check[0].name,
                });
                if (index >= response.data.dataNews.length - 5) {
                  newsBegin.push({
                    key: ele._id,
                    title: ele.title,
                    content: ele.content,
                    image: ele.image,
                    idUser: ele.idUser,
                    username: check[0].username,
                    name: check[0].name,
                  });
                }
              } else {
                arr.push({
                  key: ele._id,
                  title: ele.title,
                  content: ele.content,
                  image: ele.image,
                  idUser: ele.idUser,
                  username: "Không xác định",
                });
                if (index >= response.data.dataNews.length - 5) {
                  newsBegin.push({
                    key: ele._id,
                    title: ele.title,
                    content: ele.content,
                    image: ele.image,
                    idUser: ele.idUser,
                    username: "Không xác định",
                  });
                }
              }
            });
            setDataNews(arr.reverse());
            setNews(newsBegin.reverse());
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
    fetchDataNews();
  }, []);
  const pageChange = (current, pageSize) => {
    let arr = [];
    for (
      let i = (current - 1) * pageSize;
      i < Math.min(dataNews.length, current * pageSize);
      i++
    ) {
      arr.push(dataNews[i]);
    }
    setNews(arr);
  };
  return (
    <>
      {news.map((item, index) => (
        <div className="bg-white">
          <div className="container px-6 py-10 mx-auto">
            <h1 className="text-3xl font-semibold text-gray-800 capitalize lg:text-4xl">
              {item.title}
            </h1>
            <div className="mt-8 lg:-mx-6 lg:items-center">
              <div className="mt-6 lg:w-full lg:mt-0 lg:mx-6 ">
                <p className="mt-3 text-sm text-gray-500 md:text-sm whitespace-pre-line">
                  {item.content}
                </p>
              </div>
            </div>
            <img
              className="object-cover w-full rounded-xl mt-5"
              src={item.image}
              alt=""
            />
            <div className="flex items-center mt-6">
              <img
                className="w-10 h-10 rounded-full"
                src={item.avatar}
                alt=""
              />
              <div className="mx-4">
                <h1 className="text-sm text-gray-700">
                  {item.username !== "Không xác định" ? (
                    <Link to={"/profile/".concat(item.idUser)}>
                      {item.name !== "" ? item.name : item.username}
                    </Link>
                  ) : (
                    <p>{item.username}</p>
                  )}
                </h1>
              </div>
            </div>
          </div>
          <Divider />
        </div>
      ))}
      <Pagination
        defaultPageSize={5}
        total={dataNews.length}
        onChange={pageChange}
      />
    </>
  );
};

export default News;
