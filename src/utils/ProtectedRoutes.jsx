import { Outlet, Navigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
const ProtectedRoutes = ({ children }) => {
    const user = true;
    if (user) {
        return <Outlet /> ? <Outlet /> : children;
    } else {
        return <Navigate to={"/login"} />
    }
}
export default ProtectedRoutes;