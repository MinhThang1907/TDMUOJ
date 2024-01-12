import React from "react";

const TopUsers = () => {
  return (
    <div className="flex flex-col justify-center items-end">
      <div className="relative flex w-11/12 h-[430px] flex-col rounded-[10px] border-[1px] border-gray-200 bg-white bg-clip-border shadow-md shadow-[#F3F3F3]">
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
              <tr role="row">
                <td className="py-3 text-sm" role="cell">
                  <div className="flex items-center gap-2">
                    <div className="h-[30px] w-[30px] rounded-full">
                      <img
                        src="https://images.unsplash.com/photo-1506863530036-1efeddceb993?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=2244&amp;q=80"
                        className="h-full w-full rounded-full"
                        alt=""
                      />
                    </div>
                    <p className="text-sm font-medium text-navy-700">
                      @maddison_c21
                    </p>
                  </div>
                </td>
                <td className="py-3 text-sm" role="cell">
                  <p className="text-md font-medium text-gray-600">
                    9821
                  </p>
                </td>
              </tr>
              <tr role="row">
                <td className="py-3 text-sm" role="cell">
                  <div className="flex items-center gap-2">
                    <div className="h-[30px] w-[30px] rounded-full">
                      <img
                        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=1780&amp;q=80"
                        className="h-full w-full rounded-full"
                        alt=""
                      />
                    </div>
                    <p className="text-sm font-medium text-navy-700">
                      @karl.will02
                    </p>
                  </div>
                </td>
                <td className="py-3 text-sm" role="cell">
                  <p className="text-md font-medium text-gray-600">
                    7032
                  </p>
                </td>
              </tr>
              <tr role="row">
                <td className="py-3 text-sm" role="cell">
                  <div className="flex items-center gap-2">
                    <div className="h-[30px] w-[30px] rounded-full">
                      <img
                        src="https://images.unsplash.com/photo-1573766064535-6d5d4e62bf9d?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=1315&amp;q=80"
                        className="h-full w-full rounded-full"
                        alt=""
                      />
                    </div>
                    <p className="text-sm font-medium text-navy-700">
                      @andreea.1z
                    </p>
                  </div>
                </td>
                <td className="py-3 text-sm" role="cell">
                  <p className="text-md font-medium text-gray-600">
                    5204
                  </p>
                </td>
              </tr>
              <tr role="row">
                <td className="py-3 text-sm" role="cell">
                  <div className="flex items-center gap-2">
                    <div className="h-[30px] w-[30px] rounded-full">
                      <img
                        src="https://images.unsplash.com/photo-1628157588553-5eeea00af15c?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=1780&amp;q=80"
                        className="h-full w-full rounded-full"
                        alt=""
                      />
                    </div>
                    <p className="text-sm font-medium text-navy-700">
                      @abraham47.y
                    </p>
                  </div>
                </td>
                <td className="py-3 text-sm" role="cell">
                  <p className="text-md font-medium text-gray-600">
                    4309
                  </p>
                </td>
              </tr>
              <tr role="row">
                <td className="py-3 text-sm" role="cell">
                  <div className="flex items-center gap-2">
                    <div className="h-[30px] w-[30px] rounded-full">
                      <img
                        src="https://i.ibb.co/7p0d1Cd/Frame-24.png"
                        className="h-full w-full rounded-full"
                        alt=""
                      />
                    </div>
                    <p className="text-sm font-medium text-navy-700">
                      @simmmple.web
                    </p>
                  </div>
                </td>
                <td className="py-3 text-sm" role="cell">
                  <p className="text-md font-medium text-gray-600">
                    3871
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TopUsers;