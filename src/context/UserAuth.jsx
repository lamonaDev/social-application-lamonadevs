import { createContext, useEffect, useState } from "react";
import axios from "axios";
export const MainUserContext = createContext();
export default function UserAuthContext({ children }) {
    const [userState, setUserState] = useState(window.localStorage.getItem("token") || '');
    const [userData, setUserData] = useState(null);
    const [userId, setUserId] = useState("");
    const [loadUserProfile, setLoadUserProfile] = useState(false)
    function getLoggedUser() {
        axios(
            {
                method: 'GET',
                url: 'https://linked-posts.routemisr.com/users/profile-data',
                headers: {
                    token: userState,
                }
            }
        ).then((response) => {
            setUserData(response?.data?.user);
            setUserId(response?.data?.user?._id);
        })
    }
    useEffect(() => {
        getLoggedUser();
    }, [])
    return (
        <MainUserContext.Provider value={{userState, setUserState, userData, loadUserProfile, setLoadUserProfile, userId}}>
            { children }
        </MainUserContext.Provider>
    )
} 