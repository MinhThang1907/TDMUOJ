import React, { useEffect, useState } from "react";
import axios from "axios";

import * as env from "../env.js";

const TopUsers = () => {
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
            console.log(users);
            setRankingUser(users);
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
    <div className="flex flex-col justify-center items-end">
      <div className="relative flex w-11/12 flex-col rounded-[10px] border-[1px] border-gray-200 bg-white bg-clip-border shadow-md shadow-[#F3F3F3]">
        <div className="flex h-fit w-full items-center justify-between rounded-t-2xl bg-white px-4 pb-[20px] pt-4 shadow-2xl shadow-gray-100">
          <h4 className="text-lg font-bold text-navy-700">
            Xếp hạng thành viên
          </h4>
        </div>
        <div className="w-full overflow-x-scroll px-4 md:overflow-x-hidden">
          <table role="table" className="w-full overflow-x-scroll">
            <thead>
              <tr role="row">
                <th
                  role="columnheader"
                  title="Toggle SortBy"
                  className="cursor-pointer"
                >
                  <div className="flex items-center justify-between pb-2 pt-4 text-start uppercase tracking-wide text-gray-600 sm:text-xs lg:text-xs">
                    Username
                  </div>
                </th>
                <th
                  role="columnheader"
                  title="Toggle SortBy"
                  className="cursor-pointer"
                >
                  <div className="flex items-center justify-between pb-2 pt-4 text-start uppercase tracking-wide text-gray-600 sm:text-xs lg:text-xs">
                    Điểm
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="px-4">
              {rankingUser.map((item, index) => {
                if (index < 5) {
                  return (
                    <tr role="row">
                      <td className="py-3 text-sm" role="cell">
                        <div className="flex items-center gap-2">
                          <div className="h-[30px] w-[30px] rounded-full">
                            <img
                              src={item.avatar}
                              className="h-full w-full rounded-full"
                              alt=""
                            />
                          </div>
                          <a
                            href={`/profile/${item._id}`}
                            className="text-sm font-medium text-navy-700"
                          >
                            {item.username.split("@")[0]}
                          </a>
                        </div>
                      </td>
                      <td className="py-3 text-sm" role="cell">
                        <p className="text-md font-medium text-gray-600">
                          {item.rating}
                        </p>
                      </td>
                    </tr>
                  );
                }
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TopUsers;
