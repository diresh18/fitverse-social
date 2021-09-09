import React, { useEffect } from "react";
import Avatar from "react-avatar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { resetAuthStatus } from "../authentication/authSlice";

// import { followButtonClicked, getUserByUsername } from "../../users/usersSlice";

export const UserSuggestion = () => {
  const { allUsers } = useSelector((state) => state.search);
  const { user: loggedInUser, authStatus } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  console.log();
  const suggestedUsers = allUsers.filter(
    (user) =>
      user._id !== loggedInUser._id &&
      !loggedInUser.following.find(
        (userFollowedByLoggedInUser) =>
          userFollowedByLoggedInUser._id === user._id
      )
  );

  useEffect(() => () => dispatch(resetAuthStatus()), [dispatch]);

  return (
    <>
      <div>
        <h3 className="text-lg font-semibold">Suggested Users:</h3>
        {/* {searchStatus === "loading" && (
          <h2 className="text-center text-2xl font-semibold mt-20">
            Loading.....
          </h2>
        )} */}
        {authStatus === "fulfilled" && (
          <div className="flex overflow-x-auto pb-4 pt-2 bg-gray-50">
            {suggestedUsers?.map((user) => {
              return (
                <div className="flex flex-col items-center mx-2 mt-2 px-2 py-4 min-w-36 rounded-md bg-white hover:shadow-2xl">
                  <Avatar
                    size="80"
                    name={`${user.firstName} ${user.lastName}`}
                    className="rounded-full cursor-pointer"
                    onClick={() => navigate(`/user/${user.username}`)}
                  />
                  <p
                    className="text-lg font-semibold mt-2 cursor-pointer"
                    onClick={() => navigate(`/user/${user.username}`)}
                  >
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-gray-500 font-medium">@{user.username}</p>
                  {/* <button
                    className="bg-blue-700 text-white px-10 py-0.5 mt-1 rounded"
                    onClick={() => {
                      dispatch(getUserByUsername(loggedInUser.username));
                      dispatch(followButtonClicked(user?._id));
                    }}
                  >
                    Follow
                  </button> */}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};
