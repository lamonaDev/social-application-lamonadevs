import ProfileCard from "../components/profile/ProfileCard"
import ProfilePostsContainer from "../components/profile/ProfilePosts"
import Card from "../components/Card/Card"
import { useContext, useEffect, useState } from "react"
import { MainUserContext } from "../context/UserAuth"
import LoaderPage from "./Loader"
import axios from "axios"
import toast from "react-hot-toast"
import AddEditePost from "../components/AddEditPostComponent/addEdit"
export default function Profile() {
    const { userState, userData } = useContext(MainUserContext);
    const [userPosts, setUserPosts] = useState(null);
    const [loading, isLoading] = useState(false);
    function getUserPosts() {
        isLoading(true)
        axios
        .get(`https://linked-posts.routemisr.com/users/664bcf3e33da217c4af21f00/posts?limit=50`,
            { headers: {token: userState} }
        ).then((res) => {
            setUserPosts(res.data.posts);
        }).catch((error) => {
            toast.error(error.message);
        }).finally(() => {
            isLoading(false)
            toast.success("Done Loading Profile Posts")
        })
    }
    useEffect(() => {
        getUserPosts();
    }, [])
    return (
        <>
        {
            loading
            ?
            <LoaderPage typeOfLoader="Loading the User Profile Page"/>
            :
            <>
            <div className="w-1/2 mx-auto">
                <AddEditePost/>
            </div>
            <section className="user-profile-section flex flex-col p-5 h-screen gap-5">
                <ProfileCard />
                <div className="profile-posts-container">
                    { 
                        userPosts && userPosts.map((post) => <> <Card post={post}/> </>)
                    }
                </div>
            </section>
            </>
        }
        </>
    )
}