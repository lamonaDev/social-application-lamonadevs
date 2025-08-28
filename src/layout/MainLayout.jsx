import { Outlet } from "react-router-dom";
import NavComponent from "../components/navbar/Nav";
import ProtectedRoutes from "../utils/ProtectedRoutes";
import Dock from "../components/Dock/Dock";
import { TiHome } from "react-icons/ti";
import { FaUserCog } from "react-icons/fa";
import { MdDynamicFeed } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { MainUserContext } from "../context/UserAuth";
export default function MainLayout() {
    const { userState } = useContext(MainUserContext);
    const navigate = useNavigate();
    function handleDockNavigation(Location, Message) { 
        navigate(Location);
        toast.success(Message);
    }
    const items = [
    { icon: <TiHome size={18} color="white" />, label: 'Home', onClick: () => handleDockNavigation("/", "Home Page") },
    { icon: <FaUserCog size={18} color="white" />, label: 'Profile', onClick: () => handleDockNavigation("/profile", "Profile Page") },
    { icon: <MdDynamicFeed size={18} color="white" />, label: 'Feed', onClick: () => handleDockNavigation("/posts", "Feed Page") },
    { icon: <IoMdSettings size={18} color="white" />, label: 'Settings', onClick: () => handleDockNavigation("/settings", "Settings Page") },
    ];
    return (
        <main>
            <NavComponent />
            <Outlet />
            {
                userState && <Dock items={items} panelHeight={68} baseItemSize={50} magnification={70} className="fixed bg-blue-200 lg:w-[400px] flex flex-row justify-around" />
            }
        </main>
    );
} 