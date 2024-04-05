import axios from "axios";
import React, { useEffect, useState } from "react";

import * as env from "../env.js";
import { useParams } from "react-router-dom";
export default function ChatBox() {
  const { idUser } = useParams();
  const [idMessage, setIdMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const user = localStorage.getItem("dataUser")
    ? JSON.parse(localStorage.getItem("dataUser"))
    : null;
  const fetchDataChat = () => {
    axios
      .get(env.API_URL + "/account", {})
      .then(function (responseAccount) {
        axios
          .get(env.API_URL + "/chat", {})
          .then(async function (responseChat) {
            let checkExist = await responseChat.data.dataChats.find(
              (x) =>
                (x.idUserA === user._id && x.idUserB === idUser) ||
                (x.idUserB === user._id && x.idUserA === idUser)
            );
            if (!checkExist) {
              await axios
                .post(env.API_URL + "/chat", {
                  idUserA: user._id,
                  idUserB: idUser,
                })
                .then(function (response) {})
                .catch(function (error) {
                  console.log(error);
                });
            } else {
              setIdMessage(checkExist._id);
              let arr = [];
              await checkExist.messages.forEach(async (element) => {
                arr.push({
                  ...element,
                  avatar: await responseAccount.data.dataAccounts.find(
                    (x) => x._id === element.idUser
                  ).avatar,
                });
              });
              setMessages(arr);
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const sendMessage = () => {
    let arr = [...messages];
    if (arr.length > 0 && arr[arr.length - 1].idUser === user._id) {
      arr[arr.length - 1].content.push(message);
    } else {
      arr.push({
        idUser: user._id,
        content: [message],
      });
    }
    axios
      .put(env.API_URL + "/chat", {
        id: idMessage,
        messages: arr,
      })
      .then(function (response) {
        setMessage("");
        fetchDataChat();
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  useEffect(() => {
    fetchDataChat();
    setInterval(() => {
      fetchDataChat();
    }, 1000);
    return () => {
      clearInterval();
    };
  }, []);
  return (
    <div className="col-span-4 sm:col-span-9">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex-1 justify-between flex flex-col h-screen">
          <div className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch border-t-2">
            {messages.map((message, index) => (
              <>
                {message.idUser === idUser ? (
                  <div className="chat-message">
                    <div className="flex items-end">
                      <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
                        {message.content.map((content, index) => (
                          <div>
                            <span className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">
                              {content}
                            </span>
                          </div>
                        ))}
                      </div>
                      <img
                        src={message.avatar}
                        alt=""
                        className="w-6 h-6 rounded-full order-1"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="chat-message">
                    <div className="flex items-end justify-end">
                      <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
                        {message.content.map((content, index) => (
                          <div>
                            <span className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white">
                              {content}
                            </span>
                          </div>
                        ))}
                      </div>
                      <img
                        src={message.avatar}
                        alt=""
                        className="w-6 h-6 rounded-full order-2"
                      />
                    </div>
                  </div>
                )}
              </>
            ))}
          </div>
          <div className="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
            <div className="relative flex">
              <input
                type="text"
                placeholder="Nhập tin nhắn..."
                className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-12 bg-gray-200 rounded-md py-3"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendMessage();
                  }
                }}
              />
              <div className="absolute right-0 items-center inset-y-0 hidden sm:flex">
                <button
                  className="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none"
                  onClick={sendMessage}
                >
                  <span className="font-bold">Gửi</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-6 w-6 ml-2 transform rotate-90"
                  >
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
