import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { MainUserContext } from "../context/UserAuth"
import PostCard from "../components/Post/PostCard"
import Loader from "./Loader"
import Card from "../components/Card/Card"
import { useFetch } from "../Hooks/useFetch"
import LoaderPage from "./Loader"
import { Button } from "@heroui/react"
export default function PostDetails() {
    useEffect(() => { document.title = 'Post Details' }, [])
    let { id } = useParams()
    const { userState, userId } = useContext(MainUserContext)
    // function getSinglePost() {
    //     axios.get(`https://linked-posts.routemisr.com/posts/${id}`, {

    //         headers: {
    //             token: userToken
    //         }
    //     }).then((res) => {
    //         console.log(res.data.post);

    //         setPostDetails(res.data.post);

    //     }).catch((err) => {
    //         console.log(err);
    //     })
    // }
    const { data, error, isLoading } = useFetch('get', `https://linked-posts.routemisr.com/posts/${id}`, null, {
        token: userState
    })
    return (
        <>
            {
                isLoading
                ?
                <>
                <LoaderPage typeOfLoader="Loading Post"/>
                </>
                :
                <div className="mx-5">
                    {data && <Card post={data.post} from='details' isUserPost={data?.post?.user?._id === userId} />}
                </div>
            }
        </>
    )
}