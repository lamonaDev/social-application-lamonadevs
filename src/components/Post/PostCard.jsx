import { FaCommentAlt } from "react-icons/fa";
import { IoShareSocialSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function PostCard({ post, from }) {
    const [visibleComments, setvisibleComments] = useState(2)
    const navigate = useNavigate()
    return (
        <>
            <div className="post-header flex items-center border-b border-black py-3">
                <img src={post.user?.photo} className="size-14 rounded-full mx-3" alt="user avatar" />
                <div>
                    <h2 className="font-bold">{post.user?.name}</h2>
                    <p>{ post.createdAt.split('T')[0]}</p>
                </div>
            </div>
            <div className="post-content p-2 border-b border-gray-200 py-2">
                <p className="mb-2">{post.body}</p>
                {post.image && <img src={post.image} className="w-full h-60 object-cover" alt="post image" />}
            </div>
            <div className="post-action flex justify-between p-2">
                <div className="flex items-center gap-2"> <FaCommentAlt />({post.comments.length})comments</div>
                <div div className="flex items-center gap-2"> <IoShareSocialSharp />Share</div>
            </div>
            <div className="post-comments">
                {post.comments.length ?
                    post.comments.length > 2 ? post.comments.slice(0, visibleComments).map((comment) => <div key={comment._id} className="flex items-center gap-2 p-2 border-b border-gray-200">
                        <div className="flex ">
                            <img onError={(e) => { e.target.src = "../../assets/react.svg" }} src={comment.commentCreator.photo} className="size-14 rounded-full" alt="" />
                            <div>
                                <h3 className="font-bold">{comment.commentCreator.name}</h3>
                                <p>{comment.content}</p>
                            </div>
                        </div>
                    </div>) : post.comments.map(() => <>
                    </>) : 'No Comments'}
            </div>
            {from === 'details' ? <p className="text-center font-bold cursor-pointer"
                onClick={() => { setvisibleComments(visibleComments + 5) }}>
                See More
            </p> :
                <p className="bg-gray-200 text-center py-3 cursor-pointer" onClick={() => {
                    // navigate('/details/'+post._id)
                    navigate(`/details/${post._id}`)
                }}>
                    See Details...
                </p>
            }
        </>
    )
}