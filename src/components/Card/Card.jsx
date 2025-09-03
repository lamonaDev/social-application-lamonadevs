import userPlaceHolder from "/user.svg";
import { NavLink, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { FaComments } from "react-icons/fa6";
import { FaShare } from "react-icons/fa";
import { Button } from "@heroui/react";
import FadeContent from "../ui/animation/BlurFadeContent/BlurFadeContent";
import { IoMdArrowRoundBack } from "react-icons/io";
import toast from "react-hot-toast";
import Modal from "../Modal/Modal";
import { MainUserContext } from "../../context/UserAuth";
import ModalComponent from "../Modal/Modal";
export default function Card({ post, from, isUserPost, KeyValue, key}) {
    const { userData } = useContext(MainUserContext);
    const [visibleComments, setvisibleComments] = useState(2);
    const navigate = useNavigate();
    return (
    <FadeContent className="mx-auto" blur={true} duration={1000} easing="ease-out" initialOpacity={0}>
    <section className="card bg-blue-300 max-w-[800px] mx-auto my-5 p-10 rounded-2xl shadow-2xl">
        {
            from === 'details'
            ? <><Button  className="mb-5 border-1 text-xl" size="sm" radius="full" color="primary" variant="flat" onClick={() => navigate('/posts')}><IoMdArrowRoundBack/></Button></>
            :<></>
        }
        
        <div className="card-header flex flex-row gap-6 items-center border-b-1 p-3">
            <img src={post.user?.photo} className="size-15 rounded-full shadow-2xl border-1" />
            <div className="card-header-info">
                    <h3 className="card-user-name">{ post.user?.name }</h3>
                    <p className="card-post-date">{ post.createdAt?.split('T')[0] }</p>
            </div>
        </div>
        <div className="card-content p-2">
                <h3 className="post-title text-xl ms-1 my-3">{ post.body }</h3>
                {
                    post.image && <img src={post.image} alt="post image" className="w-[100%] min-h-[250px] object-cover size-10 border-1 rounded-xl" />
                }
        </div>
        <div className="card-post-options">
            <div className="card-post-options-header flex justify-around my-4 gap-7">
                        <h2 className="comments flex items-center gap-2 cursor-pointer" onClick={(e) => { console.log(e.target) }}><FaComments/>{`(${post?.comments?.length}) comments`}</h2>
                <h2 className="share flex items-center gap-2 cursor-pointer" onClick={(e) => {console.log(e.target)}}><FaShare/>{"Share"}</h2>
            </div>
                {/*post comments*/}
                {post?.comments?.length > 0 ? (
        post?.comments?.length > 2 ? (
            post?.comments?.slice(0, visibleComments).map((comment) => (
            <div key={comment?.id} className="post-comment flex flex-row items-center gap-4 my-4 p-3 border-1 rounded-2xl">
                    <img
                    onError={(e) => e.target.src = userPlaceHolder}
                    src={comment?.commentCreator?.photo}
                    alt=""
                    className="post-comment-img size-8 rounded-full border-1"
                />
                <div className="post-comment-content">
                    <h3 className="post-comment-name text-sm font-bold">{comment?.commentCreator?.name}</h3>
                    <p className="post-comment-content text-sm">{comment?.content}</p>
                </div>
            </div>
            ))
        ) : (
        post.comments.map((comment) => (
            <div key={comment.id} className="post-comment flex flex-row items-center gap-4 my-4 p-3 border-1 rounded-2xl">
                <img
                onError={(e) => e.target.src = userPlaceHolder}
                src={comment?.commentCreator?.photo}
                className="post-comment-img size-8 rounded-full"
                />
                <div className="post-comment-content">
                    <h3 className="post-comment-name text-sm font-bold">{comment?.commentCreator?.name}</h3>
                    <p className="post-comment-content text-sm">{comment?.content}</p>
                </div>
            </div>
        ))
    )
) : (
        <p className="text-sm ">No Comments</p>
    )}
    {
        from === "details" ? <Button as={NavLink} onClick={() => {visibleComments > post.comments.length ? toast.error("No more comments"): setvisibleComments(visibleComments + 2)}} variant="flat" color="primary" className="mt-3 w-full">See More</Button>
        : <><Button as={NavLink} onClick={() => navigate(`${post._id}`)} variant="flat" color="primary" className="mt-3 w-full">See Post Details</Button></>
    }
    {
        isUserPost ? <ModalComponent useOfModal={"Post Actions"} post={post} KeyValue={KeyValue} /> : <></>
    }
        </div>
    </section>
    </FadeContent>
    );
}