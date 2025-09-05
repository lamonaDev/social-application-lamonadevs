import { useContext, useState } from "react";
import { MainUserContext } from "../../context/UserAuth";
import userPlaceHolder from "/user.svg";
import { NavLink, useNavigate } from "react-router-dom";
import { FaComments } from "react-icons/fa6";
import { FaShare } from "react-icons/fa";
import { Button } from "@heroui/react";
import FadeContent from "../ui/animation/BlurFadeContent/BlurFadeContent";
import { IoMdArrowRoundBack } from "react-icons/io";
import toast from "react-hot-toast";
import Modal from "../Modal/Modal";
import ModalComponent from "../Modal/Modal";
import CommentModal from "../Modal/CommentModal";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
export default function Card({ post, from, isUserPost, KeyValue, key, onPostAdded }) {
    const { userData, userId, userState } = useContext(MainUserContext);
    const [visibleComments, setVisibleComments] = useState(2);
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { data: postData } = useQuery({
    queryKey: ["post", post?._id],
    queryFn: async () => {
        const response = await axios.get(`https://linked-posts.routemisr.com/posts/${post?._id}`,
            {
                headers: { token: userState },
            }
        );
      return response.data.post; // Assuming response structure is { data: { post: {...} } }
    },
    initialData: post,
    enabled: !!post?._id,
    });
    const deleteCommentMutation = useMutation({
    mutationFn: async (commentId) => {
        await axios.delete(`https://linked-posts.routemisr.com/comments/${commentId}`,
            {
                headers: { token: window.localStorage.getItem("token") },
            }
        );
    },
    onSuccess: () => {
        toast.success("Comment Deleted Successfully!");
        queryClient.invalidateQueries({ queryKey: ["post", post?._id] });
    },
    onError: () => {
        toast.error("Error in deleting comment");
    },
    });
    return (
    <FadeContent
        className="mx-auto"
            blur={true}
            duration={1000}
            easing="ease-out"
        initialOpacity={0}
    >
    <section className="card bg-blue-300 max-w-[800px] mx-auto my-5 p-10 rounded-2xl shadow-2xl">
        {from === "details" ? (
        <Button
            className="mb-5 border-1 text-xl"
                size="sm"
                    radius="full"
                    color="primary"
                variant="flat"
            onClick={() => navigate("/posts")}
        >
            <IoMdArrowRoundBack />
        </Button>
        ) : ( <></> )}
        <div className="card-header flex flex-row gap-6 items-center border-b-1 p-2">
            <img
                src={postData.user?.photo}
                className="size-15 rounded-full shadow-2xl border-1"
            />
            <div className="card-header-info">
                <h3 className="card-user-name">{postData.user?.name}</h3>
                <p className="card-post-date">{postData.createdAt?.split("T")[0]}</p>
            </div>
        </div>
        <div className="card-content p-0">
        <h3 className="post-title text-xl ms-1 my-3">{postData?.body}</h3>
        {postData.image && (
            <img
                src={postData.image}
                alt="post image"
                className="w-[100%] min-h-[300px] object-cover size-10 border-1 rounded-xl"
            />
        )}
        </div>
        <div className="card-post-options">
            <div className="card-post-options-header flex justify-around my-4 gap-7">
                <h2
                    className="comments flex items-center gap-2 cursor-pointer"
                    onClick={(e) => console.log(e.target)}
                >
                    <FaComments />
                    {`(${postData?.comments?.length}) comments`}
                </h2>
                <h2
                    className="share flex items-center gap-2 cursor-pointer"
                    onClick={(e) => console.log(e.target)}
                >
                    <FaShare />
                    {"Share"}
                </h2>
            </div>
            <CommentModal
            postId={postData?._id}
            onSuccess={() =>
                queryClient.invalidateQueries({
                    queryKey: ["post", postData?._id],
                })
            }
        />
        {/*post comments*/}
        {postData?.comments?.length > 0 ? (
            postData?.comments?.length > 2 ? (
                postData?.comments?.slice(0, visibleComments).map((comment) => (
                    <div
                        key={comment.id}
                        className="post-comment flex flex-row items-center justify-between gap-4 my-4 p-3 border-1 rounded-2xl"
                    >
                    <div className="post-comment-content flex flex-row gap-3 items-center">
                    <img
                        onError={(e) => (e.target.src = userPlaceHolder)}
                        src={comment?.commentCreator?.photo}
                        className="post-comment-img size-8 rounded-full"
                    />
                    <div className="post-comment-data">
                      <h3 className="post-comment-name text-sm font-bold">
                        {comment?.commentCreator?.name}
                      </h3>
                      <p className="post-comment-content text-sm">
                        {comment?.content}
                      </p>
                    </div>
                  </div>
                  {isUserPost ? (
                    <>
                      <div className="post-comment-acitons flex flex-row gap-2">
                        <CommentModal
                          isEdit={true}
                          commentId={comment?._id}
                          onSuccess={() =>
                            queryClient.invalidateQueries({
                              queryKey: ["post", postData?._id],
                            })
                          }
                        />
                        <Button
                          size="sm"
                          variant="flat"
                          color="danger"
                          onClick={() =>
                            deleteCommentMutation.mutate(comment?._id)
                          }
                          isLoading={deleteCommentMutation.isLoading}
                        >
                          Delete
                        </Button>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              ))
            ) : (
              postData.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="post-comment flex flex-row items-center justify-between gap-4 my-4 p-3 border-1 rounded-2xl"
                >
                  <div className="post-comment-content flex flex-row gap-3 items-center">
                    <img
                      onError={(e) => (e.target.src = userPlaceHolder)}
                      src={comment?.commentCreator?.photo}
                      className="post-comment-img size-8 rounded-full"
                    />
                    <div className="post-comment-data">
                      <h3 className="post-comment-name text-sm font-bold">
                        {comment?.commentCreator?.name}
                      </h3>
                      <p className="post-comment-content text-sm">
                        {comment?.content}
                      </p>
                    </div>
                  </div>
                  {isUserPost ? (
                    <>
                      <div className="post-comment-acitons flex flex-row gap-2">
                        <CommentModal
                          isEdit={true}
                          commentId={comment?._id}
                          onSuccess={() =>
                            queryClient.invalidateQueries({
                              queryKey: ["post", postData?._id],
                            })
                          }
                        />
                        <Button
                          size="sm"
                          variant="flat"
                          color="danger"
                          onClick={() =>
                            deleteCommentMutation.mutate(comment?._id)
                          }
                          isLoading={deleteCommentMutation.isLoading}
                        >
                          Delete
                        </Button>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              ))
            )
          ) : (
            <></>
          )}
          {from === "details" ? (
            <Button
              as={NavLink}
              onClick={() => {
                visibleComments > postData.comments.length
                  ? toast.error("No more comments")
                  : setVisibleComments(visibleComments + 2);
              }}
              variant="flat"
              color="primary"
              className="mt-3 w-full"
            >
              See More
            </Button>
          ) : (
            <>
              {from === "edit" ? (
                <></>
              ) : (
                <Button
                  as={NavLink}
                  onClick={() => navigate(`${postData._id}`)}
                  variant="flat"
                  color="primary"
                  className="mt-3 w-full"
                >
                  See Post Details
                </Button>
              )}
            </>
          )}
          {from === "details" && visibleComments >= 4 ? (
            <Button
              as={NavLink}
              onClick={() => {
                visibleComments <= 0
                  ? toast.error("See More Comments")
                  : setVisibleComments(visibleComments - 2);
              }}
              variant="flat"
              color="primary"
              className="mt-3 w-full"
            >
              See Less
            </Button>
          ) : (
            <></>
          )}
          {isUserPost ? (
            <ModalComponent
              useOfModal={"Post Actions"}
              post={postData}
              KeyValue={KeyValue}
            />
          ) : (
            <></>
          )}
        </div>
      </section>
    </FadeContent>
  );
}
