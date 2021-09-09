import { useEffect, useState } from "react";
import Avatar from "react-avatar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { CommentIconComponent } from "./Components/CommentIconComponent";
import { LikeComponent } from "./Components/LikeComponent";
import { TimeStamp } from "./Components/TimeStamp";
import {
  addCommentToPost,
  deleteCommentFromPost,
  getAllPosts,
  resetloggedInUserPostsStatus,
} from "./postsSlice";

export const SinglePostPage = () => {
  const { postId } = useParams();
  const { user, token } = useSelector((state) => state.auth);
  const { allPosts, allPostsStatus } = useSelector((state) => state.posts);
  const { allUsers } = useSelector((state) => state.search);
  const post = allPosts.find((post) => post._id === postId);
  const [comment, setComment] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  console.log(allPosts);
  console.log(post);

  useEffect(() => {
    console.log("All posts....");
    if (allPostsStatus === "idle" && token) {
      dispatch(getAllPosts());
    }
  }, [token, dispatch, allPostsStatus]);

  return (
    <>
      {allPostsStatus === "loading" && (
        <h2 className="text-center text-2xl font-semibold pt-20 h-screen">
          Loading.....
        </h2>
      )}
      {allPostsStatus === "fulfilled" && (
        <div className="pt-8 pb-20 ">
          <article className="border border-gray-500 rounded-md mx-auto my-2 px-4 w-11/12 md:w-3/5 lg:w-2/3 md:ml-72 lg:ml-80 pb-2 bg-white">
            <div className="flex gap-2 pt-2">
              <Avatar
                name={`${post.user.firstName} ${post?.user.lastName}`}
                size="50"
                className="rounded-full cursor-pointer"
                onClick={() => navigate(`/user/${post?.user.username}`)}
              />

              <div>
                <div className="flex">
                  <h3
                    className="font-semibold text-lg cursor-pointer"
                    onClick={() => navigate(`/user/${post?.user.username}`)}
                  >
                    {post.user.firstName} {post.user.lastName}
                  </h3>
                  <span className="text-gray-500 text-base ml-1 mt-0.5">
                    @{post.user.username}
                  </span>
                  <span className="text-gray-500 mx-1 mt-0.5">•</span>
                  <TimeStamp timeData={post?.createdAt} />
                </div>
                <p
                  onClick={() => navigate(`/posts/${post._id}`)}
                  className="mb-4 mt-1 cursor-pointer"
                >
                  {post.content}
                </p>
                <div className="flex items-center gap-x-4">
                  <LikeComponent post={post} />
                  <CommentIconComponent post={post} />
                </div>
              </div>
            </div>

            <div className="mt-2 border-t border-gray-300 max-h-80 overflow-y-auto">
              {post?.comments?.map((comment) => {
                console.log(comment);
                console.log(allUsers);
                const commentUser = allUsers.find(
                  (user) => user._id === comment.user
                );
                return (
                  <div className="my-2 relative">
                    <h3 className="font-semibold text-lg">
                      {`${commentUser?.firstName} ${commentUser?.lastName}`}
                      <span className="text-gray-500 text-base font-medium">
                        @{`${commentUser?.username}`}
                      </span>
                    </h3>
                    <p className="break-words w-10/12">{comment?.comment}</p>
                    {comment?.user === user._id && (
                      <span
                        class="material-icons-outlined absolute right-2 top-1 cursor-pointer"
                        onClick={() => {
                          dispatch(
                            deleteCommentFromPost({
                              postId: post?._id,
                              commentId: comment?._id,
                            })
                          );
                          dispatch(resetloggedInUserPostsStatus());
                        }}
                      >
                        delete
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex gap-4 mt-4 mb-2 min-w-full">
              <textarea
                name="post-comment"
                id="post-comment"
                className="w-10/12 h-9 px-2 py-1 resize-none border border-gray-400 rounded-md bg-white"
                placeholder="Write Something"
                value={comment}
                onChange={(event) => setComment(event.target.value)}
              ></textarea>
              <button
                onClick={() => {
                  dispatch(addCommentToPost({ postId: post?._id, comment }));
                  dispatch(resetloggedInUserPostsStatus());
                  setComment("");
                }}
                className="bg-blue-700 px-4 py-1 rounded text-white self-end"
              >
                Comment
              </button>
            </div>
          </article>
        </div>
      )}
    </>
  );
};
