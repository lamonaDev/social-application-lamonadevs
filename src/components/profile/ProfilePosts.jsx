import { useContext, useEffect, useState } from "react"
import Card from "../Card/Card"
import { MainUserContext } from "../../context/UserAuth"
import axios from "axios"
import LoaderPage from "../../pages/Loader"
import toast from "react-hot-toast"
export default function ProfilePostsContainer() {
    const { userState, userData } = useContext(MainUserContext)
    const [userPosts, setUserPosts] = useState(null);
    // setLoadUserProfile(true);
    function getUserPosts() {
        axios
        .get(`https://linked-posts.routemisr.com/users/664bcf3e33da217c4af21f00/posts?limit=50`,
            { headers: {token: userState} }
        ).then((res) => {
            setUserPosts(res.data.posts);
        }).catch((error) => {
            toast.error(error.message);
        }).finally(() => {
            toast.success("Done Loading Profile Posts")
        })
    }
    useEffect(() => {
        getUserPosts();
        console.log(userData);
    }, [])
    return (
        <div className="profile-posts-container">
            { 
                userPosts && userPosts.map((post) => <> <Card post={post}/> </>)
            }
        </div>
    )
}