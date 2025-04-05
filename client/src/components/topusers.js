import { useEffect, useState } from "react";
import axios from "axios";
import * as env from "../env.js";

const TopUsers = () => {
  const [rankingUsers, setRankingUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Sort users by rating and problem count
  const sortUsersByRankingCriteria = (users, problems) => {
    return users.sort((a, b) => {
      if (a.rating === b.rating) {
        // If ratings are equal, sort by number of solved problems
        const solvedByA = problems.filter((x) =>
          x.solved.includes(a._id)
        ).length;
        const solvedByB = problems.filter((x) =>
          x.solved.includes(b._id)
        ).length;
        return solvedByB - solvedByA;
      } else {
        // Otherwise sort by rating
        return b.rating - a.rating;
      }
    });
  };

  const fetchUserRankings = async () => {
    setIsLoading(true);

    try {
      // Fetch accounts and problems in parallel
      const [accountsResponse, problemsResponse] = await Promise.all([
        axios.get(`${env.API_URL}/account`),
        axios.get(`${env.API_URL}/problems`),
      ]);

      const users = accountsResponse.data.dataAccounts;
      const problems = problemsResponse.data.dataProblems;

      // Sort users by ranking criteria
      const sortedUsers = sortUsersByRankingCriteria(users, problems);
      setRankingUsers(sortedUsers);
    } catch (error) {
      console.error("Error fetching user rankings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserRankings();
  }, []);

  return (
    <div className="flex flex-col items-center lg:items-end w-full">
      <div className="relative flex w-full lg:w-11/12 flex-col rounded-xl border border-gray-200 bg-white shadow-md">
        <div className="flex items-center justify-between rounded-t-xl bg-white px-4 py-4 shadow-lg">
          <h4 className="text-lg font-bold text-navy-700">
            Xếp hạng thành viên
          </h4>
        </div>

        <div className="w-full px-4">
          {isLoading ? (
            <div className="py-4 text-center">Đang tải...</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left pb-2 pt-4 text-xs uppercase tracking-wide text-gray-600">
                    Username
                  </th>
                  <th className="text-left pb-2 pt-4 text-xs uppercase tracking-wide text-gray-600">
                    Điểm
                  </th>
                </tr>
              </thead>
              <tbody>
                {rankingUsers.slice(0, 5).map((user, index) => (
                  <tr key={user._id}>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-[30px] w-[30px] rounded-full overflow-hidden">
                          <img
                            src={user.avatar || "/placeholder.svg"}
                            className="h-full w-full rounded-full object-cover"
                            alt={`Avatar của ${user.username}`}
                          />
                        </div>
                        <a
                          href={`/profile/${user._id}`}
                          className="text-sm font-medium text-navy-700 hover:underline"
                        >
                          {user.username.split("@")[0]}
                        </a>
                      </div>
                    </td>
                    <td className="py-3">
                      <p className="text-md font-medium text-gray-600">
                        {user.rating}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopUsers;
