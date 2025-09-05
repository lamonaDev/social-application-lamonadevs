import { useContext } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import Card from "../Card/Card"
import { MainUserContext } from "../../context/UserAuth"
import axios from "axios"
import LoaderPage from "../../pages/Loader"
import toast from "react-hot-toast"

export default function ProfilePostsContainer() {
    const { userState, userData } = useContext(MainUserContext)
    const queryClient = useQueryClient()
    const { data: userPosts, isLoading, error, refetch } = useQuery({
        queryKey: ['userPosts', userData?._id],
        queryFn: async () => {
            try {
                const response = await axios.get(
                    `https://linked-posts.routemisr.com/users/${userData?._id}/posts?limit=50`,
                    { headers: { token: userState } }
                )
                return response.data.posts.filter(post => 
                    post && post._id && typeof post === 'object'
                )
            } catch (error) {
                toast.error("Failed to fetch posts")
                throw error
            }
        },
        enabled: !!userState && !!userData?._id // Only run if we have token and user ID
    })

    const addPostMutation = useMutation({
        mutationFn: async (newPost) => {
            const response = await axios.post(
                'https://linked-posts.routemisr.com/posts',
                newPost,
                { headers: { token: userState } }
            )
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['userPosts'])
            toast.success("Post added successfully!")
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || error.message)
        }
    })
    const deletePostMutation = useMutation({
        mutationFn: async (postId) => {
            await axios.delete(
                `https://linked-posts.routemisr.com/posts/${postId}`,
                { headers: { token: userState } }
            )
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['userPosts'])
            toast.success("Post deleted successfully!")
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || error.message)
        }
    })
    if (isLoading) return <LoaderPage />
    
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center p-8">
                <p className="text-red-500 mb-4">Error loading posts: {error.message}</p>
                <button 
                    onClick={() => refetch()}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Retry
                </button>
            </div>
        )
    }

    return (
        <div className="profile-posts-container">
            {userPosts && userPosts.length > 0 ? (
                userPosts.map((post) => (
                    post && post._id ? ( // Additional check to ensure post exists
                        <Card 
                            key={post._id} 
                            post={post}
                            onDelete={() => deletePostMutation.mutate(post._id)}
                        />
                    ) : null
                ))
            ) : (
                <div className="flex flex-col items-center justify-center p-8">
                    <p className="text-gray-500 text-lg">No posts yet</p>
                    <p className="text-gray-400">Create your first post to get started!</p>
                </div>
            )}
        </div>
    )
}