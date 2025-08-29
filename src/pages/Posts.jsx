// import styles from './Posts.module.css'

import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { MainUserContext } from "../context/UserAuth";

import PostCard from "../components/Post/PostCard";
import Loader from "../pages/Loader";
import AddEditePost from "../components/AddEditPostComponent/addEdit";
import { useQuery } from '@tanstack/react-query'
import toast from "react-hot-toast";
import NotFound from "./NotFound";
import Card from "../components/Card/Card";
export default function Posts() {
    const { userState, userData } = useContext(MainUserContext)
    // useEffect(() => { window.document.title = `${userData.name}'s Feed` }, [])
    const [allPosts, setAllPosts] = useState(null)
    function getData() {
        return axios.get('https://linked-posts.routemisr.com/posts', {
            params: {
                limit: 30,
                sort:'-createdAt'
            },
            headers: {
                token: userState
            }
        })
    }
    let { data, isLoading, isFetching, isError, error, refetch } = useQuery({
        // queryKey: ['allPosts',x]
        queryKey: 'allPosts',
        queryFn: getData,
        // refetchOnMount: false, 
        // refetchOnWindowFocus: false,
        // refetchOnReconnect
        // refetchInterval: 1000 * 60 * 60 * 24 * 3, 
        // retry:1,
        // retryDelay:2000, 
        // gcTime:2000pp
    })
    if (isLoading) {
        return <Loader typeOfLoader="Loading Posts" />
    }

    if (isError) {
        return toast.error(error.message);
    }
    return (
        <main className="md:w-1/2 p-4 mx-auto ">
            <AddEditePost getAllPosts={refetch} />
            {data?.data?.posts.length ? <>
                {data?.data?.posts.map((post) => {
                    return <div key={post._id}>
                        <Card post={post} />
                    </div>
                })}
            </>
                : <NotFound typeOfNotFound={'no posts found'}/>
            }
        </main >
    )
}