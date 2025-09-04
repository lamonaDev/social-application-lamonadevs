import { useContext } from "react"
import { MainUserContext } from "../../context/UserAuth"
import userPlaceHolder from "/user.svg";
import { Input } from "@heroui/react";
import axios from "axios";
import toast from "react-hot-toast";
export default function ProfileCard() {
    const { userData, userState } = useContext(MainUserContext);
    return (
        <>
    {userData && (
    <section className="mx-auto max-w-[900px] w-full">
        <div className="profile-card-section flex flex-col gap-2 items-center justify-center min-h-[30vh] bg-blue-300 shadow-2xl rounded-2xl p-4 sm:p-6 md:p-8">
        <div className="relative">
            <Input
            variant="flat"
            color="success"
            type="file"
            accept="image/*"
            id="avatarUpload"
            className="hidden"
            onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
            const formData = new FormData();
            formData.append("photo", file);
            axios.put(`https://linked-posts.routemisr.com/users/upload-photo`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    token: userState, 
                },
            })
            .then(() => {
                toast.success("Avatar updated");
            })
            .catch((error) => toast.error(error.message))
            }
            }}
        />
        <label
            htmlFor="avatarUpload"
            className="absolute top-1 left-13 transform -translate-x-1/2 cursor-pointer bg-blue-400 text-black text-sm py-1 px-3 rounded-full hover:bg-blue-600 transition duration-200"
        >+</label>
        </div>
        <img
            onError={(e) => { e.target.src = userPlaceHolder }}
            src={userData?.photo}
            alt="user avatar"
            className="w-30 h-30 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full border shadow-2xl object-cover mt-4"
        />
        <h2 className="profile-card-user-name font-bold text-2xl sm:text-3xl md:text-4xl text-center">
            {userData?.name}
        </h2>
        <h3 className="profile-card-user-email text-md sm:text-lg md:text-xl">
            {userData?.email}
        </h3>
        <h3 className="profile-card-birth text-md sm:text-lg md:text-xl">
            {userData?.dateOfBirth.split("T")[0]}
        </h3>
        </div>
    </section>
)}
</>
    )
}