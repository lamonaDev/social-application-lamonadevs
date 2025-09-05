import axios from "axios";
import { useContext } from "react";
import { MainUserContext } from "../context/UserAuth";
import Loader from "../pages/Loader";
import AddEditePost from "../components/AddEditPostComponent/addEdit";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from "react-hot-toast";
import NotFound from "./NotFound";
import Card from "../components/Card/Card";

export default function Posts() {
    const { userState, userData } = useContext(MainUserContext)
    const queryClient = useQueryClient()
    
    // Fetch posts with useQuery
    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ['allPosts'],
        queryFn: () => axios.get('https://linked-posts.routemisr.com/posts', {
            params: {
                limit: 30,
                sort: '-createdAt'
            },
            headers: {
                token: userState
            }
        }),
        enabled: !!userState
    })
    
    // Mutation for adding a post
    const addPostMutation = useMutation({
        mutationFn: (formData) => {
            return axios.post('https://linked-posts.routemisr.com/posts', formData, {
                headers: { 
                    token: userState,
                    'Content-Type': 'multipart/form-data'
                }
            })
        },
        onSuccess: () => {
            // Invalidate and refetch the posts query
            queryClient.invalidateQueries(['allPosts'])
            toast.success("Post added successfully")
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || error.message)
        }
    })
    
    // Mutation for deleting a post
    const deletePostMutation = useMutation({
        mutationFn: (postId) => {
            return axios.delete(`https://linked-posts.routemisr.com/posts/${postId}`, {
                headers: { token: userState }
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['allPosts'])
            toast.success("Post deleted successfully")
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || error.message)
        }
    })

    const handleDeletePost = (postId) => {
        deletePostMutation.mutate(postId)
    }

    if (isLoading) {
        return <Loader typeOfLoader="Loading Posts" />
    }

    if (isError) {
        toast.error(error.message);
        return <div>Error loading posts. Please try again.</div>
    }

    return (
        <main className="md:w-[70%] p-4 mx-auto">
            {/* Pass the addPostMutation to AddEditePost component */}
            <AddEditePost 
                onAddPost={addPostMutation.mutate} 
                isAdding={addPostMutation.isLoading}
            />
            {data?.data?.posts.length ? <>
                {data?.data?.posts.map((post) => {
                    return (
                        <div key={post._id}>
                            <Card 
                                post={post} 
                                KeyValue={post._id} 
                                isUserPost={post?.user?._id === userData?._id}
                                onDelete={() => handleDeletePost(post._id)}
                                isDeleting={deletePostMutation.isLoading && deletePostMutation.variables === post._id}
                            />
                        </div>
                    )
                })}
            </>
                : <NotFound typeOfNotFound={'no posts found'}/>
            }
        </main>
    )
}